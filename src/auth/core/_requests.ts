import { AuthModel } from './_models';
import axios from 'axios';

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

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API URL is not defined in environment variables.");
}

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/login`;
export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/users/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/users/reset-password`;
export const GET_PRODUCTS_URL = `${API_URL}/product/product`;
export const GET_PLANS_URL = `${API_URL}/plan/plans`;

export function login(email: string, newPassword: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    newPassword,
  });
}

export function register(
  email: string,
  nom: string,
  prenom: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: nom,
    last_name: prenom,
    password,
    password_confirmation,
  });
}

export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export const resetPassword = async (newPassword: string, token: string): Promise<ResetPasswordResponse> => {
  try {
    console.log('Reset Password Request:', { newPassword, token });
    const response = await axios.post<ResetPasswordResponse>(RESET_PASSWORD_URL, {
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
    const response = await axios.get<FetchProductsResponse>(GET_PRODUCTS_URL);
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchPlans = async (): Promise<Plan[]> => {
  try {
    const response = await axios.get<FetchPlansResponse>(GET_PLANS_URL);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data.data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

export const fetchPlanByProductId = async (productId: string): Promise<Plan | null> => {
  try {
    const response = await axios.get<{ plan: Plan }>(`${API_URL}/plan/product/${productId}`);
    return response.data.plan;
  } catch (error) {
    console.error('Error fetching plan by product ID:', error);
    throw error;
  }
};
