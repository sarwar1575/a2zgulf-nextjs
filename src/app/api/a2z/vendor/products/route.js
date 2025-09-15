import { apiBase, joinApi, forwardHeaders, bubble } from "../../_utils";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// LIST
export async function GET(req) {
  const base = apiBase();
  const incoming = new URL(req.url);
  const target = new URL(joinApi(base, "/vendor/products"));
  incoming.searchParams.forEach((v, k) => target.searchParams.set(k, v));
  if (!target.searchParams.has("_t")) target.searchParams.set("_t", Date.now().toString());

  const upstream = await fetch(target.toString(), {
    method: "GET",
    headers: forwardHeaders(req),
    cache: "no-store",
    redirect: "follow",
  });
  return bubble(upstream, "A2Z LIST");
}

// CREATE
export async function POST(req) {
  const ctype = req.headers.get("content-type") || "";
  const target = joinApi(apiBase(), "/vendor/products");

  // If multipart incoming → rebuild FormData (avoids duplex issues)
  if (ctype.includes("multipart/form-data")) {
    const fd = await req.formData();
    const upstream = await fetch(target, {
      method: "POST",
      headers: forwardHeaders(req, { dropContentType: true }),
      body: fd,                 // undici sets proper boundary
      cache: "no-store",
      redirect: "follow",
    });
    return bubble(upstream, "A2Z CREATE MULTIPART");
  }

  // JSON fallback
  const json = await req.json().catch(() => ({}));
  const upstream = await fetch(target, {
    method: "POST",
    headers: forwardHeaders(req, { setJson: true }),
    body: JSON.stringify(json || {}),
    cache: "no-store",
    redirect: "follow",
  });
  return bubble(upstream, "A2Z CREATE JSON");
}
