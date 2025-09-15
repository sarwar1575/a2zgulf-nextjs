// src/app/api/erp-auth/[provider]/start/route.js
export const dynamic = "force-dynamic";

/**
 * Safely join base + path
 * - trims trailing slashes on base
 * - if base already ends with /api and path starts with /api, it drops the extra /api
 */
function joinApi(base, path) {
  if (!base) return path;
  const b = String(base).replace(/\/+$/, ""); // trim trailing slashes
  let p = path.startsWith("/") ? path : `/${path}`;
  // avoid double /api/api
  if (b.endsWith("/api") && p.startsWith("/api")) p = p.replace(/^\/api/, "");
  return b + p;
}

export async function GET(req, { params }) {
  try {
    const provider = String(params?.provider || "ZOHO").toUpperCase();

    // MUST be like: https://api.a2zgulf.com/api  (with /api at end)
    const backend = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backend) {
      return new Response(JSON.stringify({ error: "NEXT_PUBLIC_API_BASE_URL not set" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build backend endpoint: if base already ends with /api, we append /auth/oAuth/...
    const endpointUrl = new URL(joinApi(backend, `/auth/oAuth/${provider}`));

    // Forward ALL query params (email, password, and any future ones)
    const incoming = new URL(req.url);
    incoming.searchParams.forEach((v, k) => endpointUrl.searchParams.set(k, v));

    // Forward a couple of important headers if present
    const h = new Headers(req.headers);
    const auth = h.get("authorization");
    const csrf = h.get("x-csrf-token");

    const upstream = await fetch(endpointUrl.toString(), {
      method: "GET",
      headers: {
        ...(auth ? { Authorization: auth } : {}),
        ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
      },
      redirect: "manual", // we want to read 3xx and return startUrl cleanly
    });

    // If backend responds with a redirect (Zoho auth), capture Location
    if (upstream.status >= 300 && upstream.status < 400) {
      const loc = upstream.headers.get("location");
      if (loc) {
        return new Response(JSON.stringify({ startUrl: loc }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Try to parse body smartly
    const contentType = upstream.headers.get("content-type") || "";
    const text = await upstream.text();

    // If JSON, look for { oAuthUrl } or { url }
    if (contentType.includes("application/json")) {
      try {
        const data = JSON.parse(text || "{}");
        if (data?.oAuthUrl || data?.url) {
          return new Response(JSON.stringify({ startUrl: data.oAuthUrl || data.url }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch {
        // fall through to text checks
      }
    }

    // If raw URL in body
    if (text && /^https?:\/\//i.test(text.trim())) {
      return new Response(JSON.stringify({ startUrl: text.trim() }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Otherwise bubble upstream body & status (useful for errors)
    return new Response(text || "Kickoff failed", {
      status: upstream.status || 500,
      headers: { "Content-Type": contentType || "text/plain" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || "Proxy error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
