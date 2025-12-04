// src/services/api.js
import axios from 'axios';

// Your ASP.NET Core API base URL (from Swagger)
const API_BASE_URL = 'https://localhost:7231/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.config.method.toUpperCase()}] ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      console.error('This could be due to:');
      console.error('1. CORS issue');
      console.error('2. API server not running');
      console.error('3. Network issue');
    } else {
      // Something happened in setting up the request
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Product API calls
export const productAPI = {
  // Get all products with optional filters
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get('/Products', { params });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error getting products:', error);
      return []; // Return empty array instead of throwing
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/Products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting product ${id}:`, error);
      return null;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/Products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error; // Re-throw for form to handle
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/Products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      await api.delete(`/Products/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return false;
    }
  },

  // Toggle product status
  toggleProductStatus: async (id) => {
    try {
      await api.patch(`/Products/${id}/toggle-status`);
      return true;
    } catch (error) {
      console.error(`Error toggling product status ${id}:`, error);
      return false;
    }
  },

  // Get products count
  getProductsCount: async () => {
    try {
      const response = await api.get('/Products/count');
      return response.data;
    } catch (error) {
      console.error('Error getting products count:', error);
      return 0;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/Categories');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error getting categories:', error);
      return []; // Always return array even on error
    }
  }
};

export default api;