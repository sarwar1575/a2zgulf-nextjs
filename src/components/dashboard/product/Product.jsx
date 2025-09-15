"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest, ensureCsrf } from "../../../lib/apiClient"; // <-- relative path

const API_BASE = "/api/a2z";

function joinApi(base, path) {
  if (!base) return path;
  let b = base.replace(/\/+$/, "");
  let p = path.startsWith("/") ? path : `/${path}`;
  if (b.endsWith("/api") && p.startsWith("/api")) p = p.replace(/^\/api/, "");
  return b + p;
}

/* ---------- API wrappers ---------- */
const ProductAPI = {
  list: (params, token) => apiRequest(joinApi(API_BASE, "/vendor/products"), { params, tokenOverride: token }),
  details: (id, token) => apiRequest(joinApi(API_BASE, `/vendor/products/${id}`), { tokenOverride: token }),
  createForm: (formData, token) => apiRequest(joinApi(API_BASE, "/vendor/products"), { method: "POST", body: formData, tokenOverride: token }),
  updateForm: (id, formData, token) => apiRequest(joinApi(API_BASE, `/vendor/products/${id}`), { method: "PUT", body: formData, tokenOverride: token }),
  remove: (id, token) => apiRequest(joinApi(API_BASE, `/vendor/products/${id}`), { method: "DELETE", tokenOverride: token }),
};

/* ---------- UI helpers ---------- */
const Status = ({ value }) => {
  const cls = value === "Synced" ? "text-[#10A760]" : value === "Pending" ? "text-[#F59E0B]" : "text-[#FF4D4F]";
  return <span className={`text-[14px] font-medium ${cls}`}>{value}</span>;
};
const CloudIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 18h10a4 4 0 0 0 0-8 5 5 0 0 0-9.8-1.2A3.5 3.5 0 0 0 7 18Z" stroke="#94A3B8" strokeWidth="1.5" /></svg>);
const PlusIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>);

