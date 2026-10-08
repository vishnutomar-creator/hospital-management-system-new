"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Save } from "lucide-react";
import { departmentAPI } from "../../../services/api";

export default function AddDepartmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    departmentId: `DEP-00${Math.floor(10 + Math.random() * 90)}`,
    description: "",
    location: "Block A - 1st Floor",
    head: "",
    phone: "",
    email: "",
    bedsCount: "30",
    availableBeds: "10",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newDeptObj = {
      id: form.departmentId,
      departmentId: form.departmentId,
      name: form.name,
      departmentName: form.name,
      description: form.description || "Hospital clinical department",
      location: form.location,
      head: form.head || "Dr. Department Head",
      doctors: 12,
      nurses: 20,
      beds: Number(form.bedsCount) || 30,
      availableBeds: Number(form.availableBeds) || 10,
      patients: 25,
      status: form.isActive ? "Active" : "Inactive",
      phone: form.phone || "+91 751 245 1000",
      email: form.email || `${form.name.toLowerCase().replace(/\s+/g, "")}@medicare.com`,
      color: "bg-[#E7F5F2] text-[#0F766E]",
    };

    try {
      await departmentAPI.createDepartment({
        departmentId: form.departmentId,
        name: form.name,
        description: form.description,
        location: form.location,
        headDoctor: form.head,
        phone: form.phone,
        email: form.email,
        bedsCount: Number(form.bedsCount) || 30,
        availableBeds: Number(form.availableBeds) || 10,
        isActive: form.isActive,
      });
    } catch (err) {
      console.warn("Department API creation notice:", err.message);
    } finally {
      setLoading(false);
      router.push("/departments");
    }
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-7">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/departments"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Add New Department</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Register a new hospital department and assign resources
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#E5E2D9] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#17201D]"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Department Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Department Name *
            </label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Cardiology, Neurology"
              className={inputClass}
            />
          </div>

          {/* Department Code / ID */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Department Code *
            </label>
            <input
              required
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Location / Block */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Location / Block
            </label>
            <select name="location" value={form.location} onChange={handleChange} className={inputClass}>
              <option>Block A - 1st Floor</option>
              <option>Block A - 2nd Floor</option>
              <option>Block B - Ground Floor</option>
              <option>Block B - 3rd Floor</option>
              <option>Block C - 1st Floor</option>
              <option>Emergency Block - Ground Floor</option>
            </select>
          </div>

          {/* Head Doctor */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Department Head
            </label>
            <input
              name="head"
              value={form.head}
              onChange={handleChange}
              placeholder="e.g. Dr. Ankit Sharma"
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Contact Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 751 245 1001"
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Contact Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="cardiology@medicare.com"
              className={inputClass}
            />
          </div>

          {/* Beds Count */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Total Beds
            </label>
            <input
              type="number"
              min="0"
              name="bedsCount"
              value={form.bedsCount}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Available Beds */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Available Beds
            </label>
            <input
              type="number"
              min="0"
              name="availableBeds"
              value={form.availableBeds}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Department Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief summary of services and specialty care provided by this department"
              className={inputClass}
            />
          </div>
        </div>

        {/* Status Checkbox */}
        <div className="mt-5 flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-[#DDD9CE] text-[#0F766E] focus:ring-[#0F766E]"
          />
          <label htmlFor="isActive" className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
            Mark department as active and operational
          </label>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link
            href="/departments"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:text-[#AAB6B0]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]"
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save Department"}
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
