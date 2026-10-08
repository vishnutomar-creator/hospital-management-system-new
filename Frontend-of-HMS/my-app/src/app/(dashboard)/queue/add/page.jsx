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

const doctors = [
  "Dr. Nikhil Rao",
  "Dr. Priya Menon",
  "Dr. Arjun Iyer",
  "Dr. Divya Kulkarni",
];

const departments = [
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "General Medicine",
  "Pediatrics",
];

export default function AddToQueuePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    patient: patients[0],
    doctor: doctors[0],
    department: departments[0],
    priority: "Normal",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to POST /api/queue
    console.log("Checked in to queue:", form);
    router.push("/queue");
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/queue"
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
            Add to Queue
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Check in a patient to the live queue
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

          {/* Doctor */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Doctor
            </label>
            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              className={inputClass}
            >
              {doctors.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Department
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className={inputClass}
            >
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Normal</option>
              <option>Urgent</option>
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
              placeholder="Reason for visit, symptoms, etc."
              className={inputClass}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link
            href="/queue"
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
            Check In
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