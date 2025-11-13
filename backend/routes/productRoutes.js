import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Multer Config for File Uploads ---
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = 'uploads/';
    // Create 'uploads/' directory if it doesn't exist
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    // Create a unique filename: fieldname-timestamp.extension
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

// @desc    Upload a new product
// @route   POST /api/products/upload
// @access  Private
router.post(
  '/upload',
  protect,
  upload.fields([
    { name: 'productFile', maxCount: 1 }, // This is the e-book/MP3
    { name: 'imageFile', maxCount: 1 },   // This is the cover image
  ]),
  async (req, res) => {
    
    const { title, description, price, productType, author, genre, previewLink } = req.body;

    if (!req.files || !req.files.productFile || !req.files.imageFile) {
      return res.status(400).json({ message: 'Please upload both a product file and an image file' });
    }

    try {
      const product = new Product({
        title,
        description,
        price: Number(price),
        productType,
        author,
        genre,
        previewLink,
        filePath: req.files.productFile[0].path,
        imagePath: req.files.imageFile[0].path, 
        seller: req.user._id,
      });

      const createdProduct = await product.save();

      // Add product to user's uploadedProducts list
      const user = await User.findById(req.user._id);
      user.uploadedProducts.push(createdProduct._id);
      await user.save();

      res.status(201).json(createdProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Get all products (or search by query)
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    // --- Search Logic ---
    const keyword = req.query.search
      ? {
          $or: [
            { author: { $regex: req.query.search, $options: 'i' } },
            { genre: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};
    // --- End Search Logic ---

    // Pass 'keyword' object to find()
    const products = await Product.find({ ...keyword }).populate('seller', 'username');
    
    // Add 'averageRating' virtual property for the frontend
    const productsWithRating = products.map(p => ({
        ...p.toObject(),
        averageRating: p.ratingCount > 0 ? (p.totalRatingScore / p.ratingCount).toFixed(1) : 0
    }));
    res.json(productsWithRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Demo-purchase a product
// @route   POST /api/products/:id/buy
// @access  Private
router.post('/:id/buy', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.id;

    if (user.purchasedProducts.includes(productId)) {
      return res.status(400).json({ message: 'Product already purchased' });
    }

    user.purchasedProducts.push(productId);
    await user.save();
    
    // Send back the updated user's purchased list
    res.json({ purchasedProducts: user.purchasedProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Download a purchased product's file
// @route   GET /api/products/:id/download
// @access  Private
router.get('/:id/download', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has purchased this item
    if (!user.purchasedProducts.includes(req.params.id)) {
      return res.status(403).json({ message: 'Not authorized, purchase required' });
    }

    // Use res.download() to send the file from the local 'filePath'
    const filePath = path.resolve(product.filePath);
    
    // Check if file exists locally
    if (fs.existsSync(filePath)) {
        res.download(filePath); // This handles setting headers for download
    } else {
        res.status(404).json({ message: 'File not found on server' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Rate a product
// @route   POST /api/products/:id/rate
// @access  Private
router.post('/:id/rate', protect, async (req, res) => {
    const { rating } = req.body; // Expecting a number 1-5
    const productId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Please provide a rating between 1 and 5' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        product.totalRatingScore += Number(rating);
        product.ratingCount += 1;
        await product.save();
        
        const newAverage = (product.totalRatingScore / product.ratingCount).toFixed(1);

        res.status(201).json({ 
            message: 'Rating added', 
            averageRating: newAverage,
            ratingCount: product.ratingCount 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export { router };
