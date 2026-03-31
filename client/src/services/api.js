import axios from 'axios';

// Base URL from env, fallback to proxy path for dev
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('simon_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: handle 401 globally ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear local storage
      localStorage.removeItem('simon_token');
      localStorage.removeItem('simon_user');
      // Redirect to login (without React Router dependency here)
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API calls ───────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── User API calls ───────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
};

// ─── Game API calls ───────────────────────────────────────────────────────────
export const gameAPI = {
  submitScore: (data) => api.post('/game/score', data),
  getHistory: () => api.get('/game/history'),
};

// ─── Leaderboard API calls ────────────────────────────────────────────────────
export const leaderboardAPI = {
  getLeaderboard: () => api.get('/leaderboard'),
};

export default api;
