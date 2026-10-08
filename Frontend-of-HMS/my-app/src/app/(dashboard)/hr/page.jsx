"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Plus,
  MoreVertical,
  Users,
  UserCheck,
  CalendarOff,
  Wallet,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

/* ----------------------------- Nav ----------------------------- */

const navItems = [
  { href: "/hr", label: "Staff" },
  { href: "/hr/attendance", label: "Attendance" },
  { href: "/hr/leaves", label: "Leaves" },
  { href: "/hr/payroll", label: "Payroll" },
];

function HRNav() {
  const pathname = usePathname();

  return (
    <div className="flex w-full gap-1 overflow-x-auto rounded-2xl border border-[#E5E2D9] bg-white p-1 dark:border-white/10 dark:bg-[#17201D]">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition
              ${
                active
                  ? "bg-[#0F766E] text-white"
                  : "text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10"
              }
            `}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

/* ----------------------------- Dummy Data ----------------------------- */

const stats = [
  {
    label: "Total Staff",
    value: "186",
    sub: "Active employees",
    icon: Users,
    tone: "teal",
  },
  {
    label: "Present Today",
    value: "162",
    sub: "Checked in",
    icon: UserCheck,
    tone: "teal",
  },
  {
    label: "On Leave",
    value: "9",
    sub: "Approved leaves",
    icon: CalendarOff,
    tone: "amber",
  },
  {
    label: "Payroll Due",
    value: "₹18.6L",
    sub: "This month",
    icon: Wallet,
    tone: "teal",
  },
];

const dummyStaff = [
  {
    staffId: "STF-201",
    name: "Dr. Ananya Rao",
    role: "Consultant Cardiologist",
    department: "Cardiology",
    type: "Full-time",
    email: "ananya.rao@hospital.com",
    phone: "+91 98220 11423",
    joined: "2021-04-10",
    status: "Active",
  },
  {
    staffId: "STF-202",
    name: "Rahul Verma",
    role: "Staff Nurse",
    department: "Nursing",
    type: "Full-time",
    email: "rahul.verma@hospital.com",
    phone: "+91 90210 55671",
    joined: "2022-01-18",
    status: "Active",
  },
  {
    staffId: "STF-203",
    name: "Priya Nair",
    role: "HR Executive",
    department: "Administration",
    type: "Full-time",
    email: "priya.nair@hospital.com",
    phone: "+91 99870 34210",
    joined: "2020-11-02",
    status: "On Leave",
  },
  {
    staffId: "STF-204",
    name: "Sanjay Mehta",
    role: "Pharmacist",
    department: "Pharmacy",
    type: "Part-time",
    email: "sanjay.mehta@hospital.com",
    phone: "+91 93400 67821",
    joined: "2023-06-25",
    status: "Active",
  },
  {
    staffId: "STF-205",
    name: "Fatima Sheikh",
    role: "Housekeeping Supervisor",
    department: "Housekeeping",
    type: "Full-time",
    email: "fatima.sheikh@hospital.com",
    phone: "+91 98765 21098",
    joined: "2019-08-14",
    status: "Active",
  },
  {
    staffId: "STF-206",
    name: "Karan Malhotra",
    role: "Radiology Technician",
    department: "Radiology",
    type: "Full-time",
    email: "karan.malhotra@hospital.com",
    phone: "+91 91234 88760",
    joined: "2021-12-01",
    status: "Inactive",
  },
];

const staffStatusStyles = {
  Active:
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  "On Leave":
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  Inactive:
    "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
};

const staffStatuses = ["All Status", "Active", "On Leave", "Inactive"];
const departments = [
  "All Departments",
  "Cardiology",
  "Nursing",
  "Administration",
  "Pharmacy",
  "Housekeeping",
  "Radiology",
];

/* --------------------------------- Page -------------------------------- */

export default function HRPage() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Status");
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredStaff = dummyStaff.filter((s) => {
    const matchesQuery = `${s.name} ${s.staffId} ${s.role}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesDept =
      department === "All Departments" || s.department === department;
    const matchesStatus = status === "All Status" || s.status === status;
    return matchesQuery && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          HR
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Human Resources
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage staff, attendance, leaves, and payroll.
          </p>
        </div>

        <Link
          href="/hr/staff/add"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
          "
        >
          <Plus size={17} />
          Add Staff
        </Link>
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

      {/* Nav */}
      <HRNav />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E2D9] bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#17201D]">
        <div className="relative w-full max-w-xs">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search staff..."
            className="
              w-full rounded-xl border border-[#E3E0D7]
              bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm
              text-[#17201D] outline-none
              placeholder:text-[#9AA49F]
              focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
              dark:border-white/10 dark:bg-[#202B27] dark:text-white
              dark:placeholder:text-[#71817B]
            "
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >
            {staffStatuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredStaff.map((s) => (
          <div
            key={s.staffId}
            className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-sm font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                  {s.name
                    .replace("Dr. ", "")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <p className="font-bold text-[#17201D] dark:text-white">
                    {s.name}
                  </p>
                  <p className="text-xs text-[#87938E]">{s.role}</p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === s.staffId ? null : s.staffId)
                  }
                  className="rounded-lg p-1.5 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                >
                  <MoreVertical size={17} />
                </button>

                {openMenuId === s.staffId && (
                  <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                    <Link
                      href={`/hr/staff/${s.staffId}/edit`}
                      className="block px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                    >
                      Edit
                    </Link>
                    <button className="block w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                {s.department}
              </span>
              <span className="rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                {s.type}
              </span>
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                <Mail size={13} className="text-[#8A9691]" />
                <span className="truncate">{s.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                <Phone size={13} className="text-[#8A9691]" />
                <span>{s.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                <Building2 size={13} className="text-[#8A9691]" />
                <span>Joined {s.joined}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#EEECE5] pt-3 dark:border-white/10">
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${staffStatusStyles[s.status]}`}
              >
                {s.status}
              </span>

              <Link
                href={`/hr/staff/${s.staffId}`}
                className="text-xs font-semibold text-[#0F766E] hover:underline dark:text-[#5EEAD4]"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}

        {filteredStaff.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-[#87938E]">
            No staff found.
          </p>
        )}
      </div>
    </div>
  );
}
