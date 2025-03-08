import express from 'express';
import { mintPortfolio,getNFTs, verifyNFT } from '../controllers/nft.controller.js';

const router = express.Router();

router.post('/mintPortfolio', mintPortfolio);
router.get('/getNFTs/:wallet', getNFTs);
router.get('/verify/:type/:id/:address', verifyNFT);

const nftRoutes = router;

export {nftRoutes}