import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API URL is not defined in environment variables.");
}

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  
  config.headers = config.headers || {};

  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {
    
    if (error.response && error.response.status === 401) {
      
      localStorage.removeItem('accessToken'); 
      window.location.href = 'auth/login'; 
    }
    return Promise.reject(error); 
  }
);

export default axiosInstance;