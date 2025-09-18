"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/suppliers", label: "Suppliers", icon: "🏢" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`h-screen sticky top-0 border-r bg-white/80 backdrop-blur-md ${
        open ? "w-64" : "w-16"
      } transition-all duration-200`}
    >
      <div className="flex items-center justify-between p-3">
        <div className="font-semibold text-sm tracking-wide">A2Z Gulf</div>
        <button
          onClick={() => setOpen((s) => !s)}
          className="rounded-lg border px-2 py-1 text-xs"
          title="Toggle"
        >
          {open ? "«" : "»"}
        </button>
      </div>

      <nav className="px-2 py-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 mb-1 text-sm
                ${active ? "bg-[#E6F7FF] text-[#0E7490]" : "hover:bg-gray-100"}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className={`${open ? "block" : "hidden"}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
