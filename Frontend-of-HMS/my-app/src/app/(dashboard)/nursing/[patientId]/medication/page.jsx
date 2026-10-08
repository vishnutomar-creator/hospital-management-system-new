"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BedDouble,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  HeartPulse,
  Info,
  Pill,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Stethoscope,
  Thermometer,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  getIPDPatientById,
  getPatientMedications,
  getPatientMedicationLogs,
  recordMedicationAdministration,
} from "../../../../utils/nursingStore";

const NOT_GIVEN_REASONS = [
  "Patient Refused",
  "Patient Fasting / NPO for Procedure",
  "Held per Doctor Order",
  "Patient Nauseous / Vomiting",
  "Vital Signs Contraindication (e.g. Low BP / HR)",
  "Allergic / Adverse Symptom Risk",
  "Medication Temporarily Unavailable in Pharmacy",
  "Patient Sleeping / Unresponsive",
  "Other Clinical Reason",
];

export default function PatientMedicationMARPage() {
  const params = useParams();
  const patientId = params?.patientId;

  const [patient, setPatient] = useState(null);
  const [medOrders, setMedOrders] = useState([]);
  const [marLogs, setMarLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  // Modal State for Administration
  const [activeModal, setActiveModal] = useState(null); // { type: "GIVEN" | "NOT_GIVEN", med: {...} }
  const [modalForm, setModalForm] = useState({
    dose: "",
    nurseName: "Sarah Jenkins, RN",
    reason: NOT_GIVEN_REASONS[0],
    notes: "",
  });

  const loadData = () => {
    if (!patientId) return;
    setLoading(true);
    const p = getIPDPatientById(patientId);
    setPatient(p);
    const meds = getPatientMedications(patientId, p?.patient);
    setMedOrders(meds);
    const logs = getPatientMedicationLogs(patientId);
    setMarLogs(logs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handler = () => {
      const logs = getPatientMedicationLogs(patientId);
      setMarLogs(logs);
    };
    window.addEventListener("hms_mar_updated", handler);
    return () => window.removeEventListener("hms_mar_updated", handler);
  }, [patientId]);

  const openAdministerModal = (med, type) => {
    setActiveModal({ type, med });
    setModalForm({
      dose: med.dose || "1 standard dose",
      nurseName: "Sarah Jenkins, RN",
      reason: NOT_GIVEN_REASONS[0],
      notes: "",
    });
  };

  const handleConfirmAdministration = (e) => {
    e.preventDefault();
    if (!activeModal || !patientId) return;

    const isGiven = activeModal.type === "GIVEN";
    const logEntry = {
      medicineName: `${activeModal.med.name} (${activeModal.med.dose})`,
      dose: modalForm.dose || activeModal.med.dose,
      status: isGiven ? "Given" : "Not Given",
      reason: isGiven ? "" : modalForm.reason + (modalForm.notes ? `: ${modalForm.notes}` : ""),
      nurseName: modalForm.nurseName || "Staff Nurse, RN",
    };

    const updated = recordMedicationAdministration(patientId, logEntry);
    setMarLogs(updated);
    setActiveModal(null);
    setSuccessMsg(
      isGiven
        ? `Marked ${activeModal.med.name} as GIVEN successfully.`
        : `Recorded ${activeModal.med.name} as NOT GIVEN (${modalForm.reason}).`
    );
    setTimeout(() => setSuccessMsg(""), 4000);
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

  const givenCount = marLogs.filter((l) => l.status === "Given").length;
  const notGivenCount = marLogs.filter((l) => l.status === "Not Given").length;

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">
      {/* Top Navigation & Breadcrumbs */}
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
              <span className="text-[#0F766E] font-medium">Medication Administration (MAR)</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">
              Medication Administration Record
            </h1>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex items-center gap-2 rounded-2xl border border-[#E3E0D7] bg-white p-1.5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <Link
            href={`/nursing/${encodeURIComponent(patientId)}/vitals`}
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-[#7B8882] transition hover:bg-[#F7F4ED] hover:text-[#17201D] dark:text-[#87938E] dark:hover:bg-[#202B27] dark:hover:text-white"
          >
            <Thermometer size={14} />
            <span>Vitals</span>
          </Link>
          <Link
            href={`/nursing/${encodeURIComponent(patientId)}/medication`}
            className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
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
                  <span>Doctor: <strong className="text-[#17201D] dark:text-white">{patient.doctor}</strong></span>
                  <span>•</span>
                  <span>Diagnosis: <strong className="text-[#17201D] dark:text-white">{patient.diagnosis}</strong></span>
                </div>
              </div>
            </div>

            {patient.allergies && patient.allergies !== "None Known" && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-700 dark:text-red-400">
                <AlertTriangle size={15} />
                <span>Allergies: {patient.allergies}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 size={18} className="text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Summary KPI Strips */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <div className="text-xs font-semibold text-[#7B8882] dark:text-[#87938E]">Active Orders</div>
          <div className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">{medOrders.length}</div>
          <div className="mt-1 text-[11px] text-[#0F766E] font-medium">Doctor Prescribed</div>
        </div>
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <div className="text-xs font-semibold text-[#7B8882] dark:text-[#87938E]">Administered (Given)</div>
          <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{givenCount}</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">Recorded in MAR</div>
        </div>
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <div className="text-xs font-semibold text-[#7B8882] dark:text-[#87938E]">Withheld (Not Given)</div>
          <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{notGivenCount}</div>
          <div className="mt-1 text-[11px] text-amber-600 font-medium">Documented reasons</div>
        </div>
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <div className="text-xs font-semibold text-[#7B8882] dark:text-[#87938E]">Shift Status</div>
          <div className="mt-1 text-lg font-bold text-[#17201D] dark:text-white">Day Shift</div>
          <div className="mt-1 text-[11px] text-[#7B8882]">07:00 - 15:00</div>
        </div>
      </div>

      {/* Active Medication Orders Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#17201D] dark:text-white">
              Active Inpatient Medication Orders
            </h2>
            <p className="text-xs text-[#7B8882] dark:text-[#87938E]">
              Review prescription orders and document dose administration in real time.
            </p>
          </div>
          <Link
            href="/pharmacy"
            className="flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline dark:text-[#5EEAD4]"
          >
            <Pill size={13} />
            View Pharmacy Orders
          </Link>
        </div>

        {medOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DDD9CE] bg-white/50 p-8 text-center text-sm text-[#7B8882] dark:border-white/10 dark:bg-[#18211E]">
            No active medication orders found for this patient.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
            {medOrders.map((med, index) => (
              <div
                key={med.id || index}
                className="flex flex-col justify-between rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition hover:border-[#0F766E]/40 hover:shadow-md dark:border-white/10 dark:bg-[#18211E]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        <Pill size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#17201D] dark:text-white">
                          {med.name}
                        </h3>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#7B8882] dark:text-[#87938E]">
                          <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">
                            {med.dose}
                          </span>
                          <span>•</span>
                          <span className="rounded bg-[#FAFAF7] px-1.5 py-0.5 font-semibold text-[#17201D] dark:bg-[#202B27] dark:text-white">
                            Route: {med.route}
                          </span>
                          <span>•</span>
                          <span className="rounded bg-[#FAFAF7] px-1.5 py-0.5 font-semibold text-[#17201D] dark:bg-[#202B27] dark:text-white">
                            Freq: {med.frequency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                      {med.status || "Active"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 rounded-xl bg-[#FAFAF7] p-3 text-xs dark:bg-[#202B27]">
                    <div className="flex justify-between text-[#7B8882] dark:text-[#87938E]">
                      <span>Timing / Schedule:</span>
                      <span className="font-semibold text-[#17201D] dark:text-white">
                        {med.timing}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#7B8882] dark:text-[#87938E]">
                      <span>Prescribed By:</span>
                      <span className="font-semibold text-[#17201D] dark:text-white">
                        {med.doctor}
                      </span>
                    </div>
                    {med.instructions && (
                      <div className="flex justify-between text-[#7B8882] dark:text-[#87938E]">
                        <span>Instructions:</span>
                        <span className="font-medium text-[#17201D] dark:text-white text-right">
                          {med.instructions}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Administration Action Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#E3E0D7]/60 pt-3 dark:border-white/10">
                  <button
                    onClick={() => openAdministerModal(med, "GIVEN")}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    <Check size={14} />
                    Mark Given
                  </button>
                  <button
                    onClick={() => openAdministerModal(med, "NOT_GIVEN")}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-500/20 dark:text-amber-300"
                  >
                    <X size={14} />
                    Mark Not Given
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MAR Administration Log Table */}
      <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
        <div className="flex items-center justify-between border-b border-[#E3E0D7]/60 pb-3 dark:border-white/10">
          <div>
            <h2 className="text-base font-bold text-[#17201D] dark:text-white">
              Medication Administration History (MAR Audit Log)
            </h2>
            <p className="text-xs text-[#7B8882] dark:text-[#87938E]">
              Timestamped record of all administered and withheld medications.
            </p>
          </div>
          <span className="rounded-full bg-[#0F766E]/10 px-3 py-1 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
            {marLogs.length} Records Logged
          </span>
        </div>

        {marLogs.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#7B8882] dark:text-[#87938E]">
            No medication administrations recorded yet.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E3E0D7] text-[#7B8882] dark:border-white/10 dark:text-[#87938E]">
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">Medication</th>
                  <th className="pb-3 font-semibold">Dose Administered</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Reason / Notes</th>
                  <th className="pb-3 font-semibold">Nurse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E0D7]/60 dark:divide-white/10">
                {marLogs.map((log, i) => (
                  <tr
                    key={log.id || i}
                    className={`transition hover:bg-[#FAFAF7] dark:hover:bg-[#202B27] ${
                      i === 0 ? "bg-[#0F766E]/5 dark:bg-[#0F766E]/10" : ""
                    }`}
                  >
                    <td className="py-3.5 pr-2 font-medium text-[#17201D] dark:text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-[#0F766E]" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-2 font-bold text-[#17201D] dark:text-white">
                      {log.medicineName}
                    </td>
                    <td className="py-3.5 pr-2 font-semibold text-[#0F766E] dark:text-[#5EEAD4]">
                      {log.dose}
                    </td>
                    <td className="py-3.5 pr-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          log.status === "Given"
                            ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                        }`}
                      >
                        {log.status === "Given" ? <Check size={11} /> : <X size={11} />}
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-[#7B8882] dark:text-[#87938E] max-w-xs">
                      {log.reason ? (
                        <span className="font-medium text-amber-800 dark:text-amber-300">
                          {log.reason}
                        </span>
                      ) : (
                        <span className="text-[#7B8882] italic">Routine administration</span>
                      )}
                    </td>
                    <td className="py-3.5 font-semibold text-[#17201D] dark:text-white whitespace-nowrap">
                      {log.nurseName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Administration Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#E3E0D7] bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#18211E]">
            <div className="flex items-center justify-between border-b border-[#E3E0D7]/60 pb-3 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    activeModal.type === "GIVEN"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {activeModal.type === "GIVEN" ? <Check size={16} /> : <X size={16} />}
                </div>
                <h3 className="text-base font-bold text-[#17201D] dark:text-white">
                  {activeModal.type === "GIVEN" ? "Confirm Dose Administration" : "Document Withheld Dose"}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#7B8882] hover:text-[#17201D] dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmAdministration} className="mt-4 space-y-4">
              <div className="rounded-xl bg-[#FAFAF7] p-3 text-xs dark:bg-[#202B27]">
                <div className="font-bold text-[#17201D] dark:text-white">
                  {activeModal.med.name}
                </div>
                <div className="mt-1 text-[#7B8882] dark:text-[#87938E]">
                  Prescribed Dose: <strong>{activeModal.med.dose}</strong> via <strong>{activeModal.med.route}</strong>
                </div>
                <div className="text-[#7B8882] dark:text-[#87938E]">
                  Patient: <strong>{patient?.patient}</strong> ({patient?.bedNumber})
                </div>
              </div>

              {/* Dose Given Input */}
              <div>
                <label className="text-xs font-bold text-[#17201D] dark:text-white">
                  Actual Dose {activeModal.type === "GIVEN" ? "Administered" : "Withheld"}
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.dose}
                  onChange={(e) => setModalForm({ ...modalForm, dose: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2 text-sm text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                />
              </div>

              {/* Reason (if not given) */}
              {activeModal.type === "NOT_GIVEN" && (
                <div>
                  <label className="text-xs font-bold text-[#17201D] dark:text-white">
                    Reason for Withholding / Not Giving
                  </label>
                  <select
                    value={modalForm.reason}
                    onChange={(e) => setModalForm({ ...modalForm, reason: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-xs font-semibold text-[#17201D] outline-none transition focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                  >
                    {NOT_GIVEN_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Nurse Name */}
              <div>
                <label className="text-xs font-bold text-[#17201D] dark:text-white">
                  Administering Nurse Signature
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.nurseName}
                  onChange={(e) => setModalForm({ ...modalForm, nurseName: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2 text-sm text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="text-xs font-bold text-[#17201D] dark:text-white">
                  Clinical Notes / Observations
                </label>
                <textarea
                  rows={2}
                  value={modalForm.notes}
                  onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                  placeholder={
                    activeModal.type === "GIVEN"
                      ? "e.g. Well tolerated, patient ingested with full glass of water..."
                      : "e.g. Dr. notified, patient was vomiting post-lunch..."
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2 text-xs text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#E3E0D7]/60 pt-3 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl border border-[#DDD9CE] px-4 py-2 text-xs font-semibold text-[#52615B] hover:bg-[#F7F4ED] dark:border-white/10 dark:text-[#AAB6B0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm ${
                    activeModal.type === "GIVEN"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  <Check size={14} />
                  {activeModal.type === "GIVEN" ? "Confirm Administration" : "Save Withhold Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
