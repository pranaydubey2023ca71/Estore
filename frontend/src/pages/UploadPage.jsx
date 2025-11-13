// src/pages/UploadPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Make sure .jsx is here

function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [productType, setProductType] = useState('ebook');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  
  // --- RENAME/ADD STATE ---
  const [productFile, setProductFile] = useState(null); // Renamed from 'file'
  const [imageFile, setImageFile] = useState(null);     // Add this
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // --- UPDATE VALIDATION ---
    if (!productFile || !imageFile) {
      setError('Please select both a product file and a cover image');
      return;
    }
    
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('productType', productType);
    formData.append('author', author);
    formData.append('genre', genre);
    formData.append('previewLink', previewLink);
    
    // --- UPDATE FORMDATA KEYS ---
    formData.append('productFile', productFile); // Must match backend 'productFile'
    formData.append('imageFile', imageFile);     // Must match backend 'imageFile'

    try {
      await axios.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div>
      <h2>Sell a New Product</h2>
      <form onSubmit={handleSubmit}>
        {/* ... (all the other text inputs) ... */}
        <div><label>Title: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></label></div>
        <div><label>Description: <textarea value={description} onChange={(e) => setDescription(e.target.value)} required /></label></div>
        <div><label>Price: <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required /></label></div>
        <div><label>Type: 
          <select value={productType} onChange={(e) => setProductType(e.target.value)}>
            <option value="ebook">E-Book</option>
            <option value="music">Music</option>
          </select>
        </label></div>
        <div><label>Author/Artist: <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required /></label></div>
        <div><label>Genre: <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} /></label></div>
        <div><label>Preview Link (YouTube): <input type="text" value={previewLink} onChange={(e) => setPreviewLink(e.target.value)} /></label></div>

        {/* --- UPDATE FILE INPUTS --- */}
        <div>
          <label>Product File (MP3, PDF, etc): 
            <input type="file" onChange={(e) => setProductFile(e.target.files[0])} required />
          </label>
        </div>
        <div>
          <label>Cover Image (JPG, PNG): 
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />
          </label>
        </div>
        
        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default UploadPage;