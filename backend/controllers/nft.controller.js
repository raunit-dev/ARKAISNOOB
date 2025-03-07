import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { User, Student } from '../models/index.js';
dotenv.config({ path: "../../.env" });

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

export const mintPortfolio = [
  authenticateToken,
  async (req, res) => {
    if (req.user.role !== 'College') return res.status(403).json({ error: 'Only Colleges can mint' });
    const { studentAddress, metadata, tokenId } = req.body;
    try {
      const metadataObj = JSON.parse(metadata);
      const tokenURI = `data:application/json;base64,${Buffer.from(metadata).toString('base64')}`;
      
      const studentUser = await User.findOne({ wallet_address: studentAddress });
      if (!studentUser || studentUser.roleModel !== 'Student') return res.status(404).json({ error: 'Student not found' });
      
      // Update student data with AI-related metadata
      await Student.findOneAndUpdate(
        { _id: studentUser.role },
        {
          portfolio_token_id: tokenId,
          course_progress: metadataObj.course_progress || { "Data structures": 0, "Deep learning": 0, "Blockchain": 0 },
          quiz_scores: metadataObj.quiz_scores || { "Data structures": [], "Deep learning": [], "Blockchain": [] },
          grades: metadataObj.grades || { "Data structures": "", "Deep learning": "", "Blockchain": "" },
          projects: metadataObj.projects || { "Data structures": "Not Started", "Deep learning": "Not Started", "Blockchain": "Not Started" }
        },
        { upsert: true, new: true }
      );

      res.json({ tokenId, tokenURI });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

export const mintBadge = [
  authenticateToken,
  async (req, res) => {
    if (req.user.role !== 'College') return res.status(403).json({ error: 'Only Colleges can mint' });
    const { studentAddress, badgeId, metadata } = req.body;
    try {
      const metadataString = JSON.stringify(JSON.parse(metadata));
      const metadataURI = `data:application/json;base64,${Buffer.from(metadataString).toString('base64')}`;
      
      const studentUser = await User.findOne({ wallet_address: studentAddress });
      if (!studentUser || studentUser.roleModel !== 'Student') return res.status(404).json({ error: 'Student not found' });
      const student = await Student.findById(studentUser.role);
      student.badges.push({ badge_token_id: badgeId, metadata_uri: metadataURI });
      await student.save();
      res.json({ badgeId, metadataURI });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

export const getNFTs = [
  authenticateToken,
  async (req, res) => {
    const { wallet } = req.params;
    try {
      const user = await User.findOne({ wallet_address: wallet }).populate('role');
      if (!user || user.roleModel !== 'Student') return res.status(404).json({ error: 'Student not found' });
      res.json({
        portfolio: user.role.portfolio_token_id ? { tokenId: user.role.portfolio_token_id } : null,
        badges: user.role.badges,
        course_progress: user.role.course_progress,
        quiz_scores: user.role.quiz_scores,
        grades: user.role.grades,
        projects: user.role.projects
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

export const verifyNFT = async (req, res) => {
  const { type, id, address } = req.params;
  const provider = new ethers.JsonRpcProvider('https://open-campus-codex-sepolia.drpc.org');
  const portfolioContract = new ethers.Contract(
    '0xDFC6e36511af209DC5fdF1c818E9c9D1704b829b',
    require('../../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json').abi,
    provider
  );
  const badgeContract = new ethers.Contract(
    '0x737c2e1A397D7cd68714AAc352723Ff62e03b878',
    require('../../artifacts/contracts/BadgeNFT.sol/BadgeNFT.json').abi,
    provider
  );
  try {
    if (type === 'portfolio') {
      const owner = await portfolioContract.ownerOf(id);
      res.json({ verified: owner.toLowerCase() === address.toLowerCase(), uri: await portfolioContract.tokenURI(id) });
    } else if (type === 'badge') {
      const balance = await badgeContract.balanceOf(address, id);
      res.json({ verified: balance > 0, amount: balance.toString() });
    } else {
      res.status(400).json({ error: 'Invalid type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};