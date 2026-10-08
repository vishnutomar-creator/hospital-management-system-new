"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical, Clock, Calendar, Trash2, Hash } from "lucide-react";
import { appointmentAPI } from "../../services/api";

// Map backend status values → display label + style
const STATUS_MAP = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  },
  completed: {
    label: "Completed",
    className: "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  },
  no_show: {
    label: "No Show",
    className: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await appointmentAPI.getAppointments();
      if (res.success && Array.isArray(res.data)) {
        const formatted = res.data.map((a) => ({
          id: a._id || a.id,
          patient: a.patientId?.name || a.patientId?.patientName || "Patient",
          doctor: a.doctorId?.name || "Dr. Specialist",
          department: a.doctorId?.department?.name || "General",
          date: a.appointmentDate ? String(a.appointmentDate).slice(0, 10) : "—",
          time: a.appointmentTime || "—",
          status: a.status || "pending",
          token: a.token,
        }));
        setAppointments(formatted);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Cancel sets status to "cancelled" — does NOT hard-delete the record
  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await appointmentAPI.cancelAppointment(id, "Cancelled by staff");
      // Optimistically update local state
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
      );
    } catch (err) {
      alert(`Could not cancel appointment: ${err.message}`);
    } finally {
      setOpenMenuId(null);
    }
  };

  const filtered = appointments.filter((a) =>
    `${a.patient} ${a.doctor} ${a.department} ${a.id}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Schedule and manage patient appointments with doctors
          </p>
        </div>

        <Link
          href="/appointments/book"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
          "
        >
          <Plus size={17} />
          Book Appointment
        </Link>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

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
              placeholder="Search appointments..."
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
            {filtered.length} appointments
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Date & Time</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((a) => {
                const statusInfo = STATUS_MAP[a.status] || {
                  label: a.status,
                  className: "bg-gray-100 text-gray-600",
                };
                return (
                  <tr
                    key={a.id}
                    className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                          {(a.patient || "P")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-[#17201D] dark:text-white">
                            {a.patient}
                          </p>
                          <p className="text-xs text-[#87938E]">{a.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                      {a.doctor}
                    </td>

                    <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                      {a.department}
                    </td>

                    <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#8A9691]" />
                        {a.date} · {a.time}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                        {a.token && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#0F766E]/10 px-2 py-0.5 text-xs font-extrabold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                            <Hash size={11} /> {a.token}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="relative flex justify-end items-center gap-2">
                        <Link
                          href={a.token ? `/queue/${a.id}` : `/queue`}
                          className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[#0F766E]/20 bg-[#0F766E]/5 px-2.5 py-1 text-xs font-semibold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white dark:border-[#5EEAD4]/20 dark:bg-[#5EEAD4]/10 dark:text-[#5EEAD4]"
                        >
                          {a.token ? `Queue · ${a.token}` : "Queue"}
                        </Link>

                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === a.id ? null : a.id)
                          }
                          className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === a.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                              <Link
                                href={a.token ? `/queue/${a.id}` : `/queue`}
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[#17201D] hover:bg-[#FAFAF7] dark:text-white dark:hover:bg-white/5"
                              >
                                <Clock size={15} className="text-[#0F766E]" /> Go to OPD Queue{a.token ? ` · ${a.token}` : ""}
                              </Link>
                              {a.status !== "cancelled" && a.status !== "completed" && (
                                <button
                                  onClick={() => handleCancel(a.id)}
                                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                  <Trash2 size={15} /> Cancel Appointment
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]">
                        <Calendar size={24} />
                      </div>
                      <p className="text-sm font-semibold text-[#17201D] dark:text-white">
                        No appointments scheduled
                      </p>
                      <p className="max-w-xs text-xs text-[#87938E]">
                        Book an appointment for a patient with a doctor.
                      </p>
                      <Link
                        href="/appointments/book"
                        className="mt-2 flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F766E]/90"
                      >
                        <Plus size={15} /> Book Appointment
                      </Link>
                    </div>
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0F766E] border-t-transparent" />
                      <p className="text-sm text-[#87938E]">Loading appointments...</p>
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