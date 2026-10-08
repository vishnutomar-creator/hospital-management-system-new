"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  CalendarDays,
  Clock3,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  Edit,
  Eye,
  Users,
  RefreshCw,
} from "lucide-react";
import { doctorAPI } from "../../services/api";

export default function DoctorsPage() {
  const [doctorList, setDoctorList] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorAPI.getDoctors();
      if (res.success && Array.isArray(res.data)) {
        const formatted = res.data.map((d) => ({
          id: d.doctorId || d._id || d.id,
          name: d.name || d.doctorName || "Dr. Specialist",
          specialization: d.specialization || "Physician",
          department: d.department?.name || d.department || "General",
          experience: d.experience ? `${d.experience} Years` : "—",
          phone: d.phone || "—",
          email: d.email || "—",
          shift: d.shift || "Morning",
          status: d.availability || d.status || "Available",
          patients: d.patientsCount ?? "—",
          initials: (d.name || "Dr").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
        }));
        setDoctorList(formatted);
      } else {
        setDoctorList([]);
      }
    } catch (err) {
      console.warn("Doctor API load notice:", err.message);
      setDoctorList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fix: only remove from state AFTER successful API deletion
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor record?")) return;
    try {
      await doctorAPI.deleteDoctor(id);
      setDoctorList((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete doctor.");
    } finally {
      setOpenMenuId(null);
    }
  };

  // Derive unique departments from actual data (no hardcoded list)
  const departments = [
    "All Departments",
    ...Array.from(new Set(doctorList.map((d) => d.department).filter(Boolean))),
  ];

  const filteredDoctors = doctorList.filter((d) => {
    const matchesQuery = `${d.name} ${d.specialization} ${d.department} ${d.id}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesDept =
      selectedDept === "All Departments" ||
      d.department.toLowerCase() === selectedDept.toLowerCase();
    return matchesQuery && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Doctors</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage doctors, departments, schedules and availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDoctors}
            className="flex items-center gap-1.5 rounded-xl border border-[#DDD9CE] px-3 py-2.5 text-xs font-semibold text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/doctors/add"
            className="flex w-fit items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]"
          >
            <Plus size={17} />
            Add Doctor
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total Doctors" value={doctorList.length} icon={<Stethoscope size={20} />} />
        <Stat title="Available Today" value={doctorList.filter((d) => d.status === "Available").length} icon={<Activity size={20} />} />
        <Stat title="On Duty" value={doctorList.filter((d) => d.status === "On Duty").length} icon={<Users size={20} />} />
        <Stat title="On Leave" value={doctorList.filter((d) => d.status === "On Leave").length} icon={<CalendarDays size={20} />} />
      </div>

      {/* Doctor Directory Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E3E0D7] bg-white shadow-sm dark:border-white/10 dark:bg-[#18211E]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#EEECE5] p-5 md:flex-row md:items-center dark:border-white/10">
          <div>
            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">Doctor Directory</h2>
            <p className="mt-1 text-xs text-[#87938E]">{filteredDoctors.length} registered doctors</p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA49F]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctor..."
                className="w-[210px] rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 text-xs text-[#52615B] outline-none dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
            >
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-[#EEECE5] dark:border-white/10">
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">Doctor</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">Department</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">Contact</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">Shift</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">Status</th>
                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="border-b border-[#F0EEE8] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7F5F2] text-xs font-bold text-[#0F766E]">
                        {doctor.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#17201D] dark:text-white">{doctor.name}</p>
                        <p className="mt-0.5 text-[10px] text-[#87938E]">{doctor.specialization}</p>
                        <p className="mt-0.5 text-[9px] text-[#A1AAA6]">{doctor.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">{doctor.department}</p>
                    <p className="mt-1 text-[9px] text-[#87938E]">{doctor.experience}</p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-[10px] text-[#52615B] dark:text-[#AAB6B0]">
                        <Phone size={11} />{doctor.phone}
                      </p>
                      <p className="flex items-center gap-1.5 text-[10px] text-[#87938E]">
                        <Mail size={11} />{doctor.email}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                      <Clock3 size={13} />{doctor.shift}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <DoctorStatus status={doctor.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === doctor.id ? null : doctor.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#87938E] hover:bg-[#E7F5F2] hover:text-[#0F766E]"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === doctor.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                            <Link
                              href={`/doctors/${doctor.id}`}
                              className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                            >
                              <Eye size={15} /> View Profile
                            </Link>
                            <Link
                              href={`/doctors/${doctor.id}/edit`}
                              className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                            >
                              <Edit size={15} /> Edit Doctor
                            </Link>
                            <button
                              onClick={() => handleDelete(doctor.id)}
                              className="flex w-full items-center gap-2 border-t border-[#EEECE5] px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:border-white/10 dark:text-red-400 dark:hover:bg-red-500/10"
                            >
                              <Trash2 size={15} /> Delete Doctor
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDoctors.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]">
                        <Stethoscope size={24} />
                      </div>
                      <p className="text-sm font-semibold text-[#17201D] dark:text-white">
                        {loading ? "Loading doctors from system..." : "No doctors found"}
                      </p>
                      <p className="max-w-xs text-xs text-[#87938E]">
                        {loading
                          ? "Connecting to backend..."
                          : query
                          ? `No doctors matching "${query}"`
                          : "Click 'Add Doctor' to register a new doctor."}
                      </p>
                      {!loading && !query && (
                        <Link
                          href="/doctors/add"
                          className="mt-1 flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B625C]"
                        >
                          <Plus size={14} /> Add Doctor
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">{icon}</div>
      <p className="mt-5 text-xs text-[#87938E]">{title}</p>
      <p className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">{value}</p>
    </div>
  );
}

function DoctorStatus({ status }) {
  const styles = {
    Available: "bg-[#ECFDF5] text-[#0F766E] dark:bg-emerald-900/30 dark:text-emerald-400",
    "On Duty": "bg-[#EEF2FF] text-[#5367B8] dark:bg-blue-900/30 dark:text-blue-400",
    "On Leave": "bg-[#FFF3E8] text-[#C87924] dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${styles[status] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>
      {status}
    </span>
  );
}