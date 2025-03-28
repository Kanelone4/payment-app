import { refreshAuthToken, isTokenExpiringSoon } from './tokenService';

let refreshTimer: NodeJS.Timeout;

const calculateRefreshDelay = (): number => {
  const expiry = localStorage.getItem('expiresIn');
  if (!expiry) return 0;
  
  const expiryTime = parseInt(expiry);
  const currentTime = Date.now();
  
  return Math.max(0, expiryTime - currentTime - 300000);
};

export const scheduleTokenRefresh = () => {

  if (refreshTimer) clearTimeout(refreshTimer);
  
  if (isTokenExpiringSoon(60)) { 
    refreshAuthToken()
      .then(() => scheduleTokenRefresh()) 
      .catch(error => console.error('Immediate refresh failed:', error));
    return;
  }
  
  const delay = calculateRefreshDelay();
  
  if (delay > 0) {
    refreshTimer = setTimeout(async () => {
      try {
        await refreshAuthToken();
        scheduleTokenRefresh();
      } catch (error) {
        console.error('Scheduled refresh failed:', error);
      }
    }, delay);
  }
};

export const clearTokenRefresh = () => {
  if (refreshTimer) clearTimeout(refreshTimer);
};