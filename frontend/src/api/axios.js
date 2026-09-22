import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request (using sessionStorage)
API.interceptors.request.use((config) => {
    // ✅ Use sessionStorage instead of localStorage
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors (token expired / unauthorized)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear session and redirect to login
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            sessionStorage.clear();
            
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/admin/login')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default API;