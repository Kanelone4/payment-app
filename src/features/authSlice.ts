import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, Registration, fetchProducts, fetchPlans, addToCart, fetchCartItems, removeCartItem } from '../services/authService';

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface Subscription {
  _id: string;
  user_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  createdAt: string;
  updatedAt: string;
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  features: string[];
  product_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  billing_cycle?: string;
  product_name?: string;
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

interface Product {
  _id: string;
  product_name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  subscriptions?: Subscription[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  products: Product[];
  cart: {
    items: CartItem[];
    total: number;
    isLoading: boolean;
  };
}

const saveAuthState = (state: AuthState) => {
  try {
    console.log('[saveAuthState] Préparation des données à sauvegarder...');
    
    const stateToPersist = {
      user: state.user ? {
        _id: state.user._id,
        nom: state.user.nom,
        prenom: state.user.prenom,
        email: state.user.email,
        role: state.user.role,
        createdAt: state.user.createdAt,
        updatedAt: state.user.updatedAt,
        subscriptions: state.user.subscriptions || []
      } : null,
      token: state.token,
      refreshToken: state.refreshToken,
    };
    
    console.log('[saveAuthState] Données à sauvegarder:', stateToPersist);
    
    localStorage.setItem('authState', JSON.stringify(stateToPersist));
    console.log('[saveAuthState] Données sauvegardées avec succès');
  } catch (error) {
    console.error('[saveAuthState] Échec de la sauvegarde:', error);
  }
};

const loadAuthState = (): Partial<AuthState> => {
  try {
    console.log('[loadAuthState] Recherche de authState dans localStorage...');
    const serializedState = localStorage.getItem('authState');
    
    console.log('[loadAuthState] Valeur brute du localStorage:', serializedState);
    
    if (serializedState) {
      console.log('[loadAuthState] Données trouvées, tentative de parsing...');
      const parsedState = JSON.parse(serializedState);
      
      console.log('[loadAuthState] Données parsées:', {
        user: parsedState.user,
        token: parsedState.token,
        refreshToken: parsedState.refreshToken
      });
      
      return {
        user: parsedState.user,
        token: parsedState.token,
        refreshToken: parsedState.refreshToken,
      };
    } else {
      console.log('[loadAuthState] Aucune donnée trouvée dans authState');
    }
  } catch (error) {
    console.error('[loadAuthState] Erreur de parsing:', error);
  }
  return {};
};

const loadedState = loadAuthState();

const initialState: AuthState = {
  user: loadedState.user || null,
  token: loadedState.token || localStorage.getItem('accessToken') || null,
  refreshToken: loadedState.refreshToken || localStorage.getItem('refreshToken') || null,
  status: 'idle',
  error: null,
  products: [],
  cart: {
    items: loadedState.cart?.items || [],
    total: loadedState.cart?.total || 0,
    isLoading: false
  }
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { nom: string; prenom: string; email: string; password: string }, { rejectWithValue }) => {
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

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (
    { planId, currentSubscriptionId }: { planId: string; currentSubscriptionId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await addToCart(planId, currentSubscriptionId);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchCartItemsAsync = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[fetchCartItemsAsync] Fetching cart items...');
      const response = await fetchCartItems();
      console.log('[fetchCartItemsAsync] Fetch successful, items:', response.items);
      return response;
    } catch (error) {
      console.error('[fetchCartItemsAsync] Error fetching cart items:', error);
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const removeCartItemAsync = createAsyncThunk(
  'cart/removeCartItem',
  async (planId: string, { rejectWithValue }) => {
    try {
      console.log('[removeCartItemAsync] Removing item with planId:', planId);
      await removeCartItem(planId);
      console.log('[removeCartItemAsync] Removal successful for planId:', planId);
      return planId;
    } catch (error) {
      console.error('[removeCartItemAsync] Error removing cart item:', error);
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('refreshToken');
    },
    rehydrateAuthState: (state) => {
      const loadedState = loadAuthState();
      if (loadedState.user) state.user = loadedState.user;
      if (loadedState.token) state.token = loadedState.token;
      if (loadedState.refreshToken) state.refreshToken = loadedState.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(registerUser.fulfilled, (state, action) => {
      console.log('Payload reçu:', action.payload); 
    
      if (!action.payload?.user) { 
        return;
      }
      const userData = action.payload.user; 
      const subscriptions = action.payload.subscriptions || [];
      state.user = {
        _id: userData._id,
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        subscriptions: userData.subscriptions || subscriptions
      };
    
      state.status = 'succeeded';
      saveAuthState(state); 
    })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.token = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          
          if (action.payload.user) {
            state.user = action.payload.user;
          }
          
          localStorage.setItem('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
          saveAuthState(state);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Login failed';
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
        state.error = action.payload as string || 'Failed to fetch products';
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
        state.error = action.payload as string || 'Failed to fetch plans';
      })
      .addCase(addToCartAsync.pending, (state) => {
        state.cart.isLoading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.cart.items = action.payload.items;
        state.cart.total = action.payload.total;
        state.cart.isLoading = false;
      })
      .addCase(addToCartAsync.rejected, (state) => {
        state.cart.isLoading = false;
      })
      .addCase(fetchCartItemsAsync.pending, (state) => {
        state.cart.isLoading = true;
      })
      .addCase(fetchCartItemsAsync.fulfilled, (state, action) => {
        state.cart.items = action.payload.items;
        state.cart.total = action.payload.total;
        state.cart.isLoading = false;
        
      })
      .addCase(fetchCartItemsAsync.rejected, (state) => {
        state.cart.isLoading = false;
      })
      .addCase(removeCartItemAsync.pending, (state) => {
        state.cart.isLoading = true;
      })
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        state.cart.items = state.cart.items.filter(item => item.plan_id._id !== action.payload);
        state.cart.total = state.cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        state.cart.isLoading = false;
        
      })
      .addCase(removeCartItemAsync.rejected, (state) => {
        state.cart.isLoading = false;
      });
  }
});

export const { logout, rehydrateAuthState } = authSlice.actions;
export default authSlice.reducer;

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as AxiosErrorResponse;
    return axiosError.response?.data?.message ?? 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}