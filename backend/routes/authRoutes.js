// routes/authRoutes.js
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// --- Generate Token ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });
    res.status(201).json({
  _id: user._id,
  username: user.username,
  email: user.email,
  token: generateToken(user._id),
  purchasedProducts: user.purchasedProducts, // Add this
  uploadedProducts: user.uploadedProducts, // Add this
});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        // Send these so frontend knows what user has
        purchasedProducts: user.purchasedProducts,
        uploadedProducts: user.uploadedProducts,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;