"use client";
import { useMemo, useState } from "react";
import list from "@/data/invoices.json";

const fmt = (n)=>`SAR ${Number(n||0).toFixed(2)}`;
const Status = ({s})=>{
  const cls = s==="Cleared"?"text-[#10A760]":s==="Ready"?"text-[#0EA5E9]":"text-[#EF4444]";
  return <span className={`text-[14px] font-medium ${cls}`}>{s}</span>;
};

export default function Billing(){
  const [view,setView]=useState("list"); // list | add
  const [rows,setRows]=useState(list);

  /* ---------- ADD FORM STATE (simple + working) ---------- */
  const [invType,setInvType]=useState("");
  const [issueDate,setIssueDate]=useState("");
  const [buyer,setBuyer]=useState("");
  const [buyerVat,setBuyerVat]=useState("");
  const [buyerAddr,setBuyerAddr]=useState("");
  const [items,setItems]=useState([
    {desc:"Item1", qty:1, price:100, vat:15},
    {desc:"Item1", qty:1, price:100, vat:15},
    {desc:"Item1", qty:1, price:100, vat:15},
    {desc:"Item1", qty:1, price:100, vat:15},
    {desc:"Item1", qty:1, price:100, vat:15},
  ]);

  const totals = useMemo(()=>{
    const sub = items.reduce((a,i)=>a+(Number(i.qty||0)*Number(i.price||0)),0);
    const vat = items.reduce((a,i)=>a+(Number(i.qty||0)*Number(i.price||0))*Number(i.vat||0)/100,0);
    return {sub, vat, grand: sub+vat};
  },[items]);

  const addRow = ()=> setItems(p=>[...p,{desc:"Item1",qty:1,price:100,vat:15}]);
  const delRow = (idx)=> setItems(p=>p.filter((_,i)=>i!==idx));
  const setAt = (i,patch)=> setItems(p=>p.map((r,idx)=>idx===i?{...r,...patch}:r));

  const createInvoice = (e)=>{
    e.preventDefault();
    setRows(p=>[
      ...p,
      {
        id: String(Date.now()),
        invoiceNo: `INV-${Math.floor(1000+Math.random()*9000)}`,
        buyer,
        date: issueDate||"2025/08/12",
        total: totals.grand,
        status: "Ready"
      }
    ]);
    // reset + back to list
    setInvType(""); setIssueDate(""); setBuyer(""); setBuyerVat(""); setBuyerAddr("");
    setItems([{desc:"Item1", qty:1, price:100, vat:15}]);
    setView("list");
  };

  /* ---------------- LIST VIEW ---------------- */
  if(view==="list"){
    return (
      <div className="bg-[#EAF6FF] min-h-screen -mx-4 md:mx-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-[20px] font-semibold text-[#383E49]">Invoices</h1>
              <p className="text-[#667085] text-sm">Create clear/report and print ZATCA–compliant invoice</p>
            </div>
            <div className="flex gap-3">
              <button className="border border-[#E5E7EB] px-4 py-2 rounded text-[#5D6679] text-[14px]">Export CSV</button>
              <button onClick={()=>setView("add")} className="bg-[#1366D9] text-white px-4 py-2 rounded text-[14px]">Add New Invoice</button>
            </div>
          </div>

          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="flex items-center justify-end gap-2 p-4">
              <button className="inline-flex items-center gap-2 rounded-sm border border-[#D0D3D9] bg-white px-4 py-1.5 text-[#5D6679] text-[14px]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h18M6 12h12M10 19h4"/></svg>
                Filters
              </button>
              <button className="inline-flex items-center gap-2 rounded-sm border border-[#D0D3D9] bg-white px-4 py-1.5 text-[#5D6679] text-[14px]">Download all</button>
            </div>

            <div className="px-4 pb-4">
              <h3 className="text-[16px] font-medium text-[#383E49] mb-2">Invoice List</h3>
              <table className="w-full text-left">
                <thead className="bg-[#F8FAFC] text-[#667085] text-[12px] uppercase">
                  <tr>
                    <th className="p-3 font-medium">Invoice No</th>
                    <th className="p-3 font-medium">Buyer</th>
                    <th className="p-3 font-medium">Date</th>
                    <th className="p-3 font-medium">Total</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r=>(
                    <tr key={r.id} className="border-t">
                      <td className="p-3 text-[#48505E] text-[14px]">{r.invoiceNo}</td>
                      <td className="p-3 text-[#48505E] text-[14px]">{r.buyer}</td>
                      <td className="p-3 text-[#48505E] text-[14px]">{r.date}</td>
                      <td className="p-3 text-[#48505E] text-[14px]">{fmt(r.total)}</td>
                      <td className="p-3"><Status s={r.status}/></td>
                      <td className="p-3">
                        <div className="flex items-center gap-4 text-slate-600 justify-end">
                          <button title="View">👁️</button>
                          <button title="Edit">✏️</button>
                          <button title="Delete">🗑️</button>
                          <button title="Download">⬇️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between mt-4">
                <button className="rounded-sm border border-[#D0D3D9] bg-white px-5 py-1 text-[#5D6679] text-[14px]">Previous</button>
                <p className="text-sm text-slate-600">Page <span className="font-medium text-slate-900">1</span> of <span className="font-medium text-slate-900">10</span></p>
                <button className="rounded-sm border border-[#D0D3D9] bg-white px-5 py-1 text-[#5D6679] text-[14px]">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- ADD VIEW ---------------- */
  return (
    <div className="bg-[#EAF6FF] min-h-screen -mx-4 md:mx-0">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[20px] font-semibold text-[#383E49]">Add New Invoice</h1>
          <button onClick={()=>setView("list")} className="border border-[#D0D3D9] px-4 py-2 rounded text-[14px] text-[#5D6679]">Back to List</button>
        </div>

        <form onSubmit={createInvoice} className="grid grid-cols-12 gap-6">
          {/* LEFT FORM */}
          <div className="col-span-12 lg:col-span-9 bg-white rounded-md shadow p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#344054] mb-1">Invoice Type</label>
                <div className="relative">
                  <select value={invType} onChange={e=>setInvType(e.target.value)} className="w-full border border-[#E5E7EB] rounded-md h-11 px-3">
                    <option value="">Select Invoice Type</option>
                    <option>Standard</option>
                    <option>Simplified</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#344054] mb-1">Issue Date</label>
                <input value={issueDate} onChange={e=>setIssueDate(e.target.value)} placeholder="dd/mm/yyyy" className="w-full border border-[#E5E7EB] rounded-md h-11 px-3"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#344054] mb-1">Seller (per–filled)</label>
                <input disabled value="A2ZGulf" className="w-full border border-[#E5E7EB] bg-[#F3F4F6] rounded-md h-11 px-3"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#344054] mb-1">Buyer Name</label>
                <input value={buyer} onChange={e=>setBuyer(e.target.value)} placeholder="Enter" className="w-full border border-[#E5E7EB] rounded-md h-11 px-3"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#344054] mb-1">Buyer VAT/TRN</label>
                <input value={buyerVat} onChange={e=>setBuyerVat(e.target.value)} placeholder="Enter VAT/TRN" className="w-full border border-[#E5E7EB] rounded-md h-11 px-3"/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">Buyer National Address</label>
              <input value={buyerAddr} onChange={e=>setBuyerAddr(e.target.value)} placeholder="Enter" className="w-full border border-[#E5E7EB] rounded-md h-11 px-3"/>
            </div>

            {/* Line Items */}
            <div>
              <p className="text-[14px] font-medium text-[#344054] mb-2">Line Items</p>
              <div className="space-y-3">
                {items.map((it,idx)=>(
                  <div key={idx} className="grid grid-cols-12 gap-3">
                    <input className="col-span-12 md:col-span-4 border border-[#E5E7EB] rounded-md h-11 px-3" value={it.desc} onChange={e=>setAt(idx,{desc:e.target.value})} placeholder="Item"/>
                    <input type="number" className="col-span-4 md:col-span-2 border border-[#E5E7EB] rounded-md h-11 px-3" value={it.qty} onChange={e=>setAt(idx,{qty:+e.target.value})} placeholder="1"/>
                    <input type="number" className="col-span-4 md:col-span-2 border border-[#E5E7EB] rounded-md h-11 px-3" value={it.price} onChange={e=>setAt(idx,{price:+e.target.value})} placeholder="100"/>
                    <select className="col-span-4 md:col-span-2 border border-[#E5E7EB] rounded-md h-11 px-3" value={it.vat} onChange={e=>setAt(idx,{vat:+e.target.value})}>
                      <option value={0}>VAT 0%</option>
                      <option value={5}>VAT 5%</option>
                      <option value={10}>VAT 10%</option>
                      <option value={15}>VAT 15%</option>
                    </select>
                    <div className="col-span-12 md:col-span-2 flex items-center gap-2">
                      <button type="button" onClick={()=>delRow(idx)} className="h-9 w-9 rounded-md border grid place-items-center">✖</button>
                      <button type="button" onClick={addRow} className="h-9 w-9 rounded-md border grid place-items-center">＋</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="col-span-12 lg:col-span-3 space-y-5">
            <div className="bg-white rounded-md shadow p-5">
              <h3 className="text-[16px] font-semibold text-[#383E49] mb-4">Summary</h3>
              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between"><span className="text-[#667085]">Sub Total</span><span className="font-medium">{fmt(totals.sub)}</span></div>
                <div className="flex justify-between"><span className="text-[#667085]">VAT</span><span className="font-medium">{fmt(totals.vat)}</span></div>
                <div className="flex justify-between pt-2 border-t"><span className="text-[#667085]">Grand Total</span><span className="font-semibold">{fmt(totals.grand)}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-md shadow p-5">
              <h3 className="text-[16px] font-semibold text-[#383E49] mb-4">QR Preview</h3>
              <div className="h-60 rounded-md bg-[#F3F4F6]" />
              <button type="submit" className="w-full mt-6 bg-[#1366D9] text-white h-10 rounded">Generate & Prepare</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
