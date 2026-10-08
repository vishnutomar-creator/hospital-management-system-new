"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BedDouble,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  HeartPulse,
  Pill,
  Plus,
  RefreshCw,
  Save,
  ShieldAlert,
  Stethoscope,
  Thermometer,
  User,
  Users,
} from "lucide-react";
import {
  getIPDPatientById,
  getPatientVitals,
  savePatientVital,
} from "../../../../utils/nursingStore";

export default function PatientVitalsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.patientId;

  const [patient, setPatient] = useState(null);
  const [vitalsList, setVitalsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [form, setForm] = useState({
    temp: "37.0",
    bpSystolic: "120",
    bpDiastolic: "80",
    pulse: "75",
    spo2: "98",
    resp: "16",
    consciousness: "Alert",
    nurseName: "Sarah Jenkins, RN",
    notes: "",
  });

  const loadData = () => {
    if (!patientId) return;
    setLoading(true);
    const p = getIPDPatientById(patientId);
    setPatient(p);
    const vitals = getPatientVitals(patientId);
    setVitalsList(vitals);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handler = () => {
      const vitals = getPatientVitals(patientId);
      setVitalsList(vitals);
    };
    window.addEventListener("hms_vitals_updated", handler);
    return () => window.removeEventListener("hms_vitals_updated", handler);
  }, [patientId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientId) return;

    const newRecord = {
      temp: parseFloat(form.temp) || 37.0,
      bpSystolic: parseInt(form.bpSystolic, 10) || 120,
      bpDiastolic: parseInt(form.bpDiastolic, 10) || 80,
      pulse: parseInt(form.pulse, 10) || 75,
      spo2: parseInt(form.spo2, 10) || 98,
      resp: parseInt(form.resp, 10) || 16,
      consciousness: form.consciousness,
      nurseName: form.nurseName || "Staff Nurse, RN",
      notes: form.notes,
    };

    const updated = savePatientVital(patientId, newRecord);
    setVitalsList(updated);
    setSuccessMsg("Vitals reading logged successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);

    // Reset notes
    setForm((prev) => ({
      ...prev,
      notes: "",
    }));
  };

  if (!patient && !loading) {
    return (
      <div className="min-h-screen bg-[#F7F4ED] p-7 text-center dark:bg-[#101614]">
        <p className="text-sm text-[#7B8882]">Patient record not found.</p>
        <Link
          href="/nursing"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} /> Return to Nursing Station
        </Link>
      </div>
    );
  }

  // Calculate vital sign warnings for current form values
  const currentTemp = parseFloat(form.temp);
  const currentSystolic = parseInt(form.bpSystolic, 10);
  const currentDiastolic = parseInt(form.bpDiastolic, 10);
  const currentPulse = parseInt(form.pulse, 10);
  const currentSpO2 = parseInt(form.spo2, 10);
  const currentResp = parseInt(form.resp, 10);

  const warnings = [];
  if (currentTemp >= 38.5) warnings.push("High Fever / Pyrexia (> 38.5°C)");
  else if (currentTemp >= 37.8) warnings.push("Low-Grade Fever (37.8 - 38.4°C)");
  if (currentSystolic >= 160 || currentDiastolic >= 100) warnings.push("Stage 2 Hypertension (BP ≥ 160/100)");
  else if (currentSystolic <= 90 || currentDiastolic <= 60) warnings.push("Hypotension (BP ≤ 90/60)");
  if (currentPulse >= 105) warnings.push("Tachycardia (Pulse > 100 bpm)");
  else if (currentPulse <= 55) warnings.push("Bradycardia (Pulse < 60 bpm)");
  if (currentSpO2 < 92) warnings.push("Critical Hypoxia (SpO2 < 92%) — Supplemental O2 Required");
  else if (currentSpO2 < 95) warnings.push("Borderline Low SpO2 (< 95%)");
  if (currentResp >= 24) warnings.push("Tachypnea (RR ≥ 24 bpm)");

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">
      {/* Top Breadcrumbs & Back */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/nursing"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] bg-white text-[#52615B] shadow-sm transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-[#87938E]">
              <span>Nursing Station</span>
              <ChevronRight size={13} />
              <span>Inpatients</span>
              <ChevronRight size={13} />
              <span className="text-[#0F766E] font-medium">Vitals Record</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">
              Patient Vitals Monitoring
            </h1>
          </div>
        </div>

        {/* Quick Nav Tabs for Current Patient */}
        <div className="flex items-center gap-2 rounded-2xl border border-[#E3E0D7] bg-white p-1.5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <Link
            href={`/nursing/${encodeURIComponent(patientId)}/vitals`}
            className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
          >
            <Thermometer size={14} />
            <span>Vitals</span>
          </Link>
          <Link
            href={`/nursing/${encodeURIComponent(patientId)}/medication`}
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-[#7B8882] transition hover:bg-[#F7F4ED] hover:text-[#17201D] dark:text-[#87938E] dark:hover:bg-[#202B27] dark:hover:text-white"
          >
            <Pill size={14} />
            <span>Medications (MAR)</span>
          </Link>
          <Link
            href={`/nursing/${encodeURIComponent(patientId)}/notes`}
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-[#7B8882] transition hover:bg-[#F7F4ED] hover:text-[#17201D] dark:text-[#87938E] dark:hover:bg-[#202B27] dark:hover:text-white"
          >
            <ClipboardCheck size={14} />
            <span>Notes Log</span>
          </Link>
        </div>
      </div>

      {/* Patient Demographic Banner */}
      {patient && (
        <div className="mb-6 rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F766E] to-teal-700 text-lg font-bold text-white shadow-sm">
                {patient.patient
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-bold text-[#17201D] dark:text-white">
                    {patient.patient}
                  </h2>
                  <span className="rounded-lg bg-[#E7F5F2] px-2.5 py-0.5 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                    {patient.ipdNumber}
                  </span>
                  <span className="rounded-lg bg-[#F7F4ED] px-2.5 py-0.5 text-xs font-semibold text-[#17201D] dark:bg-[#202B27] dark:text-white">
                    {patient.ward} • {patient.bedNumber}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#7B8882] dark:text-[#87938E]">
                  <span>Age: <strong className="text-[#17201D] dark:text-white">{patient.age}y</strong></span>
                  <span>•</span>
                  <span>Gender: <strong className="text-[#17201D] dark:text-white">{patient.gender}</strong></span>
                  <span>•</span>
                  <span>Blood Group: <strong className="text-[#0F766E] dark:text-[#5EEAD4]">{patient.bloodGroup}</strong></span>
                  <span>•</span>
                  <span>Doctor: <strong className="text-[#17201D] dark:text-white">{patient.doctor}</strong></span>
                  <span>•</span>
                  <span>Diagnosis: <strong className="text-[#17201D] dark:text-white">{patient.diagnosis}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-[#E3E0D7] pt-3 lg:border-t-0 lg:pt-0 dark:border-white/10">
              <div className="rounded-xl bg-[#FAFAF7] px-3 py-2 text-right text-xs dark:bg-[#202B27]">
                <div className="text-[10px] text-[#7B8882] dark:text-[#87938E]">Acuity Status</div>
                <div className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">{patient.acuity}</div>
              </div>
              <div className="rounded-xl bg-[#FAFAF7] px-3 py-2 text-right text-xs dark:bg-[#202B27]">
                <div className="text-[10px] text-[#7B8882] dark:text-[#87938E]">Admission Date</div>
                <div className="font-bold text-[#17201D] dark:text-white">{patient.admissionDate}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 size={18} className="text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Main Content: Record Form + History List */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Vitals Form */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
            <div className="flex items-center justify-between border-b border-[#E3E0D7]/60 pb-3 dark:border-white/10">
              <h3 className="flex items-center gap-2 text-base font-bold text-[#17201D] dark:text-white">
                <Thermometer size={18} className="text-[#0F766E]" />
                Record New Vitals
              </h3>
              <span className="text-xs font-semibold text-[#7B8882] dark:text-[#87938E]">
                Shift: Day (07-15h)
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Temperature */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#17201D] dark:text-white">
                    Temperature (°C)
                  </label>
                  <span className="text-[11px] text-[#7B8882]">Normal: 36.5 - 37.5°C</span>
                </div>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="32"
                    max="43"
                    required
                    value={form.temp}
                    onChange={(e) => setForm({ ...form, temp: e.target.value })}
                    className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm font-semibold text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                  />
                  {["36.8", "37.2", "38.5"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, temp: t })}
                      className="rounded-xl border border-[#DDD9CE] bg-white px-2.5 py-1 text-xs font-semibold text-[#52615B] hover:border-[#0F766E] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
                    >
                      {t}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Blood Pressure */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#17201D] dark:text-white">
                    Blood Pressure (mmHg)
                  </label>
                  <span className="text-[11px] text-[#7B8882]">Normal: 120 / 80 mmHg</span>
                </div>
                <div className="mt-1.5 grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      required
                      placeholder="Systolic"
                      value={form.bpSystolic}
                      onChange={(e) => setForm({ ...form, bpSystolic: e.target.value })}
                      className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm font-semibold text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                    />
                    <span className="mt-1 block text-[10px] text-[#7B8882]">Systolic (90-139)</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      required
                      placeholder="Diastolic"
                      value={form.bpDiastolic}
                      onChange={(e) => setForm({ ...form, bpDiastolic: e.target.value })}
                      className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm font-semibold text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                    />
                    <span className="mt-1 block text-[10px] text-[#7B8882]">Diastolic (60-89)</span>
                  </div>
                </div>
              </div>

              {/* Pulse & SpO2 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#17201D] dark:text-white">
                      Pulse (bpm)
                    </label>
                  </div>
                  <input
                    type="number"
                    required
                    min="30"
                    max="220"
                    value={form.pulse}
                    onChange={(e) => setForm({ ...form, pulse: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm font-semibold text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                  />
                  <span className="mt-1 block text-[10px] text-[#7B8882]">Normal: 60 - 100 bpm</span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#17201D] dark:text-white">
                      SpO2 (%)
                    </label>
                  </div>
                  <input
                    type="number"
                    required
                    min="50"
                    max="100"
                    value={form.spo2}
                    onChange={(e) => setForm({ ...form, spo2: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm font-semibold text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                  />
                  <span className="mt-1 block text-[10px] text-[#7B8882]">Normal: 95 - 100%</span>
                </div>
              </div>

              {/* Respiration & Consciousness */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#17201D] dark:text-white">
                    Respiration (bpm)
                  </label>
                  <input
                    type="number"
                    required
                    min="6"
                    max="60"
                    value={form.resp}
                    onChange={(e) => setForm({ ...form, resp: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm font-semibold text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                  />
                  <span className="mt-1 block text-[10px] text-[#7B8882]">Normal: 12 - 20 bpm</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#17201D] dark:text-white">
                    Consciousness
                  </label>
                  <select
                    value={form.consciousness}
                    onChange={(e) => setForm({ ...form, consciousness: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2.5 text-sm font-semibold text-[#17201D] outline-none transition focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                  >
                    <option value="Alert">Alert (A)</option>
                    <option value="Voice">Responsive to Voice (V)</option>
                    <option value="Pain">Responsive to Pain (P)</option>
                    <option value="Unresponsive">Unresponsive (U)</option>
                  </select>
                  <span className="mt-1 block text-[10px] text-[#7B8882]">AVPU Scale</span>
                </div>
              </div>

              {/* Nurse Name */}
              <div>
                <label className="text-xs font-bold text-[#17201D] dark:text-white">
                  Recorded By (Nurse Name)
                </label>
                <input
                  type="text"
                  required
                  value={form.nurseName}
                  onChange={(e) => setForm({ ...form, nurseName: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2 text-sm text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                />
              </div>

              {/* Clinical Remarks */}
              <div>
                <label className="text-xs font-bold text-[#17201D] dark:text-white">
                  Clinical Observations / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Patient resting comfortably, O2 given via cannula..."
                  className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                />
              </div>

              {/* Real-time Triage Alert Box */}
              {warnings.length > 0 && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle size={14} className="text-red-600" />
                    Clinical Warning Flags Detected:
                  </div>
                  <ul className="mt-1.5 list-inside list-disc space-y-0.5">
                    {warnings.map((w, idx) => (
                      <li key={idx} className="font-semibold">
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B625C]"
              >
                <Save size={16} />
                Save Vitals Record
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Vitals History Table */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
            <div className="flex items-center justify-between border-b border-[#E3E0D7]/60 pb-3 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold text-[#17201D] dark:text-white">
                  Vitals Timeline & History
                </h3>
                <p className="text-xs text-[#7B8882] dark:text-[#87938E]">
                  Serial readings sorted latest first ({vitalsList.length} total readings recorded)
                </p>
              </div>
              <span className="rounded-full bg-[#0F766E]/10 px-3 py-1 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                Live Sync
              </span>
            </div>

            {vitalsList.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#7B8882] dark:text-[#87938E]">
                No vitals recorded yet. Use the form on the left to record the first entry.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E3E0D7] text-[#7B8882] dark:border-white/10 dark:text-[#87938E]">
                      <th className="pb-3 font-semibold">Date / Time</th>
                      <th className="pb-3 font-semibold">Temp</th>
                      <th className="pb-3 font-semibold">BP (mmHg)</th>
                      <th className="pb-3 font-semibold">Pulse</th>
                      <th className="pb-3 font-semibold">SpO2</th>
                      <th className="pb-3 font-semibold">Resp</th>
                      <th className="pb-3 font-semibold">Nurse</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3E0D7]/60 dark:divide-white/10">
                    {vitalsList.map((v, i) => {
                      const isHighTemp = v.temp >= 38.0;
                      const isLowSpO2 = v.spo2 < 95;
                      const isHighBP = v.bpSystolic >= 140 || v.bpDiastolic >= 90;

                      return (
                        <tr
                          key={v.id || i}
                          className={`transition hover:bg-[#FAFAF7] dark:hover:bg-[#202B27] ${
                            i === 0 ? "bg-[#0F766E]/5 dark:bg-[#0F766E]/10" : ""
                          }`}
                        >
                          <td className="py-3.5 pr-2 font-medium text-[#17201D] dark:text-white">
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} className="text-[#0F766E]" />
                              <span>{v.timestamp}</span>
                            </div>
                            {i === 0 && (
                              <span className="mt-0.5 inline-block rounded bg-[#0F766E] px-1.5 py-0.2 text-[9px] font-bold text-white">
                                Latest
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 pr-2">
                            <span
                              className={`font-bold ${
                                isHighTemp ? "text-red-600 font-extrabold" : "text-[#17201D] dark:text-white"
                              }`}
                            >
                              {v.temp}°C
                            </span>
                          </td>
                          <td className="py-3.5 pr-2">
                            <span
                              className={`font-bold ${
                                isHighBP ? "text-amber-700 font-extrabold dark:text-amber-400" : "text-[#17201D] dark:text-white"
                              }`}
                            >
                              {v.bpSystolic}/{v.bpDiastolic}
                            </span>
                          </td>
                          <td className="py-3.5 pr-2">
                            <span className="font-bold text-[#17201D] dark:text-white">
                              {v.pulse}
                            </span>{" "}
                            <span className="text-[10px] text-[#7B8882]">bpm</span>
                          </td>
                          <td className="py-3.5 pr-2">
                            <span
                              className={`rounded-md px-1.5 py-0.5 font-bold ${
                                isLowSpO2
                                  ? "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                                  : "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                              }`}
                            >
                              {v.spo2}%
                            </span>
                          </td>
                          <td className="py-3.5 pr-2 text-[#17201D] dark:text-white">
                            {v.resp} <span className="text-[10px] text-[#7B8882]">/min</span>
                          </td>
                          <td className="py-3.5">
                            <div className="font-semibold text-[#17201D] dark:text-white">
                              {v.nurseName}
                            </div>
                            {v.notes && (
                              <p className="mt-0.5 text-[10px] text-[#7B8882] dark:text-[#87938E] line-clamp-1">
                                {v.notes}
                              </p>
                            )}
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
      </div>
    </div>
  );
}
