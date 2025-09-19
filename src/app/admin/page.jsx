"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import SUPPLIERS_DATA from "../../data/suppliers";

/* ===== Colors to match screenshot ===== */
const C = {
  grid: "#EEF2F7",
  prodBlue: "#6C8CF5",
  stockCyan: "#7ADCF5",
  outPink: "#F99CA4",
  supCyan: "#76D4E6",    // All Suppliers
  supPink: "#FFA6B2",    // Verified Suppliers
  supViolet: "#8A96FF",  // Not Verified Suppliers
  green: "#16A34A",
  red: "#EF4444",
  orange: "#F59E0B",
  tiles: [
    "#E6F0FF","#D8F6FF","#EEDCFF","#E9EDFF",
    "#EAF6FF","#FFECEE","#FFF4EA","#F5F3FF",
    "#E3F2FD","#EFE4FF","#E6F7FF","#E6F0FF",
  ],
};

/* ===== KPI data (order same as image) ===== */
const KPIS = [
  { value: 17017, label: "Total Suppliers" },
  { value: 17017, label: "Verified Suppliers" },
  { value: 17017, label: "Not Verified" },
  { value: 17017, label: "Total Products" },
  { value: 17017, label: "In Stock" },
  { value: 17017, label: "Out of Stock" },
  { value: 120, label: "Total Articles" },
  { value: 10, label: "Total Users" },
  { value: 17017450, label: "Total Revenue" },
  { value: 17017, label: "Total ERP" },
  { value: 17017, label: "Total Roles" },
  { value: 17017, label: "Total Orders" },
];

/* ===== Chart datasets (shaped to match curves) ===== */
const PRODUCTS = [
  { m:"January",   products:40, instock:60, out:15 },
  { m:"February",  products:62, instock:30, out:45 },
  { m:"March",     products:35, instock:75, out:38 },
  { m:"April",     products:52, instock:12, out:50 },
  { m:"May",       products:18, instock:42, out:58 },
  { m:"June",      products:21, instock:80, out:22 },
  { m:"July",      products:72, instock:79, out:68 },
  { m:"August",    products:12, instock:55, out:14 },
  { m:"September", products:20, instock:81, out:12 },
  { m:"October",   products:38, instock:90, out:78 },
  { m:"November",  products:99, instock:42, out:100 },
  { m:"December",  products:14, instock:26, out:25 },
];

const SUPPLIERS = [
  { m:"January",   all:175, ver:100, not:78 },
  { m:"February",  all:130, ver:60,  not:36 },
  { m:"March",     all:225, ver:158, not:58 },
  { m:"April",     all:202, ver:120, not:42 },
  { m:"May",       all:210, ver:175, not:92 },
  { m:"June",      all:168, ver:105, not:60 },
  { m:"July",      all:120, ver:95,  not:46 },
  { m:"August",    all:178, ver:80,  not:30 },
  { m:"September", all:130, ver:112, not:50 },
  { m:"October",   all:210, ver:115, not:78 },
  { m:"November",  all:220, ver:148, not:74 },
  { m:"December",  all:125, ver:62,  not:18 },
];

/* ===== Tiny KPI tile ===== */
function Tile({ value, label, bg }) {
  return (
    <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: bg }}>
      <div className="text-[18px] font-bold leading-none mb-1">
        {value.toLocaleString()}
      </div>
      <div className="text-[12px] text-slate-600">{label}</div>
    </div>
  );
}

/* ===== Badge for status ===== */
function StatusBadge({ status }) {
  const map = {
    Verified: { bg: "#ECFDF5", fg: C.green },
    "Not Verified": { bg: "#FEF2F2", fg: C.red },
    Pending: { bg: "#FFFBEB", fg: C.orange },
  };
  const s = map[status] || map.Pending;
  return (
    <span
      className="px-2.5 py-1 rounded-full text-[12px] font-medium"
      style={{ background: s.bg, color: s.fg }}
    >
      {status}
    </span>
  );
}

/* ===== Action Icon (minimal inline SVGs to match look) ===== */
const Icon = {
  eye: (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M12 5c5 0 9 5 9 7s-4 7-9 7-9-5-9-7 4-7 9-7Zm0 3a4 4 0 1 0 .001 8.001A4 4 0 0 0 12 8Z"/></svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="m3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm14.71-9.04a1 1 0 0 0 0-1.41l-1.5-1.5a1 1 0 0 0-1.41 0l-1.13 1.13 3.75 3.75 1.29-1.47Z"/></svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M6 7h12l-1 13H7L6 7Zm2-3h8l1 2H7l1-2Z"/></svg>
  ),
};

/* ===== Button (link-look) ===== */
function Btn({ children, className }) {
  return (
    <button
      className={`px-3 py-1.5 rounded-md text-[12px] font-medium border border-slate-200 hover:bg-slate-50 ${className||""}`}
      type="button"
    >
      {children}
    </button>
  );
}

