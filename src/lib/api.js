import axios from "axios";

/**
 * API base (e.g. https://api.a2zgulf.com/api)
 * NOTE: Ensure your NEXT_PUBLIC_API_BASE_URL already includes `/api` if your backend routes start with /api
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

/* ----------------------------------------------------------------
   Auth token wiring (backend JWT, NOT Supabase token)
   - Option 1: setAuthTokenGetter(() => store.getState().auth.token)
   - Option 2: setAuthToken(token) — sets a fixed token
------------------------------------------------------------------*/
let _tokenGetter = null;
export function setAuthTokenGetter(fn) {
  _tokenGetter = typeof fn === "function" ? fn : null;
}
export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

/* ----------------------------------------------------------------
   Axios instance
------------------------------------------------------------------*/
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allow cookies if backend sets them (CSRF/session)
});

api.interceptors.request.use((config) => {
  // Inject Authorization if available
  const token = _tokenGetter ? _tokenGetter() : null;
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Default Accept
  if (!config.headers?.Accept) {
    config.headers = config.headers || {};
    config.headers.Accept = "application/json";
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Normalize error messages
    const r = err?.response;
    const msg =
      r?.data?.message ||
      r?.data?.error ||
      r?.data?.msg ||
      err?.message ||
      `HTTP ${r?.status || ""}`.trim();
    const e = new Error(msg);
    e.status = r?.status;
    return Promise.reject(e);
  }
);

/* ----------------------------------------------------------------
   Helpers
------------------------------------------------------------------*/
function buildUrl(path) {
  if (!path) throw new Error("Path is required");
  const isAbsolute = /^https?:\/\//i.test(path);
  if (isAbsolute) return path;
  // API_URL already includes /api (as per your env), so do not prepend /api here
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Generic JSON fetch using window.fetch (kept for places you used it) */
export async function jfetch(
  path,
  { method = "GET", body, token, headers = {} } = {}
) {
  const url = buildUrl(path);
  const allHeaders = {
    Accept: "application/json",
    ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  // If token not passed explicitly, try tokenGetter so jfetch also stays auth-safe
  if (!token && _tokenGetter && !_hasAuth(allHeaders)) {
    const t = _tokenGetter();
    if (t) allHeaders.Authorization = `Bearer ${t}`;
  }

  const res = await fetch(url, {
    method,
    headers: allHeaders,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
    credentials: "include",
    cache: "no-store",
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error || data.msg)) ||
      text ||
      `Request failed: ${res.status}`;
    const e = new Error(msg);
    e.status = res.status;
    throw e;
  }
  return data;
}

function _hasAuth(hdrs) {
  const k = Object.keys(hdrs || {}).find((x) => x.toLowerCase() === "authorization");
  return !!k;
}

/* ----------------------------------------------------------------
   AUTH APIs (unchanged behavior, now auto-sends Authorization where needed)
------------------------------------------------------------------*/

export const registerUser = async (userData) => {
  // public
  const res = await api.post(`/auth/register`, userData);
  return res.data;
};

export const verifyOtp = async (tokenId, otp) => {
  // public
  const res = await api.post(`/auth/verify/${tokenId}`, { otp });
  return res.data;
};

export const loginUser = async (loginData) => {
  // public -> returns backend JWT in { token } (adjust if your shape differs)
  const res = await api.post(`/auth/login`, loginData);
  return res.data;
};

export const fetchUserProfile = async () => {
  // protected -> relies on interceptor to attach Authorization
  const res = await api.get(`/user/profile`);
  return res.data;
};

export const logoutUserApi = async (token) => {
  // protected -> takes explicit token OR interceptor fallback
  const res = await api.post(
    `/auth/logout`,
    {},
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return res.data;
};

/* ----------------------------------------------------------------
   ERP OAuth helpers
------------------------------------------------------------------*/

/**
 * Kick off ERP OAuth by full page redirect:
 *   GET {API_URL}/auth/oAuth/:PROVIDER?accessToken=...&redirect_uri=...
 * NOTE: API_URL already has /api; do not append it again here.
 */
export function startOAuth({ provider, accessToken, redirectUri }) {
  if (!provider) throw new Error("provider required");
  if (!accessToken) throw new Error("accessToken required");
  if (!redirectUri) throw new Error("redirectUri required");

  const url =
    `${API_URL}/auth/oAuth/${encodeURIComponent(provider.toUpperCase())}` +
    `?accessToken=${encodeURIComponent(accessToken)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  window.location.assign(url);
}

/** Optional: check ERP connection status (protected) */
export function getErpStatus(token) {
  return jfetch(`/auth/erp/status`, { method: "GET", token });
}

/* ----------------------------------------------------------------
   Vendor Products (protected, role-guarded on backend via HasRole)
------------------------------------------------------------------*/

export const listVendorProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "name",
  sortDir = "asc",
} = {}) => {
  const res = await api.get(`/vendor/products`, {
    params: { page, limit, search, sortBy, sortDir },
  });
  return res.data;
};

export const getVendorProduct = async (id) => {
  const res = await api.get(`/vendor/products/${id}`);
  return res.data;
};

export const createVendorProduct = async (formData /* FormData */) => {
  // DO NOT set content-type manually; browser will set multipart boundary
  const res = await api.post(`/vendor/products`, formData);
  return res.data;
};

export const updateVendorProduct = async (id, formData /* FormData */) => {
  const res = await api.put(`/vendor/products/${id}`, formData);
  return res.data;
};

export const deleteVendorProduct = async (id) => {
  const res = await api.delete(`/vendor/products/${id}`);
  return res.data;
};

/* ----------------------------------------------------------------
   Auth utility endpoints (optional but useful on UI)
------------------------------------------------------------------*/

export const getMe = async () => {
  // protected: returns user + roles (whatever your backend sends from res.locals.user)
  const res = await api.get(`/auth/me`);
  return res.data;
};

/**
 * Client-side helper: check if current user has any of the required roles.
 * This does NOT replace backend HasRole; it’s only for UI gating.
 */
export async function requireSeller(required = ["Seller", "Vendor"]) {
  try {
    const me = await getMe();
    // Normalize roles array from either me.roles or me.UserRoles[].Role.name
    const roleNames = Array.isArray(me?.roles)
      ? me.roles.map((r) => r?.name).filter(Boolean)
      : Array.isArray(me?.UserRoles)
      ? me.UserRoles.map((ur) => ur?.Role?.name).filter(Boolean)
      : [];
    return roleNames.some((r) => required.includes(r));
  } catch {
    return false;
  }
}
