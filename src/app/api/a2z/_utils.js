export const dynamic = "force-dynamic";

export function joinApi(base, path) {
  if (!base) return path;
  let b = base.replace(/\/+$/, "");
  let p = path.startsWith("/") ? path : `/${path}`;
  if (b.endsWith("/api") && p.startsWith("/api")) p = p.replace(/^\/api/, "");
  return b + p;
}

export function apiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.a2zgulf.com/api";
}

export function readAuth(req) {
  const h = req.headers;
  const explicit = h.get("authorization");
  if (explicit && explicit.toLowerCase().startsWith("bearer ")) return explicit;

  const xAccess = h.get("x-access-token");
  if (xAccess) return `Bearer ${xAccess}`;

  const cookie = h.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)(token|accessToken|authToken|ACCESS_TOKEN)=([^;]+)/i);
  if (m) return `Bearer ${decodeURIComponent(m[2])}`;

  return "";
}

/**
 * Clone incoming headers:
 * - keep content-type (for JSON) unless dropContentType=true
 * - add Authorization, X-CSRF-TOKEN, Accept
 * - setJson=true forces application/json
 */
export function forwardHeaders(req, { dropContentType = false, setJson = false, add = {} } = {}) {
  const out = new Headers();

  if (!dropContentType) {
    const ct = req.headers.get("content-type");
    if (ct) out.set("Content-Type", ct);
  }

  const auth = readAuth(req);
  if (auth) out.set("Authorization", auth);

  const csrf = req.headers.get("x-csrf-token") || "";
  if (csrf) out.set("X-CSRF-TOKEN", csrf);

  out.set("Accept", "application/json");
  if (setJson) out.set("Content-Type", "application/json");

  Object.entries(add).forEach(([k, v]) => {
    if (v !== undefined && v !== null) out.set(k, String(v));
  });

  return out;
}

/** Pass upstream response body & basic headers through */
export async function passThrough(upstream) {
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
      "Cache-Control": "no-store",
    },
  });
}

/** Bubble upstream if OK, else log + return its body/status for debugging */
export async function bubble(upstream, tag = "UPSTREAM") {
  if (upstream.ok) return passThrough(upstream);
  const txt = await upstream.text();
  console.error(`[${tag}] ERROR`, upstream.status, txt);
  return new Response(txt, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") || "text/plain" },
  });
}
