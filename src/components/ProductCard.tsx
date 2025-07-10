import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryName: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return;
    }

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const originalPrice = product.price * 1.2; // Mock original price
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div 
      className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
            } ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button */}
          <div className={`absolute bottom-2 left-2 right-2 transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <button className="w-full bg-white text-gray-900 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Quick View</span>
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="text-xs text-blue-600 font-medium mb-1">
            {product.categoryName}
          </div>
          
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm leading-5 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">(4.0)</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">1,234 reviews</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Prime Badge */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
              prime
            </div>
            <span className="text-xs text-gray-600">FREE delivery</span>
          </div>
          
          {/* Add to Cart Button */}
          {isAuthenticated && (
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;