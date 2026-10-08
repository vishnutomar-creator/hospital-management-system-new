"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Tag,
  MapPin,
  Calendar,
  IndianRupee,
  Building2,
  ShieldCheck,
  Image as ImageIcon,
  X,
} from "lucide-react";

const categories = [
  "Medical Equipment",
  "IT Equipment",
  "Lab Equipment",
  "Furniture",
  "Vehicle",
];

const conditions = ["Good", "Fair", "Poor"];
const statuses = ["In Use", "Idle", "Under Maintenance", "Retired"];

function Field({ label, htmlFor, required, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-[#17201D] dark:text-white"
      >
        {label}
        {required && <span className="ml-0.5 text-[#0F766E]">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClasses = `
  w-full rounded-xl border border-[#E3E0D7]
  bg-[#FAFAF7] px-3.5 py-2.5 text-sm
  text-[#17201D] outline-none
  placeholder:text-[#9AA49F]
  focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
  dark:border-white/10 dark:bg-[#202B27] dark:text-white
  dark:placeholder:text-[#71817B]
`;

const inputWithIconClasses = `${inputClasses} pl-10`;

function Section({ icon: Icon, title, description, children }) {
  return (
    <div className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
          <Icon size={18} />
        </div>
        <div>
          <p className="font-bold text-[#17201D] dark:text-white">{title}</p>
          <p className="text-xs text-[#87938E]">{description}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

export default function AddAssetPage() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    serialNumber: "",
    condition: "Good",
    status: "In Use",
    department: "",
    location: "",
    vendor: "",
    purchaseDate: "",
    warrantyExpiry: "",
    value: "",
    notes: "",
  });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this up to your create-asset API call.
    console.log("New asset payload:", form);
  };

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
          Add Asset
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Add Asset
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Register a new asset into the hospital's inventory.
          </p>
        </div>

        <Link
          href="/assets"
          className="
            flex items-center justify-center gap-2
            rounded-xl border border-[#E3E0D7] bg-white px-4 py-2.5
            text-sm font-semibold text-[#52615B]
            transition hover:bg-[#F1F3EF]
            dark:border-white/10 dark:bg-[#17201D] dark:text-[#AAB6B0] dark:hover:bg-white/10
          "
        >
          <X size={16} />
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo */}
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-dashed border-[#DDD9CE] bg-[#FAFAF7] text-[#8A9691] dark:border-white/10 dark:bg-[#202B27]">
              <ImageIcon size={24} />
            </div>
            <div>
              <button
                type="button"
                className="rounded-xl border border-[#E3E0D7] bg-white px-3.5 py-2 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:bg-[#17201D] dark:text-[#AAB6B0] dark:hover:bg-white/10"
              >
                Upload Photo
              </button>
              <p className="mt-2 text-xs text-[#87938E]">
                JPG or PNG, up to 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Asset Details */}
        <Section
          icon={Boxes}
          title="Asset Details"
          description="Identify and classify the asset"
        >
          <div className="sm:col-span-2">
            <Field label="Asset Name" htmlFor="name" required>
              <input
                id="name"
                value={form.name}
                onChange={update("name")}
                placeholder="e.g. MRI Scanner (3T)"
                className={inputClasses}
                required
              />
            </Field>
          </div>

          <Field label="Category" htmlFor="category" required>
            <div className="relative">
              <Tag
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
              />
              <select
                id="category"
                value={form.category}
                onChange={update("category")}
                className={inputWithIconClasses}
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Serial / Model Number" htmlFor="serialNumber">
            <input
              id="serialNumber"
              value={form.serialNumber}
              onChange={update("serialNumber")}
              placeholder="e.g. SN-58231-A"
              className={inputClasses}
            />
          </Field>

          <Field label="Condition" htmlFor="condition" required>
            <select
              id="condition"
              value={form.condition}
              onChange={update("condition")}
              className={inputClasses}
              required
            >
              {conditions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Status" htmlFor="status" required>
            <select
              id="status"
              value={form.status}
              onChange={update("status")}
              className={inputClasses}
              required
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </Section>

        {/* Location Details */}
        <Section
          icon={MapPin}
          title="Location Details"
          description="Where this asset is deployed"
        >
          <Field label="Department" htmlFor="department" required>
            <div className="relative">
              <Building2
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
              />
              <input
                id="department"
                value={form.department}
                onChange={update("department")}
                placeholder="e.g. Radiology"
                className={inputWithIconClasses}
                required
              />
            </div>
          </Field>

          <Field label="Room / Bay" htmlFor="location">
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
              />
              <input
                id="location"
                value={form.location}
                onChange={update("location")}
                placeholder="e.g. Room 204"
                className={inputWithIconClasses}
              />
            </div>
          </Field>
        </Section>

        {/* Purchase & Warranty */}
        <Section
          icon={IndianRupee}
          title="Purchase & Warranty"
          description="Procurement and coverage details"
        >
          <Field label="Vendor / Supplier" htmlFor="vendor">
            <input
              id="vendor"
              value={form.vendor}
              onChange={update("vendor")}
              placeholder="e.g. Siemens Healthineers"
              className={inputClasses}
            />
          </Field>

          <Field label="Asset Value" htmlFor="value" required>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8A9691]">
                ₹
              </span>
              <input
                id="value"
                type="number"
                min="0"
                value={form.value}
                onChange={update("value")}
                placeholder="0"
                className={inputWithIconClasses}
                required
              />
            </div>
          </Field>

          <Field label="Purchase Date" htmlFor="purchaseDate" required>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
              />
              <input
                id="purchaseDate"
                type="date"
                value={form.purchaseDate}
                onChange={update("purchaseDate")}
                className={inputWithIconClasses}
                required
              />
            </div>
          </Field>

          <Field label="Warranty Expiry" htmlFor="warrantyExpiry">
            <div className="relative">
              <ShieldCheck
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
              />
              <input
                id="warrantyExpiry"
                type="date"
                value={form.warrantyExpiry}
                onChange={update("warrantyExpiry")}
                className={inputWithIconClasses}
              />
            </div>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Notes" htmlFor="notes">
              <textarea
                id="notes"
                value={form.notes}
                onChange={update("notes")}
                placeholder="Any additional details about this asset"
                rows={3}
                className={`${inputClasses} resize-none`}
              />
            </Field>
          </div>
        </Section>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse gap-3 rounded-2xl border border-[#E5E2D9] bg-white p-4 sm:flex-row sm:items-center sm:justify-end dark:border-white/10 dark:bg-[#17201D]">
          <Link
            href="/assets"
            className="flex items-center justify-center rounded-xl border border-[#E3E0D7] bg-white px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:bg-[#17201D] dark:text-[#AAB6B0] dark:hover:bg-white/10"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center justify-center rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90"
          >
            Save Asset
          </button>
        </div>
      </form>
    </div>
  );
}
