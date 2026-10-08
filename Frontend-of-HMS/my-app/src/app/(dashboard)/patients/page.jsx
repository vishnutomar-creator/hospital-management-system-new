"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  MoreVertical,
  BedDouble,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  RefreshCw,
  User,
  Hash,
  ChevronDown,
  Filter,
} from "lucide-react";
import { patientAPI } from "../../services/api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const statusStyles = {
  Admitted:
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Discharged:
    "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  Outpatient:
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
};

const genderColors = {
  Male:   "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Female: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
  Other:  "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PatientsPage() {
  const router = useRouter();

  const [patients,    setPatients]    = useState([]);
  const [query,       setQuery]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenuId,  setOpenMenuId]  = useState(null);
  const [loading,     setLoading]     = useState(true);

  // ---------------------------------------------------------------------------
  // Data fetching — directly from MongoDB via patientAPI
  // ---------------------------------------------------------------------------
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientAPI.getPatients();
      if (res.success && Array.isArray(res.data)) {
        const formatted = res.data.map((p) => {
          const dob = p.dateOfBirth || p.dob;
          const age = dob
            ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 3600 * 1000))
            : p.age || null;
          return {
            id:         p.patientId || p._id || p.id,
            uhid:       p.patientId || p.uhid || p._id,
            name:       p.name || p.patientName || p.userId?.name || "Patient",
            age:        age,
            gender:     p.gender || "Other",
            phone:      p.phone || p.contactNumber || "—",
            email:      p.email || p.userId?.email || "—",
            department: p.department || p.departmentName || "General Medicine",
            status:     p.status || "Outpatient",
            bloodGroup: p.bloodGroup || "—",
            _id:        p._id,
          };
        });
        setPatients(formatted);
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.error("Failed to load patients from backend:", err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  const handleAdmitIPD = (patient) => {
    setOpenMenuId(null);
    router.push(
      `/admissions/new?patientName=${encodeURIComponent(patient.name)}&patientId=${patient.id}`
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this patient record?")) return;
    try {
      await patientAPI.deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete patient from database");
    } finally {
      setOpenMenuId(null);
    }
  };

  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------
  const filtered = patients.filter((p) => {
    const searchTarget = `${p.name} ${p.uhid || p.id} ${p.department} ${p.phone}`.toLowerCase();
    const matchesQuery = searchTarget.includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  // Stats
  const counts = {
    All:        patients.length,
    Outpatient: patients.filter((p) => p.status === "Outpatient").length,
    Admitted:   patients.filter((p) => p.status === "Admitted").length,
    Discharged: patients.filter((p) => p.status === "Discharged").length,
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Patients</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            {patients.length} registered patient{patients.length !== 1 ? "s" : ""} — identified by UHID
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admissions/new"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#0F766E] bg-[#E7F5F2] px-4 py-2.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white dark:border-[#5EEAD4] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
          >
            <BedDouble size={17} />
            Admit to IPD
          </Link>

          <Link
            href="/patients/add"
            id="add-patient-btn"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90"
          >
            <Plus size={17} />
            Add Patient
          </Link>
        </div>
      </div>

      {/* ── Status Filter Tabs ────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              statusFilter === status
                ? "bg-[#0F766E] text-white shadow-sm"
                : "bg-white text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:bg-[#17201D] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20"
            } border border-[#E5E2D9] dark:border-white/10`}
          >
            {status}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
              statusFilter === status
                ? "bg-white/20 text-white"
                : "bg-[#F1F3EF] text-[#87938E] dark:bg-white/10"
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Table Card ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, UHID, phone, department…"
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>

          <button
            onClick={fetchPatients}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#DDD9CE] px-3 py-2 text-xs font-semibold text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient / UHID</th>
                <th className="px-5 py-3">Age / Gender</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]"
                >
                  {/* Patient / UHID */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        {(p.name || "P").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">{p.name}</p>
                        {/* UHID as primary sub-identifier */}
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#87938E]">
                          <Hash size={9} className="text-[#0F766E]/60" />
                          <span className="font-mono font-semibold tracking-wide text-[#0F766E] dark:text-[#5EEAD4]">
                            {p.uhid || p.id}
                          </span>
                          {p.bloodGroup && (
                            <>
                              <span className="text-[#C5C9C6]">·</span>
                              <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                {p.bloodGroup}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Age / Gender */}
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-[#17201D] dark:text-white">{p.age != null ? `${p.age} yrs` : "—"}</span>
                      <span className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${genderColors[p.gender] || genderColors.Other}`}>
                        {p.gender}
                      </span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    <p className="font-medium">{p.phone}</p>
                    <p className="text-xs text-[#87938E]">{p.email}</p>
                  </td>

                  {/* Department */}
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{p.department}</td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[p.status] || "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {p.status !== "Admitted" && (
                        <button
                          onClick={() => handleAdmitIPD(p)}
                          className="flex items-center gap-1 rounded-lg border border-[#0F766E] bg-[#E7F5F2] px-2.5 py-1 text-xs font-bold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white dark:border-[#5EEAD4] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
                        >
                          <BedDouble size={14} />
                          Admit
                        </button>
                      )}

                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                          className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === p.id && (
                          <>
                            {/* Transparent backdrop — clicking outside closes the menu
                                Stays inside React's event system so no delegation conflict */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                            <Link
                              href={`/patients/${p.id}`}
                              className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                            >
                              <Eye size={15} />
                              View Patient
                            </Link>

                            <Link
                              href={`/patients/${p.id}/edit`}
                              className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                            >
                              <Edit size={15} />
                              Edit Patient
                            </Link>

                            <button
                              onClick={() => handleDelete(p.id)}
                              className="flex w-full items-center gap-2 border-t border-[#EEECE5] px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:border-white/10 dark:text-red-400 dark:hover:bg-red-500/10"
                            >
                              <Trash2 size={15} />
                              Delete Patient
                            </button>
                          </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]">
                        <User size={24} />
                      </div>
                      <p className="text-sm font-semibold text-[#17201D] dark:text-white">
                        {loading ? "Loading patients…" : "No patient records found"}
                      </p>
                      <p className="max-w-xs text-xs text-[#87938E]">
                        {loading
                          ? "Connecting to backend server…"
                          : query
                          ? `No patients matching "${query}" — try a UHID, name, or phone number.`
                          : "Register the first patient to get started."}
                      </p>
                      {!loading && !query && (
                        <div className="mt-2 flex items-center gap-3">
                          <Link
                            href="/patients/add"
                            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F766E]/90"
                          >
                            <Plus size={15} /> Register Patient
                          </Link>
                          <Link
                            href="/admissions/new"
                            className="flex items-center gap-2 rounded-xl border border-[#0F766E] bg-[#E7F5F2] px-4 py-2 text-xs font-bold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white"
                          >
                            <BedDouble size={15} /> Quick IPD Admission
                          </Link>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="border-t border-[#EEECE5] px-5 py-3 dark:border-white/10">
            <p className="text-xs text-[#87938E]">
              Showing {filtered.length} of {patients.length} patients
            </p>
          </div>
        )}
      </div>
    </div>
  );
}