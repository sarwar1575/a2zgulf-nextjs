import Image from "next/image";

function Overview() {
  const rows = [
  { sku: "P-0198", name: "Maggi",       price: 430, stock: "43 Packets", status: "Synced" },
  { sku: "P-0198", name: "Bru",         price: 257, stock: "22 Packets", status: "Not Sync" },
  { sku: "P-0198", name: "Red Bull",    price: 405, stock: "36 Packets", status: "Synced" },
  { sku: "P-0198", name: "Bourn Vita",  price: 502, stock: "14 Packets", status: "Not Sync" },
  { sku: "P-0198", name: "Horlicks",    price: 530, stock: "5 Packets",  status: "Synced" },
  { sku: "P-0198", name: "Harpic",      price: 605, stock: "10 Packets", status: "Synced" },
  { sku: "P-0198", name: "Ariel",       price: 408, stock: "23 Packets", status: "Not Sync" },
  { sku: "P-0198", name: "Scotch Brite",price: 359, stock: "43 Packets", status: "Synced" },
  { sku: "P-0198", name: "Coca cola",   price: 205, stock: "41 Packets", status: "Pending" },
];
  return (
    <>
    <div className="pb-[50px]">
      <div className="flex items-center justify-between rounded-sm bg-white px-6 py-4 shadow mb-6">
        <div className="">
          <h1 className="text-[20px] font-semibold text-[#383E49]">
            Seller Dashboard
          </h1>
          <p className="text-[#383E49] text-[14px] font-normal">
            Manage ERP synced products and monitor sync health.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="border border-[#FFD1DB] px-4 py-2 rounded text-[#5D6679] text-[14px] font-medium">
            Export CSV
          </button>
          <button className="bg-[#1366D9] px-4 py-2 rounded text-[#FFFFFF] text-[14px] font-medium">
            Add Manual Product
          </button>
        </div>
      </div>
      <div className="bg-[#FFFFFF] p-4 rounded-xl mb-6">
        <h6 className="text-[16px] font-medium mb-4 text-[#383E49]">Realtime Overview</h6>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {/* Card 1 */}
          <div className="bg-[#dbeafe] rounded-lg py-3 px-6 shadow-sm">
            <p className="text-[24px] text-[#222222] font-bold">17017</p>
            <span className="text-[#666666] text-[14px] font-medium">Total Products</span>
          </div>

          {/* Card 2 */}
          <div className="bg-[#e0e7ff] rounded-lg py-3 px-6 shadow-sm">
            <p className="text-[24px] text-[#222222] font-bold">17017</p>
            <span className="text-[#666666] text-[14px] font-medium">In Stock</span>
          </div>

          {/* Card 3 */}
          <div className="bg-[#fee2e2] rounded-lg py-3 px-6 shadow-sm">
            <p className="text-[24px] text-[#222222] font-bold">17017</p>
            <span className="text-[#666666] text-[14px] font-medium">Out of Stock</span>
          </div>

          {/* Card 4 */}
          <div className="bg-[#dbeafe] rounded-lg py-3 px-6 shadow-sm">
            <p className="text-[24px] text-[#222222] font-bold">17017</p>
            <span className="text-[#666666] text-[14px] font-medium">Synced Items</span>
          </div>

          {/* Card 5 */}
          <div className="bg-[#bae6fd] rounded-lg py-3 px-6 shadow-sm">
            <p className="text-[24px] text-[#222222] font-bold">17017</p>
            <span className="text-[#666666] text-[14px] font-medium">Errors</span>
          </div>
        </div>
        <div className="graff">
          <Image
            src="/assets/img/graff.png"
            width={1424}
            height={14}
            className="w-[full] h-[373px]"
            alt=""
          />
        </div>
      </div>
        <div className="bg-white rounded-sm">
      {/* Header + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-8">
        <h2 className="text-lg font-semibold text-slate-900">Products</h2>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-sm bg-[#1366D9] px-5 py-1 text-[14px] font-medium text-white shadow-sm">
            Add Product
          </button>

          <button className="inline-flex items-center gap-2 rounded-sm border border-[#D0D3D9] bg-white px-5 py-1 text-[#5D6679] text-[14px] font-medium">
            {/* filter icon */}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 5h18M6 12h12M10 19h4" />
            </svg>
            Filters
          </button>

          <button className="inline-flex items-center gap-2 rounded-sm border border-[#D0D3D9] bg-white px-5 py-1 text-[#5D6679] text-[14px] font-medium">
            Download all
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-slate-200 text-left text-sm">
          <thead className="text-slate-600">
            <tr className="[&>th]:py-3 [&>th]:px-4 sm:[&>th]:px-5 [&>th]:font-medium [&>th]:text-[12px] [&>th]:text-[#667085] [&>th]:uppercase">
              <th>SKU</th>
              <th>Products</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              {/* <th className="text-right pr-6">Actions</th> */}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#D0D3D9]">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50/60">
                <td className="py-4 px-4 sm:px-5 text-[14px] font-medium text-[#48505E]">{r.sku}</td>
                <td className="py-4 px-4 sm:px-5 text-[14px] font-medium text-[#48505E]">{r.name}</td>
                <td className="py-4 px-4 sm:px-5 text-[14px] font-medium text-[#48505E]">₹{r.price}</td>
                <td className="py-4 px-4 sm:px-5 text-[14px] font-medium text-[#48505E]">{r.stock}</td>
                <td className="py-4 px-4 sm:px-5">
                  {r.status === "Synced" && (
                    <span className="text-[14px] font-medium text-[#10A760]">Synced</span>
                  )}
                  {r.status === "Not Sync" && (
                    <span className="text-[14px] font-medium text-[#10A760]">Not Sync</span>
                  )}
                  {r.status === "Pending" && (
                    <span className="text-[14px] font-medium text-[#10A760]">Pending</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-4 px-2 sm:pr-6">
                  <div className="flex justify-end items-center gap-4 text-slate-500">
                    {/* eye */}
                    <button className="hover:text-slate-700">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    {/* edit */}
                    <button className="hover:text-slate-700">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                      </svg>
                    </button>
                    {/* delete */}
                    <button className="hover:text-slate-700">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M4 7h16" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
                        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4">
        <button className="rounded-sm border border-[#D0D3D9] bg-white px-5 py-1 text-[#5D6679] text-[14px] font-medium">
          Previous
        </button>

        <p className="text-sm text-slate-600">
          Page <span className="font-medium text-slate-900">1</span> of{" "}
          <span className="font-medium text-slate-900">10</span>
        </p>

        <button className="rounded-sm border border-[#D0D3D9] bg-white px-5 py-1 text-[#5D6679] text-[14px] font-medium">
          Next
        </button>
      </div>
    </div>
    </div>
    </>
  );
}

export default Overview;
