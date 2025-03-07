import express from 'express';
import nftController from '../controllers/nft.controller.js';

const router = express.Router();

router.post('/mintPortfolio', nftController.mintPortfolio);
router.post('/mintBadge', nftController.mintBadge);
router.get('/getNFTs/:wallet', nftController.getNFTs);
router.get('/verify/:type/:id/:address', nftController.verifyNFT);

export const nftRoutes = router;