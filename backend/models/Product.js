// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  productType: { type: String, required: true, enum: ['ebook', 'music'] },
  seller: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  author: { type: String, required: true },
  genre: { type: String },
  previewLink: { type: String },
  filePath: { type: String, required: true }, // Path on the server disk
  
  // --- ADD THIS LINE ---
  imagePath: { type: String, required: true }, // Path to the cover image

  // --- RATING LOGIC ---
  totalRatingScore: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;