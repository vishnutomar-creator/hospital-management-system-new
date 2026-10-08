"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  CalendarDays,
  ChevronRight,
  FileText,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";

export default function AddWardPage() {
  const [form, setForm] = useState({
    name: "",
    department: "",
    floor: "",
    type: "",
    totalBeds: "",
    headNurse: "",
    description: "",
    status: "Operational",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Ward Data:", form);

    // Backend connect later
    // await api.post("/wards", form);
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">

      {/* Header */}

      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>
          <div className="flex items-center gap-2 text-xs text-[#87938E]">
            <Link href="/wards" className="hover:text-[#0F766E]">
              Wards
            </Link>

            <ChevronRight size={13} />

            <span className="text-[#0F766E]">
              Add Ward
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
              <Building2 size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">
                Add Ward
              </h1>

              <p className="mt-1 text-sm text-[#7B8882]">
                Create and configure a new hospital ward.
              </p>
            </div>

          </div>
        </div>

        <Link
          href="/wards"
          className="flex w-fit items-center gap-2 rounded-xl border border-[#DDD9CE] bg-white px-4 py-2.5 text-sm font-semibold text-[#52615B] hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
        >
          <ArrowLeft size={16} />
          Back to Wards
        </Link>

      </div>


      <form onSubmit={handleSubmit}>

        {/* Basic Information */}

        <Section
          icon={<Building2 size={18} />}
          title="Ward Information"
          description="Basic details about the new ward."
        >

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            <Input
              label="Ward Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Cardiology Ward A"
              required
            />

            <Select
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              options={[
                "Cardiology",
                "Neurology",
                "Orthopedics",
                "Pediatrics",
                "General Medicine",
                "Critical Care",
                "Emergency",
                "Dermatology",
              ]}
            />

            <Select
              label="Ward Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              options={[
                "General",
                "Private",
                "Pediatric",
                "Critical Care",
                "Emergency",
                "Isolation",
              ]}
            />

            <Select
              label="Floor"
              name="floor"
              value={form.floor}
              onChange={handleChange}
              required
              options={[
                "Ground Floor",
                "1st Floor",
                "2nd Floor",
                "3rd Floor",
                "4th Floor",
                "5th Floor",
              ]}
            />

            <Input
              label="Total Bed Capacity"
              name="totalBeds"
              type="number"
              value={form.totalBeds}
              onChange={handleChange}
              placeholder="e.g. 40"
              required
            />

            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={[
                "Operational",
                "Maintenance",
                "Inactive",
              ]}
            />

          </div>

        </Section>


        {/* Staff */}

        <Section
          icon={<UserRound size={18} />}
          title="Ward Staff"
          description="Assign the responsible head nurse."
        >

          <div className="grid gap-5 md:grid-cols-2">

            <Select
              label="Head Nurse"
              name="headNurse"
              value={form.headNurse}
              onChange={handleChange}
              required
              options={[
                "Anjali Verma",
                "Priya Sharma",
                "Neha Singh",
                "Ritika Patel",
                "Kavita Joshi",
                "Megha Gupta",
                "Sneha Kapoor",
                "Pooja Mehta",
              ]}
            />

            <div className="flex items-center rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] p-4 dark:border-white/10 dark:bg-[#202B27]">

              <ShieldCheck
                size={18}
                className="mr-3 text-[#0F766E]"
              />

              <div>
                <p className="text-xs font-bold text-[#17201D] dark:text-white">
                  Staff Assignment
                </p>

                <p className="mt-1 text-[10px] text-[#87938E]">
                  The assigned nurse will manage daily ward operations.
                </p>
              </div>

            </div>

          </div>

        </Section>


        {/* Description */}

        <Section
          icon={<FileText size={18} />}
          title="Ward Description"
          description="Add additional information about this ward."
        >

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Enter ward description, facilities, special instructions..."
            className="w-full resize-none rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-3 text-xs text-[#17201D] outline-none placeholder:text-[#A1AAA6] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
          />

        </Section>


        {/* Bed Preview */}

        <div className="mb-6 rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#5367B8]">
              <BedDouble size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-[#17201D] dark:text-white">
                Bed Capacity
              </p>

              <p className="text-[10px] text-[#87938E]">
                New ward will start with all beds available.
              </p>
            </div>

          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">

            <InfoBox
              label="Total Beds"
              value={form.totalBeds || "0"}
            />

            <InfoBox
              label="Occupied"
              value="0"
            />

            <InfoBox
              label="Available"
              value={form.totalBeds || "0"}
            />

          </div>

        </div>


        {/* Actions */}

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

          <Link
            href="/wards"
            className="flex items-center justify-center rounded-xl border border-[#DDD9CE] bg-white px-6 py-3 text-sm font-semibold text-[#52615B] hover:bg-[#F4F3EE] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0B625C]"
          >
            <Save size={17} />
            Save Ward
          </button>

        </div>

      </form>

    </div>
  );
}


/* ================= SECTION ================= */

function Section({ icon, title, description, children }) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-[#E3E0D7] bg-white shadow-sm dark:border-white/10 dark:bg-[#18211E]">

      <div className="flex items-start gap-3 border-b border-[#EEECE5] px-5 py-4 dark:border-white/10">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
            {title}
          </h2>

          <p className="mt-0.5 text-[10px] text-[#87938E]">
            {description}
          </p>
        </div>

      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>

    </section>
  );
}


/* ================= INPUT ================= */

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
        {label}

        {required && (
          <span className="ml-1 text-[#D95C4F]">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-3 text-xs text-[#17201D] outline-none placeholder:text-[#A1AAA6] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
      />

    </div>
  );
}


/* ================= SELECT ================= */

function Select({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
        {label}

        {required && (
          <span className="ml-1 text-[#D95C4F]">*</span>
        )}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-3 text-xs text-[#52615B] outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
      >

        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}


/* ================= INFO BOX ================= */

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-[#FAFAF7] p-4 dark:bg-[#202B27]">

      <p className="text-[9px] text-[#9AA49F]">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-[#17201D] dark:text-white">
        {value}
      </p>

    </div>
  );
}