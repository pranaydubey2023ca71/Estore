// src/components/ProductCard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import path from 'path-browserify'; // Need to 'npm install path-browserify'

function ProductCard({ product, onProductUpdate }) {
  const { user, token, updateUser } = useAuth();
  const [userRating, setUserRating] = useState(1);
  const [error, setError] = useState(null);

  // Check if the user has purchased this item
  const imageUrl = `http://localhost:5000/${product.imagePath.replace(/\\/g, '/')}`;
  const isPurchased = user?.purchasedProducts?.includes(product._id);
  
  // Check if the user is the seller
  const isSeller = user?._id === product.seller?._id;

  const handleBuy = async () => {
    if (!user) {
      alert('Please log in to purchase');
      return;
    }
    setError(null);
    try {
      const res = await axios.post(`/products/${product._id}/buy`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      // Update the user in our global context
      updateUser({ ...user, purchasedProducts: res.data.purchasedProducts });
      alert('Purchase successful!');
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
    }
  };

  const handleDownload = async () => {
    setError(null);
    try {
      const res = await axios.get(`/products/${product._id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob', // Important!
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from the backend's filePath
      const filename = path.basename(product.filePath);
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.data?.message || 'Download failed');
    }
  };
  
  const handleRate = async () => {
    if (!user) {
        alert('Please log in to rate');
        return;
    }
    setError(null);
    try {
        await axios.post(`/products/${product._id}/rate`, { rating: userRating }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        alert('Thank you for rating!');
        onProductUpdate(); // Refetch products to show new average rating
    } catch (err) {
        setError(err.response?.data?.message || 'Rating failed');
    }
  };

  return (
    <div style={{ border: '1px solid black', padding: '15px', width: '300px' }}>
      <img 
        src={imageUrl} 
        alt={product.title} 
        style={{ 
          width: '100%', 
          height: '180px', 
          objectFit: 'cover', 
          borderRadius: '4px',
          marginBottom: '10px' 
        }} 
      />
      <h3>{product.title}</h3>
      <p>by {product.author} (Sold by: {product.seller.username})</p>
      <p>{product.description}</p>
      <p><b>Genre:</b> {product.genre} | <b>Type:</b> {product.productType}</p>
      <p><b>Price:</b> ${product.price}</p>
      <p><b>Rating:</b> {product.averageRating} / 5 (from {product.ratingCount} reviews)</p>
      
      {product.previewLink && (
        <a href={product.previewLink} target="_blank" rel="noopener noreferrer">Watch Preview</a>
      )}
      
      <hr />

      {/* --- Action Buttons --- */}
      {isSeller ? (
        <p><i>You are the seller of this item.</i></p>
      ) : isPurchased ? (
        <button onClick={handleDownload}>Download</button>
      ) : (
        <button onClick={handleBuy}>Buy Now</button>
      )}

      {/* --- Rating Section (Show if purchased) --- */}
      {isPurchased && !isSeller && (
        <div style={{ marginTop: '10px' }}>
          <label>Rate this: </label>
          <select value={userRating} onChange={(e) => setUserRating(Number(e.target.value))}>
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
          <button onClick={handleRate}>Submit Rating</button>
        </div>
      )}
      
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default ProductCard;