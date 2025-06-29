'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const updateCartItem = (product, quantity) => {
    const qtyNum = Number(quantity);
    setCart(prev => {
      const next = { ...prev };
      if (qtyNum > 0 && !isNaN(qtyNum)) {
        next[product.ProductID] = { ...product, quantity: qtyNum };
      } else {
        delete next[product.ProductID];
      }
      return next;
    });
  };

  const getTotalItems = () => Object.keys(cart).length;

  const getTotalPrice = () =>
    Object.values(cart).reduce(
      (sum, item) => sum + (item.quantity * parseFloat(item.Price || 0)),
      0
    );

  const getCartItems = () => Object.values(cart);

  const clearCart = () => {
    setCart({});
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{ cart, getCartItems, updateCartItem, getTotalItems, getTotalPrice, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
