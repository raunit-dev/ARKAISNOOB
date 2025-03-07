import cors from 'cors';
import express from 'express';
import { nftRoutes } from './routes/nft.routes.js'; // Corrected path
import { authRoutes } from './routes/auth.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/nft', nftRoutes);
app.use('/auth', authRoutes); // Ensure authRoutes is defined

app.listen(3000, () => console.log('Server running on port 3000'));