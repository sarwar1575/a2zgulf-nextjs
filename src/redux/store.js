// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
