"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useState } from "react";

export default function AddNursePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    qualification: "",
    licenseNumber: "",
    experience: "",
    department: "",
    ward: "",
    shift: "",
    joiningDate: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Nurse Data:", form);

    // API integration baad me:
    // await api.post("/nurses", form);
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">

      {/* ================= HEADER ================= */}

      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-2 text-xs text-[#87938E]">
            <Link
              href="/nurses"
              className="transition hover:text-[#0F766E]"
            >
              Nurses
            </Link>

            <ChevronRight size={13} />

            <span className="text-[#0F766E]">
              Add Nurse
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
              <UserRound size={21} />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">
                Add Nurse
              </h1>

              <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
                Register a new nursing staff member.
              </p>

            </div>

          </div>

        </div>

        <Link
          href="/nurses"
          className="flex w-fit items-center gap-2 rounded-xl border border-[#DDD9CE] bg-white px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
        >
          <ArrowLeft size={16} />
          Back to Nurses
        </Link>

      </div>


      {/* ================= FORM ================= */}

      <form onSubmit={handleSubmit}>

        {/* PERSONAL INFORMATION */}

        <FormSection
          icon={<UserRound size={18} />}
          title="Personal Information"
          description="Basic information about the nurse."
        >

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />

            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />

            <Select
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={[
                "Male",
                "Female",
                "Other",
              ]}
            />

            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              icon={<CalendarDays size={15} />}
            />

            <Input
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              icon={<Phone size={15} />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nurse@medicare.com"
              icon={<Mail size={15} />}
              required
            />

          </div>

        </FormSection>


        {/* PROFESSIONAL INFORMATION */}

        <FormSection
          icon={<Stethoscope size={18} />}
          title="Professional Information"
          description="Qualification, license and nursing experience."
        >

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            <Select
              label="Qualification"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              options={[
                "GNM",
                "B.Sc Nursing",
                "M.Sc Nursing",
                "ANM",
                "Post Basic B.Sc Nursing",
              ]}
              required
            />

            <Input
              label="Nursing License Number"
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleChange}
              placeholder="Enter license number"
              icon={<ShieldCheck size={15} />}
              required
            />

            <Select
              label="Experience"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              options={[
                "0 - 1 Years",
                "1 - 3 Years",
                "3 - 5 Years",
                "5 - 10 Years",
                "10+ Years",
              ]}
            />

          </div>

        </FormSection>


        {/* WORK ASSIGNMENT */}

        <FormSection
          icon={<Clock3 size={18} />}
          title="Work Assignment"
          description="Assign department, ward and working shift."
        >

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            <Select
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              options={[
                "Cardiology",
                "Neurology",
                "Orthopedics",
                "Pediatrics",
                "General Medicine",
                "Emergency",
                "Radiology",
                "Dermatology",
              ]}
              required
            />

            <Select
              label="Ward / Unit"
              name="ward"
              value={form.ward}
              onChange={handleChange}
              options={[
                "Ward A-101",
                "Ward A-201",
                "Ward A-302",
                "Ward B-201",
                "Ward B-305",
                "Ward C-102",
                "Emergency Unit",
                "Diagnostic Unit",
              ]}
              required
            />

            <Select
              label="Working Shift"
              name="shift"
              value={form.shift}
              onChange={handleChange}
              options={[
                "Morning",
                "Evening",
                "Night",
              ]}
              required
            />

            <Input
              label="Joining Date"
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
              icon={<CalendarDays size={15} />}
              required
            />

          </div>

        </FormSection>


        {/* ADDRESS */}

        <FormSection
          icon={<FileText size={18} />}
          title="Address"
          description="Residential address of the nurse."
        >

          <div className="grid gap-5">

            <Textarea
              label="Full Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter complete residential address..."
            />

          </div>

        </FormSection>


        {/* EMERGENCY CONTACT */}

        <FormSection
          icon={<Phone size={18} />}
          title="Emergency Contact"
          description="Person to contact in case of an emergency."
        >

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            <Input
              label="Contact Name"
              name="emergencyName"
              value={form.emergencyName}
              onChange={handleChange}
              placeholder="Enter contact name"
            />

            <Input
              label="Contact Phone"
              name="emergencyPhone"
              value={form.emergencyPhone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              icon={<Phone size={15} />}
            />

            <Select
              label="Relationship"
              name="emergencyRelation"
              value={form.emergencyRelation}
              onChange={handleChange}
              options={[
                "Father",
                "Mother",
                "Spouse",
                "Brother",
                "Sister",
                "Other",
              ]}
            />

          </div>

        </FormSection>


        {/* ================= ACTIONS ================= */}

        <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">

          <Link
            href="/nurses"
            className="flex items-center justify-center rounded-xl border border-[#DDD9CE] bg-white px-6 py-3 text-sm font-semibold text-[#52615B] transition hover:bg-[#F4F3EE] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B625C]"
          >
            <Save size={17} />
            Save Nurse
          </button>

        </div>

      </form>

    </div>
  );
}


/* ============================================================
   FORM SECTION
============================================================ */

function FormSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-[#E3E0D7] bg-white shadow-sm dark:border-white/10 dark:bg-[#18211E]">

      <div className="flex items-start gap-3 border-b border-[#EEECE5] px-5 py-4 sm:px-6 dark:border-white/10">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
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


/* ============================================================
   INPUT
============================================================ */

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
        {label}

        {required && (
          <span className="ml-1 text-[#D95C4F]">
            *
          </span>
        )}
      </label>

      <div className="relative">

        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA49F]">
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-3 text-xs text-[#17201D] outline-none transition placeholder:text-[#A1AAA6] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white ${
            icon ? "pl-10 pr-4" : "px-4"
          }`}
        />

      </div>

    </div>
  );
}


/* ============================================================
   SELECT
============================================================ */

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
          <span className="ml-1 text-[#D95C4F]">
            *
          </span>
        )}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-3 text-xs text-[#52615B] outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}


/* ============================================================
   TEXTAREA
============================================================ */

function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-3 text-xs text-[#17201D] outline-none transition placeholder:text-[#A1AAA6] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
      />

    </div>
  );
}