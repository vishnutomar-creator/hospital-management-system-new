"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Plus,
  Wrench,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
} from "lucide-react";

/* ----------------------------- Nav ----------------------------- */

const navItems = [
  { href: "/assets", label: "Assets" },
  { href: "/assets/maintenance", label: "Maintenance" },
];

function AssetsNav() {
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
    label: "Scheduled",
    value: "6",
    sub: "Upcoming this month",
    icon: Calendar,
    tone: "teal",
  },
  {
    label: "In Progress",
    value: "3",
    sub: "Being serviced now",
    icon: Wrench,
    tone: "amber",
  },
  {
    label: "Overdue",
    value: "2",
    sub: "Past due date",
    icon: AlertTriangle,
    tone: "amber",
  },
  {
    label: "Completed",
    value: "18",
    sub: "This quarter",
    icon: CheckCircle2,
    tone: "teal",
  },
];

const dummyMaintenance = [
  {
    ticketId: "MNT-501",
    assetId: "AST-1003",
    assetName: "Ventilator - Drager V500",
    type: "Corrective",
    issue: "Flow sensor calibration drift",
    technician: "MedTech Services Pvt Ltd",
    scheduledDate: "2026-08-23",
    completedDate: null,
    cost: 12500,
    status: "In Progress",
  },
  {
    ticketId: "MNT-502",
    assetId: "AST-1007",
    assetName: "Ambulance - Force Traveller",
    type: "Corrective",
    issue: "Engine overheating, coolant leak",
    technician: "Force Motors Service Center",
    scheduledDate: "2026-08-20",
    completedDate: null,
    cost: 38000,
    status: "Overdue",
  },
  {
    ticketId: "MNT-503",
    assetId: "AST-1001",
    assetName: "MRI Scanner (3T)",
    type: "Preventive",
    issue: "Quarterly preventive service",
    technician: "Siemens Healthineers",
    scheduledDate: "2026-08-28",
    completedDate: null,
    cost: 95000,
    status: "Scheduled",
  },
  {
    ticketId: "MNT-504",
    assetId: "AST-1005",
    assetName: "Autoclave Sterilizer",
    type: "Preventive",
    issue: "Annual pressure valve check",
    technician: "In-house Maintenance",
    scheduledDate: "2026-09-01",
    completedDate: null,
    cost: 4200,
    status: "Scheduled",
  },
  {
    ticketId: "MNT-505",
    assetId: "AST-1002",
    assetName: "Patient Monitor - Philips",
    type: "Corrective",
    issue: "Display flickering intermittently",
    technician: "Philips Healthcare Support",
    scheduledDate: "2026-08-12",
    completedDate: "2026-08-14",
    cost: 6800,
    status: "Completed",
  },
  {
    ticketId: "MNT-506",
    assetId: "AST-1004",
    assetName: "Server Rack - Dell PowerEdge",
    type: "Preventive",
    issue: "Firmware update and dust cleaning",
    technician: "In-house IT Team",
    scheduledDate: "2026-08-05",
    completedDate: "2026-08-05",
    cost: 0,
    status: "Completed",
  },
];

const statusStyles = {
  Scheduled:
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  "In Progress":
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  Overdue: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  Completed:
    "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
};

const statusIcons = {
  Scheduled: Calendar,
  "In Progress": Wrench,
  Overdue: AlertTriangle,
  Completed: CheckCircle2,
};

const types = ["All Types", "Preventive", "Corrective"];
const statuses = [
  "All Status",
  "Scheduled",
  "In Progress",
  "Overdue",
  "Completed",
];

/* --------------------------------- Page -------------------------------- */

export default function AssetMaintenancePage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");

  const filtered = dummyMaintenance.filter((m) => {
    const matchesQuery = `${m.assetName} ${m.assetId} ${m.ticketId} ${m.technician}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesType = type === "All Types" || m.type === type;
    const matchesStatus = status === "All Status" || m.status === status;
    return matchesQuery && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <Link href="/assets" className="hover:text-[#0F766E]">
          Assets
        </Link>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Maintenance
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Maintenance
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Track service tickets, schedules, and repair costs.
          </p>
        </div>

        <Link
          href="/assets/maintenance/add"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
          "
        >
          <Plus size={17} />
          Schedule Maintenance
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
      <AssetsNav />

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
            placeholder="Search ticket, asset, vendor..."
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

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

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
      </div>

      {/* Maintenance Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((m) => {
          const StatusIcon = statusIcons[m.status];

          return (
            <div
              key={m.ticketId}
              className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-[#17201D] dark:text-white">
                    {m.assetName}
                  </p>
                  <p className="text-xs text-[#87938E]">
                    {m.ticketId} · {m.assetId}
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[m.status]}`}
                >
                  <StatusIcon size={13} />
                  {m.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                  {m.type}
                </span>
              </div>

              <p className="mt-3 text-sm text-[#52615B] dark:text-[#AAB6B0]">
                {m.issue}
              </p>

              <div className="mt-4 space-y-2 rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                <div className="flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                  <User size={13} className="text-[#8A9691]" />
                  <span className="truncate">{m.technician}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                  <Calendar size={13} className="text-[#8A9691]" />
                  <span>
                    {m.status === "Completed"
                      ? `Completed ${m.completedDate}`
                      : `Scheduled ${m.scheduledDate}`}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[#EEECE5] pt-3 dark:border-white/10">
                <div>
                  <p className="text-[11px] text-[#87938E]">Est. Cost</p>
                  <p className="font-bold text-[#17201D] dark:text-white">
                    {m.cost > 0
                      ? `₹${m.cost.toLocaleString("en-IN")}`
                      : "In-house"}
                  </p>
                </div>

                <Link
                  href={`/assets/maintenance/${m.ticketId}`}
                  className="text-xs font-semibold text-[#0F766E] hover:underline dark:text-[#5EEAD4]"
                >
                  View Details →
                </Link>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-[#87938E]">
            No maintenance records found.
          </p>
        )}
      </div>
    </div>
  );
}
