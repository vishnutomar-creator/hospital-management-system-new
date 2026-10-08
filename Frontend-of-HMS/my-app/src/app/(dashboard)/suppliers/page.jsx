"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreVertical,
  Building2,
  Truck,
  Package,
  FileText,
  Phone,
  MapPin,
} from "lucide-react";

const stats = [
  {
    label: "Total Suppliers",
    value: "18",
    sub: "Registered vendors",
    icon: Building2,
    tone: "teal",
  },
  {
    label: "Active Suppliers",
    value: "15",
    sub: "Currently supplying",
    icon: Truck,
    tone: "teal",
  },
  {
    label: "Items Supplied",
    value: "312",
    sub: "Across catalog",
    icon: Package,
    tone: "teal",
  },
  {
    label: "Pending Orders",
    value: "6",
    sub: "Purchase orders open",
    icon: FileText,
    tone: "amber",
  },
];

const dummySuppliers = [
  {
    supplierId: "SUP-01",
    name: "MedCore Supplies",
    contact: "+91 98200 11223",
    address: "Plot 14, Industrial Area, Pune",
    gstin: "27ABCDE1234F1Z5",
    itemsSupplied: 128,
    status: "Active",
  },
  {
    supplierId: "SUP-02",
    name: "Sunrise Pharma Distributors",
    contact: "+91 99887 44556",
    address: "Sector 21, Gandhinagar",
    gstin: "24PQRSX5678K1Z2",
    itemsSupplied: 96,
    status: "Active",
  },
  {
    supplierId: "SUP-03",
    name: "Wellness Meditrade",
    contact: "+91 90123 67890",
    address: "MG Road, Bengaluru",
    gstin: "29LMNOP9012Q1Z8",
    itemsSupplied: 88,
    status: "Active",
  },
  {
    supplierId: "SUP-04",
    name: "Apex Surgical Co.",
    contact: "+91 91234 55667",
    address: "Ashok Nagar, Nagpur",
    gstin: "27WXYZT3456R1Z1",
    itemsSupplied: 42,
    status: "Inactive",
  },
];

const statusStyles = {
  Active:
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Inactive:
    "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
};

const statuses = ["All Status", "Active", "Inactive"];

export default function SuppliersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [openMenuId, setOpenMenuId] = useState(null);

  const filtered = dummySuppliers.filter((s) => {
    const matchesQuery = `${s.name} ${s.supplierId} ${s.gstin}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus = status === "All Status" || s.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Suppliers
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Suppliers
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage vendors supplying pharmacy and inventory stock.
          </p>
        </div>

        <Link
          href="/suppliers/add"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
          "
        >
          <Plus size={17} />
          Add Supplier
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
            placeholder="Search suppliers..."
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

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((s) => (
          <div
            key={s.supplierId}
            className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#17201D] dark:text-white">
                    {s.name}
                  </p>
                  <p className="text-xs text-[#87938E]">{s.supplierId}</p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === s.supplierId ? null : s.supplierId
                    )
                  }
                  className="rounded-lg p-1.5 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                >
                  <MoreVertical size={17} />
                </button>

                {openMenuId === s.supplierId && (
                  <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                    <Link
                      href={`/suppliers/${s.supplierId}/edit`}
                      className="block px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                    >
                      Edit
                    </Link>
                    <button className="block w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Contact + Address */}
            <div className="mt-4 space-y-2 text-sm text-[#52615B] dark:text-[#AAB6B0]">
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-[#8A9691]" />
                {s.contact}
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 shrink-0 text-[#8A9691]" />
                <span>{s.address}</span>
              </div>
            </div>

            {/* GSTIN + Items */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                <p className="text-[11px] text-[#87938E]">GSTIN</p>
                <p className="mt-0.5 truncate text-xs font-bold text-[#17201D] dark:text-white">
                  {s.gstin}
                </p>
              </div>
              <div className="rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                <p className="text-[11px] text-[#87938E]">Items Supplied</p>
                <p className="mt-0.5 font-bold text-[#17201D] dark:text-white">
                  {s.itemsSupplied}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-[#EEECE5] pt-3 dark:border-white/10">
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[s.status]}`}
              >
                {s.status}
              </span>

              <Link
                href={`/suppliers/${s.supplierId}`}
                className="text-xs font-semibold text-[#0F766E] hover:underline dark:text-[#5EEAD4]"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-[#87938E]">
            No suppliers found.
          </p>
        )}
      </div>
    </div>
  );
}
