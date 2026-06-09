import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Shield, Truck, ShoppingCart, Check } from 'lucide-react';
import { productsData } from '../data/products';
import axios from 'axios';

export default function ProductDetails() {
  const { id } = useParams();
  const [tenure, setTenure] = useState(6);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`, { timeout: 3000 });
        if (response.data) {
          setProduct(response.data);
          if (response.data.tenureOptions && response.data.tenureOptions.length > 0) {
            setTenure(response.data.tenureOptions[0]);
          }
        } else {
          const fallbackProduct = productsData.find(p => p._id === id);
          setProduct(fallbackProduct);
        }
      } catch (err) {
        console.warn('Backend API connection failed, using local fallback data.', err.message);
        const fallbackProduct = productsData.find(p => p._id === id);
        setProduct(fallbackProduct || { 
          _id: id, 
          name: 'Product Not Found', 
          description: 'We could not find the details for this product.', 
          category: 'Unknown', 
          monthlyRent: 0, 
          securityDeposit: 0, 
          tenureOptions: [3, 6, 9, 12], 
          imageUrl: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=600&q=80' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, tenure);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-500 font-medium">Loading premium product...</p>
    </div>
  );

  if (!product) return null;
  const tenureOptions = product.tenureOptions && product.tenureOptions.length > 0 ? product.tenureOptions : [3, 6, 9, 12];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-lg flex flex-col lg:flex-row max-w-6xl mx-auto">
      <div className="lg:w-1/2 relative bg-gray-50 flex items-center justify-center p-8">
        <img src={product.imageUrl} alt={product.name} className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-md" />
        <div className="absolute top-6 left-6 bg-white px-4 py-1.5 rounded-full text-sm font-bold text-gray-900 shadow-sm border border-gray-100">
          {product.category}
        </div>
      </div>
      <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">{product.name}</h1>
        <p className="text-gray-500 mb-8 text-lg leading-relaxed">{product.description}</p>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-3xl mb-8 border border-blue-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-900 font-semibold">Monthly Rent</span>
            <span className="text-4xl font-black text-blue-600">₹{product.monthlyRent}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-700/70 font-medium">Security Deposit (Refundable)</span>
            <span className="font-bold text-blue-900">₹{product.securityDeposit}</span>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Select Tenure</h3>
          <div className="flex flex-wrap gap-3">
            {tenureOptions.map(t => (
              <button 
                key={t}
                onClick={() => setTenure(t)}
                className={`flex-1 min-w-[80px] py-3.5 border-2 rounded-2xl font-bold transition-all duration-200 ${tenure === t ? 'border-blue-600 bg-blue-600 text-white shadow-md transform scale-105' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                {t} Mo
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          className={`w-full py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl ${added ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-900 hover:bg-black text-white'}`}
        >
          {added ? <><Check className="w-6 h-6" /> Added to Cart</> : <><ShoppingCart className="w-6 h-6" /> Add to Cart</>}
        </button>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600 font-semibold bg-gray-50 py-4 rounded-2xl">
          <span className="flex items-center gap-2"><Truck className="h-5 w-5 text-blue-500" /> Free Delivery</span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="flex items-center gap-2"><Shield className="h-5 w-5 text-blue-500" /> Free Maintenance</span>
        </div>
      </div>
    </div>
  );
}
