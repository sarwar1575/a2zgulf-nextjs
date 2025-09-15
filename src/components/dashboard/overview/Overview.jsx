"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

/* ---------- helpers ---------- */
const API_BASE = "/api/a2z"; // local proxy

function joinApi(base, path) {
  if (!base) return path;
  let b = base.replace(/\/+$/, "");
  let p = path.startsWith("/") ? path : `/${path}`;
  if (b.endsWith("/api") && p.startsWith("/api")) p = p.replace(/^\/api/, "");
  return b + p;
}

function getLocalToken() {
  try {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      ""
    );
  } catch {
    return "";
  }
}

// tokenOverride = redux token, if present
async function apiRequest(path, { method = "GET", params, body, tokenOverride } = {}) {
  const t = tokenOverride || getLocalToken();
  const url = new URL(joinApi(API_BASE, path), window.location.origin);
  const qp = { ...(params || {}), _t: Date.now() };
  Object.entries(qp).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: t ? `Bearer ${t}` : "",
      "X-CSRF-TOKEN": "", // per spec
    },
    cache: "no-store",
    redirect: "follow",
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/* ---------- component (layout preserved) ---------- */
export default function Overview({ onGoToProduct }) {
  const reduxToken = useSelector((s) => s?.auth?.token);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await apiRequest("/vendor/products", {
        params: { page, limit, sortBy: "name", sortDir: "asc" },
        tokenOverride: reduxToken,
      });
      const items = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setRows(items);
      const pages =
        Number(data?.totalPages) ||
        Number(data?.meta?.total?.pages) ||
        (items.length && items.length === limit ? page + 1 : 1) ||
        1;
      setTotalPages(pages || 1);
    } catch (e) {
      setErr(e.message || "Failed to load products.");
      setRows([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, reduxToken]);

  const stats = useMemo(() => {
    const total = rows.length;
    const get = (v) => rows.filter((r) => (r.status || r.syncStatus) === v).length;
    const synced = get("Synced");
    const pending = get("Pending");
    const notSync = get("Not Sync") || get("Error") || get("Failed");
    return { total, synced, notSync, pending };
  }, [rows]);

  const displayStock = (r) =>
    r.stock ?? r.quantity ?? r.availableStock ?? r.stockAvailable ?? "-";
  const displayStatusCls = (v) =>
    v === "Synced" ? "text-[#10A760]" : v === "Pending" ? "text-[#F59E0B]" : "text-[#FF4D4F]";

  return (
    <>
      <div className="pb-[50px]">
        {/* Top header */}
        <div className="flex items-center justify-between rounded-sm bg-white px-6 py-4 shadow mb-6">
          <div className="">
            <h1 className="text-[20px] font-semibold text-[#383E49]">Seller Dashboard</h1>
            <p className="text-[#383E49] text-[14px] font-normal">
              Manage ERP synced products and monitor sync health.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="border border-[#FFD1DB] px-4 py-2 rounded text-[#5D6679] text-[14px] font-medium"
              onClick={() => window.dispatchEvent(new CustomEvent("export-products-csv"))}
            >
              Export CSV
            </button>
            <button
              onClick={() => onGoToProduct?.("add")}
              className="bg-[#1366D9] px-4 py-2 rounded text-[#FFFFFF] text-[14px] font-medium"
            >
              Add Manual Product
            </button>
          </div>
        </div>

        {/* Realtime Overview */}
        <div className="bg-[#FFFFFF] p-4 rounded-xl mb-6">
          <h6 className="text-[16px] font-medium mb-4 text-[#383E49]">Realtime Overview</h6>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <div className="bg-[#dbeafe] rounded-lg py-3 px-6 shadow-sm">
              <p className="text-[24px] text-[#222222] font-bold">{stats.total}</p>
              <span className="text-[#666666] text-[14px] font-medium">Total Products</span>
            </div>
            <div className="bg-[#e0e7ff] rounded-lg py-3 px-6 shadow-sm">
              <p className="text-[24px] text-[#222222] font-bold">{stats.total}</p>
              <span className="text-[#666666] text-[14px] font-medium">In Stock</span>
            </div>
            <div className="bg-[#fee2e2] rounded-lg py-3 px-6 shadow-sm">
              <p className="text-[24px] text-[#222222] font-bold">0</p>
              <span className="text-[#666666] text-[14px] font-medium">Out of Stock</span>
            </div>
            <div className="bg-[#dbeafe] rounded-lg py-3 px-6 shadow-sm">
              <p className="text-[24px] text-[#222222] font-bold">{stats.synced}</p>
              <span className="text-[#666666] text-[14px] font-medium">Synced Items</span>
            </div>
            <div className="bg-[#bae6fd] rounded-lg py-3 px-6 shadow-sm">
              <p className="text-[24px] text-[#222222] font-bold">
                {stats.notSync + stats.pending}
              </p>
              <span className="text-[#666666] text-[14px] font-medium">Errors</span>
            </div>
          </div>

          <div className="graff">
            <Image
              src="/assets/img/graff.png"
              width={1424}
              height={373}
              className="w-full h-[373px] object-cover"
              alt=""
            />
          </div>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-8">
            <h2 className="text-lg font-semibold text-slate-900">Products</h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onGoToProduct?.("add")}
                className="inline-flex items-center gap-2 rounded-sm bg-[#1366D9] px-5 py-1 text-[14px] font-medium text-white shadow-sm"
              >
                Add Product
              </button>

              <button className="inline-flex items-center gap-2 rounded-sm border border-[#D0D3D9] bg-white px-5 py-1 text-[#5D6679] text-[14px] font-medium">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M3 5h18M6 12h12M10 19h4" />
                </svg>
                Filters
              </button>

              <button className="inline-flex items-center gap-2 rounded-sm border border-[#D0D3D9] bg-white px-5 py-1 text-[#5D6679] text-[14px] font-medium">
                Download all
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {err ? <div className="px-5 pb-3 text-red-600 text-sm">{err}</div> : null}
            <table className="min-w-full border-slate-200 text-left text-sm">
              <thead className="text-slate-600">
                <tr className="[&>th]:py-3 [&>th]:px-4 sm:[&>th]:px-5 [&>th]:font-medium [&>th]:text-[12px] [&>th]:text-[#667085] [&>th]:uppercase">
                  <th>SKU</th>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#D0D3D9]">
                {(loading && (
                  <tr>
                    <td className="py-6 px-5" colSpan={6}>Loading…</td>
                  </tr>
                )) ||
                  (rows.length === 0 && (
                    <tr>
                      <td className="py-6 px-5 text-slate-500" colSpan={6}>No products found.</td>
                    </tr>
                  )) ||
                  rows.map((r, i) => {
                    const id = r.id || r.productId || r._id || r.ID || i;
                    const name = r.name || r.productName || "-";
                    const sku = r.sku || r.SKU || "-";
                    const price = r.price ?? r.unitPrice ?? 0;
                    const status = r.status || r.syncStatus || "Synced";
                    const displayStatusCls = (v) =>
                      v === "Synced" ? "text-[#10A760]" : v === "Pending" ? "text-[#F59E0B]" : "text-[#FF4D4F]";
                    return (
                      <tr key={id} className="hover:bg-slate-50/60">
                        <td className="py-4 px-4 sm:px-5 text-[14px] font-medium text-[#48505E]">{sku}</td>
                        <td className="py-4 px-4 sm:px-5 text-[14px] font-medium text-[#48505E]">{name}</td>
                        <td className="py-4 px-4 sm:px-5 text-[14px] font-medium text-[#48505E]">₹{price}</td>
                        <td className="py-4 px-4 sm:px-5 text-[14px] font-medium text-[#48505E]">{displayStock(r)}</td>
                        <td className="py-4 px-4 sm:px-5">
                          <span className={"text-[14px] font-medium " + displayStatusCls(status)}>{status}</span>
                        </td>
                        <td className="py-4 px-2 sm:pr-6">
                          <div className="flex justify-end items-center gap-4 text-slate-500">
                            <button className="hover:text-slate-700" onClick={() => onGoToProduct?.("view", { ...r, id })} title="View">
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                            <button className="hover:text-slate-700" onClick={() => onGoToProduct?.("edit", { ...r, id })} title="Edit">
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                              </svg>
                            </button>
                            <button className="hover:text-slate-700" onClick={() => onGoToProduct?.("delete", { ...r, id })} title="Delete">
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M4 7h16" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
                                <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 sm:px-5 py-4">
            <button className="rounded-sm border border-[#D0D3D9] bg-white px-5 py-1 text-[#5D6679] text-[14px]" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </button>
            <p className="text-sm text-slate-600">
              Page <span className="font-medium text-slate-900">{page}</span> of{" "}
              <span className="font-medium text-slate-900">{totalPages}</span>
            </p>
            <button className="rounded-sm border border-[#D0D3D9] bg-white px-5 py-1 text-[#5D6679] text-[14px]" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
