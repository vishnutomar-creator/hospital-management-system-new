"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  IndianRupee,
  Image as ImageIcon,
  X,
} from "lucide-react";

const departments = [
  "Cardiology",
  "Nursing",
  "Administration",
  "Pharmacy",
  "Housekeeping",
  "Radiology",
];

const employmentTypes = ["Full-time", "Part-time", "Contract", "Intern"];
const genders = ["Male", "Female", "Other"];

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

export default function AddStaffPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    role: "",
    employmentType: "Full-time",
    joiningDate: "",
    reportingTo: "",
    basicSalary: "",
    allowances: "",
    bankAccount: "",
    ifsc: "",
  });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this up to your create-staff API call.
    console.log("New staff payload:", form);
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <Link href="/hr" className="hover:text-[#0F766E]">
          HR
        </Link>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Add Staff
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Add Staff
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Add a new employee to the hospital's HR records.
          </p>
        </div>

        <Link
          href="/hr"
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
        {/* Photo + basic identity */}
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
                JPG or PNG, up to 2MB. Square image recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <Section
          icon={User}
          title="Personal Details"
          description="Basic identity information"
        >
          <Field label="First Name" htmlFor="firstName" required>
            <input
              id="firstName"
              value={form.firstName}
              onChange={update("firstName")}
              placeholder="e.g. Ananya"
              className={inputClasses}
              required
            />
          </Field>

          <Field label="Last Name" htmlFor="lastName" required>
            <input
              id="lastName"
              value={form.lastName}
              onChange={update("lastName")}
              placeholder="e.g. Rao"
              className={inputClasses}
              required
            />
          </Field>

          <Field label="Gender" htmlFor="gender">
            <select
              id="gender"
              value={form.gender}
              onChange={update("gender")}
              className={inputClasses}
            >
              <option value="">Select gender</option>
              {genders.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>

          <Field label="Date of Birth" htmlFor="dob">
            <input
              id="dob"
              type="date"
              value={form.dob}
              onChange={update("dob")}
              className={inputClasses}
            />
          </Field>
        </Section>

        {/* Contact Details */}
        <Section
          icon={Phone}
          title="Contact Details"
          description="How to reach this employee"
        >
          <Field label="Email Address" htmlFor="email" required>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
              />
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="name@hospital.com"
                className={inputWithIconClasses}
                required
              />
            </div>
          </Field>

          <Field label="Phone Number" htmlFor="phone" required>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
              />
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                placeholder="+91 98220 11423"
                className={inputWithIconClasses}
                required
              />
            </div>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Address" htmlFor="address">
              <textarea
                id="address"
                value={form.address}
                onChange={update("address")}
                placeholder="Street, city, state, PIN code"
                rows={2}
                className={`${inputClasses} resize-none`}
              />
            </Field>
          </div>
        </Section>

        {/* Employment Details */}
        <Section
          icon={BriefcaseBusiness}
          title="Employment Details"
          description="Role, department, and reporting line"
        >
          <Field label="Department" htmlFor="department" required>
            <div className="relative">
              <Building2
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
              />
              <select
                id="department"
                value={form.department}
                onChange={update("department")}
                className={inputWithIconClasses}
                required
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Job Role / Designation" htmlFor="role" required>
            <input
              id="role"
              value={form.role}
              onChange={update("role")}
              placeholder="e.g. Staff Nurse"
              className={inputClasses}
              required
            />
          </Field>

          <Field label="Employment Type" htmlFor="employmentType" required>
            <select
              id="employmentType"
              value={form.employmentType}
              onChange={update("employmentType")}
              className={inputClasses}
              required
            >
              {employmentTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Joining Date" htmlFor="joiningDate" required>
            <div className="relative">
              <CalendarDays
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
              />
              <input
                id="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={update("joiningDate")}
                className={inputWithIconClasses}
                required
              />
            </div>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Reporting To" htmlFor="reportingTo">
              <input
                id="reportingTo"
                value={form.reportingTo}
                onChange={update("reportingTo")}
                placeholder="e.g. Dr. Ananya Rao"
                className={inputClasses}
              />
            </Field>
          </div>
        </Section>

        {/* Payroll Details */}
        <Section
          icon={IndianRupee}
          title="Payroll Details"
          description="Used to generate this employee's payroll"
        >
          <Field label="Basic Salary" htmlFor="basicSalary" required>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8A9691]">
                ₹
              </span>
              <input
                id="basicSalary"
                type="number"
                min="0"
                value={form.basicSalary}
                onChange={update("basicSalary")}
                placeholder="0"
                className={inputWithIconClasses}
                required
              />
            </div>
          </Field>

          <Field label="Allowances" htmlFor="allowances">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8A9691]">
                ₹
              </span>
              <input
                id="allowances"
                type="number"
                min="0"
                value={form.allowances}
                onChange={update("allowances")}
                placeholder="0"
                className={inputWithIconClasses}
              />
            </div>
          </Field>

          <Field label="Bank Account Number" htmlFor="bankAccount">
            <input
              id="bankAccount"
              value={form.bankAccount}
              onChange={update("bankAccount")}
              placeholder="Account number"
              className={inputClasses}
            />
          </Field>

          <Field label="IFSC Code" htmlFor="ifsc">
            <input
              id="ifsc"
              value={form.ifsc}
              onChange={update("ifsc")}
              placeholder="e.g. HDFC0001234"
              className={inputClasses}
            />
          </Field>
        </Section>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse gap-3 rounded-2xl border border-[#E5E2D9] bg-white p-4 sm:flex-row sm:items-center sm:justify-end dark:border-white/10 dark:bg-[#17201D]">
          <Link
            href="/hr"
            className="flex items-center justify-center rounded-xl border border-[#E3E0D7] bg-white px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:bg-[#17201D] dark:text-[#AAB6B0] dark:hover:bg-white/10"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center justify-center rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90"
          >
            Save Staff Member
          </button>
        </div>
      </form>
    </div>
  );
}
