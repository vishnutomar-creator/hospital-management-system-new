"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const categories = ["Consumables", "PPE", "Fluids", "Surgical", "Equipment"];

const suppliers = [
  "MedCore Supplies",
  "Sunrise Pharma Distributors",
  "Wellness Meditrade",
];

export default function AddInventoryItemPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    category: categories[0],
    quantityInStock: "",
    reorderLevel: "",
    unitPrice: "",
    expiryDate: "",
    supplier: suppliers[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to POST /api/inventory
    console.log("New inventory item:", form);
    router.push("/inventory");
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
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
            Add Inventory Item
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Add a new item to hospital stock
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="
          rounded-2xl border border-[#E5E2D9] bg-white p-6
          dark:border-white/10 dark:bg-[#17201D]
        "
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Item Name */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Item Name
            </label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Disposable Syringes 5ml"
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Supplier */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Supplier
            </label>
            <select
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              className={inputClass}
            >
              {suppliers.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Quantity In Stock */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Quantity In Stock
            </label>
            <input
              required
              type="number"
              min="0"
              name="quantityInStock"
              value={form.quantityInStock}
              onChange={handleChange}
              placeholder="e.g. 3200"
              className={inputClass}
            />
          </div>

          {/* Reorder Level */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Reorder Level
            </label>
            <input
              required
              type="number"
              min="0"
              name="reorderLevel"
              value={form.reorderLevel}
              onChange={handleChange}
              placeholder="e.g. 1000"
              className={inputClass}
            />
          </div>

          {/* Unit Price */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Unit Price (₹)
            </label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              name="unitPrice"
              value={form.unitPrice}
              onChange={handleChange}
              placeholder="e.g. 4.50"
              className={inputClass}
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link
            href="/inventory"
            className="
              rounded-xl px-4 py-2.5 text-sm font-semibold
              text-[#52615B] transition hover:bg-[#F1F3EF]
              dark:text-[#AAB6B0] dark:hover:bg-white/10
            "
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="
              rounded-xl bg-[#0F766E] px-5 py-2.5
              text-sm font-semibold text-white
              transition hover:bg-[#0F766E]/90
            "
          >
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7]
  bg-[#FAFAF7] px-4 py-2.5 text-sm
  text-[#17201D] outline-none
  placeholder:text-[#9AA49F]
  focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
  dark:border-white/10 dark:bg-[#202B27] dark:text-white
  dark:placeholder:text-[#71817B]
`;
