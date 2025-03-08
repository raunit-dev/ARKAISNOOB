import cors from 'cors';
import express from 'express';
import { authRoutes } from '../routes/auth.routes.js';
import { nftRoutes } from '../routes/nft.routes.js';
import { collegerouter } from '../routes/college.routes.js';
const app = express();
app.use(cors());
app.use(express.json());
console.log('NFT Routes loaded:', nftRoutes);
app.use('/nft', nftRoutes);
app.use('/auth', authRoutes); // Ensure authRoutes is defined
app.use('/',collegerouter)
export {app}


//npm init -y