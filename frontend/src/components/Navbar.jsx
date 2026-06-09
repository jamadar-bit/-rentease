import { Link } from 'react-router-dom';
import { Sofa, ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { getCartCount } = useCart();
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  
  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-105 transition">
                <Sofa className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">RentEase</span>
            </Link>
            <div className="hidden sm:ml-12 sm:flex sm:space-x-8">
              <Link to="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-600 text-sm font-bold transition">
                Home
              </Link>
              <Link to="/products" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-600 text-sm font-bold transition">
                Catalog
              </Link>
              {isAuthenticated && !isAdmin() && (
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-600 text-sm font-bold transition">
                  My Rentals
                </Link>
              )}
              {isAuthenticated && isAdmin() && (
                <Link to="/admin" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-600 text-sm font-bold transition">
                  Admin Portal
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-blue-600 transition">
              <ShoppingCart className="h-7 w-7" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-150 px-4 py-2 rounded-xl">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-gray-800 hidden md:inline">{user.name}</span>
                </div>
                <button 
                  onClick={logout} 
                  className="flex items-center justify-center p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition shadow-sm">
                <User className="h-5 w-5" />
                <span className="text-sm font-bold">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
