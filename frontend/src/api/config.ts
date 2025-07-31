import axios from 'axios';

const API_BASE_PATH = '/api/v1';

// API configuration - use environment variable or fallback to localhost
export const API_BASE_URL =
    (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim() !== '')
        ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}${API_BASE_PATH}`
        : API_BASE_PATH;

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