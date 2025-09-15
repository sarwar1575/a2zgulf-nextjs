import { apiBase, joinApi, forwardHeaders, bubble } from "../../../../../_utils";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// UPDATE VARIANT (multipart per Postman)
export async function PUT(req, { params }) {
  const { productId, variantId } = params || {};
  const ctype = req.headers.get("content-type") || "";
  const target = joinApi(apiBase(), `/vendor/products/${productId}/variants/${variantId}`);

  if (ctype.includes("multipart/form-data")) {
    const fd = await req.formData();
    const upstream = await fetch(target, {
      method: "PUT",
      headers: forwardHeaders(req, { dropContentType: true }),
      body: fd,
      cache: "no-store",
      redirect: "follow",
    });
    return bubble(upstream, "A2Z VARIANT UPDATE");
  }

  const json = await req.json().catch(() => ({}));
  const upstream = await fetch(target, {
    method: "PUT",
    headers: forwardHeaders(req, { setJson: true }),
    body: JSON.stringify(json || {}),
    cache: "no-store",
    redirect: "follow",
  });
  return bubble(upstream, "A2Z VARIANT UPDATE JSON");
}
