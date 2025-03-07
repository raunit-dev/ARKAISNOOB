import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import { User, Student } from '../models/index.js';

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Mint a Portfolio NFT
export const mintPortfolio = [
  authenticateToken,
  async (req, res) => {
    if (req.user.role !== 'College') return res.status(403).json({ error: 'Only Colleges can mint' });

    const { studentAddress, tokenId, name, degree, completionDate, metadata = '{}'} = req.body; // Default empty metadata
    console.log('Mint Portfolio Request:', req.body);

    try {
      // Parse metadata with fallback
      let metadataObj;
      try {
        metadataObj = JSON.parse(metadata);
      } catch (parseError) {
        return res.status(400).json({ error: 'Invalid metadata format: ' + parseError.message });
      }

      // Generate a mock tokenURI (replace with IPFS in production)
      const tokenURI = `ipfs://mock-hash/portfolio/${tokenId}`;
      metadataObj.tokenURI = tokenURI;

      // Find student
      const studentUser = await User.findOne({ wallet_address: studentAddress.toLowerCase() });
      if (!studentUser || studentUser.roleModel !== 'Student') {
        return res.status(404).json({ error: 'Student not found' });
      }

      const student = await Student.findById(studentUser.role);
      if (!student) return res.status(404).json({ error: 'Student record not found' });

      // Update certificates (ensure schema supports this)
      student.certificates = student.certificates || []; // Initialize if undefined
      student.certificates.push({
        token_id: tokenId,
        name,
        degree,
        completion_date: new Date(completionDate),
        metadata_uri: tokenURI,
      });
      await student.save();
      console.log('Portfolio minted successfully for student:', studentUser.wallet_address);

      res.status(200).json({ tokenId, tokenURI, metadata: metadataObj });
    } catch (error) {
      console.error('Mint Portfolio Error:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  },
];

// Mint a Badge NFT
export const mintBadge = [
  authenticateToken,
  async (req, res) => {
    if (req.user.role !== 'College') return res.status(403).json({ error: 'Only Colleges can mint' });

    const { studentAddress, badgeId, metadata, achievement } = req.body;

    // Validate required fields
    if (!studentAddress || !badgeId || !metadata || !achievement) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Parse metadata (with fallback to empty object if invalid)
      let metadataObj;
      try {
        metadataObj = JSON.parse(metadata);
      } catch (parseError) {
        return res.status(400).json({ error: 'Invalid metadata format' });
      }

      // Generate a mock metadataURI (replace with actual IPFS upload in production)
      const metadataURI = `ipfs://<mock-hash>/badge/${badgeId}`; // Replace with real IPFS logic
      metadataObj.metadataURI = metadataURI;

      // Find the student
      const studentUser = await User.findOne({ wallet_address: studentAddress.toLowerCase() });
      if (!studentUser || studentUser.roleModel !== 'Student') {
        return res.status(404).json({ error: 'Student not found' });
      }

      const student = await Student.findById(studentUser.role);
      if (!student) return res.status(404).json({ error: 'Student record not found' });

      // Update student record
      student.badges.push({
        badge_token_id: badgeId,
        metadata_uri: metadataURI,
        achievement,
      });
      await student.save();

      res.status(200).json({ badgeId, metadataURI, metadata: metadataObj });
    } catch (error) {
      console.error('Mint Badge Error:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  },
];

// Get NFTs for a student
export const getNFTs = [
  authenticateToken,
  async (req, res) => {
    const { wallet } = req.params;
    try {
      const user = await User.findOne({ wallet_address: wallet.toLowerCase() }).populate('role');
      if (!user || user.roleModel !== 'Student') {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json({
        certificates: user.role.certificates,
        badges: user.role.badges,
        course_progress: user.role.course_progress || {},
        quiz_scores: user.role.quiz_scores || {},
        grades: user.role.grades || {},
        projects: user.role.projects || {},
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

// Verify an NFT
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
    console.error('Verify NFT Error:', error);
  }
};