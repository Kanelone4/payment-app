import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Registration, login, fetchProducts, fetchPlans } from '../services/authService';

interface AuthState {
  user: null | { nom: string; prenom: string; email: string };
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  products: { _id: string; product_name: string; description: string }[];
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('accessToken') || null, 
  status: 'idle',
  error: null,
  products: [],
};

export const registerUser = createAsyncThunk(
  'auth/Registration',
  async (userData: { nom: string; prenom: string; email: string; password: string }) => {
    const response = await Registration(userData);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: { email: string; password: string }) => {
    const response = await login(userData);
    return response;
  }
);

export const fetchProductsAsync = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetchProducts();
    return response;
  }
);

export const fetchPlansAsync = createAsyncThunk(
  'plans/fetchPlans',
  async () => {
    const response = await fetchPlans();
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.products = [];
      localStorage.removeItem('accessToken'); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        localStorage.setItem('accessToken', action.payload.token); 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        localStorage.setItem('accessToken', action.payload.token); 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchPlansAsync.pending, (state) => {
        state.status = 'loading';  
      })
      .addCase(fetchPlansAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchPlansAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch plans';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;