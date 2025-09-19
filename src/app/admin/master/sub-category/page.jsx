// server component
import categories from "../../../../data/categories";

const Pencil = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25Z" stroke="#64748B" />
  </svg>
);
const Trash = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path d="M4 7h16" stroke="#64748B" />
    <path d="M7 7v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" stroke="#64748B" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#64748B" />
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path d="M4 6h16M7 12h10M10 18h4" stroke="#64748B" strokeWidth="2" />
  </svg>
);

const StatusPill = ({ v }) => (
  <span className={`text-[12px] font-medium ${v === "Active" ? "text-green-600" : "text-red-500"}`}>
    {v}
  </span>
);

export default function CategoryPage() {
  return (
    <div className="space-y-4">{/* slightly tighter vertical rhythm */}
      {/* Header */}
      <section className="bg-white rounded-xl shadow-sm px-5 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold">Sub Category</h2>
            <p className="text-[12px] text-slate-500 -mt-0.5">Lorem ipsum is a dummy or placeholder text</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 rounded-md border border-slate-200 text-[13px] hover:bg-slate-50">Import CSV</button>
            <button className="h-9 px-4 rounded-md bg-blue-600 text-white text-[13px] hover:bg-blue-700">Add New Sub Category</button>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="bg-white rounded-xl shadow-sm px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[16px] font-semibold">Sub Category List</h3>
          <button className="h-8 px-3 rounded-md border border-slate-200 text-[13px] hover:bg-slate-50 flex items-center gap-2">
            <FilterIcon /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] leading-tight">
            <thead className="text-slate-600">
              <tr>
                <th className="text-left font-medium py-2.5 pr-3">Category Name</th>
                <th className="text-left font-medium py-2.5 pr-3">Sub Category Name</th>
                <th className="text-right font-medium py-2.5 pr-3">Status</th>
                <th className="text-right font-medium py-2.5 pr-1.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={i} className="border-b border-slate-200 last:border-0">
                  <td className="py-2.5 pr-3">{c.name}</td>
                  <td className="py-2.5 pr-3">{c.Subname}</td>
                  <td className="py-2.5 pr-3 text-right"><StatusPill v={c.status} /></td>
                  <td className="py-2.5 pr-1.5">
                    <div className="flex items-center justify-end gap-2">{/* right aligned */}
                      <button className="p-1.5 rounded hover:bg-slate-100" title="Edit"><Pencil /></button>
                      <button className="p-1.5 rounded hover:bg-slate-100" title="Delete"><Trash /></button>
                      {c.status === "Active" ? (
                        <button className="h-7 px-2.5 rounded-md border border-slate-300 text-[12px] hover:bg-slate-50">Inactive</button>
                      ) : (
                        <button className="h-7 px-3 rounded-md bg-blue-600 text-white text-[12px] hover:bg-blue-700">Active</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (compact) */}
        <div className="flex items-center justify-between mt-4">
          <button className="h-8 px-3 rounded-md border border-slate-300 text-[13px] hover:bg-slate-50">Previous</button>
          <div className="text-[12px] text-slate-600">Page 1 of 10</div>
          <button className="h-8 px-3 rounded-md border border-slate-300 text-[13px] hover:bg-slate-50">Next</button>
        </div>
      </section>
    </div>
  );
}
