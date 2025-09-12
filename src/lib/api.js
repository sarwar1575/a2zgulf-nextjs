import axios from 'axios';

// API Base URL (from .env.local)
export const API_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/,"");

// --------------- Existing APIs (unchanged) ---------------
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
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

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

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





// Build full URL from a relative path or accept absolute
function buildUrl(path) {
  if (!path) throw new Error("Path is required");
  const isAbsolute = /^https?:\/\//i.test(path);
  if (isAbsolute) return path;
  // API_URL already includes /api (per your env), so we DO NOT add /api again here.
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Generic JSON fetch with token/cookies
export async function jfetch(path, { method = "GET", body, token, headers = {} } = {}) {
  const url = buildUrl(path);

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    credentials: "include", // if your API sets cookies (CORS must allow)
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

/**
 * Kick off ERP OAuth. We redirect the browser to your API:
 *   GET https://api.a2zgulf.com/api/auth/oAuth/:PROVIDER?accessToken=...&redirect_uri=...
 * 
 * NOTE: API_URL already has "/api", so path here is "/auth/oAuth/:provider" (NO extra /api).
 */
export function startOAuth({ provider, accessToken, redirectUri }) {
  if (!provider) throw new Error("provider required");
  if (!accessToken) throw new Error("accessToken required");
  if (!redirectUri) throw new Error("redirectUri required");

  const url =
    `${API_URL}/auth/oAuth/${encodeURIComponent(provider.toUpperCase())}` +
    `?accessToken=${encodeURIComponent(accessToken)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  // Full page redirect
  window.location.assign(url);
}

// Optional: check connection status after redirect (if you expose such an API)
export function getErpStatus(token) {
  // Your server route (no extra /api because API_URL already includes it)
  return jfetch("/auth/erp/status", { method: "GET", token });
}


// --- Vendor Products: list ---
export const listVendorProducts = async ({ page = 1, limit = 10, search = "", sortBy = "name", sortDir = "asc" } = {}) => {
  const res = await api.get(`/vendor/products`, {
    params: { page, limit, search, sortBy, sortDir },
  });
  return res.data; // raw API response (we'll normalize in slice)
};