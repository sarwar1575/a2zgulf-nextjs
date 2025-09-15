"use client";

import { useState } from "react";
import Overview from "./overview/Overview";
import Sidebar from "./Sidebar";
import Product from "./product/Product";
import Billing from "./billing/Billing";
import Leads from "./leeds/Leads";
import Chat from "./chat/Chat";
import Logs from "./logs/Logs";

export default function DashboardPage() {
  const [activePage, _setActivePage] = useState("overview");

  // central state for Products page
  const [productView, setProductView] = useState("list");        // "list" | "add" | "view" | "edit" | "delete"
  const [productSelected, setProductSelected] = useState(null);

  // use this everywhere instead of setActivePage
  const setActivePage = (next) => {
    _setActivePage(next);
    if (next === "products") {
      // ✅ sidebar click → always reset to list
      setProductView("list");
      setProductSelected(null);
    }
  };

  // Overview से deep-link helper
  const goToProduct = (view = "list", row = null) => {
    setProductView(view);
    setProductSelected(row);
    _setActivePage("products");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/4 px-4">
          <Sidebar setActivePage={setActivePage} activePage={activePage} />
        </div>

        <div className="w-full md:w-3/4 px-4">
          {activePage === "overview" && <Overview onGoToProduct={goToProduct} />}

          {activePage === "products" && (
            <Product
              initialView={productView}
              initialSelected={productSelected}
              onBackToList={() => setProductView("list")}
            />
          )}

          {activePage === "billing" && <Billing />}
          {activePage === "leed" && <Leads />}
          {activePage === "chat" && <Chat />}
          {activePage === "syncLogs" && <Logs />}
        </div>
      </div>
    </div>
  );
}
