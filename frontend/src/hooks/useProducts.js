import { useState, useEffect } from 'react';
import axios from 'axios';
import { productsData } from '../data/products'; // Fallback data

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch from backend REST API
        const response = await axios.get('/api/products', { timeout: 3000 });
        
        // Use API data if available, otherwise use local mock data
        if (response.data && response.data.length > 0) {
          setProducts(response.data);
        } else {
          console.warn('API returned empty products array. Using local fallback data.');
          setProducts(productsData);
        }
      } catch (err) {
        console.warn('Backend API connection failed, using local fallback data.', err.message);
        setProducts(productsData);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
