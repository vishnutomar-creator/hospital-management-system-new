"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const patients = [
  "Aditi Sharma",
  "Rohan Verma",
  "Meera Nair",
  "Karan Malhotra",
  "Sneha Patil",
];

const testTypes = [
  "Lipid Profile",
  "HbA1c",
  "X-Ray Knee (Left)",
  "MRI Brain",
  "Allergy Panel",
  "Complete Blood Count",
  "Liver Function Test",
];

const collectors = [
  "Nurse Ritu Desai",
  "Nurse Farah Khan",
  "Radiographer Vivek Shah",
];

export default function AddSamplePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    patient: patients[0],
    testType: testTypes[0],
    collectedBy: collectors[0],
    collectionDate: "",
    status: "In Transit",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to POST /api/laboratory/samples
    console.log("New sample logged:", form);
    router.push("/laboratory/samples");
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/laboratory/samples"
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
            Log Sample
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Record a newly collected patient sample
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
          {/* Patient */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Patient
            </label>
            <select
              name="patient"
              value={form.patient}
              onChange={handleChange}
              className={inputClass}
            >
              {patients.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Test Type */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Test Type
            </label>
            <select
              name="testType"
              value={form.testType}
              onChange={handleChange}
              className={inputClass}
            >
              {testTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Collected By */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Collected By
            </label>
            <select
              name="collectedBy"
              value={form.collectedBy}
              onChange={handleChange}
              className={inputClass}
            >
              {collectors.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Collection Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Collection Date
            </label>
            <input
              required
              type="date"
              name="collectionDate"
              value={form.collectionDate}
              onChange={handleChange}
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
              <option>In Transit</option>
              <option>Received at Lab</option>
              <option>Processed</option>
            </select>
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Sample handling notes, container type, etc."
              className={inputClass}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link
            href="/laboratory/samples"
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
            Log Sample
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
