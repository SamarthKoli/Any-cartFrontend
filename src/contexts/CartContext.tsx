import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../utils/api';
import { useAuth } from './AuthContext';

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  cartItemsCount: number;
  cartTotal: number;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    try {
      const cartData = await apiService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    try {
      await apiService.addToCart({ productId, quantity });
      await refreshCart();
    } catch (error) {
      throw error;
    }
  };

  const updateCartItem = async (productId: number, quantity: number) => {
    try {
      await apiService.updateCartItem(productId.toString(), { quantity });
      await refreshCart();
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      await apiService.removeFromCart(productId.toString());
      await refreshCart();
    } catch (error) {
      throw error;
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;

  const value = {
    cart,
    cartItemsCount,
    cartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};