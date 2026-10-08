"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BedDouble,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Filter,
  Flame,
  Heart,
  HeartPulse,
  Pill,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Thermometer,
  User,
  Users,
} from "lucide-react";
import { getIPDPatients, getPatientVitals, getPatientMedications, getPatientNotes } from "../../utils/nursingStore";
import { getBedsFromStorage } from "../../utils/bedStore";

const ACUITY_STYLES = {
  Critical: {
    badge: "bg-red-500/10 text-red-600 border border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
    dot: "bg-red-500 animate-pulse",
    avatar: "from-red-500 to-rose-600",
  },
  Observation: {
    badge: "bg-amber-500/10 text-amber-700 border border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400",
    dot: "bg-amber-500",
    avatar: "from-amber-500 to-orange-600",
  },
  "Post-Op": {
    badge: "bg-purple-500/10 text-purple-700 border border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400",
    dot: "bg-purple-500",
    avatar: "from-purple-500 to-indigo-600",
  },
  Stable: {
    badge: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
    dot: "bg-emerald-500",
    avatar: "from-emerald-500 to-teal-600",
  },
};

const WARDS_LIST = [
  "All Wards",
  "ICU",
  "General Medicine Ward",
  "Cardiology Ward A",
  "Orthopedic Ward A",
  "Private Care Ward",
  "Pediatric Ward",
  "Emergency Unit",
  "Neurology Ward B",
];

