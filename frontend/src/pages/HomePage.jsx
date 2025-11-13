import React, { useState, useEffect } from 'react';
// We no longer need axios or useCallback
import ProductCard from '../components/ProductCard.jsx'; // Ensure .jsx

// --- FAKE DATA ---
// We create an array of fake products that look like our API data
const fakeProducts = [
  {
    _id: '1',
    title: 'The Silent Observer',
    description: 'A thrilling mystery novel set in a quiet town with dark secrets.',
    price: 14.99,
    productType: 'ebook',
    seller: { _id: 'seller1', username: 'BookNook' },
    author: 'Eliza Vance',
    genre: 'Mystery',
    previewLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imagePath: 'uploads/fake-image-1.jpg', // This will 404, but we can fix with a placeholder
    averageRating: 4.5,
    ratingCount: 120,
  },
  {
    _id: '2',
    title: 'Midnight Grooves',
    description: 'A smooth jazz album perfect for late-night relaxation.',
    price: 9.99,
    productType: 'music',
    seller: { _id: 'seller2', username: 'MusicWorld' },
    author: 'The Night Owls',
    genre: 'Jazz',
    previewLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imagePath: 'uploads/fake-image-2.jpg',
    averageRating: 4.8,
    ratingCount: 85,
  },
  {
    _id: '3',
    title: 'Galactic Empires',
    description: 'A sprawling sci-fi epic about a war between star systems.',
    price: 19.99,
    productType: 'ebook',
    seller: { _id: 'seller1', username: 'BookNook' },
    author: 'Alex Chen',
    genre: 'Sci-Fi',
    previewLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imagePath: 'uploads/fake-image-3.jpg',
    averageRating: 4.2,
    ratingCount: 210,
  },
  {
    _id: '4',
    title: 'Echoes of the Past',
    description: 'An indie-rock album with soaring vocals and driving rhythms.',
    price: 7.99,
    productType: 'music',
    seller: { _id: 'seller3', username: 'IndieVibes' },
    author: 'The Rustics',
    genre: 'Rock',
    previewLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imagePath: 'uploads/fake-image-4.jpg',
    averageRating: 4.6,
    ratingCount: 55,
  },
];
// --- END OF FAKE DATA ---


function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // We won't have errors, but good to keep

  // --- NEW STATE FOR SEARCH ---
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- UPDATED useEffect ---
  // This now just simulates a network request
  useEffect(() => {
    setLoading(true);
    
    // Simulate a 1-second load time
    const timer = setTimeout(() => {
      // --- CLIENT-SIDE SEARCH LOGIC ---
      // We filter our fake data based on the search term
      const filteredProducts = fakeProducts.filter(p => 
        p.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setProducts(filteredProducts);
      setLoading(false);
    }, 1000); // 1 second delay

    // Cleanup the timer
    return () => clearTimeout(timer);
    
  }, [searchTerm]); // Re-run this effect when 'searchTerm' changes

  // --- NEW SEARCH HANDLER ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // We don't need 'query' anymore, we just re-run the effect
    // We'll just read 'searchTerm' directly inside the effect
    // This is a dummy function now, but we'll use the one in the input
  };
  
  // --- We'll use a placeholder for images ---
  const getImageUrl = (imagePath) => {
    // A simple placeholder image service
    const type = imagePath.includes('fake-image-1') || imagePath.includes('fake-image-3') ? 'Book' : 'Album';
    return `https://placehold.co/400x400/555/eee?text=${type}`;
  };

  return (
    <div>
      <h2>All Products</h2>

      {/* --- SEARCH FORM (Now filters client-side) --- */}
      <form onSubmit={(e) => e.preventDefault()} style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by Author or Genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '0.7rem' }}
        />
        {/* We don't need the button, it searches as you type */}
      </form>
      {/* --- END OF FORM --- */}


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
                // We create a new product object with a working image URL
                product={{...product, imagePath: getImageUrl(product.imagePath)}}
                // Pass an empty function so it doesn't crash
                onProductUpdate={() => {}}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
