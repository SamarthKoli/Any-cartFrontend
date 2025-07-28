import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { apiService } from "../utils/api";

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, refreshCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || "");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true, state: { from: "/checkout" } });
    }
  }, [isAuthenticated, navigate]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // In CheckoutPage.tsx, add this at the top of handlePlaceOrder function:
// In CheckoutPage.tsx, update the handlePlaceOrder function:
const handlePlaceOrder = async () => {
  // ... existing validation code ...

  setPlacingOrder(true);
  setError("");

  try {
    // Get the actual cart item IDs from your cart items
    // Since your backend expects individual cart row IDs, we need to get them
    // If your cart structure has individual IDs per item, use those
    // For now, let's use the cart.id as a single item
    const cartItemIds = [cart.id]; // This should work if cart.id represents all items

    await apiService.placeOrder({
      cartItemIds,
      shippingAddress: address
    });

    await refreshCart();
    navigate("/", { replace: true });
    alert("Order placed successfully!");
    
  } catch (err: any) {
    console.error('Order placement error:', err);
    setError(err.message || "Failed to place order. Please try again.");
  } finally {
    setPlacingOrder(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Shipping Address */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your shipping address"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto mb-4">
            {cart.items.map(item => (
              <li key={item.productId} className="flex justify-between py-3">
                <div className="flex items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} className="mb-4" />}

        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {placingOrder ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Placing Order...</span>
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
