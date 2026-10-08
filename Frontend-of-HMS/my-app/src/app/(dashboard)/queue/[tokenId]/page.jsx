"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Hash,
  Clock,
  CheckCircle2,
  Stethoscope,
  Heart,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  Pill,
  FlaskConical,
  FileText,
  Plus,
  Trash2,
  Save,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  ListOrdered,
  User,
} from "lucide-react";
import {
  getQueueEntry,
  updateQueueStatus,
  saveConsultation,
} from "../../../utils/opd";
import { prescriptionAPI, medicalRecordAPI, labAPI, patientAPI } from "../../../services/api";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const inputClass = `
  w-full rounded-xl border border-[#E3E0D7]
  bg-[#FAFAF7] px-4 py-2.5 text-sm
  text-[#17201D] outline-none
  placeholder:text-[#9AA49F]
  focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
  dark:border-white/10 dark:bg-[#202B27] dark:text-white
  dark:placeholder:text-[#87938E]
`;

const COMMON_DIAGNOSES = [
  "Hypertension", "Type 2 Diabetes Mellitus", "Viral Upper Respiratory Infection",
  "Acute Gastritis", "Migraine", "Tension Headache", "Allergic Rhinitis",
  "Urinary Tract Infection", "Acute Pharyngitis", "Bronchitis",
  "Anemia", "Anxiety Disorder", "Osteoarthritis", "Dyspepsia",
];

const COMMON_TESTS = [
  "Complete Blood Count (CBC)",
  "Blood Glucose — Fasting",
  "Blood Glucose — Random",
  "HbA1c",
  "Lipid Profile",
  "Liver Function Test (LFT)",
  "Renal Function Test (RFT)",
  "Urine Routine & Microscopy",
  "Chest X-Ray",
  "ECG",
  "Thyroid Profile (T3, T4, TSH)",
  "Dengue NS1 Antigen",
  "Malaria Antigen",
  "COVID-19 RTPCR",
];

const COMMON_DRUGS = [
  "Tab. Paracetamol 500mg",
  "Tab. Ibuprofen 400mg",
  "Tab. Amoxicillin 500mg",
  "Tab. Azithromycin 500mg",
  "Tab. Metformin 500mg",
  "Tab. Amlodipine 5mg",
  "Tab. Atorvastatin 10mg",
  "Tab. Pantoprazole 40mg",
  "Tab. Cetirizine 10mg",
  "Tab. Domperidone 10mg",
  "Syp. Amoxicillin 125mg/5ml",
  "Cap. Omeprazole 20mg",
  "Tab. Metronidazole 400mg",
];

const FREQUENCIES = ["OD", "BD", "TDS", "QID", "SOS", "HS", "AC", "PC"];
const DURATIONS   = ["3 days", "5 days", "7 days", "10 days", "14 days", "1 month", "Until review"];
const ROUTES      = ["Oral", "Sublingual", "IV", "IM", "Topical", "Inhalation"];