export default function NursingDashboardPage() {
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("All Wards");
  const [acuityFilter, setAcuityFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    const ipdList = getIPDPatients();
    const bedList = getBedsFromStorage();
    setPatients(ipdList);
    setBeds(bedList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const refreshHandler = () => loadData();
    window.addEventListener("hms_vitals_updated", refreshHandler);
    window.addEventListener("hms_mar_updated", refreshHandler);
    window.addEventListener("hms_notes_updated", refreshHandler);
    window.addEventListener("hms_beds_updated", refreshHandler);
    window.addEventListener("storage", refreshHandler);

    return () => {
      window.removeEventListener("hms_vitals_updated", refreshHandler);
      window.removeEventListener("hms_mar_updated", refreshHandler);
      window.removeEventListener("hms_notes_updated", refreshHandler);
      window.removeEventListener("hms_beds_updated", refreshHandler);
      window.removeEventListener("storage", refreshHandler);
    };
  }, []);

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.patient.toLowerCase().includes(q) ||
      p.ipdNumber.toLowerCase().includes(q) ||
      p.bedNumber.toLowerCase().includes(q) ||
      p.doctor.toLowerCase().includes(q) ||
      p.diagnosis.toLowerCase().includes(q);

    const matchWard = wardFilter === "All Wards" || p.ward === wardFilter;
    const matchAcuity = acuityFilter === "All" || p.acuity === acuityFilter;

    return matchSearch && matchWard && matchAcuity;
  });

  // Calculate summary metrics
  const totalPatients = patients.length;
  const criticalCount = patients.filter((p) => p.acuity === "Critical").length;
  const observationCount = patients.filter((p) => p.acuity === "Observation" || p.acuity === "Post-Op").length;
  const totalOccupiedBeds = beds.filter((b) => b.status === "Occupied").length;

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">
      {/* Top Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#87938E]">
            <span>Hospital Operations</span>
            <ChevronRight size={13} />
            <span className="text-[#0F766E] font-medium">Nursing Station</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">
              Nursing Station
            </h1>
            <span className="flex items-center gap-1.5 rounded-full bg-[#0F766E]/10 px-3 py-1 text-xs font-semibold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
              <span className="h-2 w-2 rounded-full bg-[#0F766E] animate-ping" />
              Live Inpatient Unit
            </span>
          </div>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage assigned IPD patients, record serial vitals, administer medications, and log shift notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#52615B] shadow-sm transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/admissions/new"
            className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#52615B] shadow-sm transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
          >
            <BedDouble size={16} />
            Admit Patient
          </Link>
          <Link
            href="/nurses"
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B625C]"
          >
            <Users size={16} />
            Nurse Roster
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Admitted */}
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7B8882] dark:text-[#87938E]">
              Assigned Inpatients
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#17201D] dark:text-white">
              {totalPatients}
            </span>
            <span className="text-xs text-[#7B8882] dark:text-[#87938E]">
              Active in IPD
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#0F766E] font-medium">
            <CheckCircle2 size={13} />
            All assigned to active ward beds
          </div>
        </div>

        {/* Critical Cases */}
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7B8882] dark:text-[#87938E]">
              Critical / High Alert
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
              <Flame size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-600 dark:text-red-400">
              {criticalCount}
            </span>
            <span className="text-xs text-[#7B8882] dark:text-[#87938E]">
              Require Q2H monitoring
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
            <AlertTriangle size={13} />
            ICU bed continuous telemetry
          </div>
        </div>

        {/* Step-down & Observation */}
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7B8882] dark:text-[#87938E]">
              Observation & Post-Op
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <HeartPulse size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#17201D] dark:text-white">
              {observationCount}
            </span>
            <span className="text-xs text-[#7B8882] dark:text-[#87938E]">
              Patients under watch
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
            <Clock size={13} />
            Post-op & cardiac monitoring
          </div>
        </div>

        {/* Live Ward Bed Load */}
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7B8882] dark:text-[#87938E]">
              Occupied Beds
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <BedDouble size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#17201D] dark:text-white">
              {totalOccupiedBeds}
            </span>
            <span className="text-xs text-[#7B8882] dark:text-[#87938E]">
              / {beds.length} Total Hospital Beds
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#0F766E] font-medium">
            <Building2 size={13} />
            Live sync with Wards & Admissions
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-6 rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B8882] dark:text-[#87938E]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Patient name, IPD #, Bed, Diagnosis, or Doctor..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2.5 pl-10 pr-4 text-sm text-[#17201D] placeholder-[#7B8882] outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder-[#87938E]"
            />
          </div>

          {/* Ward Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7B8882] dark:text-[#87938E]">
              <Building2 size={14} />
              Ward:
            </div>
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-xs font-semibold text-[#17201D] outline-none transition focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
            >
              {WARDS_LIST.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>

            {/* Acuity Filter Pills */}
            <div className="flex items-center gap-1 rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] p-1 dark:border-white/10 dark:bg-[#202B27]">
              {["All", "Critical", "Observation", "Post-Op", "Stable"].map((ac) => (
                <button
                  key={ac}
                  onClick={() => setAcuityFilter(ac)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    acuityFilter === ac
                      ? "bg-[#0F766E] text-white shadow-sm"
                      : "text-[#7B8882] hover:text-[#17201D] dark:text-[#87938E] dark:hover:text-white"
                  }`}
                >
                  {ac}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Patients Card Grid */}
      {filteredPatients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DDD9CE] bg-white/50 p-12 text-center dark:border-white/10 dark:bg-[#18211E]/50">
          <HeartPulse size={40} className="mx-auto text-[#87938E] opacity-50" />
          <h3 className="mt-3 text-base font-bold text-[#17201D] dark:text-white">
            No Inpatient Records Found
          </h3>
          <p className="mt-1 text-xs text-[#7B8882] dark:text-[#87938E]">
            Try adjusting your search criteria or ward filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map((patient) => {
            const vitals = getPatientVitals(patient.admissionId);
            const latestVital = vitals.length > 0 ? vitals[0] : null;
            const meds = getPatientMedications(patient.admissionId, patient.patient);
            const notes = getPatientNotes(patient.admissionId);
            const acuityStyle = ACUITY_STYLES[patient.acuity] || ACUITY_STYLES.Stable;

            return (
              <div
                key={patient.admissionId}
                className="group flex flex-col justify-between rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition hover:border-[#0F766E]/40 hover:shadow-md dark:border-white/10 dark:bg-[#18211E] dark:hover:border-[#0F766E]/50"
              >
                <div>
                  {/* Card Header: Patient Identity & Acuity */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${acuityStyle.avatar} text-base font-bold text-white shadow-sm`}
                      >
                        {patient.patient
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#17201D] group-hover:text-[#0F766E] transition dark:text-white dark:group-hover:text-[#5EEAD4]">
                            {patient.patient}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#7B8882] dark:text-[#87938E]">
                          <span>{patient.age}y • {patient.gender}</span>
                          <span>•</span>
                          <span className="font-semibold text-[#0F766E] dark:text-[#5EEAD4]">
                            {patient.bloodGroup}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Acuity Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${acuityStyle.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${acuityStyle.dot}`} />
                      {patient.acuity}
                    </span>
                  </div>

                  {/* Ward & Bed Tag + IPD */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7F4ED] px-2.5 py-1 text-xs font-semibold text-[#17201D] dark:bg-[#202B27] dark:text-white">
                      <BedDouble size={13} className="text-[#0F766E]" />
                      {patient.ward} • {patient.bedNumber}
                    </span>
                    <span className="rounded-lg bg-[#E7F5F2] px-2 py-1 text-[11px] font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                      {patient.ipdNumber}
                    </span>
                  </div>

                  {/* Clinical Details */}
                  <div className="mt-3.5 space-y-2 border-t border-[#E3E0D7]/60 pt-3 text-xs dark:border-white/10">
                    <div className="flex items-center justify-between text-[#7B8882] dark:text-[#87938E]">
                      <span className="flex items-center gap-1.5">
                        <Stethoscope size={13} className="text-[#0F766E]" /> Attending Doctor:
                      </span>
                      <span className="font-semibold text-[#17201D] dark:text-white">
                        {patient.doctor}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 text-[#7B8882] dark:text-[#87938E]">
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <ClipboardList size={13} className="text-[#0F766E]" /> Diagnosis:
                      </span>
                      <span className="text-right font-medium text-[#17201D] dark:text-white line-clamp-1">
                        {patient.diagnosis}
                      </span>
                    </div>

                    {patient.allergies && patient.allergies !== "None Known" && (
                      <div className="flex items-center justify-between rounded-lg bg-red-500/5 px-2 py-1 text-[11px] text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        <span className="flex items-center gap-1 font-bold">
                          <AlertTriangle size={11} /> Allergy Alert:
                        </span>
                        <span className="font-semibold">{patient.allergies}</span>
                      </div>
                    )}
                  </div>

                  {/* Latest Vitals Strip */}
                  <div className="mt-3.5 rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] p-2.5 dark:border-white/10 dark:bg-[#202B27]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#7B8882] dark:text-[#87938E]">
                      <span className="flex items-center gap-1">
                        <Activity size={12} className="text-[#0F766E]" />
                        Latest Vitals
                      </span>
                      <span className="text-[10px]">
                        {latestVital ? latestVital.timestamp.slice(11, 16) : "No record"}
                      </span>
                    </div>

                    {latestVital ? (
                      <div className="mt-2 grid grid-cols-4 gap-1.5 text-center">
                        <div className="rounded-lg bg-white p-1.5 shadow-2xs dark:bg-[#18211E]">
                          <div className="text-[9px] font-semibold text-[#7B8882]">TEMP</div>
                          <div className={`text-xs font-bold ${latestVital.temp > 38 ? "text-red-600 font-extrabold" : "text-[#17201D] dark:text-white"}`}>
                            {latestVital.temp}°C
                          </div>
                        </div>
                        <div className="rounded-lg bg-white p-1.5 shadow-2xs dark:bg-[#18211E]">
                          <div className="text-[9px] font-semibold text-[#7B8882]">BP</div>
                          <div className="text-xs font-bold text-[#17201D] dark:text-white">
                            {latestVital.bpSystolic}/{latestVital.bpDiastolic}
                          </div>
                        </div>
                        <div className="rounded-lg bg-white p-1.5 shadow-2xs dark:bg-[#18211E]">
                          <div className="text-[9px] font-semibold text-[#7B8882]">PULSE</div>
                          <div className="text-xs font-bold text-[#17201D] dark:text-white">
                            {latestVital.pulse} <span className="text-[9px] font-normal">bpm</span>
                          </div>
                        </div>
                        <div className="rounded-lg bg-white p-1.5 shadow-2xs dark:bg-[#18211E]">
                          <div className="text-[9px] font-semibold text-[#7B8882]">SpO2</div>
                          <div className={`text-xs font-bold ${latestVital.spo2 < 95 ? "text-red-600 font-extrabold" : "text-[#0F766E] dark:text-[#5EEAD4]"}`}>
                            {latestVital.spo2}%
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1.5 text-center text-xs text-[#7B8882] dark:text-[#87938E]">
                        No vitals logged yet today
                      </div>
                    )}
                  </div>
                </div>

                {/* 3 Action Buttons */}
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#E3E0D7]/60 pt-3 dark:border-white/10">
                  <Link
                    href={`/nursing/${encodeURIComponent(patient.admissionId)}/vitals`}
                    className="flex flex-col items-center justify-center rounded-xl border border-[#DDD9CE] bg-white p-2 text-center text-xs font-bold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
                  >
                    <div className="flex items-center gap-1">
                      <Thermometer size={13} className="text-[#0F766E]" />
                      <span>Vitals</span>
                    </div>
                    <span className="mt-0.5 text-[10px] font-normal text-[#7B8882] dark:text-[#87938E]">
                      {vitals.length} records
                    </span>
                  </Link>

                  <Link
                    href={`/nursing/${encodeURIComponent(patient.admissionId)}/medication`}
                    className="flex flex-col items-center justify-center rounded-xl border border-[#DDD9CE] bg-white p-2 text-center text-xs font-bold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
                  >
                    <div className="flex items-center gap-1">
                      <Pill size={13} className="text-[#0F766E]" />
                      <span>Meds</span>
                    </div>
                    <span className="mt-0.5 text-[10px] font-normal text-[#7B8882] dark:text-[#87938E]">
                      {meds.length} orders
                    </span>
                  </Link>

                  <Link
                    href={`/nursing/${encodeURIComponent(patient.admissionId)}/notes`}
                    className="flex flex-col items-center justify-center rounded-xl border border-[#DDD9CE] bg-white p-2 text-center text-xs font-bold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
                  >
                    <div className="flex items-center gap-1">
                      <ClipboardCheck size={13} className="text-[#0F766E]" />
                      <span>Notes</span>
                    </div>
                    <span className="mt-0.5 text-[10px] font-normal text-[#7B8882] dark:text-[#87938E]">
                      {notes.length} logs
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
