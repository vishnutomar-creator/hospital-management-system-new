"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Plus,
  MoreVertical,
  Boxes,
  CheckCircle2,
  Wrench,
  Wallet,
  MapPin,
  Calendar,
  Tag,
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
    label: "Total Assets",
    value: "312",
    sub: "Across all categories",
    icon: Boxes,
    tone: "teal",
  },
  {
    label: "In Use",
    value: "268",
    sub: "Currently active",
    icon: CheckCircle2,
    tone: "teal",
  },
  {
    label: "Under Maintenance",
    value: "11",
    sub: "Being serviced",
    icon: Wrench,
    tone: "amber",
  },
  {
    label: "Total Value",
    value: "₹4.2Cr",
    sub: "At purchase cost",
    icon: Wallet,
    tone: "teal",
  },
];

const dummyAssets = [
  {
    assetId: "AST-1001",
    name: "MRI Scanner (3T)",
    category: "Medical Equipment",
    location: "Radiology · Room 204",
    purchaseDate: "2022-05-14",
    value: 18500000,
    condition: "Good",
    status: "In Use",
  },
  {
    assetId: "AST-1002",
    name: "Patient Monitor - Philips",
    category: "Medical Equipment",
    location: "ICU · Bay 3",
    purchaseDate: "2023-02-10",
    value: 185000,
    condition: "Good",
    status: "In Use",
  },
  {
    assetId: "AST-1003",
    name: "Ventilator - Drager V500",
    category: "Medical Equipment",
    location: "ICU · Bay 1",
    purchaseDate: "2021-11-02",
    value: 920000,
    condition: "Fair",
    status: "Under Maintenance",
  },
  {
    assetId: "AST-1004",
    name: "Server Rack - Dell PowerEdge",
    category: "IT Equipment",
    location: "Admin · Server Room",
    purchaseDate: "2022-08-19",
    value: 640000,
    condition: "Good",
    status: "In Use",
  },
  {
    assetId: "AST-1005",
    name: "Autoclave Sterilizer",
    category: "Lab Equipment",
    location: "Pathology · Lab 2",
    purchaseDate: "2020-03-27",
    value: 310000,
    condition: "Fair",
    status: "In Use",
  },
  {
    assetId: "AST-1006",
    name: "Hospital Bed - Electric",
    category: "Furniture",
    location: "Ward B · Room 12",
    purchaseDate: "2023-07-05",
    value: 78000,
    condition: "Good",
    status: "Idle",
  },
  {
    assetId: "AST-1007",
    name: "Ambulance - Force Traveller",
    category: "Vehicle",
    location: "Fleet · Bay 2",
    purchaseDate: "2019-09-30",
    value: 2450000,
    condition: "Poor",
    status: "Under Maintenance",
  },
  {
    assetId: "AST-1008",
    name: "X-Ray Machine - GE",
    category: "Medical Equipment",
    location: "Radiology · Room 101",
    purchaseDate: "2018-01-16",
    value: 3200000,
    condition: "Fair",
    status: "Retired",
  },
];

const statusStyles = {
  "In Use":
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Idle: "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  "Under Maintenance":
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  Retired: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const conditionStyles = {
  Good: "text-[#0F766E] dark:text-[#5EEAD4]",
  Fair: "text-[#8A6D1D] dark:text-[#E8C766]",
  Poor: "text-red-600 dark:text-red-400",
};

const categories = [
  "All Categories",
  "Medical Equipment",
  "IT Equipment",
  "Lab Equipment",
  "Furniture",
  "Vehicle",
];
const statuses = [
  "All Status",
  "In Use",
  "Idle",
  "Under Maintenance",
  "Retired",
];

/* --------------------------------- Page -------------------------------- */

export default function AssetsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [openMenuId, setOpenMenuId] = useState(null);

  const filtered = dummyAssets.filter((a) => {
    const matchesQuery = `${a.name} ${a.assetId} ${a.location}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      category === "All Categories" || a.category === category;
    const matchesStatus = status === "All Status" || a.status === status;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Assets
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Assets
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Track equipment, inventory value, and asset status.
          </p>
        </div>

        <Link
          href="/assets/add"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
          "
        >
          <Plus size={17} />
          Add Asset
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
            placeholder="Search asset..."
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
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

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((a) => (
          <div
            key={a.assetId}
            className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                  <Boxes size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#17201D] dark:text-white">
                    {a.name}
                  </p>
                  <p className="text-xs text-[#87938E]">{a.assetId}</p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === a.assetId ? null : a.assetId)
                  }
                  className="rounded-lg p-1.5 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                >
                  <MoreVertical size={17} />
                </button>

                {openMenuId === a.assetId && (
                  <div className="absolute right-0 top-9 z-10 w-40 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                    <Link
                      href={`/assets/${a.assetId}/edit`}
                      className="block px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/assets/maintenance/add?assetId=${a.assetId}`}
                      className="block px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                    >
                      Schedule Maintenance
                    </Link>
                    <button className="block w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                      Retire Asset
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                <Tag size={11} />
                {a.category}
              </span>
              <span
                className={`rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold dark:bg-white/10 ${conditionStyles[a.condition]}`}
              >
                {a.condition} condition
              </span>
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                <MapPin size={13} className="text-[#8A9691]" />
                <span className="truncate">{a.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                <Calendar size={13} className="text-[#8A9691]" />
                <span>Purchased {a.purchaseDate}</span>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
              <p className="text-[11px] text-[#87938E]">Asset Value</p>
              <p className="mt-0.5 font-bold text-[#17201D] dark:text-white">
                ₹{a.value.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#EEECE5] pt-3 dark:border-white/10">
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[a.status]}`}
              >
                {a.status}
              </span>

              <Link
                href={`/assets/${a.assetId}`}
                className="text-xs font-semibold text-[#0F766E] hover:underline dark:text-[#5EEAD4]"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-[#87938E]">
            No assets found.
          </p>
        )}
      </div>
    </div>
  );
}
