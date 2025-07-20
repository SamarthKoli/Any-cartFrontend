const API_BASE_URL = 'http://localhost:9091';

// Mock data for development when backend is not available
const mockData = {
  products: [
    {
      id: 1,
      name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
      price: 1299.99,
      description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system.',
      categoryName: 'Electronics',
      imageUrl: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=400',
      stock: 50
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
      price: 1199.99,
      description: 'Premium Android smartphone with S Pen, advanced AI features, and exceptional camera quality.',
      categoryName: 'Electronics',
      imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
      stock: 30
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      price: 399.99,
      description: 'Industry-leading noise canceling with exceptional sound quality and 30-hour battery life.',
      categoryName: 'Electronics',
      imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      stock: 75
    },
    {
      id: 4,
      name: 'Nike Air Max 270 Running Shoes',
      price: 150.00,
      description: 'Comfortable running shoes with Max Air unit for exceptional cushioning and style.',
      categoryName: 'Clothing',
      imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
      stock: 120
    },
    {
      id: 5,
      name: 'MacBook Pro 14-inch M3 Pro 512GB Space Black',
      price: 1999.99,
      description: 'Powerful laptop with M3 Pro chip, Liquid Retina XDR display, and all-day battery life.',
      categoryName: 'Electronics',
      imageUrl: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
      stock: 25
    },
    {
      id: 6,
      name: 'Levi\'s 501 Original Fit Jeans',
      price: 89.99,
      description: 'Classic straight-leg jeans with authentic fit and timeless style.',
      categoryName: 'Clothing',
      imageUrl: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
      stock: 200
    },
    {
      id: 7,
      name: 'KitchenAid Stand Mixer 5-Quart Artisan Series',
      price: 449.99,
      description: 'Professional-grade stand mixer perfect for baking and cooking enthusiasts.',
      categoryName: 'Home & Garden',
      imageUrl: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400',
      stock: 40
    },
    {
      id: 8,
      name: 'Adidas Ultraboost 22 Running Shoes',
      price: 190.00,
      description: 'Premium running shoes with responsive Boost midsole and Primeknit upper.',
      categoryName: 'Clothing',
      imageUrl: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
      stock: 85
    }
  ],
  categories: [
    { id: 1, name: 'Electronics', parentCategoryName: null },
    { id: 2, name: 'Clothing', parentCategoryName: null },
    { id: 3, name: 'Home & Garden', parentCategoryName: null },
    { id: 4, name: 'Sports & Outdoors', parentCategoryName: null },
    { id: 5, name: 'Books', parentCategoryName: null },
    { id: 6, name: 'Beauty & Personal Care', parentCategoryName: null }
  ],
  cart: [],
  orders: [],
  reviews: []
};

