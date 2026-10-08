"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseMedical,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { doctorAPI } from "../../../services/api";

export default function AddDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "Male",
    department: "Cardiology",
    specialization: "Cardiologist",
    licenseNumber: `DOC-LIC-${Math.floor(1000 + Math.random() * 9000)}`,
    experience: "5",
    shift: "Morning",
    status: "Available",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newDoctorObj = {
      doctorId,
      name: fullName,
      email: form.email,
      phone: form.phone,
      gender: form.gender || "Male",
      department: form.department,
      specialization: form.specialization,
      qualification: "MBBS, MD",
      experience: Number(form.experience) || 5,
      registrationNumber: form.licenseNumber || `REG-${Math.floor(10000 + Math.random() * 90000)}`,
      availability: form.status === "Available" ? "Available" : "Unavailable",
      shift: form.shift,
    };

    try {
      await doctorAPI.createDoctor(newDoctorObj);
    } catch (err) {
      console.warn("Doctor API creation notice:", err.message);
    } finally {
      setLoading(false);
      router.push("/doctors");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#87938E]">
            <span>Hospital</span>
            <ChevronRight size={13} />
            <span>Doctors</span>
            <ChevronRight size={13} />
            <span className="text-[#0F766E]">Add Doctor</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-[#17201D] dark:text-white">
            Add New Doctor
          </h1>
          <p className="mt-1 text-sm text-[#7B8882]">
            Register a doctor and add their professional details.
          </p>
        </div>

        <Link
          href="/doctors"
          className="flex items-center gap-2 text-sm font-semibold text-[#52615B] hover:text-[#0F766E] dark:text-[#AAB6B0]"
        >
          <ArrowLeft size={17} />
          Back to Doctors
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#18211E]">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
                <UserRound size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#17201D] dark:text-white">Personal Information</h2>
                <p className="mt-1 text-xs text-[#87938E]">Basic information about the doctor.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">First Name *</label>
                <input required name="firstName" value={form.firstName} onChange={handleChange} placeholder="Enter first name" className={inputClass} />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Last Name *</label>
                <input required name="lastName" value={form.lastName} onChange={handleChange} placeholder="Enter last name" className={inputClass} />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Email Address *</label>
                <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="doctor@medicare.com" className={inputClass} />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Phone Number *</label>
                <input required type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#18211E]">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
                <BriefcaseMedical size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#17201D] dark:text-white">Professional Information</h2>
                <p className="mt-1 text-xs text-[#87938E]">Specialization, department and license details.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Department *</label>
                <select name="department" value={form.department} onChange={handleChange} className={inputClass}>
                  {["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine", "Radiology"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Specialization *</label>
                <input required name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g. Cardiologist" className={inputClass} />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Experience (Years)</label>
                <input type="number" name="experience" value={form.experience} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                  <option>Available</option>
                  <option>On Duty</option>
                  <option>On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <Link
              href="/doctors"
              className="rounded-xl border border-[#DDD9CE] bg-white px-5 py-2.5 text-center text-sm font-semibold text-[#52615B] hover:border-[#0F766E] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0B625C]"
            >
              <Save size={17} />
              {loading ? "Saving..." : "Save Doctor"}
            </button>
          </div>
        </div>

        {/* Side Info */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
              <ShieldCheck size={21} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-[#17201D] dark:text-white">Registration Guidelines</h3>
            <ul className="mt-4 space-y-3 text-[11px] leading-5 text-[#87938E]">
              <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F766E]" />Assign correct department and specialization.</li>
              <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F766E]" />Use valid contact number for emergency duty notifications.</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-3 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white
`;