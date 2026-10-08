"use client";

import { useState } from "react";
import Link from "next/link";
import { IndianRupee, Wallet, AlertCircle, Receipt, Download } from "lucide-react";

/* ----------------------------- Dummy Data ----------------------------- */

const stats = [
  {
    label: "Total Revenue",
    value: "₹64.8L",
    sub: "This month",
    icon: IndianRupee,
    tone: "teal",
  },
  {
    label: "Collected",
    value: "₹51.2L",
    sub: "79% of billed",
    icon: Wallet,
    tone: "teal",
  },
  {
    label: "Outstanding Dues",
    value: "₹13.6L",
    sub: "Across 84 bills",
    icon: AlertCircle,
    tone: "amber",
  },
  {
    label: "Avg. Bill Value",
    value: "₹8,420",
    sub: "Per patient",
    icon: Receipt,
    tone: "teal",
  },
];

const byDepartment = [
  { label: "Cardiology", amount: "₹18.4L", pct: 100 },
  { label: "Orthopedics", amount: "₹14.1L", pct: 77 },
  { label: "Radiology", amount: "₹11.6L", pct: 63 },
  { label: "General Medicine", amount: "₹9.2L", pct: 50 },
  { label: "Pharmacy", amount: "₹6.8L", pct: 37 },
];

const dummyBills = [
  {
    billId: "BIL-4401",
    patient: "Meera Joshi",
    department: "Cardiology",
    amount: 42500,
    paid: 42500,
    due: 0,
    status: "Paid",
  },
  {
    billId: "BIL-4402",
    patient: "Arjun Sethi",
    department: "Orthopedics",
    amount: 68000,
    paid: 30000,
    due: 38000,
    status: "Partial",
  },
  {
    billId: "BIL-4403",
    patient: "Kavya Reddy",
    department: "Gynecology",
    amount: 21500,
    paid: 0,
    due: 21500,
    status: "Unpaid",
  },
  {
    billId: "BIL-4404",
    patient: "Devansh Kapoor",
    department: "General Medicine",
    amount: 9800,
    paid: 9800,
    due: 0,
    status: "Paid",
  },
  {
    billId: "BIL-4405",
    patient: "Ishaan Bhatt",
    department: "Pediatrics",
    amount: 15200,
    paid: 5000,
    due: 10200,
    status: "Partial",
  },
];

const statusStyles = {
  Paid: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Partial:
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  Unpaid: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const ranges = ["This Week", "This Month", "This Quarter", "This Year"];

/* --------------------------------- Page -------------------------------- */

export default function FinancialReportsPage() {
  const [range, setRange] = useState("This Month");

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <Link href="/reports" className="hover:text-[#0F766E]">
          Reports
        </Link>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Financial Reports
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Financial Reports
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Revenue, billing, and outstanding dues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >
            {ranges.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>

          <button className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const iconBg =
            s.tone === "amber"
              ? "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]"
              : "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]";

          return (
            <div
              key={s.label}
              className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
                >
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#87938E]">{s.label}</p>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="text-2xl font-bold text-[#17201D] dark:text-white">
                  {s.value}
                </p>
                <p className="text-[11px] text-[#87938E]">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Breakdown */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]">
        <p className="font-bold text-[#17201D] dark:text-white">
          Revenue by Department
        </p>
        <div className="mt-4 space-y-4">
          {byDepartment.map((d) => (
            <div key={d.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#52615B] dark:text-[#AAB6B0]">
                  {d.label}
                </span>
                <span className="font-semibold text-[#17201D] dark:text-white">
                  {d.amount}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EEECE5] dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-[#0F766E]"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between border-b border-[#EEECE5] px-5 py-4 dark:border-white/10">
          <p className="font-bold text-[#17201D] dark:text-white">
            Recent Bills
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] bg-[#FAFAF7] text-xs uppercase tracking-wide text-[#87938E] dark:border-white/10 dark:bg-[#202B27]">
                <th className="px-5 py-3 font-semibold">Patient</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Bill Amount</th>
                <th className="px-5 py-3 font-semibold">Paid</th>
                <th className="px-5 py-3 font-semibold">Due</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyBills.map((b) => (
                <tr
                  key={b.billId}
                  className="border-b border-[#EEECE5] last:border-0 dark:border-white/10"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold text-[#17201D] dark:text-white">
                      {b.patient}
                    </p>
                    <p className="text-xs text-[#87938E]">{b.billId}</p>
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {b.department}
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    ₹{b.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    ₹{b.paid.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#17201D] dark:text-white">
                    ₹{b.due.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
