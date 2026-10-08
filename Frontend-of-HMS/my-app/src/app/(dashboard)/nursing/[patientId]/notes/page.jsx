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
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Copy,
  FileText,
  HeartPulse,
  Pill,
  Plus,
  RefreshCw,
  Save,
  Send,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Thermometer,
  Trash2,
  User,
  Users,
} from "lucide-react";
import {
  getIPDPatientById,
  getPatientNotes,
  savePatientNote,
  deletePatientNote,
} from "../../../../utils/nursingStore";

const NOTE_CATEGORIES = [
  "Shift Summary",
  "Physician Round",
  "Routine Care",
  "Urgent Observation",
  "Post-Procedure",
  "Patient / Family Communication",
  "Discharge / Transfer Planning",
];

const TEMPLATES = [
  {
    name: "SOAP Format",
    text: "S (Subjective): Patient reports...\nO (Objective): Vitals stable, Chest clear, IV site clean...\nA (Assessment): Improving clinical trajectory...\nP (Plan): Continue IV antibiotics, repeat morning labs...",
  },
  {
    name: "ISBAR Handover",
    text: "I (Identification): Admitted for...\nS (Situation): Current status...\nB (Background): Relevant history...\nA (Assessment): Latest vitals & findings...\nR (Recommendation): Night shift tasks...",
  },
  {
    name: "Wound & Dressing",
    text: "Surgical site dressing inspected — clean, dry, intact with no active bleeding or strike-through. Distal neurovascular status intact. Pain managed adequately.",
  },
];

