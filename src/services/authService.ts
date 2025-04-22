import { setAuthTokens, secureStoreCredentials } from "../auth/core/serviceToken/tokenService"; 
import { scheduleTokenRefresh } from "../auth/core/serviceToken/tokenRefreshScheduler";

export const requestPasswordForgot = async (email: string) => {
  const response = await fetch('https://rightcomsaasapiv2.onrender.com/users/forgot-password', {
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
  const response = await fetch('https://rightcomsaasapiv2.onrender.com/users/reset-password', {
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
    const response = await fetch('https://rightcomsaasapiv2.onrender.com/users/register', {
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
  const response = await fetch('https://rightcomsaasapiv2.onrender.com/users/login', {
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
    const response = await fetch('https://rightcomsaasapiv2.onrender.com/product/productId', {
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
    const response = await fetch('https://rightcomsaasapiv2.onrender.com/plan/plans', {
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
    const response = await fetch(`https://rightcomsaasapiv2.onrender.com/plan/product/${productId}`, {
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
    const response = await fetch('https://rightcomsaasapiv2.onrender.com/cart/items', {
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
    const response = await fetch('https://rightcomsaasapiv2.onrender.com/cart', {
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

// Solution temporaire dans authService.ts
export const removeCartItem = async (planId: string) => {
  try {
    // 1. D'abord supprimer l'item
    await fetch(`https://rightcomsaasapiv2.onrender.com/cart/items/${planId}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    return await fetchCartItems();
  } catch (error) {
    console.error('Error in removal process:', error);
    throw error;
  }
};

// Dans authService.ts (ou votre fichier de services)
export const clearCart = async (): Promise<{ success: boolean }> => {
  try {
    const response = await fetch('https://rightcomsaasapiv2.onrender.com/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error clearing cart:', error);
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
    
    const response = await fetch('https://rightcomsaasapiv2.onrender.com/users/login', {
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

export const initiateCheckout = async (paymentMethod: string, paymentProvider: string) => {
  try {
    const response = await fetch('https://rightcomsaasapiv2.onrender.com/cart/checkout', {
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

export const fetchUserLicenses = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch('https://rightcomsaasapiv2.onrender.com/licenses/list/licenses', {
      method: 'GET',
      headers: { 
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch licenses');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching licenses:', error);
    throw error;
  }
};

export const fetchUserSubscriptions = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch('https://rightcomsaasapiv2.onrender.com/my-subscriptions', {
      method: 'GET',
      headers: { 
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch subscriptions');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};


export const fetchLicenses = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch('https://rightcomsaasapiv2.onrender.com/licenses', {
      method: 'GET',
      headers: { 
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch licenses');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching licenses:', error);
    throw error;
  }
};

// Dans authService.ts
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch('https://rightcomsaasapiv2.onrender.com/notifications', {
      method: 'GET',
      headers: { 
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch notifications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};


// Ajoutez cette fonction à votre fichier authService.ts
export const verifyPaymentStatus = async (id: string, status: string) => {
  try {
    const response = await fetch('https://rightcomsaasapiv2.onrender.com/payment/verification', {
      method: 'POST',
      headers: { 
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({
        status,
        id: id
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Ajoutez cette fonction à la fin de authService.ts
export const deleteNotification = async (notificationId: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`https://rightcomsaasapiv2.onrender.com/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: { 
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};