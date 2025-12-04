// src/components/TestConnection.jsx
import React, { useEffect } from 'react';
import { productAPI } from '@/services/api';

const TestConnection = () => {
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('Testing connection to API...');
      
      // Test categories endpoint
      const categories = await productAPI.getCategories();
      console.log('Categories loaded:', categories);
      
      // Test products endpoint
      const products = await productAPI.getAllProducts();
      console.log('Products loaded:', products.length, 'products');
      
      console.log('✅ API connection successful!');
    } catch (error) {
      console.error('❌ API connection failed:', error);
      console.log('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
    }
  };

  return (
    <div>
      <h2>Testing API Connection</h2>
      <p>Check browser console for connection status</p>
    </div>
  );
};

export default TestConnection;