export default function PatientNursingNotesPage() {
  const params = useParams();
  const patientId = params?.patientId;

  const [patient, setPatient] = useState(null);
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [form, setForm] = useState({
    category: NOTE_CATEGORIES[0],
    priority: "Routine",
    text: "",
    nurseName: "Sarah Jenkins, RN",
  });

  const loadData = () => {
    if (!patientId) return;
    setLoading(true);
    const p = getIPDPatientById(patientId);
    setPatient(p);
    const notes = getPatientNotes(patientId);
    setNotesList(notes);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handler = () => {
      const notes = getPatientNotes(patientId);
      setNotesList(notes);
    };
    window.addEventListener("hms_notes_updated", handler);
    return () => window.removeEventListener("hms_notes_updated", handler);
  }, [patientId]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!form.text.trim() || !patientId) return;

    const newNote = {
      category: form.category,
      priority: form.priority,
      text: form.text.trim(),
      nurseName: form.nurseName || "Staff Nurse, RN",
    };

    const updated = savePatientNote(patientId, newNote);
    setNotesList(updated);
    setForm((prev) => ({
      ...prev,
      text: "",
    }));
    setSuccessMsg("Nursing note logged into clinical chart.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDelete = (noteId) => {
    if (!confirm("Are you sure you want to remove this nursing note entry?")) return;
    const updated = deletePatientNote(patientId, noteId);
    setNotesList(updated);
  };

  const applyTemplate = (templateText) => {
    setForm((prev) => ({
      ...prev,
      text: templateText,
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
              <span className="text-[#0F766E] font-medium">Nursing Notes</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">
              Nursing Notes & Clinical Log
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
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-[#7B8882] transition hover:bg-[#F7F4ED] hover:text-[#17201D] dark:text-[#87938E] dark:hover:bg-[#202B27] dark:hover:text-white"
          >
            <Pill size={14} />
            <span>Medications (MAR)</span>
          </Link>
          <Link
            href={`/nursing/${encodeURIComponent(patientId)}/notes`}
            className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
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

            <div className="flex items-center gap-2 text-xs text-[#7B8882] dark:text-[#87938E]">
              <span className="rounded-xl bg-[#FAFAF7] px-3 py-2 dark:bg-[#202B27]">
                Nurse in Charge: <strong className="text-[#0F766E] dark:text-[#5EEAD4]">{patient.nurseInCharge}</strong>
              </span>
            </div>
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

      {/* Two-Column Layout: Add Note Form (Left) + Notes Log Feed (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
            <div className="flex items-center justify-between border-b border-[#E3E0D7]/60 pb-3 dark:border-white/10">
              <h3 className="flex items-center gap-2 text-base font-bold text-[#17201D] dark:text-white">
                <FileText size={18} className="text-[#0F766E]" />
                Add Nursing Note
              </h3>
              <span className="text-xs font-semibold text-[#7B8882] dark:text-[#87938E]">
                Shift: Day (07-15h)
              </span>
            </div>

            <form onSubmit={handleAddNote} className="mt-4 space-y-4">
              {/* Note Category */}
              <div>
                <label className="text-xs font-bold text-[#17201D] dark:text-white">
                  Note Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2.5 text-xs font-semibold text-[#17201D] outline-none transition focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                >
                  {NOTE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs font-bold text-[#17201D] dark:text-white">
                  Clinical Priority
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {["Routine", "Important", "High"].map((pri) => (
                    <button
                      key={pri}
                      type="button"
                      onClick={() => setForm({ ...form, priority: pri })}
                      className={`rounded-xl border py-2 text-xs font-bold transition ${
                        form.priority === pri
                          ? pri === "High"
                            ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400"
                            : "border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E] dark:text-[#5EEAD4]"
                          : "border-[#DDD9CE] bg-white text-[#52615B] hover:bg-[#FAFAF7] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
                      }`}
                    >
                      {pri}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Template Chips */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#17201D] dark:text-white">
                    Quick Templates
                  </label>
                  <span className="text-[10px] text-[#7B8882]">Click to insert</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.name}
                      type="button"
                      onClick={() => applyTemplate(tmpl.text)}
                      className="rounded-lg border border-[#DDD9CE] bg-[#FAFAF7] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-white hover:text-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
                    >
                      + {tmpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free text entry */}
              <div>
                <label className="text-xs font-bold text-[#17201D] dark:text-white">
                  Clinical Note Content
                </label>
                <textarea
                  rows={6}
                  required
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="Document clinical assessment, care provided, patient response, communications, or doctor recommendations..."
                  className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] p-3 text-xs text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white font-mono leading-relaxed"
                />
              </div>

              {/* Nurse Name */}
              <div>
                <label className="text-xs font-bold text-[#17201D] dark:text-white">
                  Logged By (Nurse Signature)
                </label>
                <input
                  type="text"
                  required
                  value={form.nurseName}
                  onChange={(e) => setForm({ ...form, nurseName: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2 text-xs text-[#17201D] outline-none transition focus:border-[#0F766E] focus:bg-white dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B625C]"
              >
                <Save size={16} />
                Save Nursing Note
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Notes Log Feed */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
            <div className="flex items-center justify-between border-b border-[#E3E0D7]/60 pb-3 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold text-[#17201D] dark:text-white">
                  Nursing Notes History & Feed
                </h3>
                <p className="text-xs text-[#7B8882] dark:text-[#87938E]">
                  Chronological record of inpatient progress notes ({notesList.length} total entries)
                </p>
              </div>
              <span className="rounded-full bg-[#0F766E]/10 px-3 py-1 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                Audit Trail
              </span>
            </div>

            {notesList.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#7B8882] dark:text-[#87938E]">
                No nursing notes recorded yet. Use the form on the left to write the first note.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {notesList.map((note, idx) => (
                  <div
                    key={note.id || idx}
                    className={`rounded-2xl border p-4 shadow-2xs transition ${
                      note.priority === "High"
                        ? "border-red-300 bg-red-500/5 dark:border-red-500/30 dark:bg-red-500/10"
                        : "border-[#E3E0D7] bg-[#FAFAF7] dark:border-white/10 dark:bg-[#202B27]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-[#0F766E]/10 px-2.5 py-1 text-[11px] font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                          {note.category}
                        </span>
                        {note.priority === "High" && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:text-red-400">
                            <AlertTriangle size={11} /> High Priority
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-[#7B8882] dark:text-[#87938E]">
                          <Clock size={12} /> {note.timestamp}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-[#87938E] hover:text-red-600 transition"
                        title="Delete note entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="mt-3 whitespace-pre-line text-xs font-normal text-[#17201D] leading-relaxed dark:text-[#D1D5DB]">
                      {note.text}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#E3E0D7]/60 pt-2 text-[11px] text-[#7B8882] dark:border-white/10 dark:text-[#87938E]">
                      <span>
                        Nurse Signature: <strong className="text-[#17201D] dark:text-white">{note.nurseName}</strong>
                      </span>
                      {idx === 0 && (
                        <span className="font-semibold text-[#0F766E] dark:text-[#5EEAD4]">
                          Most Recent Note
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
