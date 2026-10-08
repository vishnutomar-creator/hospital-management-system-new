"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  AlertTriangle,
  CalendarClock,
  Wallet,
  Download,
} from "lucide-react";

/* ----------------------------- Dummy Data ----------------------------- */

const stats = [
  {
    label: "Total Items",
    value: "186",
    sub: "Catalog items",
    icon: Package,
    tone: "teal",
  },
  {
    label: "Low Stock",
    value: "14",
    sub: "Below reorder level",
    icon: AlertTriangle,
    tone: "amber",
  },
  {
    label: "Expiring Soon",
    value: "8",
    sub: "Within 90 days",
    icon: CalendarClock,
    tone: "amber",
  },
  {
    label: "Inventory Value",
    value: "₹8.4L",
    sub: "At current stock",
    icon: Wallet,
    tone: "teal",
  },
];

const byCategory = [
  { label: "Cardiac", count: 42, pct: 100 },
  { label: "Antibiotic", count: 35, pct: 83 },
  { label: "Diabetes", count: 28, pct: 67 },
  { label: "Pain Relief", count: 24, pct: 57 },
  { label: "Allergy", count: 19, pct: 45 },
];

const dummyItems = [
  {
    itemId: "MED-102",
    name: "Metformin 500mg",
    category: "Diabetes",
    stock: 90,
    reorderLevel: 150,
    status: "Low Stock",
  },
  {
    itemId: "MED-104",
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    stock: 60,
    reorderLevel: 120,
    status: "Low Stock",
  },
  {
    itemId: "MED-106",
    name: "Insulin Glargine",
    category: "Diabetes",
    stock: 35,
    reorderLevel: 40,
    status: "Expiring Soon",
  },
  {
    itemId: "MED-109",
    name: "Amoxiclav 625mg",
    category: "Antibiotic",
    stock: 44,
    reorderLevel: 100,
    status: "Low Stock",
  },
  {
    itemId: "MED-112",
    name: "Salbutamol Inhaler",
    category: "Respiratory",
    stock: 18,
    reorderLevel: 30,
    status: "Expiring Soon",
  },
];

const statusStyles = {
  "Low Stock":
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  "Expiring Soon":
    "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const ranges = ["This Week", "This Month", "This Quarter", "This Year"];

/* --------------------------------- Page -------------------------------- */

export default function InventoryReportsPage() {
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
          Inventory Reports
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Inventory Reports
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Stock levels, expiries, and reorder alerts.
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
          Stock by Category
        </p>
        <div className="mt-4 space-y-4">
          {byCategory.map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#52615B] dark:text-[#AAB6B0]">
                  {c.label}
                </span>
                <span className="font-semibold text-[#17201D] dark:text-white">
                  {c.count}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EEECE5] dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-[#0F766E]"
                  style={{ width: `${c.pct}%` }}
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
            Items Needing Attention
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] bg-[#FAFAF7] text-xs uppercase tracking-wide text-[#87938E] dark:border-white/10 dark:bg-[#202B27]">
                <th className="px-5 py-3 font-semibold">Item</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">In Stock</th>
                <th className="px-5 py-3 font-semibold">Reorder At</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyItems.map((i) => (
                <tr
                  key={i.itemId}
                  className="border-b border-[#EEECE5] last:border-0 dark:border-white/10"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold text-[#17201D] dark:text-white">
                      {i.name}
                    </p>
                    <p className="text-xs text-[#87938E]">{i.itemId}</p>
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {i.category}
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#17201D] dark:text-white">
                    {i.stock}
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {i.reorderLevel}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[i.status]}`}
                    >
                      {i.status}
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
