import { apiBase, joinApi, forwardHeaders, bubble } from "../../../../../../_utils";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  const { productId, variantId, imageId } = params || {};
  const upstream = await fetch(
    joinApi(apiBase(), `/vendor/products/${productId}/variants/${variantId}/images/${imageId}`),
    { method: "DELETE", headers: forwardHeaders(req), cache: "no-store", redirect: "follow" }
  );
  return bubble(upstream, "A2Z VARIANT IMAGE DELETE");
}
