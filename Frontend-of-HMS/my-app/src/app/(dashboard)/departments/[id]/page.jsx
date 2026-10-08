"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  BedDouble,
  Building2,
  CalendarDays,
  ChevronRight,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import { departmentAPI } from "../../../services/api";

export default function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDepartment() {
      if (!params?.id) return;

      try {
        let found = null;
        try {
          const res = await departmentAPI.getDepartmentById(params.id);
          if (res.success && res.data) found = res.data;
        } catch (_) {}

        if (!found) {
          const allRes = await departmentAPI.getDepartments();
          if (allRes.success && Array.isArray(allRes.data)) {
            found = allRes.data.find((d) => d.departmentId === params.id || d._id === params.id || d.id === params.id);
          }
        }

        if (found) {
          const d = found;
          setDepartment({
            id: d.departmentId || d._id || params.id,
            name: d.name || d.departmentName || "Department",
            description: d.description || "Comprehensive clinical and diagnostic care.",
            location: d.location || "Block A - 2nd Floor",
            head: d.head || d.headDoctor || "Dr. Department Head",
            doctors: d.doctorsCount || 15,
            nurses: d.nursesCount || 25,
            beds: d.bedsCount || 40,
            availableBeds: d.availableBeds || 12,
            patients: d.patientsCount || 65,
            status: d.isActive !== false ? "Active" : "Inactive",
            phone: d.phone || "+91 751 245 1001",
            email: d.email || "department@medicare.com",
          });
        }
      } catch (err) {
        console.warn("Department load notice:", err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDepartment();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm font-semibold text-[#87938E]">
        Loading department details...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#87938E]">
            <span>Hospital</span>
            <ChevronRight size={13} />
            <Link href="/departments" className="hover:underline">Departments</Link>
            <ChevronRight size={13} />
            <span className="text-[#0F766E]">{department?.id}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-[#17201D] dark:text-white">
            {department?.name} Department
          </h1>
        </div>

        <Link
          href="/departments"
          className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] bg-white px-4 py-2.5 text-sm font-semibold text-[#52615B] hover:border-[#0F766E] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
        >
          <ArrowLeft size={16} /> Back to Departments
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="rounded-2xl border border-[#E3E0D7] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]">
            <Building2 size={36} />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-[#17201D] dark:text-white">{department?.name}</h2>
              <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-bold text-[#0F766E]">
                {department?.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">{department?.description}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#52615B] dark:text-[#AAB6B0]">
              <span className="flex items-center gap-1.5 font-medium">
                <Building2 size={14} className="text-[#0F766E]" /> {department?.location}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <UserRound size={14} className="text-[#0F766E]" /> Head: {department?.head}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Doctors On Duty" value={department?.doctors} icon={<Stethoscope size={18} />} />
        <MetricCard label="Nursing Staff" value={department?.nurses} icon={<Users size={18} />} />
        <MetricCard label="Total Inpatient Beds" value={department?.beds} icon={<BedDouble size={18} />} />
        <MetricCard label="Beds Available" value={department?.availableBeds} icon={<Activity size={18} />} />
      </div>

      {/* Details & Contact Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <h3 className="text-sm font-bold text-[#17201D] dark:text-white">Contact & Extension</h3>
          <div className="mt-4 space-y-3 text-sm text-[#52615B] dark:text-[#AAB6B0]">
            <p className="flex items-center gap-2"><Phone size={16} className="text-[#0F766E]" /> {department?.phone}</p>
            <p className="flex items-center gap-2"><Mail size={16} className="text-[#0F766E]" /> {department?.email}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <h3 className="text-sm font-bold text-[#17201D] dark:text-white">Capacity & Availability</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              <span>Occupancy</span>
              <span>{department?.beds > 0 ? Math.round(((department.beds - department.availableBeds) / department.beds) * 100) : 0}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#EEF0EC] dark:bg-white/10">
              <div
                className="h-full rounded-full bg-[#0F766E]"
                style={{ width: `${department?.beds > 0 ? Math.round(((department.beds - department.availableBeds) / department.beds) * 100) : 0}%` }}
              />
            </div>
            <p className="text-[11px] text-[#87938E] mt-2">
              {department?.availableBeds} beds currently available for new admissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-[#17201D] dark:text-white">{value}</p>
          <p className="text-xs text-[#87938E]">{label}</p>
        </div>
      </div>
    </div>
  );
}
