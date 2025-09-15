import { apiBase, joinApi, forwardHeaders, bubble } from "../../../_utils";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// DETAILS
export async function GET(req, { params }) {
  const { productId } = params || {};
  const upstream = await fetch(joinApi(apiBase(), `/vendor/products/${productId}`), {
    method: "GET",
    headers: forwardHeaders(req),
    cache: "no-store",
    redirect: "follow",
  });
  return bubble(upstream, "A2Z DETAILS");
}

// UPDATE (PUT preferred per Postman)
export async function PUT(req, { params }) {
  const { productId } = params || {};
  const ctype = req.headers.get("content-type") || "";
  const target = joinApi(apiBase(), `/vendor/products/${productId}`);

  if (ctype.includes("multipart/form-data")) {
    const fd = await req.formData();
    const upstream = await fetch(target, {
      method: "PUT",
      headers: forwardHeaders(req, { dropContentType: true }),
      body: fd,
      cache: "no-store",
      redirect: "follow",
    });
    return bubble(upstream, "A2Z UPDATE MULTIPART");
  }

  const json = await req.json().catch(() => ({}));
  const upstream = await fetch(target, {
    method: "PUT",
    headers: forwardHeaders(req, { setJson: true }),
    body: JSON.stringify(json || {}),
    cache: "no-store",
    redirect: "follow",
  });
  return bubble(upstream, "A2Z UPDATE JSON");
}

// Allow POST-as-update (if any callers still POST)
export async function POST(req, ctx) {
  return PUT(req, ctx);
}

// DELETE
export async function DELETE(req, { params }) {
  const { productId } = params || {};
  const upstream = await fetch(joinApi(apiBase(), `/vendor/products/${productId}`), {
    method: "DELETE",
    headers: forwardHeaders(req),
    cache: "no-store",
    redirect: "follow",
  });
  return bubble(upstream, "A2Z DELETE");
}
