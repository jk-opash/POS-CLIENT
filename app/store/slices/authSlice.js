import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// Async thunk for owner login
export const loginOwner = createAsyncThunk(
  'auth/loginOwner',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login/admin', { email, password });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Login failed');
      }
      return rejectWithValue(error.message || 'An error occurred during login');
    }
  }
);

// Helper function to safely parse local storage
const loadUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  user: loadUserFromStorage(),
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
  sessionConflict: false,
  sessionConflictMessage: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.sessionConflict = false;
      state.sessionConflictMessage = '';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setSessionConflict: (state, action) => {
      state.sessionConflict = true;
      state.sessionConflictMessage = action.payload || 'This account is logged in on multiple devices. Enter your PIN to continue.';
    },
    clearSessionConflict: (state) => {
      state.sessionConflict = false;
      state.sessionConflictMessage = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, setSessionConflict, clearSessionConflict } = authSlice.actions;

export default authSlice.reducer;
