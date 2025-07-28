import React from "react";
import { useCart } from "../contexts/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const { cart, cartItemsCount, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cart.items.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p>Your cart is empty.</p>
            <Link
              to="/products"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
            >
              Shop now
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex items-center py-5">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded mr-6 border"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{item.productName}</h2>
                    <div className="text-gray-500 text-sm">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-6 mt-8 flex justify-between items-center">
              <div className="text-lg font-medium">
                Items: <span className="font-bold">{cartItemsCount}</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                Total: ${cartTotal.toFixed(2)}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => navigate('/checkout')}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
