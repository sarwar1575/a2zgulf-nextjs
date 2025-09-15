// small client util for auth + csrf + requests

export function getCookie(name) {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : "";
  } catch { return ""; }
}

export function getToken() {
  try {
    return (
      localStorage.getItem("ACCESS_TOKEN") || // your key
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      ""
    );
  } catch { return ""; }
}

export function getCsrf() {
  try {
    return localStorage.getItem("X_CSRF_TOKEN") || getCookie("X_CSRF_TOKEN") || "";
  } catch { return ""; }
}

export async function ensureCsrf() {
  // If we already have it, reuse
  const existing = getCsrf();
  if (existing) return existing;

  const token = getToken();
  const res = await fetch("/api/a2z/keep-alive", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });

  const txt = await res.text();
  // Be tolerant to different shapes
  try {
    const json = JSON.parse(txt || "{}");
    const t =
      json?.data?.token ||
      json?.data?.csrfToken ||
      json?.csrfToken ||
      json?.csrf ||
      json?.token ||
      "";
    if (t) localStorage.setItem("X_CSRF_TOKEN", t);
    return t;
  } catch {
    return "";
  }
}

/** Generic request: supports GET/JSON & FormData pass-through */
export async function apiRequest(path, { method = "GET", params, body, tokenOverride } = {}) {
  method = (method || "GET").toUpperCase();

  // Auto-fetch CSRF for mutating calls if missing
  if (method !== "GET" && method !== "HEAD" && !getCsrf()) {
    await ensureCsrf();
  }

  // Build URL (relative or absolute both ok)
  const base = path?.startsWith("http") ? path : new URL(path, window.location.origin).toString();
  const url = new URL(base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  url.searchParams.set("_t", Date.now().toString());

  // Headers
  const token = tokenOverride || getToken();
  const csrf = getCsrf();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
    Accept: "application/json",
  };

  // Body
  let bodyOut = body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    bodyOut = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: bodyOut,
    credentials: "include",
    cache: "no-store",
    redirect: "follow",
  });

  const text = await res.text();
  let data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

  if (!res.ok) {
    // Add a tiny snippet from body for easier debugging
    const snippet = typeof data === "string" ? data.slice(0, 200) : (data?.message || data?.error || "");
    const msg = snippet ? `${res.status} ${res.statusText} — ${snippet}` : `HTTP ${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
