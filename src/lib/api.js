// src/lib/api.js
import axios from 'axios';

// API Base URL (from .env.local)
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""; 

// Function to register user (POST /auth/register)
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;  // Return the response data
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;  // Throw error to handle in the slice
  }
};

export const verifyOtp = async (tokenId, otp) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify/${tokenId}`, { otp });
    return response.data;
  } catch (error) {
    console.error("OTP verification failed:", error);
    throw error;
  }
};

// Example function for login (POST /auth/login)
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Example function for fetching user profile (GET /user/profile)
export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/profile`);
    return response.data;
  } catch (error) {
    console.error('Fetching profile failed:', error);
    throw error;
  }
};


export const logoutUserApi = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};