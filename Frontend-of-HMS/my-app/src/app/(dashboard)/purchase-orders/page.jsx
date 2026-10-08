"use client";
 
import { useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical, Receipt } from "lucide-react";
 
const dummyPOs = [
  { poId: "PO-401", supplier: "MedCore Supplies", orderDate: "2026-08-05", totalAmount: 84500, status: "Received" },
  { poId: "PO-402", supplier: "Sunrise Pharma Distributors", orderDate: "2026-08-08", totalAmount: 132000, status: "Pending" },
  { poId: "PO-403", supplier: "Wellness Meditrade", orderDate: "2026-08-10", totalAmount: 45600, status: "Shipped" },
  { poId: "PO-404", supplier: "Apex Surgical Co.", orderDate: "2026-08-12", totalAmount: 98750, status: "Pending" },
];
 
const statusStyles = {
  Pending: "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  Shipped: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Received: "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
};
 
export default function PurchaseOrdersPage() {
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
 
  const filtered = dummyPOs.filter((p) =>
    `${p.supplier} ${p.poId}`.toLowerCase().includes(query.toLowerCase())
  );
 
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Purchase Orders</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Orders placed with suppliers for stock</p>
        </div>
        <Link href="/purchase-orders/add" className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90">
          <Plus size={17} />
          New Purchase Order
        </Link>
      </div>
 
      <div className="rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search purchase orders..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>
          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">{filtered.length} orders</p>
        </div>
 
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Supplier</th>
                <th className="px-5 py-3">Order Date</th>
                <th className="px-5 py-3">Total Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.poId} className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        <Receipt size={15} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">{p.supplier}</p>
                        <p className="text-xs text-[#87938E]">{p.poId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{p.orderDate}</td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">₹{p.totalAmount.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="relative flex justify-end">
                      <button onClick={() => setOpenMenuId(openMenuId === p.poId ? null : p.poId)} className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10">
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === p.poId && (
                        <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                          <Link href={`/purchase-orders/${p.poId}/edit`} className="block px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]">Edit</Link>
                          <button className="block w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#87938E]">No purchase orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
 