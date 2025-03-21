import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, Registration, fetchProducts, fetchPlans } from '../services/authService';

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as AxiosErrorResponse;
    return axiosError.response?.data?.message ?? 'Une erreur est survenue';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Une erreur inconnue est survenue';
}

interface AuthState {
  user: null | {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  products: { _id: string; product_name: string; description: string }[];
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  status: 'idle',
  error: null,
  products: [],
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {_id: string; nom: string; prenom: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await Registration(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await login(userData);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchProductsAsync = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchProducts();
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchPlansAsync = createAsyncThunk(
  'plans/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchPlans();
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = null;
      state.products = [];
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Inscription
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Registration failed';
      })

      // Connexion
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.payload.accessToken) {
          state.token = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user; // Stocker les données de l'utilisateur
          localStorage.setItem('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        } else {
          console.error("Access token not found in login response");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Login failed';
      })

      // Produits
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch products';
      })

      // Plans
      .addCase(fetchPlansAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlansAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchPlansAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch plans';
      });
  },
});

export type RootState = ReturnType<typeof authSlice.reducer>;
export const { logout } = authSlice.actions;
export default authSlice.reducer;