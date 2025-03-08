import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import { User, Student } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

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
    const { studentAddress, tokenId, name, degree, completionDate, metadata = '{}'} = req.body;
    console.log('Mint Portfolio Request:', req.body);
    try {
      let metadataObj;
      try {
        metadataObj = JSON.parse(metadata);
      } catch (parseError) {
        return res.status(400).json({ error: 'Invalid metadata format: ' + parseError.message });
      }
      const tokenURI = `ipfs://mock-hash/portfolio/${tokenId}`;
      metadataObj.tokenURI = tokenURI;
      const studentUser = await User.findOne({ wallet_address: studentAddress.toLowerCase() });
      if (!studentUser || studentUser.roleModel !== 'Student') {
        return res.status(404).json({ error: 'Student not found' });
      }
      const student = await Student.findById(studentUser.role);
      if (!student) return res.status(404).json({ error: 'Student record not found' });
      student.certificates = student.certificates || [];
      student.certificates.push({
        token_id: tokenId,
        name,
        degree,
        completion_date: new Date(completionDate),
        metadata_uri: tokenURI,
      });
      await student.save();

      // Mint on-chain for PortfolioNFT
      const provider = new ethers.JsonRpcProvider('https://open-campus-codex-sepolia.drpc.org');
      const signer = new ethers.Wallet(process.env.COLLEGE_PRIVATE_KEY, provider);
      const portfolioContract = new ethers.Contract(
        '0xDFC6e36511af209DC5fdF1c818E9c9D1704b829b',
        require('../../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json').abi,
        signer
      );
      const tx = await portfolioContract.mintCertificate(studentAddress, tokenURI);
      await tx.wait();

      console.log('Portfolio minted successfully on-chain for student:', studentUser.wallet_address);
      res.status(200).json({ tokenId, tokenURI, metadata: metadataObj, txHash: tx.hash });
    } catch (error) {
      console.error('Mint Portfolio Error:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  },
];

export const mintBadge = [
  authenticateToken,
  async (req, res) => {
    if (req.user.role !== 'College') return res.status(403).json({ error: 'Only Colleges can mint' });
    const { studentAddress, badgeId, achievement, metadata = '{}'} = req.body;
    console.log('Mint Badge Request:', req.body);
    try {
      let metadataObj;
      try {
        metadataObj = JSON.parse(metadata);
      } catch (parseError) {
        return res.status(400).json({ error: 'Invalid metadata format: ' + parseError.message });
      }
      const metadataURI = `ipfs://mock-hash/badge/${badgeId}`;
      metadataObj.metadataURI = metadataURI;
      const studentUser = await User.findOne({ wallet_address: studentAddress.toLowerCase() });
      if (!studentUser || studentUser.roleModel !== 'Student') {
        return res.status(404).json({ error: 'Student not found' });
      }
      const student = await Student.findById(studentUser.role);
      if (!student) return res.status(404).json({ error: 'Student record not found' });
      student.badges = student.badges || [];
      student.badges.push({
        badge_id: badgeId,
        achievement,
        metadata_uri: metadataURI,
      });
      await student.save();

      // Mint on-chain for BadgeNFT
      const provider = new ethers.JsonRpcProvider('https://open-campus-codex-sepolia.drpc.org');
      const signer = new ethers.Wallet(process.env.COLLEGE_PRIVATE_KEY, provider);
      const badgeContract = new ethers.Contract(
        '0x737c2e1A397D7cd68714AAc352723Ff62e03b878',
        require('../../artifacts/contracts/BadgeNFT.sol/BadgeNFT.json').abi,
        signer
      );
      // Assuming BadgeNFT has a mint function similar to mintCertificate
      const tx = await badgeContract.mintBadge(studentAddress, badgeId, metadataURI); // Adjust based on actual function name
      await tx.wait();

      console.log('Badge minted successfully on-chain for student:', studentUser.wallet_address);
      res.status(200).json({ badgeId, metadataURI, metadata: metadataObj, txHash: tx.hash });
    } catch (error) {
      console.error('Mint Badge Error:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  },
];

// Existing getNFTs and verifyNFT functions remain unchanged

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
  try {
    const provider = new ethers.JsonRpcProvider('https://open-campus-codex-sepolia.drpc.org');
    if (type === 'portfolio') {
      const portfolioContract = new ethers.Contract(
        '0xDFC6e36511af209DC5fdF1c818E9c9D1704b829b',
        require('../../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json').abi,
        provider
      );
      const owner = await portfolioContract.ownerOf(id);
      const uri = await portfolioContract.tokenURI(id);
      const verified = owner.toLowerCase() === address.toLowerCase();
      res.json({ verified, uri });
    } else if (type === 'badge') {
      const badgeContract = new ethers.Contract(
        '0x737c2e1A397D7cd68714AAc352723Ff62e03b878',
        require('../../artifacts/contracts/BadgeNFT.sol/BadgeNFT.json').abi,
        provider
      );
      // Assuming ERC-1155 for BadgeNFT
      const balance = await badgeContract.balanceOf(address, id);
      const uri = await badgeContract.uri(id); // Adjust based on actual function
      const verified = balance > 0;
      res.json({ verified, amount: balance.toString(), uri });
    } else {
      res.status(400).json({ error: 'Invalid NFT type' });
    }
  } catch (error) {
    console.error('Verify NFT Error:', error);
    res.status(500).json({ error: 'Failed to verify NFT: ' + error.message });
  }
};