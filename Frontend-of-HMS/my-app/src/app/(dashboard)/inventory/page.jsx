"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreVertical,
  Package,
  Boxes,
  AlertTriangle,
  Wallet,
  Truck,
} from "lucide-react";

const stats = [
  {
    label: "Total Items",
    value: "312",
    sub: "Catalog items",
    icon: Boxes,
    tone: "teal",
  },
  {
    label: "In Stock Units",
    value: "14,860",
    sub: "Total quantity",
    icon: Package,
    tone: "teal",
  },
  {
    label: "Low Stock Items",
    value: "21",
    sub: "Below reorder level",
    icon: AlertTriangle,
    tone: "amber",
  },
  {
    label: "Inventory Value",
    value: "₹22.6L",
    sub: "At current stock",
    icon: Wallet,
    tone: "teal",
  },
];

const dummyItems = [
  {
    itemId: "INV-201",
    name: "Disposable Syringes 5ml",
    category: "Consumables",
    stock: 3200,
    reorderLevel: 1000,
    capacity: 5000,
    unitPrice: 4.5,
    supplier: "MedCore Supplies",
    expiryDate: "2027-11-01",
    status: "In Stock",
  },
  {
    itemId: "INV-202",
    name: "Surgical Gloves (Box of 100)",
    category: "PPE",
    stock: 180,
    reorderLevel: 200,
    capacity: 800,
    unitPrice: 210,
    supplier: "Sunrise Pharma Distributors",
    expiryDate: "2028-01-15",
    status: "Low Stock",
  },
  {
    itemId: "INV-203",
    name: "IV Fluid - Normal Saline 500ml",
    category: "Fluids",
    stock: 940,
    reorderLevel: 300,
    capacity: 1200,
    unitPrice: 32,
    supplier: "Wellness Meditrade",
    expiryDate: "2026-09-10",
    status: "Expiring Soon",
  },
  {
    itemId: "INV-204",
    name: "N95 Masks (Box of 20)",
    category: "PPE",
    stock: 60,
    reorderLevel: 150,
    capacity: 500,
    unitPrice: 480,
    supplier: "MedCore Supplies",
    expiryDate: "2027-05-20",
    status: "Low Stock",
  },
  {
    itemId: "INV-205",
    name: "Suture Kit - Sterile",
    category: "Surgical",
    stock: 410,
    reorderLevel: 100,
    capacity: 600,
    unitPrice: 145,
    supplier: "Sunrise Pharma Distributors",
    expiryDate: "2026-08-28",
    status: "Expiring Soon",
  },
  {
    itemId: "INV-206",
    name: "Digital Thermometer",
    category: "Equipment",
    stock: 85,
    reorderLevel: 30,
    capacity: 120,
    unitPrice: 320,
    supplier: "Wellness Meditrade",
    expiryDate: null,
    status: "In Stock",
  },
];

const statusStyles = {
  "In Stock":
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  "Low Stock":
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  "Expiring Soon":
    "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const categories = [
  "All Categories",
  "Consumables",
  "PPE",
  "Fluids",
  "Surgical",
  "Equipment",
];
const statuses = ["All Status", "In Stock", "Low Stock", "Expiring Soon"];

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [openMenuId, setOpenMenuId] = useState(null);

  const filtered = dummyItems.filter((i) => {
    const matchesQuery = `${i.name} ${i.itemId} ${i.supplier}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      category === "All Categories" || i.category === category;
    const matchesStatus = status === "All Status" || i.status === status;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Inventory
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage hospital stock, consumables, and equipment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/inventory/low-stock"
            className="
              flex items-center justify-center gap-2
              rounded-xl border border-[#DDD9CE] px-4 py-2.5
              text-sm font-semibold text-[#52615B]
              transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E]
              dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20
            "
          >
            <AlertTriangle size={16} />
            Low Stock
          </Link>

          <Link
            href="/inventory/expired"
            className="
              flex items-center justify-center gap-2
              rounded-xl border border-[#DDD9CE] px-4 py-2.5
              text-sm font-semibold text-[#52615B]
              transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E]
              dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20
            "
          >
            <Package size={16} />
            Expired
          </Link>

          <Link
            href="/inventory/add"
            className="
              flex items-center justify-center gap-2
              rounded-xl bg-[#0F766E] px-4 py-2.5
              text-sm font-semibold text-white
              transition hover:bg-[#0F766E]/90
            "
          >
            <Plus size={17} />
            Add Item
          </Link>
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
            placeholder="Search inventory..."
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

      {/* Item Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((i) => {
          const stockPct = Math.round((i.stock / i.capacity) * 100);

          return (
            <div
              key={i.itemId}
              className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[#17201D] dark:text-white">
                      {i.name}
                    </p>
                    <p className="text-xs text-[#87938E]">{i.itemId}</p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === i.itemId ? null : i.itemId)
                    }
                    className="rounded-lg p-1.5 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                  >
                    <MoreVertical size={17} />
                  </button>

                  {openMenuId === i.itemId && (
                    <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                      <Link
                        href={`/inventory/${i.itemId}/edit`}
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

              {/* Badge */}
              <div className="mt-3">
                <span className="rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                  {i.category}
                </span>
              </div>

              {/* Stock Bar */}
              <div className="mt-4 rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#17201D] dark:text-white">
                    <Boxes size={13} className="text-[#8A9691]" />
                    Stock Level
                  </div>
                  <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">
                    {stockPct}%
                  </span>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EEECE5] dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#0F766E]"
                    style={{ width: `${stockPct}%` }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-3 text-center text-xs">
                  <div>
                    <p className="text-[#87938E]">In Stock</p>
                    <p className="font-bold text-[#17201D] dark:text-white">
                      {i.stock}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#87938E]">Reorder At</p>
                    <p className="font-bold text-[#17201D] dark:text-white">
                      {i.reorderLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#87938E]">Capacity</p>
                    <p className="font-bold text-[#17201D] dark:text-white">
                      {i.capacity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price + Expiry */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                  <p className="text-[11px] text-[#87938E]">Unit Price</p>
                  <p className="mt-0.5 font-bold text-[#17201D] dark:text-white">
                    ₹{i.unitPrice}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                  <p className="text-[11px] text-[#87938E]">Expiry</p>
                  <p className="mt-0.5 font-bold text-[#17201D] dark:text-white">
                    {i.expiryDate || "—"}
                  </p>
                </div>
              </div>

              {/* Supplier */}
              <div className="mt-3 flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                <Truck size={13} className="text-[#8A9691]" />
                <span className="truncate">{i.supplier}</span>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-[#EEECE5] pt-3 dark:border-white/10">
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[i.status]}`}
                >
                  {i.status}
                </span>

                <Link
                  href={`/inventory/${i.itemId}`}
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
            No inventory items found.
          </p>
        )}
      </div>
    </div>
  );
}
