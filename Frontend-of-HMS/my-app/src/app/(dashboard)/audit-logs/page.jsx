"use client";

import { useState, useMemo } from "react";
import {
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronRight,
  LogIn,
  LogOut,
  PlusCircle,
  Pencil,
  Trash2,
  Download,
  ShieldAlert,
  KeyRound,
  CalendarDays,
  Package,
  Wallet,
  UserCog,
  Wrench,
  X,
} from "lucide-react";

/* ----------------------------- Dummy Data ----------------------------- */

const modules = [
  "All Modules",
  "Appointments",
  "Inventory",
  "HR",
  "Finance",
  "Assets",
  "Auth",
];

const actionTypes = [
  "All Actions",
  "Create",
  "Update",
  "Delete",
  "Login",
  "Logout",
  "Export",
  "Permission",
];

const statusFilters = ["All", "Success", "Failed"];

const moduleIcons = {
  Appointments: CalendarDays,
  Inventory: Package,
  HR: UserCog,
  Finance: Wallet,
  Assets: Wrench,
  Auth: KeyRound,
};

const actionStyles = {
  Create: {
    icon: PlusCircle,
    iconBg: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  },
  Update: {
    icon: Pencil,
    iconBg: "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  },
  Delete: {
    icon: Trash2,
    iconBg: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  },
  Login: {
    icon: LogIn,
    iconBg: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  },
  Logout: {
    icon: LogOut,
    iconBg: "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  },
  Export: {
    icon: Download,
    iconBg: "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  },
  Permission: {
    icon: ShieldAlert,
    iconBg: "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  },
};

const initialLogs = [
  {
    id: "LOG-10245",
    actor: "Dr. Shreya Iyer",
    role: "Physician",
    action: "Update",
    module: "Appointments",
    description: "Rescheduled appointment APT-3391 for Kavya Reddy to 3:00 PM.",
    ip: "10.0.4.22",
    time: "2 min ago",
    status: "Success",
  },
  {
    id: "LOG-10244",
    actor: "Anil Kulkarni",
    role: "Pharmacist",
    action: "Delete",
    module: "Inventory",
    description: "Removed expired batch INV-7742 (Insulin Glargine) from stock.",
    ip: "10.0.4.55",
    time: "18 min ago",
    status: "Success",
  },
  {
    id: "LOG-10243",
    actor: "system",
    role: "System",
    action: "Login",
    module: "Auth",
    description: "Failed login attempt for account priya.nair@hospital.org — invalid password.",
    ip: "103.22.8.101",
    time: "34 min ago",
    status: "Failed",
  },
  {
    id: "LOG-10242",
    actor: "Rahul Verma",
    role: "HR Manager",
    action: "Permission",
    module: "HR",
    description: "Granted 'Payroll Admin' role to employee Meera Joshi.",
    ip: "10.0.4.9",
    time: "1 hour ago",
    status: "Success",
  },
  {
    id: "LOG-10241",
    actor: "Vikram Singh",
    role: "Finance Officer",
    action: "Export",
    module: "Finance",
    description: "Exported August revenue ledger (BIL-4300 to BIL-4401) as CSV.",
    ip: "10.0.4.31",
    time: "2 hours ago",
    status: "Success",
  },
  {
    id: "LOG-10240",
    actor: "Dr. Arjun Mehta",
    role: "Physician",
    action: "Create",
    module: "Appointments",
    description: "Booked new appointment APT-3392 for patient Sana Sheikh.",
    ip: "10.0.4.18",
    time: "3 hours ago",
    status: "Success",
  },
  {
    id: "LOG-10239",
    actor: "Anil Kulkarni",
    role: "Pharmacist",
    action: "Update",
    module: "Inventory",
    description: "Adjusted reorder threshold for Metformin 500mg from 100 to 150 units.",
    ip: "10.0.4.55",
    time: "5 hours ago",
    status: "Success",
  },
  {
    id: "LOG-10238",
    actor: "Neha Kapoor",
    role: "Asset Manager",
    action: "Update",
    module: "Assets",
    description: "Attempted to close maintenance ticket MNT-502 without inspection sign-off.",
    ip: "10.0.4.47",
    time: "Yesterday",
    status: "Failed",
  },
  {
    id: "LOG-10237",
    actor: "system",
    role: "System",
    action: "Logout",
    module: "Auth",
    description: "Session for user rahul.verma@hospital.org expired after 30 minutes of inactivity.",
    ip: "10.0.4.9",
    time: "Yesterday",
    status: "Success",
  },
  {
    id: "LOG-10236",
    actor: "Meera Joshi",
    role: "Billing Clerk",
    action: "Create",
    module: "Finance",
    description: "Recorded payment of ₹42,500 against bill BIL-4401.",
    ip: "10.0.4.63",
    time: "Yesterday",
    status: "Success",
  },
];

/* --------------------------------- Page -------------------------------- */

import { useEffect } from "react";
import { auditAPI } from "../../services/api";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [action, setAction] = useState("All Actions");
  const [module, setModuleFilter] = useState("All Modules");
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await auditAPI.getAuditLogs();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map((l) => ({
          id: l._id || l.id || `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
          actor: l.userId?.name || l.actor || "System",
          role: l.userId?.role || l.role || "Admin",
          action: l.action || "Update",
          module: l.module || "System",
          description: l.description || l.action || "Log entry recorded",
          ip: l.ipAddress || l.ip || "127.0.0.1",
          time: l.createdAt ? String(l.createdAt).slice(11, 16) : l.time || "Recently",
          status: l.status === "failed" ? "Failed" : "Success",
        }));
        setLogs(formatted);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.warn("Audit API load notice:", err.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const failedCount = logs.filter((l) => l.status === "Failed").length;

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const matchesQuery =
        query.trim() === "" ||
        l.actor.toLowerCase().includes(query.toLowerCase()) ||
        l.description.toLowerCase().includes(query.toLowerCase()) ||
        l.id.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "All" || l.status === status;
      const matchesAction = action === "All Actions" || l.action === action;
      const matchesModule = module === "All Modules" || l.module === module;
      return matchesQuery && matchesStatus && matchesAction && matchesModule;
    });
  }, [logs, query, status, action, module]);

  const toggleExpand = (id) =>
    setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Audit Logs
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[#17201D] dark:text-white">
            Audit Logs
            {failedCount > 0 && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                {failedCount} failed
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            A record of every action taken across the hospital system.
          </p>
        </div>

        <button
          className="
            flex items-center justify-center gap-2
            rounded-xl border border-[#E3E0D7] bg-white px-4 py-2.5
            text-sm font-semibold text-[#52615B]
            transition hover:bg-[#F1F3EF]
            dark:border-white/10 dark:bg-[#17201D] dark:text-[#AAB6B0] dark:hover:bg-white/5
          "
        >
          <Download size={17} />
          Export logs
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#87938E]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by actor, log ID, or description…"
            className="
              w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2.5 pl-9 pr-3
              text-sm text-[#17201D] outline-none
              focus:border-[#0F766E]
              dark:border-white/10 dark:bg-[#202B27] dark:text-white
            "
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-xl bg-[#F1F3EF] p-1 dark:bg-white/5">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`
                  rounded-lg px-4 py-1.5 text-sm font-semibold transition
                  ${
                    status === s
                      ? "bg-white text-[#0F766E] shadow-sm dark:bg-[#17201D] dark:text-[#5EEAD4]"
                      : "text-[#64746E] dark:text-[#AAB6B0]"
                  }
                `}
              >
                {s}
                {s === "Failed" && failedCount > 0 && ` (${failedCount})`}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
            >
              {actionTypes.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <select
              value={module}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
            >
              {modules.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Log List */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1F3EF] text-[#8A9691] dark:bg-white/10">
              <ShieldCheck size={20} />
            </div>
            <p className="text-sm text-[#87938E]">
              No log entries match your filters.
            </p>
          </div>
        )}

        {filtered.map((log, idx) => {
          const { icon: ActionIcon, iconBg } = actionStyles[log.action];
          const ModuleIcon = moduleIcons[log.module];
          const isOpen = expanded === log.id;

          return (
            <div
              key={log.id}
              className={
                idx !== filtered.length - 1
                  ? "border-b border-[#EEECE5] dark:border-white/10"
                  : ""
              }
            >
              <button
                onClick={() => toggleExpand(log.id)}
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-[#FAFAF7] dark:hover:bg-white/[0.03]"
              >
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                >
                  <ActionIcon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#17201D] dark:text-white">
                          {log.actor}
                        </p>
                        <span className="text-xs text-[#87938E]">
                          {log.role}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            log.status === "Success"
                              ? "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
                              : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-[#52615B] dark:text-[#AAB6B0]">
                        {log.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-[#B8BFBB]">
                      <span className="hidden text-xs text-[#87938E] sm:inline">
                        {log.time}
                      </span>
                      {isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                      <ModuleIcon size={11} />
                      {log.module}
                    </span>
                    <span className="text-xs text-[#87938E] sm:hidden">
                      {log.time}
                    </span>
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="mx-5 mb-4 rounded-xl border border-[#EEECE5] bg-[#FAFAF7] px-4 py-3 text-sm dark:border-white/10 dark:bg-[#202B27]">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                    <div className="flex justify-between sm:justify-start sm:gap-2">
                      <span className="text-[#87938E]">Log ID</span>
                      <span className="font-medium text-[#17201D] dark:text-white">
                        {log.id}
                      </span>
                    </div>
                    <div className="flex justify-between sm:justify-start sm:gap-2">
                      <span className="text-[#87938E]">Action</span>
                      <span className="font-medium text-[#17201D] dark:text-white">
                        {log.action}
                      </span>
                    </div>
                    <div className="flex justify-between sm:justify-start sm:gap-2">
                      <span className="text-[#87938E]">IP address</span>
                      <span className="font-medium text-[#17201D] dark:text-white">
                        {log.ip}
                      </span>
                    </div>
                    <div className="flex justify-between sm:justify-start sm:gap-2">
                      <span className="text-[#87938E]">Timestamp</span>
                      <span className="font-medium text-[#17201D] dark:text-white">
                        {log.time}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}