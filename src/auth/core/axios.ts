import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError
} from 'axios';
import { store } from '../../store';
import { logout } from '../../features/authSlice';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface UserCredentials {
  email: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://rightcomsaasapi-if7l.onrender.com';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown | null, token: string | null = null): void => {
  failedRequestsQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedRequestsQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = localStorage.getItem('accessToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (token && tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry);
      const currentTime = Date.now();
      const bufferTime = 300000; 

      if (expiryTime - currentTime < bufferTime && !isRefreshing) {
        isRefreshing = true;
        console.log('Token expiring soon, attempting refresh...');

        try {
          const credentials = localStorage.getItem('userCredentials');
          if (!credentials) throw new Error('No credentials stored');

          const { email, password } = JSON.parse(credentials) as UserCredentials;
          const response = await axios.post<AuthTokens>(`${API_URL}/users/login`, {
            email,
            password
          });

          const { accessToken, refreshToken, expiresIn } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('tokenExpiry', (Date.now() + expiresIn * 1000).toString());

          console.log('Token refreshed successfully');
          isRefreshing = false;
          processQueue(null, accessToken);
        } catch (error) {
          console.error('Failed to refresh token:', error);
          processQueue(error);
          isRefreshing = false;
          store.dispatch(logout());
          window.location.href = 'auth/login';
          throw error;
        }
      }

      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean });
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const credentials = localStorage.getItem('userCredentials');
        if (!credentials) throw new Error('No credentials stored');

        const { email, password } = JSON.parse(credentials) as UserCredentials;
        const response = await axios.post<AuthTokens>(`${API_URL}/users/login`, {
          email,
          password
        });

        const { accessToken, refreshToken, expiresIn } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('tokenExpiry', (Date.now() + expiresIn * 1000).toString());

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        isRefreshing = false;
        processQueue(null, accessToken);

        return axiosInstance(originalRequest);
      } catch (error) {
        isRefreshing = false;
        processQueue(error);
        store.dispatch(logout());
        window.location.href = 'auth/login';
        throw error;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;