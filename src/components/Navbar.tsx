import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, Settings, Heart, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-white text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Deliver to New York 10001
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Customer Service</span>
              <span>Sell on AnyCart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-orange-500 p-2 rounded">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">AnyCart</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="flex">
                <select className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>All</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Home & Garden</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AnyCart"
                  className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded-r-md transition-colors"
                >
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>
          </div>

          {/* Right side navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language/Country */}
            <div className="flex items-center space-x-1 text-sm">
              <img src="https://flagcdn.com/w20/us.png" alt="US" className="w-5 h-3" />
              <span className="text-gray-700">EN</span>
            </div>

            {isAuthenticated ? (
              <>
                {/* Account & Lists */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex flex-col items-start text-sm hover:text-orange-600 transition-colors"
                  >
                    <span className="text-xs text-gray-600">Hello, {user?.firstName}</span>
                    <span className="font-medium text-gray-900">Account & Lists</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">Your Account</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Your Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Your Orders
                      </Link>
                      <Link
                        to="/price-alerts"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Your Wish List
                      </Link>
                      {isAdmin && (
                        <>
                          <hr className="my-2" />
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <Settings className="w-4 h-4" />
                              <span>Admin Dashboard</span>
                            </div>
                          </Link>
                        </>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Returns & Orders */}
                <Link to="/orders" className="flex flex-col items-start text-sm hover:text-orange-600 transition-colors">
                  <span className="text-xs text-gray-600">Returns</span>
                  <span className="font-medium text-gray-900">& Orders</span>
                </Link>

                {/* Cart */}
                <Link to="/cart" className="relative flex items-center space-x-1 hover:text-orange-600 transition-colors">
                  <div className="relative">
                    <ShoppingCart className="w-8 h-8 text-gray-700" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-600">Cart</span>
                    <span className="font-medium text-gray-900">{cartItemsCount}</span>
                  </div>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex flex-col items-start text-sm hover:text-orange-600 transition-colors"
                >
                  <span className="text-xs text-gray-600">Hello, sign in</span>
                  <span className="font-medium text-gray-900">Account & Lists</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Start here
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AnyCart"
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </form>
        </div>
      </div>

      {/* Secondary navigation */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 py-2 text-sm">
            <Link to="/products" className="hover:text-orange-300 transition-colors flex items-center space-x-1">
              <Menu className="w-4 h-4" />
              <span>All</span>
            </Link>
            <Link to="/categories" className="hover:text-orange-300 transition-colors">Today's Deals</Link>
            <Link to="/categories" className="hover:text-orange-300 transition-colors">Customer Service</Link>
            <Link to="/categories" className="hover:text-orange-300 transition-colors">Registry</Link>
            <Link to="/categories" className="hover:text-orange-300 transition-colors">Gift Cards</Link>
            <Link to="/categories" className="hover:text-orange-300 transition-colors">Sell</Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/products"
              className="block text-gray-700 hover:text-orange-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              to="/categories"
              className="block text-gray-700 hover:text-orange-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart ({cartItemsCount})</span>
                </Link>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-orange-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Account
                </Link>
                <Link
                  to="/orders"
                  className="block text-gray-700 hover:text-orange-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Orders
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block text-gray-700 hover:text-orange-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-orange-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-700 hover:text-orange-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;