"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Wallet, CheckCircle2, Clock3, TrendingUp } from "lucide-react";

/* ----------------------------- Nav ----------------------------- */

const navItems = [
  { href: "/hr", label: "Staff" },
  { href: "/hr/attendance", label: "Attendance" },
  { href: "/hr/leaves", label: "Leaves" },
  { href: "/hr/payroll", label: "Payroll" },
];

function HRNav() {
  const pathname = usePathname();

  return (
    <div className="flex w-full gap-1 overflow-x-auto rounded-2xl border border-[#E5E2D9] bg-white p-1 dark:border-white/10 dark:bg-[#17201D]">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition
              ${
                active
                  ? "bg-[#0F766E] text-white"
                  : "text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10"
              }
            `}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

/* ----------------------------- Dummy Data ----------------------------- */

const stats = [
  {
    label: "Total Payroll",
    value: "₹18.6L",
    sub: "This month",
    icon: Wallet,
    tone: "teal",
  },
  {
    label: "Paid",
    value: "₹11.2L",
    sub: "3 employees",
    icon: CheckCircle2,
    tone: "teal",
  },
  {
    label: "Pending",
    value: "₹7.4L",
    sub: "2 employees",
    icon: Clock3,
    tone: "amber",
  },
  {
    label: "Avg. Net Pay",
    value: "₹59,040",
    sub: "Per employee",
    icon: TrendingUp,
    tone: "teal",
  },
];

const dummyPayroll = [
  {
    staffId: "STF-201",
    name: "Dr. Ananya Rao",
    department: "Cardiology",
    basic: 145000,
    allowances: 22000,
    deductions: 9800,
    netPay: 157200,
    status: "Paid",
  },
  {
    staffId: "STF-202",
    name: "Rahul Verma",
    department: "Nursing",
    basic: 42000,
    allowances: 6000,
    deductions: 2900,
    netPay: 45100,
    status: "Paid",
  },
  {
    staffId: "STF-203",
    name: "Priya Nair",
    department: "Administration",
    basic: 38000,
    allowances: 4500,
    deductions: 2600,
    netPay: 39900,
    status: "Pending",
  },
  {
    staffId: "STF-204",
    name: "Sanjay Mehta",
    department: "Pharmacy",
    basic: 30000,
    allowances: 3000,
    deductions: 1800,
    netPay: 31200,
    status: "Pending",
  },
  {
    staffId: "STF-205",
    name: "Fatima Sheikh",
    department: "Housekeeping",
    basic: 21000,
    allowances: 2000,
    deductions: 1200,
    netPay: 21800,
    status: "Paid",
  },
];

const payrollStatusStyles = {
  Paid: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Pending:
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
};

const statuses = ["All Status", "Paid", "Pending"];

/* --------------------------------- Page -------------------------------- */

export default function PayrollPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");

  const filtered = dummyPayroll.filter((p) => {
    const matchesQuery = `${p.name} ${p.department}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus = status === "All Status" || p.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <Link href="/hr" className="hover:text-[#0F766E]">
          HR
        </Link>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Payroll
        </span>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
          Payroll
        </h1>
        <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
          Review salaries, deductions, and payment status.
        </p>
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

      {/* Nav */}
      <HRNav />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E2D9] bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#17201D]">
        <div className="relative w-full max-w-xs">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employee..."
            className="
              w-full rounded-xl border border-[#E3E0D7]
              bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm
              text-[#17201D] outline-none
              placeholder:text-[#9AA49F]
              focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
              dark:border-white/10 dark:bg-[#202B27] dark:text-white
              dark:placeholder:text-[#71817B]
            "
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Payroll Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] bg-[#FAFAF7] text-xs uppercase tracking-wide text-[#87938E] dark:border-white/10 dark:bg-[#202B27]">
                <th className="px-5 py-3 font-semibold">Employee</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Basic</th>
                <th className="px-5 py-3 font-semibold">Allowances</th>
                <th className="px-5 py-3 font-semibold">Deductions</th>
                <th className="px-5 py-3 font-semibold">Net Pay</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.staffId}
                  className="border-b border-[#EEECE5] last:border-0 dark:border-white/10"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold text-[#17201D] dark:text-white">
                      {p.name}
                    </p>
                    <p className="text-xs text-[#87938E]">{p.staffId}</p>
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {p.department}
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    ₹{p.basic.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    ₹{p.allowances.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-red-600 dark:text-red-400">
                    −₹{p.deductions.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 font-bold text-[#17201D] dark:text-white">
                    ₹{p.netPay.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${payrollStatusStyles[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-[#87938E]">
              No payroll records found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
