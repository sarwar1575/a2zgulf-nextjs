import { apiBase, joinApi, forwardHeaders, passThrough } from "../_utils";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const upstream = await fetch(joinApi(apiBase(), "/keep-alive"), {
    method: "GET",
    headers: forwardHeaders(req),
    cache: "no-store",
    redirect: "follow",
  });
  return passThrough(upstream);
}
