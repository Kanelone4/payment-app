// tokenService.ts
import { store } from '../../../store'; 
import { logout } from '../../../features/authSlice'; 

export const secureStoreCredentials = (email: string, password: string) => {
  localStorage.setItem('userCredentials', JSON.stringify({ email, password }));
};

const getStoredCredentials = () => {
  const credentials = localStorage.getItem('userCredentials');
  return credentials ? JSON.parse(credentials) : null;
};

const clearStoredCredentials = () => {
  localStorage.removeItem('userCredentials');
};

export const setAuthTokens = (tokens: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}) => {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
  // Calcule la date d'expiration (timestamp en ms)
  const expiryDate = Date.now() + tokens.expiresIn * 1000;
  localStorage.setItem('expiresIn', expiryDate.toString());
};

export const getAccessToken = () => localStorage.getItem('accessToken');

// tokenService.ts
export const isTokenExpiringSoon = (bufferSeconds = 300): boolean => {
    const expiry = localStorage.getItem('expiresIn');
    if (!expiry) return true;
    
    const expiryTime = parseInt(expiry);
    const currentTime = Date.now();
    return (expiryTime - currentTime) < (bufferSeconds * 1000);
  };
export const refreshAuthToken = async () => {
  const credentials = getStoredCredentials();
  if (!credentials) throw new Error('No stored credentials');

  try {
    const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });

    if (!response.ok) throw new Error('Refresh failed');

    const data = await response.json();
    setAuthTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn
    });
    
    return data.accessToken;
  } catch (error) {
    clearStoredCredentials();
    store.dispatch(logout());
    throw error;
  }
};