import { AuthModel } from './_models';
import axiosInstance from '../../auth/core/axios';

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

interface Product {
  _id: string;
  product_name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  billing_cycle?: string;
  features: string[];
  product_id: string;
  product_name?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CartItem {
  _id: string;
  plan_id: Plan;
  quantity: number;
  metadata: {
    isUpgrade: boolean;
    currentSubscriptionId: string;
  };
  added_at: string;
  subtotal: number;
}

interface CartResponse {
  _id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
  __v: number;
  items: CartItem[];
}

interface FetchProductsResponse {
  products: Product[];
}

interface FetchPlansResponse {
  data: Plan[];
  message: string;
  error: string | null;
}

interface License {
  _id: string
  key: string
  user_id: string
  plan_id: {
    _id: string
    name: string
    price: number
    billing_cycle: string
    features: string[]
    product_id: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  subscription_id: string
  expires_at: string
  is_active: boolean
  status: 'active' | 'inactive' | 'expired'
  created_at: string
  __v: number
}

interface LicensesResponse {
  success: boolean;
  data: License[];
  message?: string;
  error?: string | null;
  count: number;
}

interface UserSubscription {
  order_id: string
  Product: string
  Status: string
  Plan: string
  expire_date: string
  Details: {
    billing_cycle: string
    start_date: string
  }
}

interface SubscriptionsResponse {
  data: {
    subscriptions: UserSubscription[];
    count: number;
  };
  message: string;
  error: string | null;
}

interface Notification {
  _id: string;
  userId: string;
  event: string;
  data: {
    message: string;
    plan_id?: string;
    start_date?: string;
    end_date?: string;
    amount?: number;
    transaction_id?: number;
    timestamp: string;
  };
  timestamp: string;
  __v: number;
}

interface Invoice {
  invoiceNumber: string;
  amount: number;
  date: string;
  paymentId: string;
  planName: string;
  productName: string;
  details: {
    invoiceId: string;
    user: {
      username: string;
      email: string;
      name: string;
    };
  };
}

interface InvoicesResponse {
  success: boolean;
  data: Invoice[];
}

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API URL is not defined in environment variables.");
}

export const NOTIFICATION_URLS = {
  GET_NOTIFICATIONS: `${API_URL}/notifications`,
};

export const LICENSE_URLS = {
  GET_LICENSES: `${API_URL}/licenses/list/licenses`,
  GET_ALL_LICENSES: `${API_URL}/licenses`,
  GET_LICENSES_BY_PRODUCT_ID: (productId: string) => `${API_URL}/licenses/${productId}`,
};

export const SUBSCRIPTION_URLS = {
  GET_MY_SUBSCRIPTIONS: `${API_URL}/my-subscriptions`,
};

export const INVOICE_URLS = {
  GET_INVOICES: `${API_URL}/invoices`,
};

export const PLAN_URLS = {
  GET_PLANS: `${API_URL}/plan/plans`, 
  GET_PLAN_BY_PRODUCT_ID: (productId: string) => `${API_URL}/plan/product/${productId}`,
  ADD_TO_CART: `${API_URL}/cart/items`,
  GET_CART: `${API_URL}/cart`,
  REMOVE_CART_ITEM: (planId: string) => `${API_URL}/cart/items/${planId}`,
  CHECKOUT: `${API_URL}/cart/checkout`,
};

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/login`;
export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/users/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/users/reset-password`;
export const GET_PRODUCTS_URL = `${API_URL}/product/product`;

export function login(email: string, password: string) {
  return axiosInstance.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  });
}

export function register(
  email: string,
  nom: string,
  prenom: string,
  password: string,
  password_confirmation: string
) {
  return axiosInstance.post(REGISTER_URL, {
    email,
    first_name: nom,
    last_name: prenom,
    password,
    password_confirmation,
  });
}

export function requestPassword(email: string) {
  return axiosInstance.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export const resetPassword = async (newPassword: string, token: string): Promise<ResetPasswordResponse> => {
  try {
    const response = await axiosInstance.post<ResetPasswordResponse>(RESET_PASSWORD_URL, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get<FetchProductsResponse>(GET_PRODUCTS_URL);
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchPlans = async (): Promise<Plan[]> => {
  try {
    const response = await axiosInstance.get<FetchPlansResponse>(PLAN_URLS.GET_PLANS);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data.data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

export const fetchPlanByProductId = async (productId: string): Promise<{ billing_cycle: string; plans: Plan[] }[]> => {
  try {
    const response = await axiosInstance.get<{ data: { billing_cycle: string; plans: Plan[] }[] }>(
      PLAN_URLS.GET_PLAN_BY_PRODUCT_ID(productId)
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching plan by product ID:', error);
    throw error;
  }
};

export const addToCart = async (planId: string, currentSubscriptionId: string): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.post<CartResponse>(PLAN_URLS.ADD_TO_CART, {
      planId,
      currentSubscriptionId
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const fetchCartItems = async (): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.get<CartResponse>(PLAN_URLS.GET_CART);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const removeCartItem = async (planId: string): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.delete<{ success: boolean }>(
      PLAN_URLS.REMOVE_CART_ITEM(planId)
    );
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

export const initiateCheckout = async (
  paymentMethod: string, 
  paymentProvider: string
): Promise<{
  success: boolean;
  data: {
    requires_payment: boolean;
    subscriptions: Array<{
      id: string;
      status: string;
      plan_id: string;
      plan_name: string;
      billing_cycle: string;
      start_date: string;
    }>;
    payment_details: {
      method: string;
      provider: string;
      amount: number;
      transaction_id: number;
      redirect_url: string;
    };
  };
  meta: {
    timestamp: string;
    api_version: string;
  };
}> => {
  try {
    const response = await axiosInstance.post(PLAN_URLS.CHECKOUT, {
      payment_method: paymentMethod,
      payment_provider: paymentProvider
    });
    return response.data;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};

export const fetchUserLicenses = async (): Promise<License[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/licenses/list/licenses', {
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

    const data: LicensesResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching licenses:', error);
    throw error;
  }
};

export const fetchUserSubscriptions = async (): Promise<{ subscriptions: UserSubscription[], count: number }> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(SUBSCRIPTION_URLS.GET_MY_SUBSCRIPTIONS, {
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

    const data: SubscriptionsResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

export const fetchLicenses = async (): Promise<License[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/licenses', {
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
    return data.licenses; 
  } catch (error) {
    console.error('Error fetching licenses:', error);
    throw error;
  }
};

export const getLicensesByProductId = async (productId: string): Promise<License[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axiosInstance.get<LicensesResponse>(
      `${API_URL}/licenses/${productId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data.licenses;
  } catch (error) {
    console.error(`Error fetching licenses for product ${productId}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to fetch product licenses'
    );
  }
};

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch('https://rightcomsaasapi-if7l.onrender.com/notifications', {
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

export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(INVOICE_URLS.GET_INVOICES, {
      method: 'GET',
      headers: { 
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch invoices');
    }

    const data: InvoicesResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const downloadInvoice = async (invoiceId: string): Promise<Blob> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/invoices/download/${invoiceId}`, {
      method: 'GET',
      headers: { 
        'accept': 'application/pdf',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // Gérer spécifiquement les erreurs 404
      if (response.status === 404) {
        throw new Error('Facture non trouvée sur le serveur');
      }
      // Essayer de lire le message d'erreur comme texte d'abord
      const errorText = await response.text();
      throw new Error(errorText || 'Échec du téléchargement');
    }

    // Vérifier que la réponse est bien un PDF
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/pdf')) {
      throw new Error('La réponse n\'est pas un PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};