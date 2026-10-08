"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserCog,
  UserCheck,
  CalendarOff,
  Wallet,
  Download,
} from "lucide-react";

/* ----------------------------- Dummy Data ----------------------------- */

const stats = [
  {
    label: "Total Staff",
    value: "186",
    sub: "Active employees",
    icon: UserCog,
    tone: "teal",
  },
  {
    label: "Avg. Attendance",
    value: "94.2%",
    sub: "This month",
    icon: UserCheck,
    tone: "teal",
  },
  {
    label: "Leaves Taken",
    value: "58",
    sub: "This month",
    icon: CalendarOff,
    tone: "amber",
  },
  {
    label: "Payroll Processed",
    value: "₹18.6L",
    sub: "This month",
    icon: Wallet,
    tone: "teal",
  },
];

const byDepartment = [
  { label: "Nursing", count: 62, pct: 100 },
  { label: "Administration", count: 34, pct: 55 },
  { label: "Cardiology", count: 28, pct: 45 },
  { label: "Pharmacy", count: 21, pct: 34 },
  { label: "Housekeeping", count: 18, pct: 29 },
];

const dummyStaff = [
  {
    staffId: "STF-201",
    name: "Dr. Ananya Rao",
    department: "Cardiology",
    attendance: "97%",
    leaves: 1,
    payrollStatus: "Paid",
  },
  {
    staffId: "STF-202",
    name: "Rahul Verma",
    department: "Nursing",
    attendance: "93%",
    leaves: 2,
    payrollStatus: "Paid",
  },
  {
    staffId: "STF-203",
    name: "Priya Nair",
    department: "Administration",
    attendance: "88%",
    leaves: 4,
    payrollStatus: "Pending",
  },
  {
    staffId: "STF-204",
    name: "Sanjay Mehta",
    department: "Pharmacy",
    attendance: "91%",
    leaves: 2,
    payrollStatus: "Pending",
  },
  {
    staffId: "STF-205",
    name: "Fatima Sheikh",
    department: "Housekeeping",
    attendance: "96%",
    leaves: 1,
    payrollStatus: "Paid",
  },
];

const statusStyles = {
  Paid: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Pending:
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
};

const ranges = ["This Week", "This Month", "This Quarter", "This Year"];

/* --------------------------------- Page -------------------------------- */

export default function StaffReportsPage() {
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
          Staff Reports
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Staff Reports
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Attendance, leaves, and payroll summaries.
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
          Staff by Department
        </p>
        <div className="mt-4 space-y-4">
          {byDepartment.map((d) => (
            <div key={d.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#52615B] dark:text-[#AAB6B0]">
                  {d.label}
                </span>
                <span className="font-semibold text-[#17201D] dark:text-white">
                  {d.count}
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
            Staff Summary
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] bg-[#FAFAF7] text-xs uppercase tracking-wide text-[#87938E] dark:border-white/10 dark:bg-[#202B27]">
                <th className="px-5 py-3 font-semibold">Employee</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Attendance</th>
                <th className="px-5 py-3 font-semibold">Leaves Taken</th>
                <th className="px-5 py-3 font-semibold">Payroll</th>
              </tr>
            </thead>
            <tbody>
              {dummyStaff.map((s) => (
                <tr
                  key={s.staffId}
                  className="border-b border-[#EEECE5] last:border-0 dark:border-white/10"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold text-[#17201D] dark:text-white">
                      {s.name}
                    </p>
                    <p className="text-xs text-[#87938E]">{s.staffId}</p>
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {s.department}
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#17201D] dark:text-white">
                    {s.attendance}
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {s.leaves}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[s.payrollStatus]}`}
                    >
                      {s.payrollStatus}
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
