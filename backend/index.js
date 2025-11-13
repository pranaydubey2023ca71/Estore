import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import serverless from 'serverless-http'; // <-- Import this
import connectDB from './db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

// --- Config ---
dotenv.config();
connectDB();
const app = express();
app.use(express.json()); 
app.use(cors());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// --- Serve Static Files (Our 'uploads' folder) ---
// This is crucial for React to display images/previews if we had them
// For downloads, we use the protected route, but this makes the folder "web-accessible"
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// // --- Start Server ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export const handler = serverless(app);