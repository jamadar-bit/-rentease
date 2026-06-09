import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

export default function Products() {
  const { products, loading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const searchInputRef = useRef(null);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!loading && products) {
      setFilteredProducts(products);
    }
  }, [products, loading]);

  const handleSearch = () => {
    const query = searchInputRef.current.value.toLowerCase();
    filterData(query, category, sortOrder);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    filterData(searchInputRef.current?.value.toLowerCase() || '', cat, sortOrder);
  };
  
  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortOrder(sort);
    filterData(searchInputRef.current?.value.toLowerCase() || '', category, sort);
  };

  const filterData = (query, cat, sort) => {
    let result = [...products];
    if (cat !== 'All') {
      result = result.filter(p => p.category === cat);
    }
    if (query) {
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }
    
    if (sort === 'lowToHigh') {
      result.sort((a, b) => a.monthlyRent - b.monthlyRent);
    } else if (sort === 'highToLow') {
      result.sort((a, b) => b.monthlyRent - a.monthlyRent);
    }
    
    setFilteredProducts(result);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-500 font-medium">Loading premium catalog...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <h2 className="text-3xl font-extrabold text-gray-900 w-full xl:w-auto">Browse Catalog</h2>
        
        {/* Search, Filter, Sort */}
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative flex-grow sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              ref={searchInputRef}
              onChange={handleSearch}
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm font-medium text-gray-900"
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <div className="flex bg-gray-100 p-1 rounded-full shadow-inner flex-shrink-0">
              {['All', 'Furniture', 'Appliances', 'Properties', 'Books', 'Fitness', 'Electronics'].map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition ${category === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select 
              value={sortOrder}
              onChange={handleSortChange}
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-full focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 flex-shrink-0 shadow-sm outline-none"
            >
              <option value="default">Sort by</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 uppercase tracking-wider shadow-sm">
                  {product.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-2xl font-extrabold text-blue-600 mt-auto mb-4">₹{product.monthlyRent}<span className="text-sm font-normal text-gray-500"> /mo</span></p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => addToCart(product, 6)} // Default 6 months tenure from catalog
                    className="flex-grow flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-100 transition"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add
                  </button>
                  <Link to={`/products/${product._id}`} className="flex-grow text-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
