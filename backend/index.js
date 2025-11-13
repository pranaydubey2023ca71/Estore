import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { join } from 'path'; // We ONLY import 'join'
import serverless from 'serverless-http';
import { connectDB } from './db.js'; // Use our named import

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

// --- Config ---
dotenv.config();
connectDB(); // This will now work
const app = express();
app.use(express.json()); 
app.use(cors());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// --- Serve Static Files ---
// We use the global __dirname provided by Netlify and our imported 'join'
app.use('/uploads', express.static(join(__dirname, '/uploads')));

// --- Handler ---
export const handler = serverless(app);
