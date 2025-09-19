"use client";
import data from "../../../data/suppliers.json";

const Status = ({ v }) => (
  <span className={`text-[13px] font-medium ${
    v === "Verified" ? "text-green-600" : v === "Not Verified" ? "text-red-500" : "text-amber-500"
  }`}>{v}</span>
);

export default function SuppliersPage() {
  return (
    <div className="space-y-5">
      <section className="bg-white rounded-xl shadow-sm px-5 py-4">
        <h2 className="text-[15px] font-semibold">Suppliers</h2>
        <p className="text-[12px] text-slate-500">Lorem ipsum is a dummy or placeholder text.</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold">Suppliers List</h3>
          <div className="flex items-center gap-3">
            <button className="h-9 px-4 rounded-md bg-blue-600 text-white text-[13px] hover:bg-blue-700">Add Manual</button>
            <button className="h-9 px-3 rounded-md border border-slate-200 text-[13px] hover:bg-slate-50">Filters</button>
            <button className="h-9 px-4 rounded-md border border-slate-200 text-[13px] hover:bg-slate-50">Download all</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="text-slate-600">
              <tr>{["Company Name","Company Registration No","VAT No","Phone No","Email Id","National Address","Status","Action"]
                .map(h=> <th key={h} className="text-left font-medium py-3 pr-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((r,i)=>(
                <tr key={i} className="border-b border-slate-200 last:border-0">
                  <td className="py-4 pr-3">{r.company}</td>
                  <td className="py-4 pr-3">{r.registrationNo}</td>
                  <td className="py-4 pr-3">{r.vatNo}</td>
                  <td className="py-4 pr-3">{r.phone}</td>
                  <td className="py-4 pr-3">{r.email}</td>
                  <td className="py-4 pr-3">{r.nationalAddress}</td>
                  <td className="py-4 pr-3"><Status v={r.status} /></td>
                  <td className="py-4 pr-3 flex items-center gap-3">
                    <button className="h-8 px-3 rounded-md border border-slate-300 text-[12px] hover:bg-slate-50">Cancel</button>
                    <button className="h-8 px-4 rounded-md bg-blue-600 text-white text-[12px] hover:bg-blue-700">Verify</button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-5">
          <button className="h-9 px-4 rounded-md border border-slate-300 text-[13px] hover:bg-slate-50">Previous</button>
          <div className="text-[13px] text-slate-600">Page 1 of 10</div>
          <button className="h-9 px-4 rounded-md border border-slate-300 text-[13px] hover:bg-slate-50">Next</button>
        </div>
      </section>
    </div>
  );
}
