"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Clock,
  Stethoscope,
  RefreshCw,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Filter,
  Hash,
  User,
  ChevronRight,
  AlertCircle,
  ListOrdered,
} from "lucide-react";
import {
  readQueue,
  updateQueueStatus,
  sortQueue,
  getTodayQueue,
} from "../../utils/opd";
import { useRole } from "../../hooks/usePermission";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const statusStyles = {
  Waiting:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "In Consultation":
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Completed:
    "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400",
  Cancelled:
    "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const statusDot = {
  Waiting:          "bg-amber-400",
  "In Consultation": "bg-[#0F766E]",
  Completed:         "bg-gray-400",
  Cancelled:         "bg-red-500",
};

// ---------------------------------------------------------------------------
// Elapsed time helper
// ---------------------------------------------------------------------------
function elapsed(isoString) {
  if (!isoString) return "—";
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60)  return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
}

// ---------------------------------------------------------------------------
// QueueCard — single row
// ---------------------------------------------------------------------------
function QueueCard({ entry, onStatusChange, isDoctor }) {
  const router = useRouter();

  const canStart    = entry.status === "Waiting";
  const inProgress  = entry.status === "In Consultation";
  const isDone      = entry.status === "Completed" || entry.status === "Cancelled";

  return (
    <div
      className={`
        flex flex-col gap-4 border-b border-[#EEECE5] p-4 transition-colors
        last:border-0 sm:flex-row sm:items-center sm:justify-between
        dark:border-white/5
        ${inProgress ? "bg-[#E7F5F2]/40 dark:bg-[#0F766E]/[0.06]" : "hover:bg-[#FAFAF7] dark:hover:bg-white/[0.02]"}
      `}
    >
      {/* Left: token + patient info */}
      <div className="flex items-center gap-4">
        {/* Token badge */}
        <div
          className={`
            flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl
            font-mono font-black
            ${inProgress
              ? "bg-[#0F766E] text-white shadow-lg shadow-[#0F766E]/30"
              : isDone
              ? "bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-gray-500"
              : "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
            }
          `}
        >
          <span className="text-[10px] font-bold uppercase opacity-70 leading-none">
            {entry.token?.split("-")[0]}
          </span>
          <span className="text-xl leading-none">
            {entry.token?.split("-")[1]}
          </span>
        </div>

        {/* Patient + doctor */}
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-[#17201D] dark:text-white">{entry.patient}</p>
            {entry.patientUhid && (
              <span className="flex items-center gap-0.5 rounded-full bg-[#0F766E]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                <Hash size={8} />
                {entry.patientUhid}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-[#87938E]">
            <span className="flex items-center gap-1">
              <Stethoscope size={11} />
              {entry.doctor}
            </span>
            <span>·</span>
            <span>{entry.department}</span>
            {entry.time && <><span>·</span><span className="flex items-center gap-1"><Clock size={11} />{entry.time}</span></>}
          </div>
          {entry.notes && (
            <p className="mt-1 max-w-xs truncate text-[11px] italic text-[#87938E]">{entry.notes}</p>
          )}
        </div>
      </div>

      {/* Right: status + actions */}
      <div className="flex items-center gap-3 pl-[72px] sm:pl-0">
        {/* Elapsed time */}
        <div className="hidden flex-col items-end text-right sm:flex">
          {inProgress && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#87938E]">In progress</p>
              <p className="text-sm font-bold text-[#0F766E]">{elapsed(entry.consultationStartedAt)}</p>
            </>
          )}
          {entry.status === "Waiting" && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#87938E]">Waiting</p>
              <p className="text-sm font-bold text-amber-600">{elapsed(entry.enqueuedAt)}</p>
            </>
          )}
          {entry.status === "Completed" && (
            <p className="text-xs text-[#87938E]">Done {elapsed(entry.completedAt)} ago</p>
          )}
        </div>

        {/* Status badge */}
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[entry.status]}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot[entry.status]}`} />
          {entry.status}
        </span>

        {/* Action buttons — only for doctors / all roles with permission */}
        {canStart && (
          <button
            id={`start-consult-${entry.id}`}
            onClick={() => {
              onStatusChange(entry.id, "In Consultation");
              router.push(`/queue/${entry.id}`);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0B625C] active:scale-95"
          >
            <PlayCircle size={14} />
            Start Consultation
          </button>
        )}

        {inProgress && (
          <button
            id={`resume-consult-${entry.id}`}
            onClick={() => router.push(`/queue/${entry.id}`)}
            className="flex items-center gap-1.5 rounded-xl border border-[#0F766E] bg-[#E7F5F2] px-3 py-2 text-xs font-bold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white dark:border-[#5EEAD4] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
          >
            <ChevronRight size={14} />
            Resume
          </button>
        )}

        {!isDone && (
          <button
            onClick={() => onStatusChange(entry.id, "Cancelled")}
            title="Cancel"
            className="rounded-xl p-2 text-[#87938E] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
          >
            <XCircle size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function QueuePage() {
  const { activeRole } = useRole();
  const [queue,        setQueue]        = useState([]);
  const [query,        setQuery]        = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active"); // Active | All | Completed
  const [refreshKey,   setRefreshKey]   = useState(0);

  const isDoctor = activeRole === "Doctor";
  const debounceRef = useRef(null);

  const loadQueue = useCallback(() => {
    const raw = getTodayQueue(isDoctor ? doctorFilter || undefined : undefined);
    setQueue(sortQueue(raw));
  }, [isDoctor, doctorFilter]);

  useEffect(() => {
    loadQueue();
    // Auto-refresh every 30s
    const interval = setInterval(loadQueue, 30_000);
    return () => clearInterval(interval);
  }, [loadQueue, refreshKey]);

  const handleStatusChange = (id, status) => {
    updateQueueStatus(id, status);
    loadQueue();
  };

  // Filter by search + status tab
  const visible = queue.filter((e) => {
    const matchSearch = `${e.patient} ${e.doctor} ${e.token} ${e.department}`.toLowerCase().includes(query.toLowerCase());
    const matchStatus =
      statusFilter === "All"       ? true :
      statusFilter === "Active"    ? (e.status === "Waiting" || e.status === "In Consultation") :
      statusFilter === "Completed" ? e.status === "Completed" :
      true;
    return matchSearch && matchStatus;
  });

  // Stats
  const waiting       = queue.filter((e) => e.status === "Waiting").length;
  const inConsult     = queue.filter((e) => e.status === "In Consultation").length;
  const completed     = queue.filter((e) => e.status === "Completed").length;
  const totalToday    = queue.length;

  return (
    <div className="space-y-5">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">OPD Queue</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Today's live patient queue — {totalToday} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { loadQueue(); setRefreshKey((k) => k + 1); }}
            className="flex items-center gap-1.5 rounded-xl border border-[#DDD9CE] px-3 py-2 text-xs font-semibold text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <Link
            href="/appointments/book"
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90"
          >
            <ListOrdered size={16} />
            New Appointment
          </Link>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Waiting",          value: waiting,    color: "text-amber-600",    bg: "bg-amber-50 dark:bg-amber-500/10" },
          { label: "In Consultation",  value: inConsult,  color: "text-[#0F766E]",    bg: "bg-[#E7F5F2] dark:bg-[#0F766E]/10" },
          { label: "Completed",        value: completed,  color: "text-gray-600",     bg: "bg-gray-50 dark:bg-white/5" },
          { label: "Total Today",      value: totalToday, color: "text-[#17201D] dark:text-white", bg: "bg-white dark:bg-[#17201D]" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border border-[#E5E2D9] p-4 dark:border-white/10 ${bg}`}>
            <p className="text-xs font-semibold text-[#87938E]">{label}</p>
            <p className={`mt-1 text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Main card ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">

        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#EEECE5] p-4 sm:flex-row sm:items-center dark:border-white/10">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by patient, token, doctor, department…"
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>

          {/* Doctor filter — debounced */}
          <div className="relative w-full sm:w-52">
            <Stethoscope size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input
              type="text"
              value={doctorFilter}
              onChange={(e) => {
                const val = e.target.value;
                setDoctorFilter(val);
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => loadQueue(), 300);
              }}
              placeholder="Filter by doctor…"
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1 border-b border-[#EEECE5] px-4 py-2 dark:border-white/10">
          {[
            { key: "Active",    label: `Active (${waiting + inConsult})` },
            { key: "Completed", label: `Completed (${completed})` },
            { key: "All",       label: `All (${totalToday})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === key
                  ? "bg-[#0F766E] text-white"
                  : "text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/[0.06]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Queue list */}
        <div>
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]">
                <ListOrdered size={24} />
              </div>
              <p className="text-sm font-semibold text-[#17201D] dark:text-white">Queue is empty</p>
              <p className="max-w-xs text-center text-xs text-[#87938E]">
                No patients in the queue yet. Book an appointment to add one.
              </p>
              <Link href="/appointments/book" className="mt-2 flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F766E]/90">
                Book Appointment
              </Link>
            </div>
          ) : (
            visible.map((entry) => (
              <QueueCard
                key={entry.id}
                entry={entry}
                onStatusChange={handleStatusChange}
                isDoctor={isDoctor}
              />
            ))
          )}
        </div>

        {/* Footer count */}
        {visible.length > 0 && (
          <div className="border-t border-[#EEECE5] px-5 py-3 dark:border-white/10">
            <p className="text-xs text-[#87938E]">
              Showing {visible.length} of {queue.length} entries for today
            </p>
          </div>
        )}
      </div>
    </div>
  );
}