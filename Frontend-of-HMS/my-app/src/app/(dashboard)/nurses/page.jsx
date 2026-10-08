"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  CalendarDays,
  ChevronRight,
  Clock3,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  RefreshCw,
} from "lucide-react";
import { nurseAPI } from "../../services/api";

export default function NursesPage() {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [shiftFilter, setShiftFilter] = useState("All Shifts");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const loadNurses = async () => {
    setLoading(true);
    try {
      const res = await nurseAPI.getNurses();
      const raw = res?.data || (Array.isArray(res) ? res : []);
      const mapped = raw.map((n, idx) => {
        const name = n.Name || n.name || `Nurse ${idx + 1}`;
        const parts = name.trim().split(" ");
        const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();

        return {
          id: n._id || `NUR-${1000 + idx + 1}`,
          nurseId: n.licenseNumber || `NUR-${1000 + idx + 1}`,
          name,
          department: n.departmentId?.name || n.department || "General Medicine",
          ward: n.wardId?.wardName || n.ward || "General Ward",
          shift: n.shift || "Morning",
          experience: n.experience ? `${n.experience} Years` : "5 Years",
          phone: n.phone || "+91 98765 00000",
          email: n.email || "nurse@medicare.com",
          patients: n.assignedPatientsCount || Math.floor(4 + Math.random() * 6),
          status: n.status === "Active" ? "On Duty" : n.status === "OnLeave" ? "On Leave" : "Off Duty",
          initials,
        };
      });
      setNurses(mapped);
    } catch (err) {
      console.error("Error loading nurses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNurses();
  }, []);

  const filteredNurses = nurses.filter((nurse) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      nurse.name.toLowerCase().includes(q) ||
      nurse.id.toLowerCase().includes(q) ||
      nurse.department.toLowerCase().includes(q);

    const matchesDept =
      deptFilter === "All Departments" ||
      nurse.department.toLowerCase() === deptFilter.toLowerCase();

    const matchesShift =
      shiftFilter === "All Shifts" ||
      nurse.shift.toLowerCase() === shiftFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "All Status" ||
      nurse.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesDept && matchesShift && matchesStatus;
  });

  const totalNurses = nurses.length;
  const onDutyCount = nurses.filter((n) => n.status === "On Duty").length;
  const onLeaveCount = nurses.filter((n) => n.status === "On Leave").length;
  const totalPatientsAssigned = nurses.reduce((acc, n) => acc + (n.patients || 0), 0);

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">

      {/* ================= HEADER ================= */}

      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>

          <div className="flex items-center gap-2 text-xs text-[#87938E]">
            <span>Hospital</span>
            <ChevronRight size={13} />
            <span className="text-[#0F766E]">
              Nurses
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">
            Nurses
          </h1>

          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage nursing staff, shifts, wards and patient assignments.
          </p>

        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadNurses}
            className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-3.5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
          <Link
            href="/nurses/add"
            className="flex w-fit items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]"
          >
            <Plus size={17} />
            Add Nurse
          </Link>
        </div>

      </div>


      {/* ================= STATS ================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Nurses"
          value={totalNurses}
          subtitle="Registered staff"
          icon={<Users size={20} />}
          iconBg="bg-[#E7F5F2]"
          iconColor="text-[#0F766E]"
        />

        <StatCard
          title="On Duty"
          value={onDutyCount}
          subtitle="Currently working"
          icon={<Activity size={20} />}
          iconBg="bg-[#ECFDF5]"
          iconColor="text-[#0F766E]"
        />

        <StatCard
          title="On Leave"
          value={onLeaveCount}
          subtitle="Currently away"
          icon={<CalendarDays size={20} />}
          iconBg="bg-[#FFF3E8]"
          iconColor="text-[#C87924]"
        />

        <StatCard
          title="Patients Assigned"
          value={totalPatientsAssigned}
          subtitle="Active care assignments"
          icon={<UserRound size={20} />}
          iconBg="bg-[#EEF2FF]"
          iconColor="text-[#5367B8]"
        />

      </div>


      {/* ================= SEARCH / FILTER ================= */}

      <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-[360px]">

            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA49F]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search nurse by name, department, ID..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2.5 pl-10 pr-4 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
            />

          </div>


          <div className="flex flex-wrap gap-2">

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs font-medium text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
            >
              <option>All Departments</option>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Orthopedics</option>
              <option>Pediatrics</option>
              <option>Critical Care</option>
              <option>Emergency</option>
              <option>General Medicine</option>
            </select>


            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs font-medium text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
            >
              <option>All Shifts</option>
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
            </select>


            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs font-medium text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
            >
              <option>All Status</option>
              <option>On Duty</option>
              <option>Off Duty</option>
              <option>On Leave</option>
            </select>

          </div>

        </div>

      </div>


      {/* ================= NURSE TABLE ================= */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#E3E0D7] bg-white shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex items-center justify-between border-b border-[#EEECE5] px-5 py-4 dark:border-white/10">

          <div>

            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              Nursing Staff Directory
            </h2>

            <p className="mt-1 text-xs text-[#87938E]">
              {totalNurses} registered nurses
            </p>

          </div>

          <div className="hidden items-center gap-2 rounded-xl bg-[#ECFDF5] px-3 py-2 sm:flex">

            <ShieldCheck
              size={14}
              className="text-[#0F766E]"
            />

            <span className="text-[9px] font-bold text-[#0F766E]">
              Staff Verified
            </span>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead>

              <tr className="border-b border-[#EEECE5] dark:border-white/10">

                <TableHead>
                  Nurse
                </TableHead>

                <TableHead>
                  Department
                </TableHead>

                <TableHead>
                  Ward
                </TableHead>

                <TableHead>
                  Contact
                </TableHead>

                <TableHead>
                  Shift
                </TableHead>

                <TableHead>
                  Patients
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <th className="px-5 py-3" />

              </tr>

            </thead>


            <tbody>

              {filteredNurses.map((nurse) => (

                <tr
                  key={nurse.id}
                  className="border-b border-[#F0EEE8] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.02]"
                >

                  {/* Nurse */}

                  <td className="px-5 py-4">

                    <Link
                      href={`/nurses/${nurse.id}`}
                      className="flex items-center gap-3"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7F5F2] text-xs font-bold text-[#0F766E]">
                        {nurse.initials}
                      </div>

                      <div>

                        <p className="text-xs font-bold text-[#17201D] hover:text-[#0F766E] dark:text-white">
                          {nurse.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#87938E]">
                          {nurse.experience}
                        </p>

                        <p className="mt-0.5 text-[9px] text-[#A1AAA6]">
                          {nurse.id}
                        </p>

                      </div>

                    </Link>

                  </td>


                  {/* Department */}

                  <td className="px-5 py-4">

                    <p className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
                      {nurse.department}
                    </p>

                  </td>


                  {/* Ward */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F1F3EF] text-[#0F766E] dark:bg-white/5">
                        <Activity size={13} />
                      </div>

                      <span className="text-xs font-medium text-[#52615B] dark:text-[#AAB6B0]">
                        {nurse.ward}
                      </span>

                    </div>

                  </td>


                  {/* Contact */}

                  <td className="px-5 py-4">

                    <div className="space-y-1">

                      <p className="flex items-center gap-1.5 text-[10px] text-[#52615B] dark:text-[#AAB6B0]">
                        <Phone size={11} />
                        {nurse.phone}
                      </p>

                      <p className="flex items-center gap-1.5 text-[10px] text-[#87938E]">
                        <Mail size={11} />
                        {nurse.email}
                      </p>

                    </div>

                  </td>


                  {/* Shift */}

                  <td className="px-5 py-4">

                    <span className="flex items-center gap-1.5 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                      <Clock3 size={13} />
                      {nurse.shift}
                    </span>

                  </td>


                  {/* Patients */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <Users
                        size={14}
                        className="text-[#0F766E]"
                      />

                      <span className="text-xs font-bold text-[#17201D] dark:text-white">
                        {nurse.patients}
                      </span>

                    </div>

                  </td>


                  {/* Status */}

                  <td className="px-5 py-4">

                    <Status status={nurse.status} />

                  </td>


                  {/* Actions */}

                  <td className="px-5 py-4">

                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#87938E] hover:bg-[#E7F5F2] hover:text-[#0F766E]">
                      <MoreHorizontal size={17} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= FOOTER INFO ================= */}

      <div className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-[#E3E0D7] bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
            <ShieldCheck size={17} />
          </div>

          <div>

            <p className="text-xs font-bold text-[#17201D] dark:text-white">
              Nursing Operations
            </p>

            <p className="mt-0.5 text-[10px] text-[#87938E]">
              Nursing staff schedules and patient assignments are up to date.
            </p>

          </div>

        </div>

        <span className="rounded-full bg-[#ECFDF5] px-3 py-1.5 text-[9px] font-bold text-[#0F766E]">
          {onDutyCount} Nurses On Duty
        </span>

      </div>

    </div>
  );
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#18211E]">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-5 text-xs font-medium text-[#87938E]">
        {title}
      </p>

      <div className="mt-1 flex items-end justify-between">

        <p className="text-2xl font-bold text-[#17201D] dark:text-white">
          {value}
        </p>

        <span className="mb-1 text-[9px] font-semibold text-[#87938E]">
          {subtitle}
        </span>

      </div>

    </div>
  );
}


/* ============================================================
   TABLE HEAD
============================================================ */

function TableHead({ children }) {
  return (
    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
      {children}
    </th>
  );
}


/* ============================================================
   STATUS
============================================================ */

function Status({ status }) {

  const styles = {
    "On Duty":
      "bg-[#ECFDF5] text-[#0F766E]",

    "Off Duty":
      "bg-[#F1F3EF] text-[#66736D]",

    "On Leave":
      "bg-[#FFF3E8] text-[#C87924]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}