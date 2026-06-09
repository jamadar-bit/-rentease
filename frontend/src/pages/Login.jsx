import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      if (data.role === 'admin' || data.role === 'vendor') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex w-full max-w-6xl">
        {/* Left Side - Image & Branding */}
        <div className="w-1/2 hidden lg:flex flex-col relative p-12 justify-between">
          <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80" alt="Furniture" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl inline-block border border-white/20">
              <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tight">
                RentEase
              </div>
            </div>
          </div>
          
          <div className="relative z-10 mb-8">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              Welcome back to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">better living.</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-md font-light leading-relaxed">
              Access your personalized dashboard to manage active rentals, track deliveries, and request maintenance instantly.
            </p>
            
            {/* Floating Review Badge */}
            <div className="mt-10 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 max-w-sm transform hover:-translate-y-1 transition duration-300">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/100?img=1" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/100?img=2" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/100?img=3" alt="User" />
              </div>
              <div className="text-sm text-gray-200">
                <span className="font-bold text-white block">10,000+ Users</span>
                Trust RentEase
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-16 lg:p-20 bg-white flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-60"></div>
          
          <div className="max-w-md mx-auto w-full relative z-10">
            <div className="mb-10">
              <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Sign In</h2>
              <p className="text-gray-500 text-lg">Enter your details to access your account.</p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-sm font-medium border border-red-100 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 font-medium text-gray-900 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                  <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 font-medium text-gray-900 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 mt-2 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.6)]">
                Sign In to Account
              </button>
            </form>
            
            <p className="mt-10 text-center text-gray-500 font-medium">
              New to RentEase? <Link to="/register" className="text-blue-600 font-bold hover:underline transition">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
