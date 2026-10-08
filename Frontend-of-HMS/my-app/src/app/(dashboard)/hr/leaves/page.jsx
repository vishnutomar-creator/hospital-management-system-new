"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Plus,
  CalendarOff,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

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
    label: "Pending Requests",
    value: "7",
    sub: "Awaiting review",
    icon: Clock3,
    tone: "amber",
  },
  {
    label: "Approved",
    value: "22",
    sub: "This month",
    icon: CheckCircle2,
    tone: "teal",
  },
  {
    label: "Rejected",
    value: "3",
    sub: "This month",
    icon: XCircle,
    tone: "amber",
  },
  {
    label: "On Leave Today",
    value: "9",
    sub: "Across departments",
    icon: CalendarOff,
    tone: "teal",
  },
];

const dummyLeaves = [
  {
    leaveId: "LV-3301",
    name: "Priya Nair",
    department: "Administration",
    type: "Sick Leave",
    from: "2026-08-20",
    to: "2026-08-24",
    days: 5,
    appliedOn: "2026-08-17",
    status: "Approved",
  },
  {
    leaveId: "LV-3302",
    name: "Rahul Verma",
    department: "Nursing",
    type: "Casual Leave",
    from: "2026-08-29",
    to: "2026-08-29",
    days: 1,
    appliedOn: "2026-08-21",
    status: "Pending",
  },
  {
    leaveId: "LV-3303",
    name: "Fatima Sheikh",
    department: "Housekeeping",
    type: "Earned Leave",
    from: "2026-09-02",
    to: "2026-09-06",
    days: 5,
    appliedOn: "2026-08-15",
    status: "Pending",
  },
  {
    leaveId: "LV-3304",
    name: "Karan Malhotra",
    department: "Radiology",
    type: "Casual Leave",
    from: "2026-08-18",
    to: "2026-08-19",
    days: 2,
    appliedOn: "2026-08-10",
    status: "Rejected",
  },
];

const leaveStatusStyles = {
  Approved:
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Pending:
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  Rejected: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const statuses = ["All Status", "Approved", "Pending", "Rejected"];

/* --------------------------------- Page -------------------------------- */

export default function LeavesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");

  const filtered = dummyLeaves.filter((l) => {
    const matchesQuery = `${l.name} ${l.department} ${l.type}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus = status === "All Status" || l.status === status;
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
          Leaves
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Leaves
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Review and manage staff leave requests.
          </p>
        </div>

        <Link
          href="/hr/leaves/add"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
          "
        >
          <Plus size={17} />
          Apply Leave
        </Link>
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
            placeholder="Search leave requests..."
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

      {/* Leave Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((l) => (
          <div
            key={l.leaveId}
            className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-[#17201D] dark:text-white">
                  {l.name}
                </p>
                <p className="text-xs text-[#87938E]">
                  {l.department} · {l.leaveId}
                </p>
              </div>
              <span
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${leaveStatusStyles[l.status]}`}
              >
                {l.status === "Approved" && <CheckCircle2 size={13} />}
                {l.status === "Rejected" && <XCircle size={13} />}
                {l.status === "Pending" && <Clock3 size={13} />}
                {l.status}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#87938E]">{l.type}</span>
                <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">
                  {l.days} day{l.days > 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-[#17201D] dark:text-white">
                  {l.from}
                </span>
                <span className="text-[#87938E]">to</span>
                <span className="font-semibold text-[#17201D] dark:text-white">
                  {l.to}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#EEECE5] pt-3 text-xs text-[#87938E] dark:border-white/10">
              <span>Applied on {l.appliedOn}</span>
              {l.status === "Pending" && (
                <div className="flex gap-3">
                  <button className="font-semibold text-[#0F766E] hover:underline dark:text-[#5EEAD4]">
                    Approve
                  </button>
                  <button className="font-semibold text-red-600 hover:underline dark:text-red-400">
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-[#87938E]">
            No leave requests found.
          </p>
        )}
      </div>
    </div>
  );
}
