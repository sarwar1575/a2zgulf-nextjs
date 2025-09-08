// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice';

const store = configureStore({
  reducer: {
    auth: authReducer,  // Add the auth slice reducer to the store
  },
});

export default store;
