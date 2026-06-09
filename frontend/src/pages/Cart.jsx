import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 mt-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any furniture or appliances yet.</p>
        <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-4">
          {cart.map((item) => (
            <div key={`${item._id}-${item.tenure}`} className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm p-4 gap-4">
              <img src={item.imageUrl} alt={item.name} className="w-full sm:w-32 h-32 object-cover rounded-xl" />
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">Tenure: <span className="font-semibold text-gray-900">{item.tenure} Months</span></p>
                  <p className="text-sm text-gray-500">Rent: ₹{item.monthlyRent}/mo | Deposit: ₹{item.securityDeposit}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item._id, item.tenure, item.quantity - 1)} className="p-1 hover:bg-white rounded transition"><Minus className="w-4 h-4" /></button>
                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.tenure, item.quantity + 1)} className="p-1 hover:bg-white rounded transition"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item._id, item.tenure)} className="text-red-500 hover:text-red-700 transition p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:w-1/3">
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {cart.map(item => (
                <div key={`summary-${item._id}-${item.tenure}`} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>₹{(item.monthlyRent * item.tenure * item.quantity) + (item.securityDeposit * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-bold text-lg">Total Amount</span>
                <span className="text-3xl font-extrabold text-blue-600">₹{getCartTotal()}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Includes total rent for selected tenure + refundable deposits</p>
            </div>
            <Link to="/checkout" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md">
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