// ---------------------------------------------------------------------------
// Section wrapper (collapsible)
// ---------------------------------------------------------------------------
function Section({ icon: Icon, title, color = "#0F766E", children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-[#E5E2D9] bg-white shadow-sm dark:border-white/10 dark:bg-[#17201D]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "18" }}>
            <Icon size={18} style={{ color }} />
          </div>
          <p className="text-sm font-bold text-[#17201D] dark:text-white">{title}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-[#87938E]" /> : <ChevronDown size={16} className="text-[#87938E]" />}
      </button>
      {open && <div className="border-t border-[#EEECE5] px-6 py-5 dark:border-white/10">{children}</div>}
    </div>
  );
}

function Field({ label, required, className = "", children }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Previous History Panel (from Part 2 structure)
// ---------------------------------------------------------------------------
function PatientHistoryPanel({ entry }) {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const ids = [entry.patientId, entry.patientUhid].filter(Boolean);
        let found = null;

        for (const id of ids) {
          try {
            const res = await patientAPI.getPatientById(id);
            if (res.success && res.data) {
              found = res.data;
              break;
            }
          } catch (_) {}
        }

        if (!found) {
          const allRes = await patientAPI.getPatients();
          if (allRes.success && Array.isArray(allRes.data)) {
            found = allRes.data.find(
              (x) =>
                (entry.patientId && (x.patientId === entry.patientId || x.id === entry.patientId || x._id === entry.patientId)) ||
                (entry.patientUhid && (x.uhid === entry.patientUhid || x.patientId === entry.patientUhid)) ||
                (entry.patient && (x.name?.toLowerCase() === entry.patient.toLowerCase() || x.patientName?.toLowerCase() === entry.patient.toLowerCase()))
            );
          }
        }

        if (found) {
          setHistory({
            allergies:  Array.isArray(found.allergies) ? found.allergies.join(", ") : (found.allergies || ""),
            bloodGroup: found.bloodGroup || "",
            dob:        found.dob || found.dateOfBirth || "",
            age:        found.age || "",
            gender:     found.gender || "",
            notes:      found.notes || found.medicalHistory || "",
          });
        }
      } catch (err) {
        console.warn("Error loading patient history:", err.message);
      }
    }
    loadHistory();
  }, [entry]);

  if (!history) return (
    <p className="text-sm text-[#87938E]">No linked patient record found. Patient was entered manually.</p>
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "Blood Group",  value: history.bloodGroup || "—" },
        { label: "Age",          value: history.age ? `${history.age} yrs` : "—" },
        { label: "Gender",       value: history.gender || "—" },
        { label: "DOB",          value: history.dob ? new Date(history.dob).toLocaleDateString("en-IN") : "—" },
      ].map(({ label, value }) => (
        <div key={label} className="rounded-xl bg-[#FAFAF7] p-3 dark:bg-[#202B27]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#87938E]">{label}</p>
          <p className="mt-0.5 text-sm font-bold text-[#17201D] dark:text-white">{value}</p>
        </div>
      ))}
      {history.allergies && (
        <div className="col-span-2 flex items-start gap-2 rounded-xl bg-red-50 p-3 dark:bg-red-500/10 sm:col-span-4">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-red-600" />
          <div>
            <p className="text-[10px] font-bold uppercase text-red-600">Known Allergies</p>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">{history.allergies}</p>
          </div>
        </div>
      )}
      {history.notes && (
        <div className="col-span-2 rounded-xl bg-[#FAFAF7] p-3 dark:bg-[#202B27] sm:col-span-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#87938E]">Medical History / Notes</p>
          <p className="mt-0.5 text-sm text-[#52615B] dark:text-[#AAB6B0]">{history.notes}</p>
        </div>
      )}
    </div>
  );
}


// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function ConsultationPage() {
  const router = useRouter();
  const params = useParams();
  const tokenId = params?.tokenId;

  const [entry,   setEntry]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [done,    setDone]    = useState(false);

  // ── Form state ────────────────────────────────────────────────────────
  const [vitals, setVitals] = useState({
    bp:          "",
    pulse:       "",
    temp:        "",
    spo2:        "",
    rr:          "",
    weight:      "",
    height:      "",
    bmi:         "",
  });

  const [consult, setConsult] = useState({
    chiefComplaint: "",
    history:        "",
    examination:    "",
    diagnosis:      "",
    diagnosisCode:  "",
    severity:       "Mild",
    notes:          "",
    followUpDate:   "",
    followUpNotes:  "",
  });

  const [drugs, setDrugs] = useState([
    { name: "", dose: "", frequency: "OD", duration: "5 days", route: "Oral", instructions: "" },
  ]);

  const [labTests, setLabTests] = useState([
    { test: "", priority: "Routine", instructions: "" },
  ]);

  // ── Load queue entry ─────────────────────────────────────────────────
  useEffect(() => {
    if (!tokenId) return;
    const e = getQueueEntry(tokenId);
    if (e) {
      setEntry(e);
      // Restore any previously saved state
      if (e.vitals)       setVitals(e.vitals);
      if (e.consultation) setConsult(e.consultation);
      if (e.prescription?.drugs?.length)  setDrugs(e.prescription.drugs);
      if (e.labOrders?.tests?.length)     setLabTests(e.labOrders.tests);
      // Mark as In Consultation if still Waiting
      if (e.status === "Waiting") {
        updateQueueStatus(tokenId, "In Consultation");
        setEntry((prev) => ({ ...prev, status: "In Consultation" }));
      }
    }
    setLoading(false);
  }, [tokenId]);

  // ── Auto-BMI ─────────────────────────────────────────────────────────
  const handleVitalChange = (field, value) => {
    setVitals((prev) => {
      const next = { ...prev, [field]: value };
      if ((field === "weight" || field === "height") && next.weight && next.height) {
        const hM = parseFloat(next.height) / 100;
        if (hM > 0) {
          next.bmi = (parseFloat(next.weight) / (hM * hM)).toFixed(1);
        }
      }
      return next;
    });
  };

  // ── Drug helpers ─────────────────────────────────────────────────────
  const addDrug = () =>
    setDrugs((prev) => [...prev, { name: "", dose: "", frequency: "OD", duration: "5 days", route: "Oral", instructions: "" }]);
  const removeDrug = (i) => setDrugs((prev) => prev.filter((_, idx) => idx !== i));
  const updateDrug = (i, field, value) =>
    setDrugs((prev) => prev.map((d, idx) => (idx === i ? { ...d, [field]: value } : d)));

  // ── Lab test helpers ─────────────────────────────────────────────────
  const addTest = () =>
    setLabTests((prev) => [...prev, { test: "", priority: "Routine", instructions: "" }]);
  const removeTest = (i) => setLabTests((prev) => prev.filter((_, idx) => idx !== i));
  const updateTest = (i, field, value) =>
    setLabTests((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));

  // ── Complete consultation ─────────────────────────────────────────────
  const handleComplete = async (e) => {
    e.preventDefault();
    setSaving(true);

    const prescriptionId = `RX-${Date.now()}`;
    const labOrderId     = `LO-${Date.now()}`;

    // Map clinical shorthand → backend enum
    const FREQ_MAP = {
      "OD":  "once_daily",
      "BD":  "twice_daily",
      "TDS": "three_times_daily",
      "QID": "four_times_daily",
      "SOS": "as_needed",
      "HS":  "once_daily",
      "AC":  "once_daily",
      "PC":  "once_daily",
    };

    const validDrugs = drugs.filter((d) => d.name.trim());
    const validTests = labTests.filter((t) => t.test.trim());

    // ── 1. Create prescription in MongoDB ─────────────────────────────
    try {
      if (validDrugs.length > 0) {
        await prescriptionAPI.createPrescription({
          rxId:        prescriptionId,
          patientId:   entry?.patientId   || undefined,
          patientName: entry?.patient     || undefined,
          doctorId:    entry?.doctorId    || undefined,
          doctorName:  entry?.doctor      || undefined,
          diagnosis:   consult.diagnosis  || "General Consultation",
          advice:      consult.notes      || "",
          followUpDate: consult.followUpDate || undefined,
          medicines: validDrugs.map((d) => ({
            name:         d.name,
            dosage:       d.dose || "1 tablet",       // ← d.dose (form field), NOT d.dosage
            frequency:    FREQ_MAP[d.frequency] || "once_daily",
            timing:       "anytime",
            duration:     d.duration || "5 days",
            instructions: d.instructions || "",
          })),
          status: "Pending Dispense",
        });
      }
    } catch (err) {
      console.warn("Prescription API notice:", err.message);
    }

    // ── 2. Create lab orders in MongoDB (one per test) ─────────────────
    const labMongoIds = [];
    if (validTests.length > 0) {
      if (entry?.patientId && entry?.doctorId) {
        for (const t of validTests) {
          try {
            const res = await labAPI.orderLabTest({
              patientId:    entry.patientId,
              doctorId:     entry.doctorId,
              patientName:  entry.patient  || "",
              doctorName:   entry.doctor   || "",
              testName:     t.test,
              testCategory: "Other",
              priority:     t.priority || "Routine",
              notes:        t.instructions || "",
            });
            if (res?.data?._id) labMongoIds.push(res.data._id);
          } catch (err) {
            console.error(
              `❌ Lab order FAILED for "${t.test}":`,
              err.message,
              "\n  patientId:", entry?.patientId,
              "\n  doctorId:",  entry?.doctorId
            );
          }
        }
      } else {
        // IDs missing — log clearly so developer can diagnose booking flow
        console.error(
          "❌ Lab orders NOT saved — missing patientId or doctorId in queue entry.",
          "\n  patientId:", entry?.patientId || "(empty)",
          "\n  doctorId:",  entry?.doctorId  || "(empty)",
          "\n  patient:",   entry?.patient,
          "\n  doctor:",    entry?.doctor,
          "\n  Fix: ensure the appointment booking stores the MongoDB _id for both patient and doctor."
        );
      }
    }

    // ── 3. Create medical record in MongoDB ────────────────────────────
    try {
      if (entry?.patientId && entry?.doctorId && consult.diagnosis) {
        await medicalRecordAPI.createMedicalRecord({
          patientId:     entry.patientId,
          doctorId:      entry.doctorId,
          patientName:   entry.patient  || "",
          doctorName:    entry.doctor   || "",
          appointmentId: undefined, // entry.id is a human-readable string (e.g. "APT-8278"), not an ObjectId
          recordType:    "consultation",
          diagnosis:     consult.diagnosis,
          chiefComplaint: consult.chiefComplaint || "",
          symptoms:      consult.chiefComplaint ? [consult.chiefComplaint] : [],
          doctorNotes:   [consult.notes, consult.examination].filter(Boolean).join("\n"),
          treatment:     consult.notes || "",
          followUpDate:  consult.followUpDate || undefined,
          status:        "active",
        });
      } else if (consult.diagnosis) {
        console.error(
          "❌ Medical record NOT saved — missing patientId or doctorId.",
          "\n  patientId:", entry?.patientId || "(empty)",
          "\n  doctorId:",  entry?.doctorId  || "(empty)"
        );
      }
    } catch (err) {
      console.error("Medical record API error:", err.message, err);
    }

    // ── 4. Save locally to OPD queue + mark Completed ─────────────────
    saveConsultation(tokenId, {
      vitals,
      consultation: consult,
      prescription: { id: prescriptionId, drugs: validDrugs },
      labOrders:    { id: labOrderId, tests: validTests, mongoIds: labMongoIds },
    });

    setSaving(false);
    setDone(true);
  };

  // ── Loading / not found ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-[#87938E]">
        <Loader2 size={20} className="mr-2 animate-spin" /> Loading consultation…
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="space-y-4 p-6 text-center">
        <p className="text-sm font-semibold text-[#87938E]">Queue entry not found.</p>
        <Link href="/queue" className="inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-bold text-white">
          Back to Queue
        </Link>
      </div>
    );
  }

  // ── Completion screen ────────────────────────────────────────────────
  if (done) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/queue" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Consultation Complete</h1>
        </div>

        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#17201D]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/10">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-[#17201D] dark:text-white">Consultation Saved!</h2>
          <p className="mt-1 text-sm text-[#7B8882]">
            {entry.patient}'s consultation with {entry.doctor} has been completed.
          </p>

          {/* Token badge */}
          <div className="mx-auto mt-5 flex w-fit items-center gap-3 rounded-2xl border border-[#E5E2D9] bg-[#FAFAF7] px-5 py-3 dark:border-white/10 dark:bg-[#202B27]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] font-mono text-sm font-black text-white">
              {entry.token}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#17201D] dark:text-white">{entry.patient}</p>
              <p className="text-[11px] text-[#87938E]">Token marked as Completed</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 text-sm text-[#52615B] dark:text-[#AAB6B0]">
            {drugs.filter((d) => d.name).length > 0 && (
              <p className="flex items-center gap-2">
                <Pill size={14} className="text-[#0F766E]" />
                {drugs.filter((d) => d.name).length} drug(s) prescribed → saved to Prescriptions module
              </p>
            )}
            {labTests.filter((t) => t.test).length > 0 && (
              <p className="flex items-center gap-2">
                <FlaskConical size={14} className="text-emerald-600" />
                {labTests.filter((t) => t.test).length} lab test(s) ordered → saved to Laboratory module
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/queue" className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B625C]">
              <ListOrdered size={16} />
              Back to Queue
            </Link>
            {entry.patientId && (
              <Link href={`/patients/${entry.patientId}`} className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-5 py-2.5 text-sm font-semibold text-[#52615B] dark:border-white/10 dark:text-[#AAB6B0]">
                <User size={15} />
                View Patient Record
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Main consultation form ────────────────────────────────────────────
  return (
    <form onSubmit={handleComplete} className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/queue" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Doctor Consultation</h1>
            <p className="text-xs text-[#7B8882] dark:text-[#87938E]">Fill vitals, diagnose, prescribe and order labs from one screen</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B625C] disabled:opacity-60"
        >
          {saving
            ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
            : <><CheckCircle2 size={16} /> Complete &amp; Save</>
          }
        </button>
      </div>

      {/* ── Patient identity card ────────────────────────────── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E5E2D9] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0F766E] font-mono text-sm font-black text-white shadow-md shadow-[#0F766E]/30">
            {entry.token}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-[#17201D] dark:text-white">{entry.patient}</p>
              {entry.patientUhid && (
                <span className="flex items-center gap-1 rounded-full bg-[#0F766E]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                  <Hash size={9} />{entry.patientUhid}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-[#87938E]">
              <Stethoscope size={12} className="mr-1 inline" />
              {entry.doctor} · {entry.department} · {entry.time}
            </p>
            {entry.notes && <p className="mt-1 text-xs italic text-[#87938E]">{entry.notes}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-[#0F766E]/10 px-4 py-2 dark:bg-[#0F766E]/20">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#0F766E]" />
          <span className="text-xs font-bold text-[#0F766E] dark:text-[#5EEAD4]">In Consultation</span>
        </div>
      </div>

      {/* ── Patient History (linked) ─────────────────────────── */}
      <Section icon={User} title="Patient History (from Records)" color="#7C3AED" defaultOpen={false}>
        <PatientHistoryPanel entry={entry} />
      </Section>

      {/* ── Vitals ──────────────────────────────────────────── */}
      <Section icon={Activity} title="Vitals" color="#2563EB">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Blood Pressure">
            <input value={vitals.bp} onChange={(e) => handleVitalChange("bp", e.target.value)} placeholder="e.g. 120/80 mmHg" className={inputClass} />
          </Field>
          <Field label="Pulse (bpm)">
            <input type="number" value={vitals.pulse} onChange={(e) => handleVitalChange("pulse", e.target.value)} placeholder="72" className={inputClass} />
          </Field>
          <Field label="Temperature (°F)">
            <input type="number" step="0.1" value={vitals.temp} onChange={(e) => handleVitalChange("temp", e.target.value)} placeholder="98.6" className={inputClass} />
          </Field>
          <Field label="SpO₂ (%)">
            <input type="number" value={vitals.spo2} onChange={(e) => handleVitalChange("spo2", e.target.value)} placeholder="98" min="0" max="100" className={inputClass} />
          </Field>
          <Field label="Respiratory Rate">
            <input type="number" value={vitals.rr} onChange={(e) => handleVitalChange("rr", e.target.value)} placeholder="16 /min" className={inputClass} />
          </Field>
          <Field label="Weight (kg)">
            <input type="number" step="0.1" value={vitals.weight} onChange={(e) => handleVitalChange("weight", e.target.value)} placeholder="70" className={inputClass} />
          </Field>
          <Field label="Height (cm)">
            <input type="number" value={vitals.height} onChange={(e) => handleVitalChange("height", e.target.value)} placeholder="170" className={inputClass} />
          </Field>
          <Field label="BMI (auto)">
            <input readOnly value={vitals.bmi} placeholder="Auto" className={`${inputClass} cursor-default bg-[#F1F3EF] dark:bg-[#17201D]`} />
          </Field>
        </div>
      </Section>

      {/* ── Clinical Notes ────────────────────────────────────── */}
      <Section icon={FileText} title="Clinical Notes & Diagnosis" color="#7C3AED">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Chief Complaint *" required className="sm:col-span-2">
            <textarea required value={consult.chiefComplaint} onChange={(e) => setConsult((p) => ({ ...p, chiefComplaint: e.target.value }))} rows={2} placeholder="Patient's primary presenting complaint" className={inputClass} />
          </Field>
          <Field label="History of Present Illness" className="sm:col-span-2">
            <textarea value={consult.history} onChange={(e) => setConsult((p) => ({ ...p, history: e.target.value }))} rows={3} placeholder="Onset, duration, character, associated symptoms…" className={inputClass} />
          </Field>
          <Field label="Examination Findings" className="sm:col-span-2">
            <textarea value={consult.examination} onChange={(e) => setConsult((p) => ({ ...p, examination: e.target.value }))} rows={3} placeholder="General, systemic, local examination findings…" className={inputClass} />
          </Field>

          {/* Diagnosis with quick-pick */}
          <Field label="Diagnosis *" required className="sm:col-span-2">
            <input required value={consult.diagnosis} onChange={(e) => setConsult((p) => ({ ...p, diagnosis: e.target.value }))} placeholder="Enter diagnosis or select below" className={inputClass} />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {COMMON_DIAGNOSES.map((d) => (
                <button
                  key={d} type="button"
                  onClick={() => setConsult((p) => ({ ...p, diagnosis: d }))}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                    consult.diagnosis === d
                      ? "border-[#0F766E] bg-[#0F766E] text-white"
                      : "border-[#E3E0D7] bg-[#FAFAF7] text-[#52615B] hover:border-[#0F766E] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </Field>

          <Field label="ICD-10 Code">
            <input value={consult.diagnosisCode} onChange={(e) => setConsult((p) => ({ ...p, diagnosisCode: e.target.value }))} placeholder="e.g. J06.9" className={inputClass} />
          </Field>
          <Field label="Severity">
            <select value={consult.severity} onChange={(e) => setConsult((p) => ({ ...p, severity: e.target.value }))} className={inputClass}>
              <option>Mild</option><option>Moderate</option><option>Severe</option><option>Critical</option>
            </select>
          </Field>

          <Field label="Additional Notes" className="sm:col-span-2">
            <textarea value={consult.notes} onChange={(e) => setConsult((p) => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Advice, precautions, observations…" className={inputClass} />
          </Field>
          <Field label="Follow-up Date">
            <input type="date" value={consult.followUpDate} onChange={(e) => setConsult((p) => ({ ...p, followUpDate: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Follow-up Instructions">
            <input value={consult.followUpNotes} onChange={(e) => setConsult((p) => ({ ...p, followUpNotes: e.target.value }))} placeholder="Instructions for next visit" className={inputClass} />
          </Field>
        </div>
      </Section>

      {/* ── Prescription ─────────────────────────────────────── */}
      <Section icon={Pill} title="Prescription" color="#0F766E">
        <div className="space-y-3">
          {drugs.map((drug, i) => (
            <div key={i} className="relative rounded-xl border border-[#E5E2D9] bg-[#FAFAF7] p-4 dark:border-white/10 dark:bg-[#202B27]">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* Drug name with quick-pick */}
                <div className="lg:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#52615B] dark:text-[#AAB6B0]">Drug Name</label>
                  <input
                    value={drug.name}
                    onChange={(e) => updateDrug(i, "name", e.target.value)}
                    placeholder="e.g. Tab. Paracetamol 500mg"
                    className={inputClass}
                  />
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {COMMON_DRUGS.slice(0, 6).map((d) => (
                      <button key={d} type="button" onClick={() => updateDrug(i, "name", d)} className="rounded-md border border-[#E3E0D7] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#52615B] hover:border-[#0F766E] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#17201D] dark:text-[#AAB6B0]">
                        {d.replace("Tab. ", "").replace("Syp. ", "").replace("Cap. ", "")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#52615B] dark:text-[#AAB6B0]">Dose</label>
                  <input value={drug.dose} onChange={(e) => updateDrug(i, "dose", e.target.value)} placeholder="e.g. 1 tablet" className={inputClass} />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#52615B] dark:text-[#AAB6B0]">Frequency</label>
                  <select value={drug.frequency} onChange={(e) => updateDrug(i, "frequency", e.target.value)} className={inputClass}>
                    {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#52615B] dark:text-[#AAB6B0]">Duration</label>
                  <select value={drug.duration} onChange={(e) => updateDrug(i, "duration", e.target.value)} className={inputClass}>
                    {DURATIONS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#52615B] dark:text-[#AAB6B0]">Route</label>
                  <select value={drug.route} onChange={(e) => updateDrug(i, "route", e.target.value)} className={inputClass}>
                    {ROUTES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#52615B] dark:text-[#AAB6B0]">Special Instructions</label>
                  <input value={drug.instructions} onChange={(e) => updateDrug(i, "instructions", e.target.value)} placeholder="e.g. Take after food" className={inputClass} />
                </div>
              </div>

              {drugs.length > 1 && (
                <button type="button" onClick={() => removeDrug(i)} className="absolute right-3 top-3 rounded-lg p-1.5 text-[#87938E] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addDrug} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#0F766E]/40 py-3 text-sm font-semibold text-[#0F766E] transition hover:bg-[#E7F5F2] dark:hover:bg-[#0F766E]/10">
            <Plus size={16} />
            Add Another Drug
          </button>
        </div>
      </Section>

      {/* ── Lab Orders ───────────────────────────────────────── */}
      <Section icon={FlaskConical} title="Lab Orders" color="#059669">
        <div className="space-y-3">
          {labTests.map((test, i) => (
            <div key={i} className="relative rounded-xl border border-[#E5E2D9] bg-[#FAFAF7] p-4 dark:border-white/10 dark:bg-[#202B27]">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#52615B] dark:text-[#AAB6B0]">Test Name</label>
                  <input value={test.test} onChange={(e) => updateTest(i, "test", e.target.value)} placeholder="e.g. Complete Blood Count" className={inputClass} />
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {COMMON_TESTS.slice(0, 8).map((t) => (
                      <button key={t} type="button" onClick={() => updateTest(i, "test", t)} className="rounded-md border border-[#E3E0D7] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#52615B] hover:border-[#059669] hover:text-[#059669] dark:border-white/10 dark:bg-[#17201D] dark:text-[#AAB6B0]">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#52615B] dark:text-[#AAB6B0]">Priority</label>
                  <select value={test.priority} onChange={(e) => updateTest(i, "priority", e.target.value)} className={inputClass}>
                    <option>Routine</option><option>Urgent</option><option>STAT</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#52615B] dark:text-[#AAB6B0]">Special Instructions</label>
                  <input value={test.instructions} onChange={(e) => updateTest(i, "instructions", e.target.value)} placeholder="e.g. Fasting sample required" className={inputClass} />
                </div>
              </div>

              {labTests.length > 1 && (
                <button type="button" onClick={() => removeTest(i)} className="absolute right-3 top-3 rounded-lg p-1.5 text-[#87938E] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addTest} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400/40 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
            <Plus size={16} />
            Add Another Lab Test
          </button>
        </div>
      </Section>

      {/* ── Submit footer ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5E2D9] bg-white px-6 py-4 dark:border-white/10 dark:bg-[#17201D]">
        <Link href="/queue" className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]">
          <X size={15} />
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B625C] disabled:opacity-60"
        >
          {saving
            ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
            : <><CheckCircle2 size={16} /> Complete Consultation &amp; Save All</>
          }
        </button>
      </div>
    </form>
  );
}
