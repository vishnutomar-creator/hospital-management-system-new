"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, ArrowDownCircle } from "lucide-react";

const dummyReceivables = [
  { arId: "AR-901", patient: "Rohan Verma", billId: "BILL-502", amount: 8600, dueDate: "2026-08-20", status: "Overdue" },
  { arId: "AR-902", patient: "Meera Nair", billId: "BILL-503", amount: 11500, dueDate: "2026-08-25", status: "Unpaid" },
  { arId: "AR-903", patient: "Sneha Patil", billId: "BILL-505", amount: 3200, dueDate: "2026-08-30", status: "Unpaid" },
];

const statusStyles = {
  Unpaid: "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  Overdue: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  Paid: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
};

export default function AccountsReceivablePage() {
  const [query, setQuery] = useState("");

  const filtered = dummyReceivables.filter((r) =>
    `${r.patient} ${r.arId} ${r.billId}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/finance" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Accounts Receivable</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Amounts owed to the hospital by patients</p>
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
              placeholder="Search receivables..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>
          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">{filtered.length} entries</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Bill</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.arId} className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        <ArrowDownCircle size={15} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">{r.patient}</p>
                        <p className="text-xs text-[#87938E]">{r.arId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{r.billId}</td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">₹{r.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{r.dueDate}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[r.status]}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#87938E]">No receivables found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}