"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, ArrowUpCircle } from "lucide-react";

const dummyPayables = [
  { apId: "AP-951", supplier: "MedCore Supplies", invoiceNo: "INV-8821", amount: 84500, dueDate: "2026-08-22", status: "Unpaid" },
  { apId: "AP-952", supplier: "Sunrise Pharma Distributors", invoiceNo: "INV-8830", amount: 132000, dueDate: "2026-08-18", status: "Overdue" },
  { apId: "AP-953", supplier: "Apex Surgical Co.", invoiceNo: "INV-8845", amount: 45600, dueDate: "2026-08-28", status: "Unpaid" },
];

const statusStyles = {
  Unpaid: "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  Overdue: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  Paid: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
};

export default function AccountsPayablePage() {
  const [query, setQuery] = useState("");

  const filtered = dummyPayables.filter((p) =>
    `${p.supplier} ${p.apId} ${p.invoiceNo}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/finance" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Accounts Payable</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Amounts owed by the hospital to suppliers</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search payables..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>
          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">{filtered.length} entries</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Supplier</th>
                <th className="px-5 py-3">Invoice No.</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.apId} className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        <ArrowUpCircle size={15} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">{p.supplier}</p>
                        <p className="text-xs text-[#87938E]">{p.apId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{p.invoiceNo}</td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">₹{p.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{p.dueDate}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[p.status]}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#87938E]">No payables found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}