// src/store/slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, fetchUserProfile } from '../lib/api';

// Async thunk for user registration
export const register = createAsyncThunk('auth/register', async (userData) => {
  const response = await registerUser(userData);
  return response;  // Return the response data
});

// Async thunk for user login
export const login = createAsyncThunk('auth/login', async (loginData) => {
  const response = await loginUser(loginData);
  return response;  // Return the response data
});

// Async thunk for fetching user profile
export const fetchProfile = createAsyncThunk('user/fetchProfile', async () => {
  const response = await fetchUserProfile();
  return response;  // Return the response data
});

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
  profile: null,  // For user profile data
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle registration
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;  // Store user data after successful registration
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Handle login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;  // Store user data after successful login
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Handle fetching user profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;  // Store user profile data
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
