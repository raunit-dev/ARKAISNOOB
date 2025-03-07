const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');

router.post('/mintPortfolio', nftController.mintPortfolio);
router.post('/mintBadge', nftController.mintBadge); // Ensure this line exists
router.get('/getNFTs/:wallet', nftController.getNFTs);
router.get('/verify/:type/:id/:address', nftController.verifyNFT);

module.exports = router;