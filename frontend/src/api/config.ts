import axios from 'axios';

// API configuration - use environment variable or fallback to localhost
// Supports both HTTP (local/demo) and HTTPS (production) endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
  : 'http://localhost:8080/api/v1';

// SSL/HTTPS Configuration
// When running over HTTPS, ensure API calls handle mixed content appropriately
const isHTTPS = window.location.protocol === 'https:';
const isProduction = import.meta.env.PROD;

// Log configuration for debugging
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    baseURL: API_BASE_URL,
    isHTTPS,
    isProduction,
    env: import.meta.env.VITE_API_BASE_URL
  });
}

// Basic auth credentials
const AUTH_CREDENTIALS = btoa('admin:admin123');

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Basic ${AUTH_CREDENTIALS}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common HTTP errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('Authentication failed');
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error('API error:', data?.message || error.message);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error - no response received');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);