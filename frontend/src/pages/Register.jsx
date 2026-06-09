import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex w-full max-w-6xl flex-row-reverse">
        {/* Right Side (visually Left) - Image & Branding */}
        <div className="w-1/2 hidden lg:flex flex-col relative p-12 justify-between">
          <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" alt="Room Interior" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>
          
          <div className="relative z-10 flex justify-end">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl inline-block border border-white/20">
              <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tight">
                RentEase
              </div>
            </div>
          </div>
          
          <div className="relative z-10 mb-8 text-right flex flex-col items-end">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              Join the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">revolution.</span>
            </h2>
            <p className="text-lg text-blue-100 max-w-md font-light leading-relaxed">
              Start renting premium furniture, appliances, and properties today. Upgrade your lifestyle effortlessly.
            </p>
          </div>
        </div>

        {/* Left Side (visually Right) - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-16 lg:p-20 bg-white flex flex-col justify-center relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gray-50 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/3 opacity-60"></div>
          
          <div className="max-w-md mx-auto w-full relative z-10">
            <div className="mb-10">
              <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Create Account</h2>
              <p className="text-gray-500 text-lg">Sign up to explore and rent our premium catalog.</p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all duration-300 font-medium text-gray-900 outline-none"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all duration-300 font-medium text-gray-900 outline-none"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="Create a strong password"
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all duration-300 font-medium text-gray-900 outline-none"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-4 mt-4 rounded-2xl font-bold text-lg hover:bg-black hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)]">
                Create Account
              </button>
            </form>
            
            <p className="mt-10 text-center text-gray-500 font-medium">
              Already have an account? <Link to="/login" className="text-gray-900 font-bold hover:underline transition">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
