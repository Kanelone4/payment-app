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

interface FetchProductsResponse {
  products: Product[];
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  billing_cycle: string;
  features: string[];
  product_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FetchPlansResponse {
  data: Plan[];
  message: string;
  error: string | null;
}

interface SubscriptionResponse {
  success: boolean;
  message?: string;
}


const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API URL is not defined in environment variables.");
}


export const PLAN_URLS = {
  GET_PLANS: `${API_URL}/plan/plans`, 
  GET_PLAN_BY_PRODUCT_ID: (productId: string) => `${API_URL}/plan/product/${productId}`, 
};


export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/login`;
export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/users/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/users/reset-password`;
export const GET_PRODUCTS_URL = `${API_URL}/product/product`;
export const CREATE_SUBSCRIPTION_URL = `${API_URL}/subscription`;


export function login(email: string, password: string) {
  console.log("Sending login request to:", LOGIN_URL); 
  console.log("Request payload:", { email, password }); 

  return axiosInstance.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  }).then(response => {
    console.log("Login API response:", response.data);
    return response.data;
  }).catch(error => {
    console.error("Login API error:", error);
    console.error("Login API error response:", error.response); 
    throw error;
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
    console.log('Reset Password Request:', { newPassword, token });
    const response = await axiosInstance.post<ResetPasswordResponse>(RESET_PASSWORD_URL, {
      token,
      newPassword,
    });

    if (response.data.message === "Mot de passe réinitialisé avec succès") {
      return { success: true, message: "Password has been successfully reset!" };
    } else {
      throw new Error(response.data.message || 'Failed to reset password.');
    }
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

    console.log('Réponse du backend pour fetchPlanByProductId:', JSON.stringify(response.data, null, 2));

    return response.data.data; 
  } catch (error) {
    console.error('Error fetching plan by product ID:', error);
    throw error;
  }
};

export const createSubscription = async (userId: string, planId: string): Promise<SubscriptionResponse> => {
  console.log('Creating subscription with URL:', CREATE_SUBSCRIPTION_URL); 
  try {
    const response = await axiosInstance.post<SubscriptionResponse>(CREATE_SUBSCRIPTION_URL, {
      user_id: userId,
      plan_id: planId,
      start_date: new Date().toISOString(),
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      status: 'active',
    });
    console.log('Subscription created successfully:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};