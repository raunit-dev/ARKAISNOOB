import express from 'express';
import { mintPortfolio, mintBadge, getNFTs, verifyNFT } from '../controllers/nft.controller.js';

const router = express.Router();

router.post('/mintPortfolio', mintPortfolio);
router.post('/mintBadge', mintBadge);
router.get('/getNFTs/:wallet', getNFTs);
router.get('/verify/:type/:id/:address', verifyNFT);

export { router as nftRoutes };