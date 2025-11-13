import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { join } from 'path'; // <-- 1. We ONLY import 'join'
import serverless from 'serverless-http';
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

// --- 2. DELETE the line "const __dirname = dirname(__filename);" ---
//    (The server provides __dirname for us)

// --- Serve Static Files ---
//    We use the server's __dirname and our imported 'join'
app.use('/uploads', express.static(join(__dirname, '/uploads')));

// --- Handler ---
export const handler = serverless(app);
