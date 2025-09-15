import { apiBase, joinApi, forwardHeaders, bubble } from "../../../../_utils";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ADD VARIANT (multipart per Postman)
export async function POST(req, { params }) {
  const { productId } = params || {};
  const ctype = req.headers.get("content-type") || "";
  const target = joinApi(apiBase(), `/vendor/products/${productId}/variants`);

  if (ctype.includes("multipart/form-data")) {
    const fd = await req.formData();
    const upstream = await fetch(target, {
      method: "POST",
      headers: forwardHeaders(req, { dropContentType: true }),
      body: fd,
      cache: "no-store",
      redirect: "follow",
    });
    return bubble(upstream, "A2Z VARIANT CREATE");
  }

  // If you ever call this as JSON:
  const json = await req.json().catch(() => ({}));
  const upstream = await fetch(target, {
    method: "POST",
    headers: forwardHeaders(req, { setJson: true }),
    body: JSON.stringify(json || {}),
    cache: "no-store",
    redirect: "follow",
  });
  return bubble(upstream, "A2Z VARIANT CREATE JSON");
}
