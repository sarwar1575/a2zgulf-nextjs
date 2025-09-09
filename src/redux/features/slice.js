// // src/store/slice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { registerUser, loginUser, fetchUserProfile } from '../../lib/api';

// export const register = createAsyncThunk('auth/register', async (userData) => {
//   const response = await registerUser(userData);
//   return response; 
// });


// export const login = createAsyncThunk('auth/login', async (loginData) => {
//   const response = await loginUser(loginData);
//   return response;  
// });


// export const fetchProfile = createAsyncThunk('user/fetchProfile', async () => {
//   const response = await fetchUserProfile();
//   return response;  
// });

// // Initial state
// const initialState = {
//   user: null,
//   loading: false,
//   error: null,
//   profile: null,
// };

// // Slice
// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(register.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload; 
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });

//     // Handle login
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;  
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });

//     // Handle fetching user profile
//     builder
//       .addCase(fetchProfile.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.profile = action.payload;
//       })
//       .addCase(fetchProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default authSlice.reducer;



// src/store/slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, fetchUserProfile, verifyOtp } from '../../lib/api';

// Register thunk
export const register = createAsyncThunk('auth/register', async (userData) => {
  const response = await registerUser(userData);
  return response;
});

// Login thunk
export const login = createAsyncThunk('auth/login', async (loginData) => {
  const response = await loginUser(loginData);
  return response;
});

// Fetch profile thunk
export const fetchProfile = createAsyncThunk('user/fetchProfile', async () => {
  const response = await fetchUserProfile();
  return response;
});

// ✅ OTP Verify thunk
export const verifyUserOtp = createAsyncThunk('auth/verifyOtp', async ({ tokenId, otp }) => {
  const response = await verifyOtp(tokenId, otp);
  return response;
});

const initialState = {
  user: null,
  loading: false,
  error: null,
  profile: null,
  otpVerified: false, // ✅ नया state
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ Verify OTP
      .addCase(verifyUserOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpVerified = false;
      })
      .addCase(verifyUserOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true; // ✅ OTP success
        state.user = action.payload; // server से user data भी आ सकता है
      })
      .addCase(verifyUserOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.otpVerified = false;
      });
  },
});

export default authSlice.reducer;