class ApiService {
  private isBackendAvailable = true;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getAuthHeadersMultipart(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async checkBackendAvailability(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      // Try a simple endpoint that doesn't require auth
      const response = await fetch(`${API_BASE_URL}/api/v1/categories/viewAll`, {
      const response = await fetch(`${API_BASE_URL}/api/v1/categories/viewAll`, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      return response.ok || response.status === 401; // 401 means backend is running but needs auth
      
      clearTimeout(timeoutId);
      return response.ok || response.status === 401; // 401 means backend is running but needs auth
    } catch (error) {
      console.warn('Backend connection failed:', error);
      return false;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Check if backend is available on first request or if we think it's available
    if (this.isBackendAvailable) {
      const url = `${API_BASE_URL}${endpoint}`;
      const config = {
        headers: this.getAuthHeaders(),
        ...options,
      };

      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        
        return await response.text() as unknown as T;
      } catch (error) {
        console.error('API request failed:', error);
        // Check if backend is still available
        this.isBackendAvailable = await this.checkBackendAvailability();
        
        if (!this.isBackendAvailable) {
          console.warn('Backend not available, falling back to mock data');
          return this.getMockResponse<T>(endpoint, options.method || 'GET');
        }
        throw error;
      }
    } else {
      // Backend not available, use mock data
      console.warn('Backend not available, using mock data');
      return this.getMockResponse<T>(endpoint, options.method || 'GET');
    }
  }

  private getMockResponse<T>(endpoint: string, method: string): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let response: any = { success: true };

        if (endpoint.includes('/products/viewAll')) {
          response = mockData.products;
        } else if (endpoint.includes('/products/viewById/')) {
          const id = endpoint.split('/').pop();
          response = mockData.products.find(p => p.id.toString() === id) || null;
          if (response) {
            // Add reviews to product details
            response = {
              ...response,
              reviews: [
                {
                  id: 1,
                  rating: 5,
                  comment: "Excellent product! Highly recommended.",
                  userName: "John Doe",
                  createdAt: "2024-01-15T10:30:00Z"
                },
                {
                  id: 2,
                  rating: 4,
                  comment: "Good quality, fast delivery.",
                  userName: "Jane Smith",
                  createdAt: "2024-01-10T14:20:00Z"
                }
              ]
            };
          }
        } else if (endpoint.includes('/products/viewByCategory/')) {
          response = mockData.products;
        } else if (endpoint.includes('/categories/viewAll')) {
          response = mockData.categories;
        } else if (endpoint.includes('/categories/viewById/')) {
          const id = endpoint.split('/').pop();
          response = mockData.categories.find(c => c.id.toString() === id) || null;
        } else if (endpoint.includes('/cartItems/view')) {
          response = {
            id: 1,
            userId: 1,
            items: mockData.cart
          };
        } else if (endpoint.includes('/orders/history')) {
          response = mockData.orders;
        } else if (endpoint.includes('/auth/login')) {
          response = 'mock-jwt-token-12345';
        } else if (endpoint.includes('/auth/register')) {
          response = { 
            id: 1, 
            email: 'user@example.com', 
            firstName: 'John',
            lastName: 'Doe',
            role: 'User',
            address: '123 Main St, New York, NY 10001'
          };
        } else if (endpoint.includes('/auth/profile')) {
          response = { 
            id: 1, 
            email: 'user@example.com', 
            firstName: 'John',
            lastName: 'Doe',
            role: 'User',
            address: '123 Main St, New York, NY 10001'
          };
        } else if (endpoint.includes('/auth/profile')) {
          response = { 
            id: 1, 
            email: 'user@example.com', 
            firstName: 'John',
            lastName: 'Doe',
            role: 'User',
            address: '123 Main St, New York, NY 10001'
          };
        } else if (method === 'POST' || method === 'PUT') {
          response = { success: true, message: 'Operation completed successfully (mock)' };
        } else if (method === 'DELETE') {
          response = { success: true, message: 'Item deleted successfully (mock)' };
        }

        resolve(response as T);
      }, 500); // Simulate network delay
    });
  }

  async requestMultipart<T>(endpoint: string, formData: FormData): Promise<T> {
    if (!this.isBackendAvailable) {
      console.warn('Backend not available, using mock response for multipart request');
      return this.getMockResponse<T>(endpoint, 'POST');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      method: 'POST',
      headers: this.getAuthHeadersMultipart(),
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API multipart request failed:', error);
      this.isBackendAvailable = false;
      return this.getMockResponse<T>(endpoint, 'POST');
    }
  }

  // Initialize backend connection check
  async initialize(): Promise<void> {
    this.isBackendAvailable = await this.checkBackendAvailability();
    if (this.isBackendAvailable) {
      console.log('✅ Backend connection established');
    } else {
      console.warn('⚠️ Backend not available, using mock data');
    }
  }

  // Auth endpoints
  async register(data: any) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: any): Promise<string> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request('/api/auth/profile');
  }

  // Products
  async getProducts() {
    return this.request('/api/v1/products/viewAll');
  }

  async getProductById(id: string) {
    return this.request(`/api/v1/products/viewById/${id}`);
  }

  async getProductsByCategory(categoryId: string) {
    return this.request(`/api/v1/products/viewByCategory/${categoryId}`);
  }

  async createProduct(formData: FormData) {
    return this.requestMultipart('/api/v1/products/add', formData);
  }

  async updateProduct(id: string, formData: FormData) {
    if (!this.isBackendAvailable) {
      return this.getMockResponse('/api/v1/products/update', 'PUT');
    }

    const url = `${API_BASE_URL}/api/v1/products/update/${id}`;
    const config = {
      method: 'PUT',
      headers: this.getAuthHeadersMultipart(),
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Update product failed:', error);
      this.isBackendAvailable = false;
      return this.getMockResponse('/api/v1/products/update', 'PUT');
    }
  }

  // Categories
  async getCategories() {
    return this.request('/api/v1/categories/viewAll');
  }

  async getCategoryById(id: string) {
    return this.request(`/api/v1/categories/viewById/${id}`);
  }

  async getSubCategories(parentId: string) {
    return this.request(`/api/v1/categories/viewSubcategory/${parentId}`);
  }

  async createCategory(data: any) {
    return this.request('/api/v1/categories/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: any) {
    return this.request(`/api/v1/categories/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/api/v1/categories/remove/${id}`, {
      method: 'DELETE',
    });
  }

  // Cart
  async getCart() {
    return this.request('/api/v1/cartItems/view');
  }

  async addToCart(data: any) {
    return this.request('/api/v1/cartItems/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCartItem(productId: string, data: any) {
    return this.request(`/api/v1/cartItems/update/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeFromCart(productId: string) {
    return this.request(`/api/v1/cartItems/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async placeOrder(data: any) {
    return this.request('/api/v1/orders/place', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrderHistory() {
    return this.request('/api/v1/orders/history');
  }

  async getOrderDetails(orderId: string) {
    return this.request(`/api/v1/orders/view/${orderId}`);
  }

  async cancelOrder(orderId: string) {
    return this.request(`/api/v1/orders/cancel/${orderId}`, {
      method: 'PUT',
    });
  }

  async getAllOrders() {
    return this.request('/api/v1/orders/all');
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/api/v1/orders/update/${orderId}/status?status=${status}`, {
      method: 'PUT',
    });
  }

  // Reviews
  async createReview(data: any) {
    return this.request('/api/v1/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProductReviews(productId: string) {
    return this.request(`/api/v1/reviews/product/${productId}`);
  }

  async deleteReview(reviewId: string) {
    return this.request(`/api/v1/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  // Price Alerts
  async createPriceAlert(data: any) {
    return this.request('/api/v1/price-alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPriceAlerts() {
    return this.request('/api/v1/price-alerts');
  }

  async deletePriceAlert(alertId: string) {
    return this.request(`/api/v1/price-alerts/${alertId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();