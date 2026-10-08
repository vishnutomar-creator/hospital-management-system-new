"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  LogOut,
  BedDouble,
  Download,
} from "lucide-react";

/* ----------------------------- Dummy Data ----------------------------- */

const stats = [
  {
    label: "Total Patients",
    value: "4,286",
    sub: "All-time records",
    icon: Users,
    tone: "teal",
  },
  {
    label: "New Admissions",
    value: "132",
    sub: "This month",
    icon: UserPlus,
    tone: "teal",
  },
  {
    label: "Discharges",
    value: "118",
    sub: "This month",
    icon: LogOut,
    tone: "teal",
  },
  {
    label: "Avg. Stay",
    value: "3.4 days",
    sub: "Per admission",
    icon: BedDouble,
    tone: "amber",
  },
];

const byDepartment = [
  { label: "Cardiology", count: 68, pct: 100 },
  { label: "Orthopedics", count: 54, pct: 79 },
  { label: "General Medicine", count: 49, pct: 72 },
  { label: "Pediatrics", count: 37, pct: 54 },
  { label: "Gynecology", count: 28, pct: 41 },
];

const dummyPatients = [
  {
    patientId: "PT-8841",
    name: "Meera Joshi",
    department: "Cardiology",
    admitDate: "2026-08-15",
    dischargeDate: "2026-08-19",
    status: "Discharged",
  },
  {
    patientId: "PT-8842",
    name: "Arjun Sethi",
    department: "Orthopedics",
    admitDate: "2026-08-18",
    dischargeDate: null,
    status: "Admitted",
  },
  {
    patientId: "PT-8843",
    name: "Kavya Reddy",
    department: "Gynecology",
    admitDate: "2026-08-19",
    dischargeDate: null,
    status: "Admitted",
  },
  {
    patientId: "PT-8844",
    name: "Devansh Kapoor",
    department: "General Medicine",
    admitDate: "2026-08-10",
    dischargeDate: "2026-08-13",
    status: "Discharged",
  },
  {
    patientId: "PT-8845",
    name: "Ishaan Bhatt",
    department: "Pediatrics",
    admitDate: "2026-08-20",
    dischargeDate: null,
    status: "Admitted",
  },
];

const statusStyles = {
  Admitted:
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  Discharged:
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
};

const ranges = ["This Week", "This Month", "This Quarter", "This Year"];

/* --------------------------------- Page -------------------------------- */

export default function PatientReportsPage() {
  const [range, setRange] = useState("This Month");

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <Link href="/reports" className="hover:text-[#0F766E]">
          Reports
        </Link>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Patient Reports
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Patient Reports
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Admissions, discharges, and patient demographics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >
            {ranges.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>

          <button className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const iconBg =
            s.tone === "amber"
              ? "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]"
              : "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]";

          return (
            <div
              key={s.label}
              className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
                >
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#87938E]">{s.label}</p>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="text-2xl font-bold text-[#17201D] dark:text-white">
                  {s.value}
                </p>
                <p className="text-[11px] text-[#87938E]">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Breakdown */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]">
        <p className="font-bold text-[#17201D] dark:text-white">
          Patients by Department
        </p>
        <div className="mt-4 space-y-4">
          {byDepartment.map((d) => (
            <div key={d.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#52615B] dark:text-[#AAB6B0]">
                  {d.label}
                </span>
                <span className="font-semibold text-[#17201D] dark:text-white">
                  {d.count}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EEECE5] dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-[#0F766E]"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between border-b border-[#EEECE5] px-5 py-4 dark:border-white/10">
          <p className="font-bold text-[#17201D] dark:text-white">
            Recent Records
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] bg-[#FAFAF7] text-xs uppercase tracking-wide text-[#87938E] dark:border-white/10 dark:bg-[#202B27]">
                <th className="px-5 py-3 font-semibold">Patient</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Admitted</th>
                <th className="px-5 py-3 font-semibold">Discharged</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyPatients.map((p) => (
                <tr
                  key={p.patientId}
                  className="border-b border-[#EEECE5] last:border-0 dark:border-white/10"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold text-[#17201D] dark:text-white">
                      {p.name}
                    </p>
                    <p className="text-xs text-[#87938E]">{p.patientId}</p>
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {p.department}
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {p.admitDate}
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {p.dischargeDate ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
