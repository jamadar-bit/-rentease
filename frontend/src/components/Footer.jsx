import { Sofa, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Sofa className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">RentEase</span>
            </Link>
            <p className="text-sm text-gray-400">
              Premium furniture and appliance rentals for the modern lifestyle. Flexible, affordable, and sustainable.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-blue-400 transition">Browse Catalog</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition">Create Account</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition">My Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Maintenance Request</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition">FB</a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition">TW</a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition">IG</a>
            </div>
            <p className="text-sm flex items-center gap-2"><Mail className="w-4 h-4" /> support@rentease.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} RentEase Platform. All rights reserved.</p>
          <p>Designed with passion.</p>
        </div>
      </div>
    </footer>
  );
}
