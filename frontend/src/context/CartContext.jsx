import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('rentease_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('rentease_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, tenure) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id && item.tenure === tenure);
      if (existing) {
        return prev.map(item => 
          item._id === product._id && item.tenure === tenure
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, tenure, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, tenure) => {
    setCart(prev => prev.filter(item => !(item._id === productId && item.tenure === tenure)));
  };

  const updateQuantity = (productId, tenure, quantity) => {
    if (quantity < 1) return removeFromCart(productId, tenure);
    setCart(prev => prev.map(item => 
      item._id === productId && item.tenure === tenure ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.monthlyRent * item.tenure * item.quantity) + (item.securityDeposit * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
