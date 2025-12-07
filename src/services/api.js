import axios from 'axios';

// Debug log to check environment variable
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('All env variables:', import.meta.env);

// Add fallback for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'development' ? 'https://localhost:44357/api' : '/api');

console.log('Using API_BASE_URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.config.method.toUpperCase()}] ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        console.error('Unauthorized access');
        // window.location.href = '/login';
      } else if (error.response.status === 404) {
        console.error('Resource not found');
      }
    } else if (error.request) {
      console.error('API No Response:', error.request);
      console.error('Possible reasons: CORS issue, server down, network problem.');
    } else {
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const productAPI = {
  getAllProducts: async (params = {}) => {
    try {
      const res = await api.get('/Products', { params });
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Error getting products:', err);
      return [];
    }
  },
  getProductById: async (id) => {
    try {
      const res = await api.get(`/Products/${id}`);
      return res.data;
    } catch (err) {
      console.error(`Error getting product ${id}:`, err);
      return null;
    }
  },
  createProduct: async (data) => {
    try {
      const res = await api.post('/Products', data);
      return res.data;
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  },
  updateProduct: async (id, data) => {
    try {
      const res = await api.put(`/Products/${id}`, data);
      return res.data;
    } catch (err) {
      console.error(`Error updating product ${id}:`, err);
      throw err;
    }
  },
  deleteProduct: async (id) => {
    try {
      await api.delete(`/Products/${id}`);
      return true;
    } catch (err) {
      console.error(`Error deleting product ${id}:`, err);
      return false;
    }
  },
  toggleProductStatus: async (id) => {
    try {
      await api.patch(`/Products/${id}/toggle-status`);
      return true;
    } catch (err) {
      console.error(`Error toggling product status ${id}:`, err);
      return false;
    }
  },
  getProductsCount: async () => {
    try {
      const res = await api.get('/Products/count');
      return res.data;
    } catch (err) {
      console.error('Error getting products count:', err);
      return 0;
    }
  },
  getCategories: async () => {
    try {
      const res = await api.get('/Categories');
      console.log('api: API_BASE_URL=', API_BASE_URL+res.config.url);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Error getting categories:', err);
      return [];
    }
  }
};

export default api;