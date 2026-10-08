"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Stethoscope,
  CalendarDays,
  BedDouble,
  TrendingUp,
  TrendingDown,
  Activity,
  FlaskConical,
  Pill,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  UserPlus,
  DollarSign,
} from "lucide-react";
import dynamic from "next/dynamic";

import {
  patientAPI,
  doctorAPI,
  appointmentAPI,
  bedAPI,
  labAPI,
  billingAPI,
} from "../../services/api";

// ─── Chart skeleton (defined before dynamic imports that reference it) ─────────
function ChartSkeleton() {
  return (
    <div className="flex h-60 items-center justify-center">
      <div className="h-40 w-full animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />
    </div>
  );
}

// Dynamically import charts (recharts requires client-side rendering)
const RevenueChart = dynamic(
  () => import("../../components/charts/RevenueChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const AppointmentChart = dynamic(
  () => import("../../components/charts/AppointmentChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const PatientChart = dynamic(
  () => import("../../components/charts/PatientChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

// ─── Skeleton helpers ──────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/10 dark:bg-white/5 ${className}`}
    />
  );
}


// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, trend, trendVal, color, loading, href }) {
  const cardContent = (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
        bg-white/70 dark:bg-white/5 border-white/40 dark:border-white/10 backdrop-blur-sm
        ${href ? "cursor-pointer" : ""}`}
    >
      {/* Glow accent */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl shadow-lg"
          style={{ background: `${color}22`, border: `1.5px solid ${color}44` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {trendVal !== undefined && (
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              trend === "up"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
            }`}
          >
            {trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trendVal}
          </span>
        )}
      </div>

      <div className="mt-4">
        {loading ? (
          <>
            <Skeleton className="mb-2 h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <p className="text-3xl font-bold text-[#17201D] dark:text-white">
              {value ?? "—"}
            </p>
            <p className="mt-0.5 text-sm font-medium text-[#6B8C84]">{label}</p>
            {sub && (
              <p className="mt-1 text-xs text-[#9BB5AE]">{sub}</p>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (href) return <Link href={href}>{cardContent}</Link>;
  return cardContent;
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub, href, hrefLabel = "View all" }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-base font-bold text-[#17201D] dark:text-white">{title}</h2>
        {sub && <p className="text-xs text-[#6B8C84]">{sub}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#0F766E] transition-colors hover:bg-[#0F766E]/10"
        >
          {hrefLabel} <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    scheduled: { cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", label: "Scheduled" },
    completed: { cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", label: "Completed" },
    cancelled: { cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", label: "Cancelled" },
    pending: { cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", label: "Pending" },
    active: { cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", label: "Active" },
    admitted: { cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", label: "Admitted" },
    discharged: { cls: "bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-400", label: "Discharged" },
    ordered: { cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", label: "Ordered" },
    "in-progress": { cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400", label: "In Progress" },
    inprogress: { cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400", label: "In Progress" },
    available: { cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", label: "Available" },
    occupied: { cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", label: "Occupied" },
    maintenance: { cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", label: "Maintenance" },
  };
  const s = map[status?.toLowerCase()] ?? { cls: "bg-slate-100 text-slate-600", label: status ?? "Unknown" };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ─── Quick-action button ──────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label, href, color }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl shadow-md transition-transform duration-200 group-hover:scale-110"
        style={{ background: `${color}22`, border: `1.5px solid ${color}44` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <span className="text-xs font-semibold text-[#17201D] dark:text-[#C8DDD7]">{label}</span>
    </Link>
  );
}

// ─── Revenue chart data builder ───────────────────────────────────────────────
function buildMonthlyRevenue(billings = []) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const map = {};
  months.forEach((m) => { map[m] = { month: m, revenue: 0, expenses: 0 }; });
  billings.forEach((b) => {
    const d = new Date(b.createdAt || b.date);
    if (isNaN(d)) return;
    const m = months[d.getMonth()];
    const total = Number(b.totalAmount || b.total || 0);
    const status = (b.status || b.paymentStatus || "").toLowerCase();
    if (status === "paid") map[m].revenue += total;
    else map[m].expenses += total * 0.3;
  });
  return Object.values(map);
}

function buildWeeklyAppointments(appointments = []) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const map = {};
  days.forEach((d) => { map[d] = { day: d, scheduled: 0, completed: 0, cancelled: 0 }; });
  appointments.forEach((a) => {
    const d = new Date(a.date || a.appointmentDate || a.createdAt);
    if (isNaN(d)) return;
    const day = days[(d.getDay() + 6) % 7];
    const s = (a.status || "").toLowerCase();
    if (s === "scheduled") map[day].scheduled++;
    else if (s === "completed") map[day].completed++;
    else if (s === "cancelled") map[day].cancelled++;
  });
  return Object.values(map);
}

function buildMonthlyPatients(patients = []) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const map = {};
  months.forEach((m) => { map[m] = { month: m, newPatients: 0, discharged: 0 }; });
  patients.forEach((p) => {
    const d = new Date(p.createdAt);
    if (isNaN(d)) return;
    const m = months[d.getMonth()];
    map[m].newPatients++;
  });
  return Object.values(map);
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [beds, setBeds] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [billings, setBillings] = useState([]);

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    const safe = (promise) => promise.catch(() => null);

    const [p, d, a, b, l, bi] = await Promise.all([
      safe(patientAPI.getPatients()),
      safe(doctorAPI.getDoctors()),
      safe(appointmentAPI.getAppointments()),
      safe(bedAPI.getBeds()),
      safe(labAPI.getLabTests()),
      safe(billingAPI.getBillings()),
    ]);

    const extract = (res) => {
      if (!res) return [];
      return Array.isArray(res) ? res
        : Array.isArray(res?.data) ? res.data
        : Array.isArray(res?.data?.data) ? res.data.data
        : Array.isArray(res?.patients) ? res.patients
        : Array.isArray(res?.doctors) ? res.doctors
        : Array.isArray(res?.appointments) ? res.appointments
        : Array.isArray(res?.beds) ? res.beds
        : Array.isArray(res?.labTests) ? res.labTests
        : Array.isArray(res?.billings) ? res.billings
        : [];
    };

    setPatients(extract(p));
    setDoctors(extract(d));
    setAppointments(extract(a));
    setBeds(extract(b));
    setLabTests(extract(l));
    setBillings(extract(bi));
    setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Derived metrics ──────────────────────────────────────────────────────────
  const totalRevenue = billings
    .filter((b) => (b.status || "").toLowerCase() === "paid")
    .reduce((s, b) => s + Number(b.totalAmount || b.total || 0), 0);

  const availableBeds = beds.filter((b) => (b.status || "").toLowerCase() === "available").length;
  const occupiedBeds = beds.filter((b) => (b.status || "").toLowerCase() === "occupied").length;
  const bedOccupancy = beds.length ? Math.round((occupiedBeds / beds.length) * 100) : 0;

  const todayStr = new Date().toDateString();
  const todayAppointments = appointments.filter((a) => {
    const d = new Date(a.date || a.appointmentDate || a.createdAt);
    return d.toDateString() === todayStr;
  });

  const pendingLabs = labTests.filter(
    (l) => ["ordered", "pending", "samplecollected", "inprogress"].includes((l.status || "").toLowerCase())
  );

  const activeDoctors = doctors.filter(
    (d) => (d.status || d.isActive) !== false
  );

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 6);

  const recentBillings = [...billings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const unpaidBills = billings.filter(
    (b) => ["unpaid", "pending", "overdue"].includes((b.status || "").toLowerCase())
  );

  // ── Chart data ───────────────────────────────────────────────────────────────
  const revenueData = buildMonthlyRevenue(billings);
  const appointmentData = buildWeeklyAppointments(appointments);
  const patientData = buildMonthlyPatients(patients);

  const statCards = [
    {
      icon: Users,
      label: "Total Patients",
      value: patients.length.toLocaleString(),
      sub: `${recentPatients.length} registered recently`,
      trend: "up",
      trendVal: "+12%",
      color: "#0F766E",
      href: "/patients",
    },
    {
      icon: Stethoscope,
      label: "Active Doctors",
      value: activeDoctors.length,
      sub: `${doctors.length} total doctors`,
      trend: "up",
      trendVal: "+3%",
      color: "#7C3AED",
      href: "/doctors",
    },
    {
      icon: CalendarDays,
      label: "Today's Appointments",
      value: todayAppointments.length,
      sub: `${appointments.length} total appointments`,
      trend: todayAppointments.length > 0 ? "up" : "down",
      trendVal: `${todayAppointments.filter((a) => (a.status || "").toLowerCase() === "scheduled").length} pending`,
      color: "#2563EB",
      href: "/appointments",
    },
    {
      icon: BedDouble,
      label: "Beds Available",
      value: availableBeds,
      sub: `${bedOccupancy}% occupancy rate`,
      trend: availableBeds > 10 ? "up" : "down",
      trendVal: `${occupiedBeds} occupied`,
      color: "#D97706",
      href: "/beds",
    },
    {
      icon: FlaskConical,
      label: "Pending Lab Tests",
      value: pendingLabs.length,
      sub: `${labTests.length} total tests`,
      trend: pendingLabs.length > 5 ? "down" : "up",
      trendVal: `${labTests.filter((l) => (l.status || "").toLowerCase() === "completed").length} done`,
      color: "#DC2626",
      href: "/laboratory",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `₹${(totalRevenue / 1000).toFixed(1)}k`,
      sub: `${unpaidBills.length} unpaid bills`,
      trend: totalRevenue > 0 ? "up" : "down",
      trendVal: "+8%",
      color: "#059669",
      href: "/billing",
    },
  ];

  const quickActions = [
    { icon: UserPlus, label: "New Patient", href: "/patients", color: "#0F766E" },
    { icon: CalendarDays, label: "Schedule Appt.", href: "/appointments", color: "#2563EB" },
    { icon: FlaskConical, label: "Order Lab Test", href: "/laboratory", color: "#DC2626" },
    { icon: Pill, label: "Prescriptions", href: "/prescriptions", color: "#7C3AED" },
    { icon: BedDouble, label: "Manage Beds", href: "/beds", color: "#D97706" },
    { icon: Activity, label: "Admissions", href: "/admissions", color: "#059669" },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Hospital Dashboard
          </h1>
          <p className="text-sm text-[#6B8C84]">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <p className="text-xs text-[#9BB5AE]">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-[#0F766E]/30 bg-[#0F766E]/10 px-4 py-2 text-sm font-semibold text-[#0F766E] transition-all hover:bg-[#0F766E]/20 disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>

      {/* ── Alert Banner (unpaid bills) ──────────────────────────────────────── */}
      {!loading && unpaidBills.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-50/80 dark:bg-amber-900/20 px-5 py-3 backdrop-blur-sm">
          <AlertTriangle size={18} className="shrink-0 text-amber-500" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <span className="font-bold">{unpaidBills.length} unpaid bill{unpaidBills.length > 1 ? "s" : ""}</span> require attention.
          </p>
          <Link
            href="/billing"
            className="ml-auto shrink-0 rounded-lg bg-amber-500 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-600"
          >
            Review
          </Link>
        </div>
      )}

      {/* ── Charts Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 backdrop-blur-sm">
          <SectionHeader
            title="Revenue vs Expenses"
            sub="Monthly financial overview"
            href="/billing"
            hrefLabel="View billing"
          />
          {loading ? <ChartSkeleton /> : <RevenueChart data={revenueData} />}
        </div>

        {/* Appointment Chart */}
        <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 backdrop-blur-sm">
          <SectionHeader
            title="Weekly Appointments"
            sub="Scheduled vs completed vs cancelled"
            href="/appointments"
            hrefLabel="View appointments"
          />
          {loading ? <ChartSkeleton /> : <AppointmentChart data={appointmentData} />}
        </div>
      </div>

      {/* Patient Trend Chart */}
      <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 backdrop-blur-sm">
        <SectionHeader
          title="Patient Flow"
          sub="New admissions vs discharges per month"
          href="/patients"
          hrefLabel="View patients"
        />
        {loading ? <ChartSkeleton /> : <PatientChart data={patientData} />}
      </div>

      {/* ── Quick Actions ────────────────────────────────────────────────────── */}
      <div>
        <SectionHeader title="Quick Actions" sub="Common tasks at a glance" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((qa) => (
            <QuickAction key={qa.label} {...qa} />
          ))}
        </div>
      </div>

      {/* ── Bottom Grid: Tables ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Recent Appointments */}
        <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 backdrop-blur-sm">
          <SectionHeader title="Recent Appointments" href="/appointments" />
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : recentAppointments.length === 0 ? (
            <EmptyState icon={CalendarDays} message="No appointments found." />
          ) : (
            <div className="divide-y divide-[#E8F0EE] dark:divide-white/10">
              {recentAppointments.map((appt, i) => {
                const patientName =
                  appt.patientName ||
                  (appt.patient?.name) ||
                  `Patient #${String(appt.patientId || appt.patient?._id || "").slice(-4) || (i + 1)}`;
                const doctorName =
                  appt.doctorName ||
                  (appt.doctor?.name) ||
                  `Dr. ${String(appt.doctorId || appt.doctor?._id || "").slice(-4) || "—"}`;
                const apptDate = new Date(appt.date || appt.appointmentDate || appt.createdAt);
                return (
                  <div key={appt._id || i} className="flex items-center gap-3 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F766E]/10 text-sm font-bold text-[#0F766E]">
                      {patientName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#17201D] dark:text-white">
                        {patientName}
                      </p>
                      <p className="truncate text-xs text-[#6B8C84]">
                        {doctorName} · {isNaN(apptDate) ? "—" : apptDate.toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Patients */}
        <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 backdrop-blur-sm">
          <SectionHeader title="Recent Patients" href="/patients" />
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : recentPatients.length === 0 ? (
            <EmptyState icon={Users} message="No patients found." />
          ) : (
            <div className="divide-y divide-[#E8F0EE] dark:divide-white/10">
              {recentPatients.map((patient, i) => {
                const name = patient.name || patient.fullName || `Patient #${i + 1}`;
                const dob = patient.dateOfBirth || patient.dob;
                const age = dob
                  ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 3600 * 1000))
                  : null;
                return (
                  <div key={patient._id || i} className="flex items-center gap-3 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-sm font-bold text-purple-600 dark:text-purple-400">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#17201D] dark:text-white">
                        {name}
                      </p>
                      <p className="truncate text-xs text-[#6B8C84]">
                        {patient.gender ? `${patient.gender} · ` : ""}
                        {age !== null ? `${age} yrs` : "—"}
                        {patient.bloodGroup ? ` · ${patient.bloodGroup}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-[#9BB5AE]">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Bed Status + Lab Tests Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Bed Status */}
        <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 backdrop-blur-sm">
          <SectionHeader title="Bed Availability" href="/beds" />
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : beds.length === 0 ? (
            <EmptyState icon={BedDouble} message="No bed data available." />
          ) : (
            <>
              {/* Summary bar */}
              <div className="mb-4 overflow-hidden rounded-full bg-[#E8F0EE] dark:bg-white/10" style={{ height: 8 }}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0F766E] to-[#10B981] transition-all duration-700"
                  style={{ width: `${100 - bedOccupancy}%` }}
                />
              </div>
              <div className="mb-3 flex gap-4 text-xs text-[#6B8C84]">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  {availableBeds} Available
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                  {occupiedBeds} Occupied
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
                  {beds.filter((b) => (b.status || "").toLowerCase() === "maintenance").length} Maintenance
                </span>
              </div>
              <div className="divide-y divide-[#E8F0EE] dark:divide-white/10">
                {beds.slice(0, 5).map((bed, i) => (
                  <div key={bed._id || i} className="flex items-center gap-3 py-2.5">
                    <BedDouble size={16} className="shrink-0 text-[#6B8C84]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#17201D] dark:text-white">
                        {bed.bedNumber || bed.number || `Bed ${i + 1}`}
                      </p>
                      <p className="text-xs text-[#9BB5AE]">
                        {bed.ward?.name || bed.wardName || bed.type || "General"}
                      </p>
                    </div>
                    <StatusBadge status={bed.status} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pending Lab Tests */}
        <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 backdrop-blur-sm">
          <SectionHeader title="Pending Lab Tests" href="/laboratory" />
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : pendingLabs.length === 0 ? (
            <EmptyState icon={CheckCircle2} message="No pending lab tests!" success />
          ) : (
            <div className="divide-y divide-[#E8F0EE] dark:divide-white/10">
              {pendingLabs.slice(0, 5).map((test, i) => {
                const patientName =
                  test.patientName ||
                  test.patient?.name ||
                  `Patient #${String(test.patientId || "").slice(-4) || (i + 1)}`;
                const testName = test.testName || test.name || test.type || "Lab Test";
                return (
                  <div key={test._id || i} className="flex items-center gap-3 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                      <FlaskConical size={14} className="text-red-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#17201D] dark:text-white">
                        {testName}
                      </p>
                      <p className="truncate text-xs text-[#9BB5AE]">{patientName}</p>
                    </div>
                    <StatusBadge status={test.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Billings ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 backdrop-blur-sm">
        <SectionHeader title="Recent Billing" sub="Latest invoices" href="/billing" />
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : recentBillings.length === 0 ? (
          <EmptyState icon={DollarSign} message="No billing records found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-[#9BB5AE]">
                  <th className="pb-3 pr-4">Patient</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8F0EE] dark:divide-white/10">
                {recentBillings.map((bill, i) => {
                  const patientName =
                    bill.patientName ||
                    bill.patient?.name ||
                    `Patient #${String(bill.patientId || "").slice(-4) || (i + 1)}`;
                  const amount = Number(bill.totalAmount || bill.total || 0);
                  const date = new Date(bill.createdAt || bill.date);
                  return (
                    <tr key={bill._id || i} className="group">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0F766E]/10 text-xs font-bold text-[#0F766E]">
                            {patientName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-[#17201D] dark:text-white">{patientName}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-[#17201D] dark:text-white">
                        ₹{amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pr-4 text-[#6B8C84]">
                        {isNaN(date) ? "—" : date.toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={bill.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, message, success = false }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <Icon
        size={32}
        className={success ? "text-emerald-400" : "text-[#C8DDD7] dark:text-[#2A4A44]"}
      />
      <p className="text-sm text-[#9BB5AE]">{message}</p>
    </div>
  );
}