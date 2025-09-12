export const dynamic = "force-dynamic";

function joinApi(base, path) {
  if (!base) return path;
  let b = base.replace(/\/+$/, "");
  let p = path.startsWith("/") ? path : `/${path}`;
  if (b.endsWith("/api") && p.startsWith("/api")) p = p.replace(/^\/api/, "");
  return b + p;
}

export async function GET(req, ctx) {
  try {
    // 🔧 params must be awaited in dynamic route handlers
    const { provider: rawProvider } = await ctx.params;
    const provider = String(rawProvider || "ZOHO").toUpperCase();

    const backend = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backend) {
      return new Response(JSON.stringify({ error: "NEXT_PUBLIC_API_BASE_URL not set" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // read email/password from query (GET body is not used by browsers)
    const url = new URL(req.url);
    const email = url.searchParams.get("email") || "";
    const password = url.searchParams.get("password") || "";

    // forward headers
    const h = new Headers(req.headers);
    const auth = h.get("authorization");
    const csrf = h.get("x-csrf-token");

    // build backend URL
    const endpoint = new URL(joinApi(backend, `/api/auth/oAuth/${provider}`));
    if (email) endpoint.searchParams.set("email", email);
    if (password) endpoint.searchParams.set("password", password);

    const upstream = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        ...(auth ? { Authorization: auth } : {}),
        ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
      },
      redirect: "manual",
    });

    // 3xx → Location has Zoho URL
    if (upstream.status >= 300 && upstream.status < 400) {
      const loc = upstream.headers.get("location");
      if (loc) {
        return new Response(JSON.stringify({ startUrl: loc }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // otherwise try to parse body as JSON or raw URL
    const text = await upstream.text();
    try {
      const data = JSON.parse(text);
      if (data?.oAuthUrl || data?.url) {
        return new Response(JSON.stringify({ startUrl: data.oAuthUrl || data.url }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch {
      if (text?.startsWith("http")) {
        return new Response(JSON.stringify({ startUrl: text }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(text || "Kickoff failed", {
      status: upstream.status || 500,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || "Proxy error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
