import { store } from '../../../store';
import { logout } from '../../../features/authSlice';

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const refreshToken = async () => {
  const credentials = JSON.parse(localStorage.getItem('userCredentials') || '{}');
  
  if (!credentials.email || !credentials.password) {
    throw new Error('No credentials available for refresh');
  }

  const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return await response.json();
};

// Intercepteur pour les requêtes fetch
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken');
  const optionsWithAuth = { ...options };

  // Ajout du token aux headers
  if (token) {
    optionsWithAuth.headers = {
      ...optionsWithAuth.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  let response = await fetch(url, optionsWithAuth);

  // Si le token a expiré (statut 401) et qu'on a un token
  if (response.status === 401 && token && !isTokenExpired(token)) {
    try {
      // Rafraîchir le token
      const newTokens = await refreshToken();
      
      // Mettre à jour le storage
      localStorage.setItem('accessToken', newTokens.accessToken);
      localStorage.setItem('refreshToken', newTokens.refreshToken);
      
      // Créer une nouvelle configuration avec le nouveau token
      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newTokens.accessToken}`
        }
      };
      
      // Réessayer la requête originale
      response = await fetch(url, newOptions);
    } catch (error) {
      // En cas d'échec, déconnecter l'utilisateur
      store.dispatch(logout());
      throw error;
    }
  }

  return response;
};