"use client";

import { useState } from "react";
import Overview from "./overview/Overview";
import Sidebar from "./Sidebar";
import Product from "./product/Product";
import Billing from "./billing/Billing";
import Leads from "./leeds/Leads";
import Chat from "./chat/Chat";
import Logs from "./logs/Logs";

function DashboardPage() {
  const [activePage, setActivePage] = useState("overview");

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap -mx-4">
        {/* Sidebar (col-3) */}
        <div className="w-full md:w-1/4 px-4">
          {/* ✅ Pass setActivePage */}
          <Sidebar setActivePage={setActivePage} activePage={activePage}/>
        </div>

        {/* Main Content (col-9) */}
        <div className="w-full md:w-3/4 px-4">
          {activePage === "overview" && <Overview />}
          {activePage === "products" && <Product />}
          {activePage === "billing" && <Billing />}
          {activePage === "leed" && <Leads />}
          {activePage === "chat" && <Chat />}
          {activePage === "syncLogs" && <Logs />}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
