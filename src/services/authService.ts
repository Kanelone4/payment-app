import { setAuthTokens, secureStoreCredentials } from "../auth/core/serviceToken/tokenService"; 
import { scheduleTokenRefresh } from "../auth/core/serviceToken/tokenRefreshScheduler";

export const requestPasswordForgot = async (email: string) => {
  const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/users/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const requestPasswordReset = async (token: string, newPassword: string) => {
  const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/users/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const Registration = async (userData: {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register');
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const login = async (userData: { email: string; password: string }) => {
  const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error('Login failed');

  const data = await response.json();
  
  setAuthTokens(data);
  secureStoreCredentials(userData.email, userData.password);
  scheduleTokenRefresh();
  
  return data;
};

export const fetchProducts = async () => {
  try {
    const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/product/productId', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

export const fetchPlans = async () => {
  try {
    const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/plan/plans', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    throw error;
  }
};

export const fetchPlanByProductId = async (productId: string) => {
  try {
    const response = await fetch(`https://rightcomsaasapi-if7l.onrender.com/plan/product/${productId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.error('Failed to fetch plan by product ID:', error);
    throw error;
  }
};

// Ajoutez cette fonction à la fin de authService.ts
export const addToCart = async (planId: string, currentSubscriptionId: string) => {
  try {
    const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/cart/items', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ 
        planId, 
        currentSubscriptionId 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add to cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};


export const fetchCartItems = async () => {
  try {
    console.log('[fetchCartItems] Fetching cart items...');
    const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/cart', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    console.log('[fetchCartItems] Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[fetchCartItems] Error response data:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[fetchCartItems] Cart items fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('[fetchCartItems] Error fetching cart items:', error);
    throw error;
  }
};

export const removeCartItem = async (planId: string) => {
  try {
    console.log('[removeCartItem] Attempting to remove item with planId:', planId);
    console.log('[removeCartItem] Full URL:', `https://rightcomsaasapi-if7l.onrender.com/cart/items/${planId}`);
    console.log('[removeCartItem] Auth token:', localStorage.getItem('accessToken'));

    const response = await fetch(`https://rightcomsaasapi-if7l.onrender.com/cart/items/${planId}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    console.log('[removeCartItem] Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[removeCartItem] Error response data:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[removeCartItem] Item removed successfully:', data);
    return data;
  } catch (error) {
    console.error('[removeCartItem] Error removing cart item:', error);
    throw error;
  }
};

export const refreshAuthToken = async () => {
  try {
    const credentials = localStorage.getItem('userCredentials');
    
    if (!credentials) {
      throw new Error('No credentials available for refresh');
    }
    
    const { email, password } = JSON.parse(credentials);
    
    const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

// Ajoutez cette fonction à la fin de authService.ts
export const initiateCheckout = async (paymentMethod: string, paymentProvider: string) => {
  try {
    const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/cart/checkout', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ 
        payment_method: paymentMethod,
        payment_provider: paymentProvider
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Checkout failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};