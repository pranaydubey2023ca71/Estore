import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx'; // Ensure .jsx

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW STATE FOR SEARCH ---
  // 'searchTerm' is for the text box
  const [searchTerm, setSearchTerm] = useState('');
  // 'query' is the *submitted* term that we send to the API
  const [query, setQuery] = useState('');

  // --- UPDATED fetchProducts ---
  // It now depends on 'query', so it re-fetches when the query changes
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Pass the query state to the API
      const res = await axios.get(`/products?search=${query}`);
      setProducts(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]); // Re-run this function if 'query' changes

  // --- UPDATED useEffect ---
  useEffect(() => {
    fetchProducts(); // Fetch on component mount
  }, [fetchProducts]); // Run when 'fetchProducts' (and its 'query' dependency) changes

  // --- NEW SEARCH HANDLER ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery(searchTerm); // Set the 'query', which triggers the useEffect
  };

  return (
    <div>
      <h2>All Products</h2>

      {/* --- NEW SEARCH FORM --- */}
      <form onSubmit={handleSearchSubmit} style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by Author or Genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '0.7rem' }} // From index.css
        />
        <button type="submit">Search</button>
      </form>
      {/* --- END OF NEW FORM --- */}


      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {products.length === 0 ? (
            <p>No products found for your search.</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                // This prop still works! It will re-run fetchProducts
                // which now correctly remembers the search query.
                onProductUpdate={fetchProducts}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;