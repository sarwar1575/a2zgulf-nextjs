// src/store/slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, fetchUserProfile, verifyOtp,logoutUserApi} from '../../lib/api';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''; // Your API base URL

// ------------------ REGISTER ------------------
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      if (response.success) return response;
      return rejectWithValue(response.message || 'Registration failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Registration failed');
    }
  }
);

// ------------------ LOGIN ------------------
export const login = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await loginUser(loginData);
      if (response.success) return response;
      return rejectWithValue(response.message || 'Login failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Login failed');
    }
  }
);

// ------------------ FETCH PROFILE ------------------
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserProfile();
      if (response.success) return response;
      return rejectWithValue(response.message || 'Fetch profile failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Fetch profile failed');
    }
  }
);

// ------------------ VERIFY OTP ------------------
export const verifyUserOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ tokenId, otp }, { rejectWithValue }) => {
    try {
      const response = await verifyOtp(tokenId, otp);
      if (response.success) return response;
      return rejectWithValue(response.message || 'OTP verification failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'OTP verification failed');
    }
  }
);

// ------------------ LOGOUT ------------------
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await logoutUserApi(token);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
// ------------------ INITIAL STATE ------------------
const initialState = {
  user: typeof window !== 'undefined' && localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  loading: false,
  error: null,
};

// ------------------ SLICE ------------------
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || null;
        if (state.user) {
          localStorage.setItem('user', JSON.stringify(state.user));
          localStorage.setItem('token', action.payload.data.token);
        } else {
          state.error = action.payload.message || 'Login failed';
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || state.user;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // VERIFY OTP
      .addCase(verifyUserOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || state.user;
      })
      .addCase(verifyUserOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
     .addCase(logoutUser.fulfilled, (state) => {
  state.user = null;
  state.error = null;
});
  },
});

export default authSlice.reducer;