/* ===== Suppliers Toolbar ===== */
function SuppliersToolbar() {
  return (
    <div className="flex items-center gap-3">
      <button className="bg-[#3B82F6] hover:bg-[#336fe0] text-white text-[12px] font-medium px-4 py-2 rounded-md">
        Add Product
      </button>
      <Btn>
        {/* filter icon */}
        <span className="inline-flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M3 5h18v2l-7 6v5l-4 2v-7L3 7V5Z"/></svg>
          Filters
        </span>
      </Btn>
      <Btn>Download all</Btn>
    </div>
  );
}

/* ===== Main content: same two sections + Suppliers table below ===== */
export default function DashboardContent() {
  return (
    <div className="space-y-5">
      {/* 1) Heading block */}
      <section className="bg-white rounded-xl shadow-sm px-5 py-4">
        <h1 className="text-[15px] font-semibold">Super Admin Dashboard</h1>
        <p className="text-[12px] text-slate-500">
          Manage ERP synced products and monitor sync health.
        </p>
      </section>

      {/* 2) Realtime Overview block: KPIs + two charts (exactly under KPIs) */}
      <section className="bg-white rounded-xl shadow-sm px-5 py-5">
        <div className="text-[13px] font-semibold mb-3">Realtime Overview</div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {KPIS.map((k, i) => (
            <Tile key={k.label} value={k.value} label={k.label} bg={C.tiles[i % C.tiles.length]} />
          ))}
        </div>

        {/* Chart 1 */}
        <div className="h-[360px] w-full mb-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PRODUCTS} margin={{ top: 10, right: 18, left: 8, bottom: 10 }}>
              <defs>
                <linearGradient id="gProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.prodBlue} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={C.prodBlue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.stockCyan} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={C.stockCyan} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.outPink} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={C.outPink} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="products" name="Total Products"
                    stroke={C.prodBlue} fill="url(#gProd)" strokeWidth={2}
                    dot={{ r: 3 }} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="instock" name="In Stock"
                    stroke={C.outPink} fill="url(#gOut)" strokeWidth={2}
                    dot={{ r: 3 }} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="out" name="Out of Stock"
                    stroke={C.stockCyan} fill="url(#gStock)" strokeWidth={2}
                    dot={{ r: 3 }} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2 */}
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SUPPLIERS} margin={{ top: 10, right: 18, left: 8, bottom: 10 }}>
              <defs>
                <linearGradient id="gSupAll" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.supCyan} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.supCyan} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gSupVer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.supPink} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.supPink} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gSupNot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.supViolet} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.supViolet} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 300]} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="all" name="All Suppliers"
                    stroke={C.supCyan} fill="url(#gSupAll)" strokeWidth={2}
                    dot={{ r: 3 }} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="ver" name="Verified Suppliers"
                    stroke={C.supPink} fill="url(#gSupVer)" strokeWidth={2}
                    dot={{ r: 3 }} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="not" name="Not Verified Suppliers"
                    stroke={C.supViolet} fill="url(#gSupNot)" strokeWidth={2}
                    dot={{ r: 3 }} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3) Suppliers section (exact look/feel of screenshot) */}
      <section className="bg-white rounded-xl shadow-sm px-5 py-5">
        {/* top bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold">Suppliers</h2>
          <SuppliersToolbar />
        </div>

        {/* table */}
        <div className="border border-slate-200 rounded-lg overflow-x-auto">
          <table className="min-w-full text-[13px]">
            <thead className="bg-[#F8FAFC] text-slate-600">
              <tr className="text-left">
                {[
                  "Company Name",
                  "Company Registration No",
                  "VAT No",
                  "Phone No",
                  "Email Id",
                  "National Address",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SUPPLIERS_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{row.company}</td>
                  <td className="px-4 py-3">{row.registrationNo}</td>
                  <td className="px-4 py-3">{row.vatNo}</td>
                  <td className="px-4 py-3">{row.phone}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.nationalAddress}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Cancel */}
                      <Btn>Cancel</Btn>

                      {/* Eye, Edit, Trash */}
                      <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600">{Icon.eye}</button>
                      <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600">{Icon.pen}</button>
                      <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600">{Icon.trash}</button>

                      {/* Verify (only show when not verified) */}
                      {row.status !== "Verified" ? (
                        <button className="bg-[#1D4ED8] hover:bg-[#1a43b8] text-white text-[12px] font-medium px-3 py-1.5 rounded-md">
                          Verify
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between mt-4">
          <button className="px-4 py-2 rounded-md border border-slate-200 text-[12px]">Previous</button>
          <span className="text-[12px] text-slate-500">Page 1 of 10</span>
          <button className="px-4 py-2 rounded-md border border-slate-200 text-[12px]">Next</button>
        </div>
      </section>
    </div>
  );
}
