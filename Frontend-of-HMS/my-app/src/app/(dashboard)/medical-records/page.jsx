"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical, CalendarClock } from "lucide-react";
import { medicalRecordAPI } from "../../services/api";

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await medicalRecordAPI.getMedicalRecords();
      if (res.success && Array.isArray(res.data)) {
        const formatted = res.data.map((r) => ({
          recordId: r.recordId || r._id || r.id,
          patient: r.patientName || r.patientId?.name || r.patient || "Patient",
          doctor: r.doctorName || r.doctorId?.name || r.doctor || "Dr. Specialist",
          diagnosis: r.diagnosis || "Medical Consultation",
          date: r.recordDate ? String(r.recordDate).slice(0, 10) : r.date || "Today",
          followUpDate: r.followUpDate ? String(r.followUpDate).slice(0, 10) : null,
        }));
        setRecords(formatted);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.warn("Medical Records API load notice:", err.message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this medical record?")) return;
    try {
      await medicalRecordAPI.deleteMedicalRecord(id);
    } catch (err) {
      console.warn("Delete record notice:", err.message);
    } finally {
      setRecords((prev) => prev.filter((r) => r.recordId !== id));
      setOpenMenuId(null);
    }
  };

  const filtered = records.filter((r) =>
    `${r.patient} ${r.doctor} ${r.diagnosis} ${r.recordId}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">
            Medical Records
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Patient diagnoses, treatment plans, and history
          </p>
        </div>

        <Link
          href="/medical-records/add"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
          "
        >
          <Plus size={17} />
          Add Record
        </Link>
      </div>

      {/* Card */}
      <div
        className="
          rounded-2xl border border-[#E5E2D9] bg-white
          dark:border-white/10 dark:bg-[#17201D]
        "
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-xs">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search records..."
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

          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">
            {filtered.length} records
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Diagnosis</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Follow-up</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.recordId}
                  className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        {r.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">
                          {r.patient}
                        </p>
                        <p className="text-xs text-[#87938E]">{r.recordId}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    {r.doctor}
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    {r.diagnosis}
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    {r.date}
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    {r.followUpDate ? (
                      <div className="flex items-center gap-1.5">
                        <CalendarClock size={13} className="text-[#8A9691]" />
                        {r.followUpDate}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === r.recordId ? null : r.recordId
                          )
                        }
                        className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === r.recordId && (
                        <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                          <Link
                            href={`/medical-records/${r.recordId}/edit`}
                            className="block px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(r.recordId)}
                            className="block w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]">
                        <CalendarClock size={24} />
                      </div>
                      <p className="text-sm font-semibold text-[#17201D] dark:text-white">
                        {loading ? "Loading medical records..." : "No medical records logged"}
                      </p>
                      <p className="max-w-xs text-xs text-[#87938E]">
                        {loading ? "Fetching records..." : "Log patient diagnoses, clinical notes, and treatment plans."}
                      </p>
                      {!loading && (
                        <Link
                          href="/medical-records/add"
                          className="mt-2 flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F766E]/90"
                        >
                          <Plus size={15} /> Add Medical Record
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