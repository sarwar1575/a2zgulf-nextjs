// src/redux/features/slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, fetchUserProfile, verifyOtp, logoutUserApi } from '../../lib/api';

/** ---------------- Helpers ---------------- **/
const getLS = (k, def = null) => {
  if (typeof window === 'undefined') return def;
  const v = localStorage.getItem(k);
  if (v == null) return def;
  try { return JSON.parse(v); } catch { return v; }
};

const setLS = (k, v) => {
  if (typeof window === 'undefined') return;
  if (typeof v === 'string') localStorage.setItem(k, v);
  else localStorage.setItem(k, JSON.stringify(v));
};

const rmLS = (k) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(k);
};

// Safely pull token from common response shapes
const extractToken = (payload) => {
  // Supports: payload.token, payload.data.token, payload.accessToken
  return (
    payload?.token ||
    payload?.data?.token ||
    payload?.accessToken ||
    payload?.data?.accessToken ||
    ''
  );
};

// Safely pull user
const extractUser = (payload) => {
  return payload?.user || payload?.data?.user || null;
};

// Normalize error to string
const asErrorString = (errLike) => {
  if (!errLike) return 'Something went wrong';
  if (typeof errLike === 'string') return errLike;
  return errLike.message || errLike.error || 'Something went wrong';
};

/** ---------------- Thunks ---------------- **/
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      if (response?.success) return response;
      return rejectWithValue(asErrorString(response?.message || 'Registration failed'));
    } catch (err) {
      return rejectWithValue(asErrorString(err?.response?.data?.message || err?.message));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await loginUser(loginData);
      if (response?.success) return response;
      return rejectWithValue(asErrorString(response?.message || 'Login failed'));
    } catch (err) {
      return rejectWithValue(asErrorString(err?.response?.data?.message || err?.message));
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserProfile();
      if (response?.success) return response;
      return rejectWithValue(asErrorString(response?.message || 'Fetch profile failed'));
    } catch (err) {
      return rejectWithValue(asErrorString(err?.response?.data?.message || err?.message));
    }
  }
);

export const verifyUserOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ tokenId, otp }, { rejectWithValue }) => {
    try {
      const response = await verifyOtp(tokenId, otp);
      if (response?.success) return response;
      return rejectWithValue(asErrorString(response?.message || 'OTP verification failed'));
    } catch (err) {
      return rejectWithValue(asErrorString(err?.response?.data?.message || err?.message));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = (typeof window !== 'undefined' && localStorage.getItem('token')) || null;
      const response = await logoutUserApi(token);
      // Clear storage regardless of API outcome
      if (typeof window !== 'undefined') {
        rmLS('user');
        rmLS('token');
        rmLS('ACCESS_TOKEN');
      }
      return response || { success: true };
    } catch (err) {
      // Still clear storage on error
      if (typeof window !== 'undefined') {
        rmLS('user');
        rmLS('token');
        rmLS('ACCESS_TOKEN');
      }
      return rejectWithValue(asErrorString(err?.response?.data?.message || err?.message));
    }
  }
);

/** ---------------- Initial State ---------------- **/
const initialUser = getLS('user', null);
const initialToken = getLS('ACCESS_TOKEN', '') || getLS('token', '');

const initialState = {
  user: initialUser,
  token: initialToken || '',
  loading: false,
  error: null,
};

/** ---------------- Slice ---------------- **/
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Optional manual setters
    setAuth(state, action) {
      const user = action.payload?.user ?? null;
      const token = action.payload?.token ?? '';
      state.user = user;
      state.token = token;
      if (user) setLS('user', user); else rmLS('user');
      if (token) {
        setLS('ACCESS_TOKEN', token);
        setLS('token', token);
      } else {
        rmLS('ACCESS_TOKEN');
        rmLS('token');
      }
    },
    clearAuth(state) {
      state.user = null;
      state.token = '';
      rmLS('user');
      rmLS('ACCESS_TOKEN');
      rmLS('token');
    },
  },
  extraReducers: (builder) => {
    builder
      /** REGISTER */
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        const user = extractUser(action.payload);
        const token = extractToken(action.payload);
        state.user = user;
        if (token) {
          state.token = token;
          setLS('ACCESS_TOKEN', token);
          setLS('token', token);
        }
        if (user) setLS('user', user);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = asErrorString(action.payload);
      })

      /** LOGIN */
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const user = extractUser(action.payload);
        const token = extractToken(action.payload);
        if (!token) {
          state.error = asErrorString(action.payload?.message || 'Login failed (no token)');
          return;
        }
        state.user = user;
        state.token = token;
        if (user) setLS('user', user);
        setLS('ACCESS_TOKEN', token);
        setLS('token', token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = asErrorString(action.payload);
      })

      /** FETCH PROFILE */
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        const user = extractUser(action.payload);
        if (user) {
          state.user = user;
          setLS('user', user);
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = asErrorString(action.payload);
      })

      /** VERIFY OTP (often returns token; save if present) */
      .addCase(verifyUserOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserOtp.fulfilled, (state, action) => {
        state.loading = false;
        const user = extractUser(action.payload);
        const token = extractToken(action.payload);
        if (user) {
          state.user = user;
          setLS('user', user);
        }
        if (token) {
          state.token = token;
          setLS('ACCESS_TOKEN', token);
          setLS('token', token);
        }
      })
      .addCase(verifyUserOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = asErrorString(action.payload);
      })

      /** LOGOUT */
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = '';
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // even if API failed, we already cleared storage in thunk
        state.user = null;
        state.token = '';
        state.error = asErrorString(action.payload);
      });
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
