const API_BASE = (process.env.NEXT_PUBLIC_VENDOR_BASE || "/api/a2z").replace(/\/+$/, "");

const buildQS = (q) => {
  const p = new URLSearchParams();
  Object.entries(q || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length) p.set(k, String(v));
  });
  return p.toString() ? `?${p.toString()}` : "";
};

// remove fields that often trigger 403 (server infers from token)
const sanitizeCreate = (payload = {}) => {
  const {
    vendorId, // ❌ most servers infer this
    ...rest
  } = payload;

  return rest;
};

const sanitizeUpdate = (payload = {}) => {
  const { vendorId, ...rest } = payload;
  return rest;
};

async function request(token, path, { method = "GET", body, query } = {}) {
  const url = `${API_BASE}${path}${buildQS(query)}`;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "X-Requested-With": "XMLHttpRequest", // harmless, can help
  };
  // ...
if (token) {
  const authHeader = /^Bearer\s/i.test(token) ? token : `Bearer ${token}`;
  headers.Authorization = authHeader.trim();
}
// ...


  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
    cache: "no-store",
    redirect: "follow",
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text || null; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return { data, headers: res.headers, status: res.status };
}

/* -------- API surface (NO '/api' in paths) -------- */
export function listVendorProducts(
  token,
  { page = 1, limit = 10, search = "", sortBy = "name", sortDir = "asc" } = {}
) {
  return request(token, "/vendor/products", {
    method: "GET",
    query: { page, limit, search, sortBy, sortDir },
  });
}

export function getVendorProduct(token, productId) {
  return request(token, `/vendor/products/${encodeURIComponent(productId)}`, { method: "GET" });
}

export const createVendorProduct = (t, body, vendorId) =>
  request(t, "/vendor/products", {
    method: "POST",
    body: vendorId ? { ...body, vendorId } : body,
  });

export function updateVendorProduct(token, productId, payload) {
  return request(token, `/vendor/products/${encodeURIComponent(productId)}`, {
    method: "POST", // per your backend
    body: sanitizeUpdate(payload),
  });
}

export function deleteVendorProduct(token, productId) {
  return request(token, `/vendor/products/${encodeURIComponent(productId)}`, { method: "DELETE" });
}
