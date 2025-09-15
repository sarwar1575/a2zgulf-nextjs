export const dynamic = "force-dynamic";

function joinApi(base, path) {
  if (!base) return path;
  let b = base.replace(/\/+$/, "");
  let p = path.startsWith("/") ? path : `/${path}`;
  if (b.endsWith("/api") && p.startsWith("/api")) p = p.replace(/^\/api/, "");
  return b + p;
}

// Read token from Authorization header or cookies (token/accessToken/authToken)
function readAuth(req) {
  const h = req.headers;
  const auth = h.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) return auth;

  const xAccess = h.get("x-access-token");
  if (xAccess) return `Bearer ${xAccess}`;

  const cookie = h.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)(token|accessToken|authToken)=([^;]+)/i);
  if (m) return `Bearer ${decodeURIComponent(m[2])}`;

  return "";
}

export async function GET(req) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.a2zgulf.com/api";
  const { searchParams } = new URL(req.url);
  const target = new URL(joinApi(API_BASE, "/vendor/products"));
  searchParams.forEach((v, k) => target.searchParams.set(k, v));
  if (!target.searchParams.has("_t")) target.searchParams.set("_t", Date.now().toString());

  const auth = readAuth(req);
  const csrf = req.headers.get("x-csrf-token") || "";

  const upstream = await fetch(target.toString(), {
    method: "GET",
    headers: {
      Authorization: auth,
      "X-CSRF-TOKEN": csrf,
      Accept: "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    cache: "no-store",
    redirect: "follow",
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.a2zgulf.com/api";
  const auth = readAuth(req);
  const csrf = req.headers.get("x-csrf-token") || "";
  const payload = await req.json().catch(() => ({}));

  const upstream = await fetch(joinApi(API_BASE, "/vendor/products"), {
    method: "POST",
    headers: {
      Authorization: auth,
      "X-CSRF-TOKEN": csrf,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
    redirect: "follow",
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
      "Cache-Control": "no-store",
    },
  });
}
