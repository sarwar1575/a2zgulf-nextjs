"use client";

import { useEffect } from "react";
import DashboardNavbar from "@/components/shared/DashboardNavbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }) {
  useEffect(() => {
    document.body.classList.add("bg-[#EAF7FD]");
    return () => document.body.classList.remove("bg-[#EAF7FD]");
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-white border-b">
        <DashboardNavbar />
      </header>

      <div className="max-w-[1400px] mx-auto px-3 lg:px-4 py-3 lg:py-4">
        <div className="flex gap-4">
          <AdminSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
