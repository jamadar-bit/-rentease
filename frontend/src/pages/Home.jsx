import { ArrowRight, ShieldCheck, Truck, Clock, Sparkles, Sofa, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

export default function Home() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  
  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="space-y-24">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] px-6 py-28 sm:px-12 sm:py-36 lg:px-20 border border-white/10 shadow-[0_30px_100px_-20px_rgba(37,99,235,0.3)]">
        {/* Subtle animated background gradients */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-600/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 mix-blend-screen pointer-events-none"></div>
        
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80')] opacity-30 bg-cover bg-center mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/30">
              <Sofa className="h-10 w-10 text-white" />
            </div>
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">RentEase</span>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-gray-300 font-medium text-sm mb-10 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20">
            <Sparkles className="w-4 h-4 text-blue-400" /> Discover the Future of Living
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-white tracking-tight mb-8 leading-[1.1]">
            Elevate Your Space. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Without the Commitment.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed font-light">
            Experience premium furniture and high-end appliances on your terms. Flexible monthly subscriptions with white-glove delivery included.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Link to="/products" className="inline-flex justify-center items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
              Explore Collection <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/products" className="inline-flex justify-center items-center bg-transparent text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 backdrop-blur-md transition border border-white/20 transform hover:-translate-y-1">
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">The Premium Experience</h2>
          <p className="text-gray-500 text-xl font-light">Designed for the modern professional. We handle the heavy lifting so you can focus on living beautifully.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="group flex flex-col items-center text-center p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.1)] transition-all duration-500 transform hover:-translate-y-2">
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-3xl mb-8 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
              <ShieldCheck className="h-10 w-10 text-gray-800" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Flawless Condition</h3>
            <p className="text-gray-500 leading-relaxed font-light text-lg">Every piece undergoes a rigorous 5-step deep cleaning and quality check before it reaches your door.</p>
          </div>
          <div className="group flex flex-col items-center text-center p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.1)] transition-all duration-500 transform hover:-translate-y-2">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-3xl mb-8 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
              <Truck className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">White-Glove Delivery</h3>
            <p className="text-gray-500 leading-relaxed font-light text-lg">Moving to a new apartment? We'll pack, move, and assemble your rented items for free once a year.</p>
          </div>
          <div className="group flex flex-col items-center text-center p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.1)] transition-all duration-500 transform hover:-translate-y-2">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-3xl mb-8 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
              <Clock className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Ultimate Flexibility</h3>
            <p className="text-gray-500 leading-relaxed font-light text-lg">Need it for 3 months or 3 years? Choose your tenure and upgrade your items anytime effortlessly.</p>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="px-4 py-10">
        <div className="flex justify-between items-end mb-10 max-w-7xl mx-auto">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Trending Rentals</h2>
            <p className="text-gray-500 text-lg font-light">Discover what others are bringing home today.</p>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition">
            View All <ArrowRight className="w-5 h-5"/>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {featuredProducts.map((product) => (
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
                      onClick={() => addToCart(product, 6)}
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
        <div className="mt-8 text-center sm:hidden">
          <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition">
            View All Collection <ArrowRight className="w-5 h-5"/>
          </Link>
        </div>
      </section>

      {/* Mini CTA */}
      <section className="relative overflow-hidden bg-gray-900 rounded-[3rem] p-16 text-center border border-gray-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Ready to elevate your home?</h2>
          <p className="text-xl text-gray-400 mb-10 font-light max-w-2xl mx-auto">Join thousands of others who have discovered a smarter way to furnish their space.</p>
          <Link to="/products" className="inline-block bg-white text-gray-900 px-12 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-lg text-lg transform hover:-translate-y-1">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
