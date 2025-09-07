"use client";

import Image from "next/image";
import Link from "next/link";

export default function Sidebar({ setActivePage, activePage }) {
  return (
    <div className="sidebar rounded-2xl p-0">
      <div className="rounded-[22px] border border-black/5 bg-[#FFF5F7] p-3 shadow-md">
        <nav className="space-y-1">
          {/* Overview */}
          <Link
            href=""
            onClick={() => setActivePage("overview")}
            className={`flex items-center gap-4 py-4 ps-3 w-full text-left rounded-lg transition ${
              activePage === "overview"
                ? "text-[#1570EF] text-[17px] font-bold"
                : "text-[#5D6679] text-[16px] font-medium"
            }`}
          >
            <div className="icon__sidbar">
              <Image
                src="/assets/icon/dashboard.png"
                width={18}
                height={19}
                className="object-cover w-[19px] h-[19px]"
                alt="dashboard"
              />
            </div>
            <p className="mt-1">
              Overview
            </p>
          </Link>

          {/* Products */}
          <Link
            href=""
            onClick={() => setActivePage("products")}
            className={`flex items-center gap-4 py-4 ps-3 w-full text-left rounded-lg transition ${
              activePage === "products"
                ? "text-[#1570EF] text-[17px] font-bold"
                : "text-[#5D6679] text-[16px] font-medium"
            }`}
          >
            <div className="icon__sidbar">
              <Image
                src="/assets/icon/product.png"
                width={18}
                height={19}
                className="object-cover w-[20px] h-[18px]"
                alt="dashboard"
              />
            </div>
            <p className="">Products</p>
          </Link>
            <Link
            href=""
            onClick={() => setActivePage("billing")}
            className={`flex items-center gap-4 py-4 ps-3 w-full text-left rounded-lg transition ${
              activePage === "billing"
                ? "text-[#1570EF] text-[17px] font-bold"
                : "text-[#5D6679] text-[16px] font-medium"
            }`}
          >
            <div className="icon__sidbar">
              <Image
                src="/assets/icon/billing.png"
                width={18}
                height={19}
                className="object-cover w-[20px] h-[20px]"
                alt="dashboard"
              />
            </div>
            <p className="">Billing</p>
          </Link>
            <Link
            href=""
            onClick={() => setActivePage("leed")}
            className={`flex items-center gap-4 py-4 ps-3 w-full text-left rounded-lg transition ${
              activePage === "leed"
                ? "text-[#1570EF] text-[17px] font-bold"
                : "text-[#5D6679] text-[16px] font-medium"
            }`}
          >
            <div className="icon__sidbar">
              <Image
                src="/assets/icon/leeds.png"
                width={18}
                height={19}
                className="object-cover w-[20px] h-[20px]"
                alt="dashboard"
              />
            </div>
            <p className="">Leads</p>
          </Link>
            <Link
            href=""
            onClick={() => setActivePage("chat")}
            className={`flex items-center gap-4 py-4 ps-3 w-full text-left rounded-lg transition ${
              activePage === "chat"
                ? "text-[#1570EF] text-[17px] font-bold"
                : "text-[#5D6679] text-[16px] font-medium"
            }`}
          >
            <div className="icon__sidbar">
              <Image
                src="/assets/icon/chat.png"
                width={18}
                height={19}
                className="object-cover w-[16px] h-[20px]"
                alt="dashboard"
              />
            </div>
            <p className="">Chat</p>
          </Link>
            <Link
            href=""
            onClick={() => setActivePage("products")}
            className={`flex items-center gap-4 py-4 ps-3 w-full text-left rounded-lg transition ${
              activePage === "products"
                ? "text-[#1570EF] text-[17px] font-bold"
                : "text-[#5D6679] text-[16px] font-medium"
            }`}
          >
            <div className="icon__sidbar">
              <Image
                src="/assets/icon/logs.png"
                width={20}
                height={18}
                className="object-cover w-[20px] h-[18px]"
                alt="dashboard"
              />
            </div>
            <p className="">Subscription</p>
          </Link>
            <Link
            href=""
            onClick={() => setActivePage("syncLogs")}
            className={`flex items-center gap-4 py-4 ps-3 w-full text-left rounded-lg transition ${
              activePage === "syncLogs"
                ? "text-[#1570EF] text-[17px] font-bold"
                : "text-[#5D6679] text-[16px] font-medium"
            }`}
          >
            <div className="icon__sidbar">
              <Image
                src="/assets/icon/logs.png"
                width={20}
                height={18}
                className="object-cover w-[20px] h-[18px]"
                alt="dashboard"
              />
            </div>
            <p className="">Sync Logs</p>
          </Link>
           <Link
            href=""
            onClick={() => setActivePage("syncLogs")}
            className={`flex items-center gap-4 py-4 ps-3 w-full text-left rounded-lg transition ${
              activePage === "syncLogs"
                ? "text-[#1570EF] text-[17px] font-bold"
                : "text-[#5D6679] text-[16px] font-medium"
            }`}
          >
            <div className="icon__sidbar">
              <Image
                src="/assets/icon/setting.png"
                width={18}
                height={18}
                className="object-cover w-[18px] h-[18px]"
                alt="dashboard"
              />
            </div>
            <p className="">Settings</p>
          </Link>
        </nav>

        <div className="mt-6">
          <button
            type="button"
            className="w-full rounded-full bg-[#1FB6FF] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Sync Now
          </button>
        </div>

        <div className="mt-4 text-sm">
          <span className="text-slate-500">Last Sync</span>{" "}
          <span className="font-semibold text-slate-900">12 min ago</span>
        </div>
      </div>
    </div>
  );
}
