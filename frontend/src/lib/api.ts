import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for session authentication
});

// Request interceptor to add auth headers
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  me: () => api.get('/users/me/'),
};

export const tracksAPI = {
  getAll: () => api.get('/tracks/'),
  getById: (id: number) => api.get(`/tracks/${id}/`),
  create: (data: FormData) => api.post('/tracks/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: { track_name?: string }) =>
    api.patch(`/tracks/${id}/`, data),
  delete: (id: number) => api.delete(`/tracks/${id}/`),
  search: (query: string) => api.get(`/tracks/search/?q=${encodeURIComponent(query)}`),
  transform: (id: number, styles: string[]) =>
    api.post(`/tracks/${id}/transform/`, { track_id: id, styles }),
};

export const transformationsAPI = {
  getAll: () => api.get('/transformations/'),
  getById: (id: number) => api.get(`/transformations/${id}/`),
  download: (id: number) => api.get(`/transformations/${id}/download/`),
};

export const jobsAPI = {
  getAll: () => api.get('/jobs/'),
  getById: (id: number) => api.get(`/jobs/${id}/`),
  getActive: () => api.get('/jobs/active/'),
  cancel: (id: number) => api.post(`/jobs/${id}/cancel/`),
};

export const profileAPI = {
  get: () => api.get('/profiles/'),
  getStats: () => api.get('/profiles/stats/'),
  update: (data: Record<string, unknown>) => api.patch('/profiles/', data),
};

export default api;
