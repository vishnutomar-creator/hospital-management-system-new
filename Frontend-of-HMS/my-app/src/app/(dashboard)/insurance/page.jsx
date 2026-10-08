"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical, ShieldCheck } from "lucide-react";

const dummyClaims = [
  { claimId: "CLM-801", patient: "Aditi Sharma", insuranceCompany: "Star Health", policyNo: "SH-88213421", claimAmount: 45000, status: "Approved" },
  { claimId: "CLM-802", patient: "Karan Malhotra", insuranceCompany: "HDFC Ergo", policyNo: "HE-33210987", claimAmount: 18500, status: "Submitted" },
  { claimId: "CLM-803", patient: "Meera Nair", insuranceCompany: "ICICI Lombard", policyNo: "IL-77102345", claimAmount: 62000, status: "Rejected" },
];

const statusStyles = {
  Submitted: "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  Approved: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Rejected: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export default function InsurancePage() {
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const filtered = dummyClaims.filter((c) =>
    `${c.patient} ${c.claimId} ${c.insuranceCompany}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Insurance</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Insurance claims filed on behalf of patients</p>
        </div>
        <Link href="/insurance/add" className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90">
          <Plus size={17} />
          New Claim
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
              placeholder="Search claims..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>
          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">{filtered.length} claims</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Insurance Company</th>
                <th className="px-5 py-3">Policy No.</th>
                <th className="px-5 py-3">Claim Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.claimId} className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        <ShieldCheck size={15} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">{c.patient}</p>
                        <p className="text-xs text-[#87938E]">{c.claimId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{c.insuranceCompany}</td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{c.policyNo}</td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">₹{c.claimAmount.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="relative flex justify-end">
                      <button onClick={() => setOpenMenuId(openMenuId === c.claimId ? null : c.claimId)} className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10">
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === c.claimId && (
                        <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                          <Link href={`/insurance/${c.claimId}/edit`} className="block px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]">Edit</Link>
                          <button className="block w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#87938E]">No claims found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}