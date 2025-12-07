import axios from 'axios';

// Debug log to check environment variable
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Environment Mode:', import.meta.env.MODE);
console.log('Is Development:', import.meta.env.DEV);
console.log('Is Production:', import.meta.env.PROD);

// Determine API base URL based on environment
let API_BASE_URL;

if (import.meta.env.VITE_API_BASE_URL) {
  // Priority 1: Use from environment variable if explicitly set
  API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
} else if (import.meta.env.PROD) {
  // Priority 2: Production environment
  API_BASE_URL = 'http://localhost:82/api';
} else {
  // Priority 3: Development environment (default)
  API_BASE_URL = 'https://localhost:44357/api';
}

console.log('Final API_BASE_URL:', API_BASE_URL);

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
    // Add auth token if needed
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Success [${response.config.method.toUpperCase()}] ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
      });
      
      // Handle specific status codes
      if (error.response.status === 401) {
        console.error('Unauthorized - Redirecting to login');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('API No Response - Server may be down or network issue');
    } else {
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Helper function to get full URL for debugging
export const getFullUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// API methods
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
      console.log('API Request to:', getFullUrl('/Categories'));
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Error getting categories:', err);
      return [];
    }
  }
};

export default api;