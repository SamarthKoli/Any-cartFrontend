import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CartPage: React.FC = () => {
  const { cart, cartTotal, updateCartItem, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId: number) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your cart</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access your shopping cart.</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/products"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-flex items-center space-x-2"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Cart Items</h2>
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.price.toFixed(2)} each
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                            prime
                          </div>
                          <span className="text-xs text-gray-600">FREE delivery</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            disabled={updatingItems.has(item.productId) || item.quantity <= 1}
                            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                            {updatingItems.has(item.productId) ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            disabled={updatingItems.has(item.productId)}
                            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={updatingItems.has(item.productId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(cartTotal * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors mt-6">
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center">
                  <Link
                    to="/products"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;