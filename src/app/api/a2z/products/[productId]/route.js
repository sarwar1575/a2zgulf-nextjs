export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function joinApi(base, path) {
  if (!base) return path;
  let b = base.replace(/\/+$/, "");
  let p = path.startsWith("/") ? path : `/${path}`;
  if (b.endsWith("/api") && p.startsWith("/api")) p = p.replace(/^\/api/, "");
  return b + p;
}
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.a2zgulf.com/api";

export async function GET(req, { params }) {
  const upstream = await fetch(joinApi(API_BASE, `/products/${params.productId}`), {
    method: "GET",
    headers: { Accept: "application/json" },
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
