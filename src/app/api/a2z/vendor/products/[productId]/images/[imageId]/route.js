import { apiBase, joinApi, forwardHeaders, passThrough } from "../../../../_utils";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  const { productId, imageId } = params || {};
  const upstream = await fetch(joinApi(apiBase(), `/vendor/products/${productId}/images/${imageId}`), {
    method: "DELETE",
    headers: forwardHeaders(req),
    cache: "no-store",
    redirect: "follow",
  });
  return passThrough(upstream);
}
