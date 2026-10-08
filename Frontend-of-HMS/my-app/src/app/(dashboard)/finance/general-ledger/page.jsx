"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, BookOpen } from "lucide-react";

const dummyLedger = [
  { ledgerId: "GL-001", accountCode: "4001", accountName: "Patient Revenue", debit: 0, credit: 245000, date: "2026-08-10", description: "OPD & IPD billing" },
  { ledgerId: "GL-002", accountCode: "5001", accountName: "Pharmacy Purchases", debit: 84500, credit: 0, date: "2026-08-08", description: "PO-401 settlement" },
  { ledgerId: "GL-003", accountCode: "5002", accountName: "Staff Salaries", debit: 620000, credit: 0, date: "2026-08-01", description: "August payroll" },
  { ledgerId: "GL-004", accountCode: "4002", accountName: "Insurance Receipts", debit: 0, credit: 63000, date: "2026-08-11", description: "Claim CLM-801 settled" },
];

export default function GeneralLedgerPage() {
  const [query, setQuery] = useState("");

  const filtered = dummyLedger.filter((l) =>
    `${l.accountName} ${l.accountCode} ${l.ledgerId}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/finance" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">General Ledger</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">All debit and credit transactions</p>
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
              placeholder="Search ledger..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>
          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">{filtered.length} entries</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Account</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Debit</th>
                <th className="px-5 py-3">Credit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.ledgerId} className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        <BookOpen size={15} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">{l.accountName}</p>
                        <p className="text-xs text-[#87938E]">{l.accountCode} · {l.ledgerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{l.description}</td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{l.date}</td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{l.debit ? `₹${l.debit.toLocaleString()}` : "—"}</td>
                  <td className="px-5 py-3.5 font-semibold text-[#0F766E] dark:text-[#5EEAD4]">{l.credit ? `₹${l.credit.toLocaleString()}` : "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#87938E]">No ledger entries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}