/** small uploader (keeps File in state) */
function ImagesUploader({ value = [], onChange, max = 5 }) {
  const inputRef = useRef(null);
  const handleFiles = (files) => {
    const list = Array.from(files || []);
    const urls = list.map((f) => ({ url: URL.createObjectURL(f), file: f }));
    const next = [...value, ...urls].slice(0, max);
    onChange?.(next);
  };
  const onDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };
  const removeAt = (i) => {
    const next = [...value];
    const removed = next.splice(i, 1)[0];
    if (removed?.url) URL.revokeObjectURL(removed.url);
    onChange?.(next);
  };
  return (
    <>
      <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="border-2 border-dashed border-[#E5E7EB] rounded-lg py-10 px-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <CloudIcon />
          <p className="text-[#475467] text-sm">Chose the files</p>
          <button type="button" onClick={() => inputRef.current?.click()} className="mt-2 inline-flex items-center justify-center rounded-md bg-[#1366D9] h-7 w-7" aria-label="add">
            <PlusIcon />
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </div>
      </div>
      {!!value.length && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {value.slice(0, max).map((it, i) => (
            <div key={i} className="relative">
              <img src={it.url} alt={`img-${i}`} className="w-full h-28 object-cover rounded-md border" />
              <button type="button" onClick={() => removeAt(i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-white border text-xs leading-5 text-slate-600" title="remove">×</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ---------- Page (layout preserved) ---------- */
export default function Product({ initialView = "list", initialSelected = null, onBackToList }) {
  const reduxToken = useSelector((s) => s?.auth?.token);

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [subView, setSubView] = useState(initialView);
  const [current, setCurrent] = useState(initialSelected);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { setSubView(initialView); setCurrent(initialSelected); }, [initialView, initialSelected]);

  const loadList = async () => {
    setLoading(true); setErr("");
    try {
      await ensureCsrf();
      const data = await ProductAPI.list({ page, limit, sortBy: "name", sortDir: "asc" }, reduxToken);
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setRows(items);
      const pages = Number(data?.totalPages) || Number(data?.meta?.total?.pages) || (items.length && items.length === limit ? page + 1 : 1) || 1;
      setTotalPages(pages || 1);
    } catch (e) {
      setErr(e.message || "Failed to load products."); setRows([]); setTotalPages(1);
    } finally { setLoading(false); }
  };

  useEffect(() => { if (subView === "list") loadList(); /* eslint-disable-next-line */ }, [subView, page, reduxToken]);

  /* ------ CREATE ------ */
  const [form, setForm] = useState({ name: "", sku: "", price: "", description: "" });
  const [formImages, setFormImages] = useState([]);
  const canCreate = useMemo(() => form.name.trim() && form.sku.trim() && String(form.price).trim(), [form]);

  const createProduct = async (e) => {
    e.preventDefault();
    if (!canCreate) return;
    setLoading(true); setErr("");
    try {
      await ensureCsrf();
      const fd = new FormData();
      // Per Postman spec:
      fd.append("category", "1");
      fd.append("name", form.name.trim());
      fd.append("description", form.description || "");
      // optional identifiers:
      // fd.append("isbn", ""); fd.append("ean", ""); fd.append("upc", "");
      // price/sku go in variant add, but some APIs accept here too:
      fd.append("sku", form.sku.trim());
      fd.append("price", String(Number(form.price) || 0));
      // customFields example:
      // fd.append("customFields[dimensions]", "280x280x80");
      // fd.append("customFields[weight]", "250g");
      (formImages || []).forEach((x) => { if (x?.file) fd.append("images[]", x.file); });

      await ProductAPI.createForm(fd, reduxToken);
      setForm({ name: "", sku: "", price: "", description: "" });
      setFormImages([]);
      setSubView("list");
      await loadList();
    } catch (e) {
      setErr(e.message || "Create failed.");
    } finally { setLoading(false); }
  };

  /* ------ DETAILS / EDIT ------ */
  const openView = async (p) => {
    const id = p?.id || p?.productId || p;
    if (!id) return;
    setLoading(true); setErr("");
    try {
      const d = await ProductAPI.details(id, reduxToken);
      setCurrent({ ...(p || {}), ...(d || {}) }); setSubView("view");
    } catch {
      setCurrent(p); setSubView("view");
    } finally { setLoading(false); }
  };

  const [editForm, setEditForm] = useState({ name: "", sku: "", price: "", description: "" });
  const [editImages, setEditImages] = useState([]);

  const openEdit = async (p) => {
    const id = p?.id || p?.productId || p;
    if (!id) return;
    setLoading(true); setErr("");
    try {
      const d = await ProductAPI.details(id, reduxToken);
      const m = { ...(p || {}), ...(d || {}) };
      setCurrent(m);
      setEditForm({
        name: m.name || "",
        sku: m.sku || "",
        price: m.price ?? "",
        description: m.description || "",
      });
      setEditImages((m.images || m.fileUrls || []).slice(0, 5).map((u) => ({ url: u, file: null })));
      setSubView("edit");
    } catch {
      setCurrent(p);
      setEditForm({ name: p?.name || "", sku: p?.sku || "", price: p?.price ?? "", description: p?.description || "" });
      setEditImages((p?.images || []).slice(0, 5).map((u) => ({ url: u, file: null })));
      setSubView("edit");
    } finally { setLoading(false); }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    if (!current) return;
    const id = current.id || current.productId;
    if (!id) return;

    setLoading(true); setErr("");
    try {
      await ensureCsrf();
      const fd = new FormData();
      // Per Postman "Update Product" (form-data + PUT)
      fd.append("category", "1");
      fd.append("name", editForm.name || "");
      fd.append("description", editForm.description || "");
      // optional:
      // fd.append("isbn", "12345678"); fd.append("ean", "12345678"); fd.append("upc", "12345678");
      fd.append("sku", editForm.sku || "");
      fd.append("price", String(Number(editForm.price) || 0));
      // previews won't re-upload existing URLs; only new uploaded Files:
      editImages.forEach((x) => { if (x?.file) fd.append("images[]", x.file); });

      await ProductAPI.updateForm(id, fd, reduxToken);
      setSubView("list"); setCurrent(null);
      await loadList();
    } catch (e) {
      setErr(e.message || "Update failed.");
    } finally { setLoading(false); }
  };

  /* ------ DELETE ------ */
  const confirmDelete = async () => {
    if (!current) return;
    const id = current.id || current.productId;
    if (!id) return;
    setLoading(true); setErr("");
    try {
      await ensureCsrf();
      await ProductAPI.remove(id, reduxToken);
      setSubView("list"); setCurrent(null);
      await loadList();
    } catch (e) {
      setErr(e.message || "Delete failed.");
    } finally { setLoading(false); }
  };

  /* ------ Header (layout preserved) ------ */
  const Header = (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-[20px] font-semibold text-[#383E49]">
          {subView === "add" && "Add New Product"}
          {subView === "view" && "Product View"}
          {subView === "edit" && "Update Product"}
          {subView === "delete" && "Delete Product"}
          {subView === "list" && "Products"}
        </h1>
        {subView === "list" && (
          <p className="text-[#667085] text-sm">Create clear/report and print ZATCA-compliant invoice</p>
        )}
      </div>

      {subView === "list" ? (
        <div className="flex gap-3">
          <button className="border border-[#E5E7EB] px-4 py-2 rounded text-[#5D6679] text-[14px]" onClick={() => window.dispatchEvent(new CustomEvent("export-products-csv"))}>
            Export CSV
          </button>
          <button onClick={() => setSubView("add")} className="bg-[#1366D9] text-white px-4 py-2 rounded text-[14px]">
            Add New Product
          </button>
        </div>
      ) : (
        <button onClick={() => { setSubView("list"); onBackToList?.(); }} className="border border-[#D0D3D9] px-4 py-2 rounded text-[14px] text-[#5D6679]">
          Back to List
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-[#EAF6FF] min-h-screen -mx-4 md:mx-0">
      <div className="p-6">
        {Header}

        <div className="bg-white rounded-md shadow overflow-hidden">
          {/* LIST */}
          {subView === "list" && (
            <>
              <div className="flex items-center justify-end gap-2 p-4">
                <button className="inline-flex items-center gap-2 rounded-sm border border-[#D0D3D9] bg-white px-4 py-1.5 text-[#5D6679] text-[14px]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h18M6 12h12M10 19h4" /></svg>
                  Filters
                </button>
                <button className="inline-flex items-center gap-2 rounded-sm border border-[#D0D3D9] bg-white px-4 py-1.5 text-[#5D6679] text-[14px]">
                  Download all
                </button>
              </div>

              {err ? <div className="px-5 text-red-600 text-sm">{err}</div> : null}

              <div className="px-4 pb-4">
                <h3 className="text-[16px] font-medium text-[#383E49] mb-2">Product List</h3>
                <table className="w-full text-left">
                  <thead className="bg-[#F8FAFC] text-[#667085] text-[12px] uppercase">
                    <tr>
                      <th className="p-3 font-medium">SKU</th>
                      <th className="p-3 font-medium">Products</th>
                      <th className="p-3 font-medium">Price</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(loading && (<tr><td className="p-3" colSpan={5}>Loading…</td></tr>)) ||
                    (rows.length === 0 && (<tr><td className="p-3 text-slate-500" colSpan={5}>No products found.</td></tr>)) ||
                      rows.map((p) => {
                        const id = p.id || p.productId || p._id || p.ID;
                        const name = p.name || p.productName || "-";
                        const sku = p.sku || p.SKU || "-";
                        const price = p.price ?? p.unitPrice ?? 0;
                        const status = p.status || p.syncStatus || "Synced";
                        return (
                          <tr key={id} className="border-t">
                            <td className="p-3 text-[#48505E] text-[14px]">{sku}</td>
                            <td className="p-3 text-[#48505E] text-[14px]">{name}</td>
                            <td className="p-3 text-[#48505E] text-[14px]">₹{price}</td>
                            <td className="p-3"><Status value={status} /></td>
                            <td className="p-3">
                              <div className="flex items-center gap-4 text-slate-600 justify-end">
                                <button title="View" onClick={() => openView(p)}>
                                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />
                                  </svg>
                                </button>
                                <button title="Edit" onClick={() => openEdit(p)}>
                                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                                    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                                  </svg>
                                </button>
                                <button title="Delete" onClick={() => { setCurrent(p); setSubView("delete"); }}>
                                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                                    <path d="M4 7h16" /><path d="M10 11v6M14 11v6" />
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

                <div className="flex items-center justify-between mt-4">
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
            </>
          )}

          {/* ADD */}
          {subView === "add" && (
            <form onSubmit={createProduct} className="p-6 space-y-5">
              {err && <div className="mb-2 text-red-600 text-sm">{err}</div>}
              <h2 className="text-[18px] font-semibold text-[#383E49] mb-2">Add New Product</h2>

              <div>
                <label className="block text-sm font-medium text-[#344054] mb-1">Product Title</label>
                <input className="w-full border border-[#E5E7EB] rounded-md h-11 px-3" placeholder="Enter"
                  value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#344054] mb-1">SKU</label>
                  <input className="w-full border border-[#E5E7EB] rounded-md h-11 px-3" placeholder="Enter"
                    value={form.sku} onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#344054] mb-1">Price</label>
                  <input type="number" className="w-full border border-[#E5E7EB] rounded-md h-11 px-3" placeholder="Enter"
                    value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#344054] mb-1">Description</label>
                <textarea className="w-full border border-[#E5E7EB] rounded-md px-3 py-2" rows={3}
                  value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#344054] mb-2">Images</label>
                <ImagesUploader value={formImages} onChange={setFormImages} />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setForm({ name: "", sku: "", price: "", description: "" }); setFormImages([]); setSubView("list"); }}
                  className="border border-[#D0D3D9] px-4 h-10 rounded text-[14px] text-[#5D6679]">
                  Cancel
                </button>
                <button type="submit" disabled={!canCreate || loading} className="bg-[#1366D9] text-white px-4 h-10 rounded text-[14px] disabled:opacity-50">
                  {loading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          )}

          {/* VIEW */}
          {subView === "view" && current && (
            <div className="p-6">
              {err && <div className="mb-2 text-red-600 text-sm">{err}</div>}
              <h3 className="text-[16px] font-semibold text-[#383E49] mb-3">Product View</h3>
              <div className="border-2 border-[#BAE6FD] rounded-lg p-3">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-4">
                    <img src={current.images?.[0] || current.fileUrls?.[0] || "/images/sample.jpg"} className="w-full h-40 object-cover rounded-md" alt="main" />
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      <div className="text-sm text-gray-500">Product Title</div>
                      <div className="font-medium">{current.name}</div>
                      <div className="text-sm text-gray-500">SKU</div>
                      <div className="font-medium">{current.sku}</div>
                      <div className="text-sm text-gray-500">Price</div>
                      <div className="font-medium">₹{current.price}</div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="grid grid-cols-5 gap-3">
                      {(current.images?.length ? current.images : current.fileUrls?.length ? current.fileUrls : ["/images/sample.jpg","/images/sample.jpg","/images/sample.jpg","/images/sample.jpg","/images/sample.jpg"])
                        .slice(0, 5).map((src, i) => (<img key={i} src={src} className="w-full h-24 object-cover rounded-md" alt={`thumb-${i}`} />))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setSubView("list")} className="border border-[#D0D3D9] px-4 h-10 rounded text-[14px] text-[#5D6679]">
                  Back
                </button>
              </div>
            </div>
          )}

          {/* EDIT */}
          {subView === "edit" && current && (
            <form onSubmit={updateProduct} className="p-6 space-y-5">
              {err && <div className="mb-2 text-red-600 text-sm">{err}</div>}
              <h2 className="text-[18px] font-semibold text-[#383E49] mb-2">Update Product</h2>

              <div>
                <label className="block text-sm font-medium text-[#344054] mb-1">Product Title</label>
                <input className="w-full border border-[#E5E7EB] rounded-md h-11 px-3" value={editForm.name}
                  onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#344054] mb-1">SKU</label>
                  <input className="w-full border border-[#E5E7EB] rounded-md h-11 px-3" value={editForm.sku}
                    onChange={(e) => setEditForm((s) => ({ ...s, sku: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#344054] mb-1">Price</label>
                  <input type="number" className="w-full border border-[#E5E7EB] rounded-md h-11 px-3" value={editForm.price}
                    onChange={(e) => setEditForm((s) => ({ ...s, price: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#344054] mb-2">Description</label>
                <textarea className="w-full border border-[#E5E7EB] rounded-md px-3 py-2" rows={3}
                  value={editForm.description} onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))} />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#344054] mb-2">Images</label>
                <ImagesUploader value={editImages} onChange={setEditImages} />
                <p className="text-xs text-slate-500 mt-1">(Only newly uploaded files will be sent; existing URLs are left as-is.)</p>
              </div>

              <div className="flex justify-between pt-1">
                <button type="button" onClick={() => setSubView("list")} className="border border-[#D0D3D9] px-4 h-10 rounded text-[14px] text-[#5D6679]">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="bg-[#1366D9] text-white px-4 h-10 rounded text-[14px]">
                  {loading ? "Saving…" : "Update Product"}
                </button>
              </div>
            </form>
          )}

          {/* DELETE */}
          {subView === "delete" && current && (
            <div className="p-8">
              {err && <div className="mb-2 text-red-600 text-sm">{err}</div>}
              <div className="max-w-sm mx-auto text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M6 7h12M10 11v6M14 11v6" stroke="#EF4444" strokeWidth="1.8" />
                    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#EF4444" strokeWidth="1.8" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-1">Delete item</h3>
                <p className="text-gray-500 mb-6">Do you want to delete <span className="font-medium">{current.name}</span>?</p>
                <div className="flex justify-center gap-3">
                  <button className="px-4 h-10 rounded border border-[#D0D3D9] text-[#5D6679]" onClick={() => setSubView("list")}>Cancel</button>
                  <button className="px-4 h-10 rounded bg-[#1366D9] text-white" onClick={confirmDelete} disabled={loading}>
                    {loading ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
