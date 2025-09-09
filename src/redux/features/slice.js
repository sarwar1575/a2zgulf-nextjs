// src/store/slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, fetchUserProfile } from '../../lib/api';

export const register = createAsyncThunk('auth/register', async (userData) => {
  const response = await registerUser(userData);
  return response; 
});


export const login = createAsyncThunk('auth/login', async (loginData) => {
  const response = await loginUser(loginData);
  return response;  
});


export const fetchProfile = createAsyncThunk('user/fetchProfile', async () => {
  const response = await fetchUserProfile();
  return response;  
});

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
  profile: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
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
        state.user = action.payload;  
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
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
