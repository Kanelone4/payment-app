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

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API URL is not defined in environment variables.");
}

export const PLAN_URLS = {
  GET_PLANS: `${API_URL}/plan/plans`, 
  GET_PLAN_BY_PRODUCT_ID: (productId: string) => `${API_URL}/plan/product/${productId}`,
  ADD_TO_CART: `${API_URL}/cart/items`,
  GET_CART: `${API_URL}/cart`,
  REMOVE_CART_ITEM: (planId: string) => `${API_URL}/cart/items/${planId}`,
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