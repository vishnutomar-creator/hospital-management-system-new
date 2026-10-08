"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowLeft,
  Package,
  Truck,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";

// Same catalog as the main inventory page — filtered here to items
// at or below their reorder level. TODO: replace with GET /api/inventory?status=low-stock
const dummyLowStockItems = [
  {
    itemId: "INV-202",
    name: "Surgical Gloves (Box of 100)",
    category: "PPE",
    stock: 180,
    reorderLevel: 200,
    unitPrice: 210,
    supplier: "Sunrise Pharma Distributors",
  },
  {
    itemId: "INV-204",
    name: "N95 Masks (Box of 20)",
    category: "PPE",
    stock: 60,
    reorderLevel: 150,
    unitPrice: 480,
    supplier: "MedCore Supplies",
  },
];

export default function LowStockInventoryPage() {
  const [query, setQuery] = useState("");

  const filtered = dummyLowStockItems.filter((i) =>
    `${i.name} ${i.itemId} ${i.supplier}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-[#DDD9CE] text-[#52615B]
              transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E]
              dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20
            "
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-xl font-bold text-[#17201D] dark:text-white">
              Low Stock Items
            </h1>
            <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
              Items at or below their reorder level
            </p>
          </div>
        </div>

        <Link
          href="/inventory/add"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
          "
        >
          Restock Item
        </Link>
      </div>

      {/* Card */}
      <div
        className="
          rounded-2xl border border-[#E5E2D9] bg-white
          dark:border-white/10 dark:bg-[#17201D]
        "
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-xs">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search low stock items..."
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

          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">
            {filtered.length} items
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Item</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Reorder Level</th>
                <th className="px-5 py-3">Unit Price</th>
                <th className="px-5 py-3">Supplier</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((i) => (
                <tr
                  key={i.itemId}
                  className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]">
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">
                          {i.name}
                        </p>
                        <p className="text-xs text-[#87938E]">{i.itemId}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    {i.category}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 font-semibold text-[#8A6D1D] dark:text-[#E8C766]">
                      <AlertTriangle size={13} />
                      {i.stock}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    {i.reorderLevel}
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    ₹{i.unitPrice}
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    <div className="flex items-center gap-1.5">
                      <Truck size={13} className="text-[#8A9691]" />
                      {i.supplier}
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      <button className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-[#87938E]"
                  >
                    No low stock items.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
