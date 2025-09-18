"use client";

import AdminSidebar from "../AdminSidebar";
import DashboardNavbar from "@/components/shared/DashboardNavbar"; // <- your existing navbar
import { useEffect, useState } from "react";

export default function AdminShell({
  children,
  title = "Super Admin Dashboard",
}) {
  // small helper to add body background like screenshot
  useEffect(() => {
    document.body.classList.add("bg-[#F3FAFE]");
    return () => document.body.classList.remove("bg-[#F3FAFE]");
  }, []);

  return (
    <div className="min-h-screen">
      {/* Top nav (your existing component) */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <DashboardNavbar />
      </div>

      {/* Main with sidebar */}
      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-4 lg:p-6">
          <div className="mb-4">
            <h1 className="text-sm font-semibold">Super Admin Dashboard</h1>
            <p className="text-xs text-gray-500">
              Manage ERP sync, products and monitor sync health.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
