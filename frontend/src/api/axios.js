import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'https://vender-e-comm-backend.vercel.app/api',
});

// Attach seller token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('seller_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on expired/invalid session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('seller_token');
      localStorage.removeItem('seller_profile');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
