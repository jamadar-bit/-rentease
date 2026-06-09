import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Calendar, CreditCard, Truck, AlertCircle, LogIn } from 'lucide-react';
import axios from 'axios';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white border border-gray-100 rounded-3xl p-10 shadow-xl space-y-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
          <LogIn className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-900">Sign In Required</h2>
        <p className="text-gray-500 text-sm">
          Please log in to your account to complete your rental order. Your items are safe in your cart and will be waiting for you!
        </p>
        <div className="pt-4">
          <Link
            to="/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-lg shadow-blue-600/30 text-center"
          >
            Sign In Now
          </Link>
          <Link
            to="/products"
            className="block w-full text-center text-gray-500 hover:text-gray-900 text-sm font-bold mt-4"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', city: '', zip: '', deliveryDate: '', paymentMethod: 'card'
  });

  // Calculate dynamic billing parameters
  const rent = cart.reduce((sum, item) => sum + (item.monthlyRent * item.quantity), 0);
  const deposit = cart.reduce((sum, item) => sum + (item.securityDeposit * item.quantity), 0);
  const total = rent + deposit;

  const handleComplete = async (e) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      try {
        setPincodeLoading(true);
        const response = await axios.get(`/api/serviceareas/check/${formData.zip}`, { timeout: 3000 });
        if (response.data && response.data.available) {
          setFormData(prev => ({ ...prev, city: response.data.city }));
          setStep(2);
        } else {
          setError('Sorry, we do not deliver to this pincode yet. Active service areas include Mumbai (400001), Bangalore (560001), and Delhi (110001).');
        }
      } catch (err) {
        console.warn('Coverage check failed. Proceeding with offline bypass.', err.message);
        setStep(2);
      } finally {
        setPincodeLoading(false);
      }
    } else if (step === 2) {
      setStep(3);
    } else {
      try {
        const orderItems = cart.map(item => ({
          product: item._id,
          tenureMonths: item.tenure,
          quantity: item.quantity
        }));
        
        await axios.post('/api/rentals/batch', {
          items: orderItems,
          deliveryAddress: `${formData.address}, ${formData.city} - ${formData.zip}`,
          deliveryDate: formData.deliveryDate
        });
        
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to place rental order. Please try again.');
      }
    }
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Browse Catalog</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-4xl font-black text-gray-900">Order Confirmed!</h2>
        <p className="text-lg text-gray-500 max-w-md">Your rental request has been received. Your items will be delivered to your address on {formData.deliveryDate}.</p>
        <p className="text-sm text-gray-400">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
      <div className="w-full lg:w-2/3">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Secure Checkout</h2>
        
        {/* Progress Tracker */}
        <div className="flex items-center mb-10 text-sm font-bold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>1</div>
            Delivery
          </div>
          <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>2</div>
            Payment
          </div>
          <div className={`w-16 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>3</div>
            Review
          </div>
        </div>

        <form onSubmit={handleComplete} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Step 1: Delivery Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-4"><MapPin className="text-blue-600"/> Shipping Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input required type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input required type="tel" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Delivery Address</label>
                  <input required type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City / Service Area</label>
                  <input required type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">PIN / Zip Code</label>
                  <input required type="text" className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                </div>
                <div className="md:col-span-2 mt-4 pt-4 border-t">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4"/> Preferred Delivery Date</label>
                  <input required type="date" className="w-full md:w-1/2 border-2 border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" value={formData.deliveryDate} onChange={e => setFormData({...formData, deliveryDate: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-4"><CreditCard className="text-blue-600"/> Payment Method</h3>
              <div className="space-y-4">
                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition ${formData.paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="card" checked={formData.paymentMethod === 'card'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-5 h-5 text-blue-600" />
                  <span className="ml-4 font-bold text-gray-900">Credit / Debit Card</span>
                </label>
                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition ${formData.paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="upi" checked={formData.paymentMethod === 'upi'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-5 h-5 text-blue-600" />
                  <span className="ml-4 font-bold text-gray-900">UPI / Net Banking</span>
                </label>
                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="cod" checked={formData.paymentMethod === 'cod'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-5 h-5 text-blue-600" />
                  <span className="ml-4 font-bold text-gray-900">Pay on Delivery</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-4"><CheckCircle className="text-blue-600"/> Review Order</h3>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <p className="font-bold text-gray-900 mb-2">Delivery Address</p>
                <p className="text-gray-600 text-sm">{formData.name} <br/> {formData.address}, {formData.city} - {formData.zip} <br/> Ph: {formData.phone}</p>
                <p className="text-blue-600 text-sm font-bold mt-2 flex items-center gap-1"><Truck className="w-4 h-4"/> Delivery on {formData.deliveryDate}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <p className="font-bold text-gray-900 mb-2">Payment</p>
                <p className="text-gray-600 text-sm capitalize">{formData.paymentMethod === 'card' ? 'Credit/Debit Card' : formData.paymentMethod === 'upi' ? 'UPI' : 'Pay on Delivery'}</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4 pt-6 border-t">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                Back
              </button>
            )}
            <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
              {step === 3 ? 'Place Rental Order' : 'Continue'}
            </button>
          </div>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="w-full lg:w-1/3">
        <div className="bg-gray-900 rounded-3xl p-8 sticky top-24 shadow-2xl text-white">
          <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={`${item._id}-${item.tenure}`} className="flex gap-4">
                <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover border border-gray-700" alt={item.name}/>
                <div>
                  <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                  <p className="text-gray-400 text-xs">Qty: {item.quantity} • {item.tenure} Months</p>
                  <p className="text-blue-400 font-bold text-sm">₹{item.monthlyRent * item.quantity}/mo</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-3 pt-6 border-t border-gray-700 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Monthly Rent (1st Month)</span>
              <span>₹{rent}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Security Deposit (Refundable)</span>
              <span>₹{deposit}</span>
            </div>
            <div className="flex justify-between text-green-400">
              <span>Delivery & Installation</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between font-black text-xl text-white pt-4 border-t border-gray-700 mt-2">
              <span>Total to Pay</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
