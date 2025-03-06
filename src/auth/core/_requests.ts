import { AuthModel } from './_models';
import axios from 'axios';


interface ResetPasswordResponse {
  success: boolean;
  message?: string;
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
      return { success: true, message: response.data.message };
    } else {
      throw new Error(response.data.message || 'Failed to reset password.');
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};


