"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  CalendarX,
  Download,
} from "lucide-react";

/* ----------------------------- Dummy Data ----------------------------- */

const stats = [
  {
    label: "Total Appointments",
    value: "1,048",
    sub: "This month",
    icon: CalendarDays,
    tone: "teal",
  },
  {
    label: "Completed",
    value: "864",
    sub: "82% completion",
    icon: CheckCircle2,
    tone: "teal",
  },
  {
    label: "No-Shows",
    value: "97",
    sub: "9.3% of total",
    icon: XCircle,
    tone: "amber",
  },
  {
    label: "Cancelled",
    value: "87",
    sub: "8.3% of total",
    icon: CalendarX,
    tone: "amber",
  },
];

const byDepartment = [
  { label: "General Medicine", count: 312, pct: 100 },
  { label: "Cardiology", count: 241, pct: 77 },
  { label: "Orthopedics", count: 198, pct: 63 },
  { label: "Pediatrics", count: 164, pct: 53 },
  { label: "Gynecology", count: 133, pct: 43 },
];

const dummyAppointments = [
  {
    apptId: "APT-6601",
    patient: "Meera Joshi",
    doctor: "Dr. Ananya Rao",
    department: "Cardiology",
    date: "2026-08-22",
    time: "10:30 AM",
    status: "Completed",
  },
  {
    apptId: "APT-6602",
    patient: "Arjun Sethi",
    doctor: "Dr. Vivek Nanda",
    department: "Orthopedics",
    date: "2026-08-22",
    time: "11:15 AM",
    status: "Scheduled",
  },
  {
    apptId: "APT-6603",
    patient: "Kavya Reddy",
    doctor: "Dr. Shreya Iyer",
    department: "Gynecology",
    date: "2026-08-21",
    time: "03:00 PM",
    status: "No-show",
  },
  {
    apptId: "APT-6604",
    patient: "Devansh Kapoor",
    doctor: "Dr. Rohit Sharma",
    department: "General Medicine",
    date: "2026-08-21",
    time: "09:45 AM",
    status: "Completed",
  },
  {
    apptId: "APT-6605",
    patient: "Ishaan Bhatt",
    doctor: "Dr. Neha Kulkarni",
    department: "Pediatrics",
    date: "2026-08-20",
    time: "01:30 PM",
    status: "Cancelled",
  },
];

const statusStyles = {
  Completed:
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Scheduled:
    "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  "No-show": "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  Cancelled:
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
};

const ranges = ["This Week", "This Month", "This Quarter", "This Year"];

/* --------------------------------- Page -------------------------------- */

export default function AppointmentReportsPage() {
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
          Appointment Reports
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Appointment Reports
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Scheduled, completed, and no-show trends.
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
          Appointments by Department
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
            Recent Appointments
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] bg-[#FAFAF7] text-xs uppercase tracking-wide text-[#87938E] dark:border-white/10 dark:bg-[#202B27]">
                <th className="px-5 py-3 font-semibold">Patient</th>
                <th className="px-5 py-3 font-semibold">Doctor</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Date & Time</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyAppointments.map((a) => (
                <tr
                  key={a.apptId}
                  className="border-b border-[#EEECE5] last:border-0 dark:border-white/10"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold text-[#17201D] dark:text-white">
                      {a.patient}
                    </p>
                    <p className="text-xs text-[#87938E]">{a.apptId}</p>
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {a.doctor}
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {a.department}
                  </td>
                  <td className="px-5 py-3 text-[#52615B] dark:text-[#AAB6B0]">
                    {a.date} · {a.time}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[a.status]}`}
                    >
                      {a.status}
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
