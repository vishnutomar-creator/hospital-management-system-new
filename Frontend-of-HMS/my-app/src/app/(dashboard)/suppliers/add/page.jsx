"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AddSupplierPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    gstin: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to POST /api/suppliers
    console.log("New supplier:", form);
    router.push("/suppliers");
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/suppliers"
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
            Add Supplier
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Register a new vendor
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
          {/* Supplier Name */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Supplier Name
            </label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. MedCore Supplies"
              className={inputClass}
            />
          </div>

          {/* Contact No */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Contact No.
            </label>
            <input
              required
              type="tel"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="+91 98200 11223"
              className={inputClass}
            />
          </div>

          {/* GSTIN */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              GSTIN
            </label>
            <input
              required
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
              placeholder="27ABCDE1234F1Z5"
              className={inputClass}
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Address
            </label>
            <textarea
              required
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              placeholder="Enter full address"
              className={inputClass}
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link
            href="/suppliers"
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
            Save Supplier
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
