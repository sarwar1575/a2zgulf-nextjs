"use client";

import data from "@/data/admin-dashboard.json";
import { useMemo } from "react";

// tiny SVG sparkline
const Sparkline = ({ values = [], height = 50 }) => {
  const path = useMemo(() => {
    if (!values.length) return "";
    const w = 300;
    const h = height;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const norm = (v) => (h - ((v - min) / (max - min || 1)) * h);
    return values.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (values.length - 1)) * w},${norm(v)}`).join(" ");
  }, [values, height]);

  return (
    <svg viewBox="0 0 300 50" className="w-full h-12">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {data.realtimeOverview.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border bg-white p-3 shadow-sm"
          >
            <div className="text-xl font-bold">{kpi.value.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts section (simple sparkline + placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <div className="text-sm font-semibold mb-2">Products / Stock Trend</div>
          <div className="text-gray-600">
            <Sparkline values={data.sparkline} />
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <div className="text-sm font-semibold mb-2">Suppliers Trend</div>
          <div className="text-xs text-gray-500">
            Placeholder chart — plug your preferred chart lib later.
          </div>
          <div className="mt-4">
            <Sparkline values={[5, 9, 7, 10, 12, 9, 15, 13, 17, 20, 14, 11]} />
          </div>
        </div>
      </div>

      {/* Suppliers table */}
      <div className="rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between p-3">
          <div className="text-sm font-semibold">Suppliers</div>
          <div className="flex gap-2">
            <button className="text-xs border rounded-lg px-3 py-1">Add Product</button>
            <button className="text-xs border rounded-lg px-3 py-1">Filters</button>
            <button className="text-xs border rounded-lg px-3 py-1">Download all</button>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">Company Name</th>
                <th className="px-3 py-2 text-left">Company Registration No</th>
                <th className="px-3 py-2 text-left">VAT No</th>
                <th className="px-3 py-2 text-left">Phone No</th>
                <th className="px-3 py-2 text-left">Email Id</th>
                <th className="px-3 py-2 text-left">National Address</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.suppliers.map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">{s.company}</td>
                  <td className="px-3 py-2">{s.regNo}</td>
                  <td className="px-3 py-2">{s.vatNo}</td>
                  <td className="px-3 py-2">{s.phone}</td>
                  <td className="px-3 py-2">{s.email}</td>
                  <td className="px-3 py-2">{s.nationalAddress}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        s.status === "Verified"
                          ? "bg-green-100 text-green-700"
                          : s.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button className="border rounded-md px-2 py-1 text-xs">Cancel</button>
                      <button className="border rounded-md px-2 py-1 text-xs">Verify</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-3 text-xs text-gray-500">
          <button className="border rounded-md px-2 py-1">Previous</button>
          <span>Page 1 of 10</span>
          <button className="border rounded-md px-2 py-1">Next</button>
        </div>
      </div>
    </div>
  );
}
