import axios from "axios";

// Dynamic API Base URL detection
const getBaseURL = () => {
  const isDevelopment = import.meta.env.MODE === 'development';
  
  if (isDevelopment) {
    // Local development - use backend server
    return "http://localhost:4000/api";
  }
  
  // Production - API is on same domain (single Vercel deployment)
  // If VITE_API_URL is set, use it (for separate deployments)
  const envBackendURL = import.meta.env.VITE_API_URL;
  if (envBackendURL) {
    return envBackendURL;
  }
  
  // Default: Same domain, /api routes
  return "/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Add Authorization header from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced error handling for network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      error.message = "Connection failed. Check your internet connection.";
    }
    return Promise.reject(error);
  }
);

export default api;
