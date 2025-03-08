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
    if (req.user.role !== 'College') return res.status(403).json({ error: 'Only Colleges can mint certificates' });
    const { studentAddress, achievement, issueDate } = req.body;
    console.log('Mint Certificate Request:', req.body);

    // Validate required fields
    if (!studentAddress || !achievement || !issueDate) {
      return res.status(400).json({ error: 'Missing required fields: studentAddress, achievement, issueDate' });
    }

    try {
      // Generate a unique tokenId (this could be improved with a counter or UUID)
      const tokenId = Date.now(); // Simple tokenId generation; consider using a counter or UUID in production

      // Generate a mock token URI (in production, upload metadata to IPFS or another decentralized storage)
      const tokenURI = `ipfs://mock-hash/certificate/${tokenId}`;

      // Find the student user by wallet address
      const studentUser = await User.findOne({ wallet_address: studentAddress.toLowerCase() });
      if (!studentUser || studentUser.roleModel !== 'Student') {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Find the student record
      const student = await Student.findById(studentUser.role);
      if (!student) return res.status(404).json({ error: 'Student record not found' });

      // Add certificate to student's record
      student.certificates = student.certificates || [];
      student.certificates.push({
        token_id: tokenId,
        achievement,
        issue_date: new Date(issueDate),
        metadata_uri: tokenURI,
      });
      await student.save();

      // Mint on-chain for CertificateNFT
      const provider = new ethers.JsonRpcProvider('https://rpc.open-campus-codex.gelato.digital');
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const certificateContract = new ethers.Contract(
        '0x3fcC09B2D1023b031FB45317c170C0AB6eFDdaC0',
        require('../../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json').abi,
        signer
      );
      const tx = await certificateContract.mintCertificate(studentAddress, tokenURI);
      await tx.wait();

      console.log('Certificate minted successfully on-chain for student:', studentUser.wallet_address);
      res.status(200).json({ tokenId, tokenURI, txHash: tx.hash });
    } catch (error) {
      console.error('Mint Certificate Error:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  },
];

// Get NFTs (Certificates) for a student
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

// Verify a Certificate NFT
export const verifyNFT = async (req, res) => {
  const { id, address } = req.params;
  try {
    const provider = new ethers.JsonRpcProvider('https://rpc.open-campus-codex.gelato.digital');
    const certificateContract = new ethers.Contract(
      '0x3fcC09B2D1023b031FB45317c170C0AB6eFDdaC0',
      require('../../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json').abi,
      provider
    );
    const owner = await certificateContract.ownerOf(id);
    const uri = await certificateContract.tokenURI(id);
    const verified = owner.toLowerCase() === address.toLowerCase();
    res.json({ verified, uri });
  } catch (error) {
    console.error('Verify Certificate Error:', error);
    res.status(500).json({ error: 'Failed to verify certificate: ' + error.message });
  }
};