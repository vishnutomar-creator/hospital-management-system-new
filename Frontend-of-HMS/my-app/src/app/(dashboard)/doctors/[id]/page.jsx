"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { doctorAPI } from "../../../services/api";

export default function DoctorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctor() {
      if (!params?.id) return;

      try {
        let found = null;
        try {
          const res = await doctorAPI.getDoctorById(params.id);
          if (res.success && res.data) found = res.data;
        } catch (_) {}

        if (!found) {
          const allRes = await doctorAPI.getDoctors();
          if (allRes.success && Array.isArray(allRes.data)) {
            found = allRes.data.find((d) => d.doctorId === params.id || d._id === params.id || d.id === params.id);
          }
        }

        if (found) {
          const d = found;
          setDoctor({
            id: d.doctorId || d._id || params.id,
            name: d.name || d.doctorName || "Dr. Specialist",
            specialization: d.specialization || "Cardiologist",
            department: d.department?.name || d.department || "Cardiology",
            experience: d.experience ? `${d.experience} Years` : "8 Years",
            phone: d.phone || "+91 98765 43210",
            email: d.email || "doctor@medicare.com",
            shift: d.shift || "Morning",
            status: d.availability || d.status || "Available",
          });
        }
      } catch (err) {
        console.warn("Doctor load error:", err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDoctor();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm font-semibold text-[#87938E]">
        Loading doctor profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">Doctor Profile</h1>
          <p className="text-xs text-[#87938E]">Doctor ID: {doctor?.id}</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/doctors"
            className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] bg-white px-4 py-2.5 text-sm font-semibold text-[#52615B] hover:border-[#0F766E] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
          >
            <ArrowLeft size={16} /> Back
          </Link>

          <Link
            href={`/doctors/${doctor?.id}/edit`}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B625C]"
          >
            <Edit size={16} /> Edit Doctor
          </Link>
        </div>
      </div>

      {/* Profile Hero */}
      <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#18211E]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#E7F5F2] text-xl font-bold text-[#0F766E]">
            {(doctor?.name || "Dr").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-[#17201D] dark:text-white">{doctor?.name}</h2>
              <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/15 dark:text-[#5EEAD4]">
                {doctor?.status}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-[#0F766E]">{doctor?.specialization}</p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#87938E]">
              <span className="flex items-center gap-1"><Stethoscope size={14} className="text-[#0F766E]" />{doctor?.department}</span>
              <span className="flex items-center gap-1"><Clock3 size={14} className="text-[#0F766E]" />{doctor?.shift} Shift</span>
              <span className="flex items-center gap-1"><CalendarDays size={14} className="text-[#0F766E]" />{doctor?.experience}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Professional Info */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <h3 className="text-sm font-bold text-[#17201D] dark:text-white">Contact Info</h3>
          <div className="mt-4 space-y-3 text-sm text-[#52615B] dark:text-[#AAB6B0]">
            <p className="flex items-center gap-2"><Mail size={16} className="text-[#0F766E]" /> {doctor?.email}</p>
            <p className="flex items-center gap-2"><Phone size={16} className="text-[#0F766E]" /> {doctor?.phone}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <h3 className="text-sm font-bold text-[#17201D] dark:text-white">Department Details</h3>
          <div className="mt-4 space-y-2 text-sm text-[#52615B] dark:text-[#AAB6B0]">
            <p><span className="font-semibold">Department:</span> {doctor?.department}</p>
            <p><span className="font-semibold">Specialization:</span> {doctor?.specialization}</p>
            <p><span className="font-semibold">Experience:</span> {doctor?.experience}</p>
          </div>
        </div>
      </div>
    </div>
  );
}