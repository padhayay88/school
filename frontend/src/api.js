import axios from "axios";

// Dynamic API Base URL detection - works on Vercel and any domain
const getBaseURL = () => {
  const isDevelopment = import.meta.env.MODE === 'development';
  
  if (isDevelopment) {
    // Local development
    return "http://localhost:4000/api";
  }
  
  // Production on Vercel - use specific backend URL
  // Check if we have a custom backend URL in env
  const envBackendURL = import.meta.env.VITE_API_URL;
  if (envBackendURL) {
    return envBackendURL;
  }
  
  // Fallback: Try common Vercel patterns
  const hostname = window.location.hostname;
  
  // If on *.vercel.app, try to construct backend URL
  if (hostname.includes('vercel.app')) {
    // Extract project name (e.g., 'myproject' from 'myproject.vercel.app')
    const projectName = hostname.split('.')[0];
    // Try backend with -api suffix (common pattern)
    return `https://${projectName}-api.vercel.app/api`;
  }
  
  // For custom domains - use same domain with /api prefix
  const protocol = window.location.protocol;
  return `${protocol}//api.${hostname}`;
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
