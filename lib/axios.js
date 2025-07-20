import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API } from '../constant/endpoints';

const api = axios.create({
  baseURL: BASE_API,
  headers: {
    Authorization: `Bearer ${Cookies.get('token')}`,
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.warn('Unauthorized, redirecting to login...');
      // window.location.href = '/login'; // Uncomment if needed
    }
    return Promise.reject(error);
  }
);

export default api;