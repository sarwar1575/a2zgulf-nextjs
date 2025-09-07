// app/components/DashboardNavbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

const navItems = ["Products", "Products", "Products", "Products"];

export default function DashboardNavbar() {
  return (
    <header className="w-full bg-[#ECFAFF]">
      <div className="container mx-auto">
      <div className="mx-auto px-4 py-4">
        <nav
          className="
            flex items-center justify-between
            rounded-[999px] bg-white/95 shadow-sm ring-1 ring-black/5
            px-4 sm:px-6 md:px-8 h-20
          "
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Link href="">
                <Image
                  src="/assets/img/weblogo.png"
                  width={170}
                  height={170}
                  alt=""
                />
              </Link>
            </Link>
          </div>

          {/* Center: Menu */}
          <ul className="hidden md:flex items-center gap-10">
            {navItems.map((item, i) => (
              <li key={i}>
                <Link
                  href="#"
                  className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-6">
            <div className="bellIcon">
              <Link href="">
                <Image
                  src="/assets/icon/bellIcon.png"
                  width={15}
                  height={16}
                  className="w-[15px] h-[16px]"
                />
              </Link>
            </div>
            <button
              type="button"
              className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-black/10"
            >
              <Link href="">
                <Image
                  src="/assets/icon/profile.png"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </Link>
            </button>
          </div>
        </nav>
      </div>
      </div>
    </header>
  );
}
