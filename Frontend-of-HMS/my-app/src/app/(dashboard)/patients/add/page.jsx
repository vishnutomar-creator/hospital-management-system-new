"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  User,
  Phone,
  Hash,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  Sparkles,
  X,
  Eye,
} from "lucide-react";
import { patientAPI } from "../../../services/api";
import { generateUHID, peekNextUHID, isValidUHID, syncUHIDSequenceWithDB } from "../../../utils/uhid";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const DEPARTMENTS = [
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "General Medicine",
  "Pediatrics",
  "Gynecology",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Psychiatry",
  "Oncology",
  "Nephrology",
  "Gastroenterology",
  "Pulmonology",
  "Endocrinology",
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7]
  bg-[#FAFAF7] px-4 py-2.5 text-sm
  text-[#17201D] outline-none
  placeholder:text-[#9AA49F]
  focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
  dark:border-white/10 dark:bg-[#202B27] dark:text-white
  dark:placeholder:text-[#71817B]
`;

// ---------------------------------------------------------------------------
// Step 1: Search Gate
// ---------------------------------------------------------------------------
function SearchGate({ onNewPatient, onExistingFound }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null); // null = not searched yet
  const [previewUHID] = useState(() => peekNextUHID());

  const doSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) return;

    setSearching(true);
    setResults(null);

    // Direct backend search via patientAPI
    let found = [];
    try {
      const res = await patientAPI.getPatients();
      const rawList = res?.success && Array.isArray(res?.data) ? res.data : [];
      const qNorm = q.replace(/\s/g, "").toLowerCase();

      found = rawList
        .filter((p) => {
          const phone = (p.phone || p.contactNumber || "").replace(/\s/g, "");
          const uhid  = (p.uhid || p.patientId || p._id || "").replace(/\s/g, "").toLowerCase();
          const name  = (p.name || p.patientName || "").replace(/\s/g, "").toLowerCase();
          return (
            phone.includes(qNorm) ||
            uhid.includes(qNorm) ||
            name.includes(qNorm)
          );
        })
        .map((p) => ({
          id:         p.patientId || p._id || p.id,
          uhid:       p.patientId || p.uhid || p._id,
          name:       p.name || p.patientName || "Patient",
          phone:      p.phone || p.contactNumber || "—",
          gender:     p.gender || "—",
          age:        p.age || "—",
          department: p.department || "General Medicine",
          status:     p.status || "Outpatient",
        }));
    } catch (apiErr) {
      console.warn("[SearchGate] API patient search failed:", apiErr?.message || apiErr);
      found = [];
    } finally {
      console.log("[SearchGate] Final results:", found.length, found);
      setSearching(false);
      setResults(found);
    }
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") doSearch();
  };

  return (
    <div className="space-y-6">

      {/* Search card */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#17201D]">

        <div className="mb-5">
          <h2 className="text-base font-bold text-[#17201D] dark:text-white">
            Check for Existing Patient
          </h2>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Search by mobile number, UHID, or name before registering to prevent duplicate records.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
            />
            <input
              id="patient-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter mobile number, UHID (HSP-2026-…), or patient name"
              className={`${inputClass} pl-10`}
            />
          </div>

          <button
            id="patient-search-btn"
            onClick={doSearch}
            disabled={!query.trim() || searching}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </div>

        {/* Results */}
        {results !== null && (
          <div className="mt-5">
            {results.length === 0 ? (
              /* No match found — clear to register new */
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      No existing patient found
                    </p>
                    <p className="mt-0.5 text-xs text-emerald-600/80 dark:text-emerald-400/70">
                      Safe to register as a new patient. A UHID will be auto-generated.
                    </p>

                    {/* Preview UHID */}
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-100/60 px-3 py-2 dark:bg-emerald-500/10">
                      <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        Will be assigned UHID:
                      </span>
                      <code className="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-300">
                        {previewUHID}
                      </code>
                    </div>
                  </div>
                </div>

                <button
                  id="proceed-new-patient-btn"
                  onClick={() => onNewPatient(query.trim())}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <ChevronRight size={16} />
                  Proceed to Registration Form
                </button>
              </div>
            ) : (
              /* Matches found */
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                <div className="mb-3 flex items-start gap-3">
                  <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                      {results.length} existing patient{results.length > 1 ? "s" : ""} found
                    </p>
                    <p className="mt-0.5 text-xs text-amber-600/80 dark:text-amber-400/70">
                      Review these records before creating a new one to avoid duplicates.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {results.map((p, i) => (
                    <div
                      key={p.id || i}
                      className="flex items-center justify-between rounded-xl border border-amber-200/60 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#1C2723]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F766E]/10 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                          {(p.name || "P").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#17201D] dark:text-white">{p.name}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#87938E]">
                            <Hash size={10} />
                            <span className="font-mono font-semibold">{p.uhid || p.id}</span>
                            <span>·</span>
                            <Phone size={10} />
                            <span>{p.phone}</span>
                            <span>·</span>
                            <span>{p.age} yrs · {p.gender}</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/patients/${p.id}`}
                        className="flex items-center gap-1.5 rounded-lg bg-[#0F766E]/10 px-3 py-1.5 text-xs font-bold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
                      >
                        <Eye size={13} />
                        View Record
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Still allow creating new if staff confirms */}
                <div className="mt-4 border-t border-amber-200/60 pt-4 dark:border-white/10">
                  <p className="mb-3 text-xs text-amber-700/80 dark:text-amber-400/70">
                    If this is genuinely a different patient, you can still proceed:
                  </p>
                  <button
                    id="force-new-patient-btn"
                    onClick={() => onNewPatient(query.trim())}
                    className="flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 dark:border-amber-500/30 dark:bg-transparent dark:text-amber-400 dark:hover:bg-amber-500/10"
                  >
                    <ChevronRight size={15} />
                    Register as New Patient Anyway
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="rounded-xl border border-[#E5E2D9] bg-[#FAFAF7] px-4 py-3 dark:border-white/10 dark:bg-[#17201D]/50">
        <p className="text-xs text-[#7B8882] dark:text-[#87938E]">
          <span className="font-semibold text-[#17201D] dark:text-white">Tip:</span>{" "}
          UHID (Unique Hospital ID) is automatically assigned to every patient and is their
          permanent identifier across all visits, departments, and records.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Registration Form
// ---------------------------------------------------------------------------
function RegistrationForm({ searchQuery, onBack }) {
  const router  = useRouter();
  const [loading, setLoading]       = useState(false);
  const [savedUHID, setSavedUHID]   = useState(null); // shown on success

  // Sync UHID sequence with DB on mount so the preview & generation are collision-free
  useEffect(() => {
    syncUHIDSequenceWithDB();
  }, []);

  const [form, setForm] = useState({
    name:        "",
    dob:         "",
    age:         "",
    gender:      "Male",
    phone:       searchQuery?.replace(/\D/g, "").slice(-10) ?? "", // pre-fill phone if searched by number
    email:       "",
    bloodGroup:  "",
    department:  DEPARTMENTS[3], // General Medicine default
    status:      "Outpatient",
    address:     "",
    city:        "",
    state:       "",
    pincode:     "",
    emergencyName:    "",
    emergencyPhone:   "",
    emergencyRelation: "",
    allergies:   "",
    notes:       "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Auto-compute age from DOB
    if (name === "dob" && value) {
      const today   = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setForm((prev) => ({ ...prev, dob: value, age: String(Math.max(0, age)) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Sync with DB before generating UHID to prevent collisions
    await syncUHIDSequenceWithDB();
    const uhid = generateUHID();

    const newPatient = {
      id:       uhid,
      uhid,
      patientId: uhid,
      name:     form.name,
      patientName: form.name,
      dob:      form.dob,
      age:      Number(form.age) || 0,
      gender:   form.gender,
      phone:    form.phone,
      email:    form.email,
      bloodGroup: form.bloodGroup,
      department: form.department,
      status:   form.status,
      address:  [form.address, form.city, form.state, form.pincode].filter(Boolean).join(", "),
      city:     form.city,
      state:    form.state,
      pincode:  form.pincode,
      emergencyContact: {
        name:     form.emergencyName,
        phone:    form.emergencyPhone,
        relation: form.emergencyRelation,
      },
      allergies:   form.allergies,
      notes:       form.notes,
      registeredAt: new Date().toISOString(),
    };
    // Save to MongoDB via backend API
    try {
      const res = await patientAPI.createPatient(newPatient);
      console.log("Patient saved to MongoDB:", res);
    } catch (err) {
      console.warn("Backend save warning:", err.message || err);
    }

    setLoading(false);
    setSavedUHID(uhid);
  };

  // Success screen
  if (savedUHID) {
    return (
      <div className="rounded-2xl border border-[#E5E2D9] bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#17201D]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/10">
          <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
        </div>

        <h2 className="text-xl font-bold text-[#17201D] dark:text-white">
          Patient Registered Successfully!
        </h2>
        <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
          {form.name} has been added to the hospital system.
        </p>

        {/* UHID Hero */}
        <div className="mx-auto mt-6 max-w-xs rounded-2xl border-2 border-dashed border-[#0F766E]/40 bg-[#E7F5F2] px-6 py-5 dark:bg-[#0F766E]/10">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#0F766E]/70 dark:text-[#5EEAD4]/70">
            Unique Hospital ID (UHID)
          </p>
          <p className="font-mono text-3xl font-black tracking-wider text-[#0F766E] dark:text-[#5EEAD4]">
            {savedUHID}
          </p>
          <p className="mt-2 text-[10px] text-[#7B8882] dark:text-[#87938E]">
            This ID is permanent and must be quoted at every future visit.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/patients/${savedUHID}`}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B625C]"
          >
            View Patient Record
          </Link>
          <Link
            href="/patients"
            className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            Back to Patients List
          </Link>
          <button
            onClick={() => {
              setSavedUHID(null);
              setForm({
                name: "", dob: "", age: "", gender: "Male", phone: "", email: "",
                bloodGroup: "", department: DEPARTMENTS[3], status: "Outpatient",
                address: "", city: "", state: "", pincode: "",
                emergencyName: "", emergencyPhone: "", emergencyRelation: "",
                allergies: "", notes: "",
              });
              onBack();
            }}
            className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Section: Personal Information */}
      <FormSection title="Personal Information" subtitle="Core demographic details">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Full Name" required className="sm:col-span-2 lg:col-span-2">
            <input
              required name="name" value={form.name} onChange={handleChange}
              placeholder="Enter patient's full name" className={inputClass}
            />
          </Field>

          <Field label="Blood Group">
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={inputClass}>
              <option value="">— Select —</option>
              {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>

          <Field label="Date of Birth">
            <input
              type="date" name="dob" value={form.dob} onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className={inputClass}
            />
          </Field>

          <Field label="Age (years)" required>
            <input
              required type="number" min="0" max="150"
              name="age" value={form.age} onChange={handleChange}
              placeholder="e.g. 34" className={inputClass}
            />
          </Field>

          <Field label="Gender" required>
            <select required name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </Field>
        </div>
      </FormSection>

      {/* Section: Contact Details */}
      <FormSection title="Contact Details" subtitle="Primary and emergency contact">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Mobile Number" required>
            <input
              required type="tel" name="phone" value={form.phone} onChange={handleChange}
              placeholder="+91 98765 43210" className={inputClass}
            />
          </Field>

          <Field label="Email Address">
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="patient@example.com" className={inputClass}
            />
          </Field>

          <Field label="Address">
            <input
              name="address" value={form.address} onChange={handleChange}
              placeholder="House / Flat / Street" className={inputClass}
            />
          </Field>

          <Field label="City">
            <input
              name="city" value={form.city} onChange={handleChange}
              placeholder="City" className={inputClass}
            />
          </Field>

          <Field label="State">
            <input
              name="state" value={form.state} onChange={handleChange}
              placeholder="State" className={inputClass}
            />
          </Field>

          <Field label="PIN Code">
            <input
              name="pincode" value={form.pincode} onChange={handleChange}
              placeholder="e.g. 110001" maxLength={6} className={inputClass}
            />
          </Field>
        </div>

        {/* Emergency Contact */}
        <div className="mt-5 rounded-xl border border-[#E5E2D9] bg-[#FAFAF7] p-4 dark:border-white/10 dark:bg-[#202B27]">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#7B8882] dark:text-[#87938E]">
            Emergency Contact
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Contact Name">
              <input name="emergencyName" value={form.emergencyName} onChange={handleChange}
                placeholder="e.g. John Doe" className={inputClass} />
            </Field>
            <Field label="Contact Phone">
              <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange}
                placeholder="+91 98765 43210" className={inputClass} />
            </Field>
            <Field label="Relationship">
              <input name="emergencyRelation" value={form.emergencyRelation} onChange={handleChange}
                placeholder="e.g. Spouse, Parent" className={inputClass} />
            </Field>
          </div>
        </div>
      </FormSection>

      {/* Section: Clinical Defaults */}
      <FormSection title="Clinical Defaults" subtitle="Initial department assignment and status">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Department" required>
            <select required name="department" value={form.department} onChange={handleChange} className={inputClass}>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>

          <Field label="Status">
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option>Outpatient</option>
              <option>Admitted</option>
              <option>Discharged</option>
            </select>
          </Field>

          <Field label="Known Allergies" className="sm:col-span-2">
            <textarea
              name="allergies" value={form.allergies} onChange={handleChange}
              rows={2} placeholder="e.g. Penicillin, Aspirin, Shellfish"
              className={inputClass}
            />
          </Field>

          <Field label="Clinical Notes" className="sm:col-span-2">
            <textarea
              name="notes" value={form.notes} onChange={handleChange}
              rows={2} placeholder="Any additional notes for the clinical team"
              className={inputClass}
            />
          </Field>
        </div>
      </FormSection>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5E2D9] bg-white px-6 py-4 dark:border-white/10 dark:bg-[#17201D]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]"
        >
          <X size={15} />
          Cancel
        </button>

        <button
          id="submit-patient-btn"
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B625C] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Saving…</>
          ) : (
            <><CheckCircle2 size={16} /> Register Patient & Generate UHID</>
          )}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------
function FormSection({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-[#E5E2D9] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#17201D]">
      <div className="mb-5 border-b border-[#EEECE5] pb-4 dark:border-white/10">
        <h3 className="text-sm font-bold text-[#17201D] dark:text-white">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-[#7B8882] dark:text-[#87938E]">{subtitle}</p>}
      </div>
      {children}
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
// Page: two-step orchestrator
// ---------------------------------------------------------------------------
export default function AddPatientPage() {
  const [step, setStep]           = useState("search"); // "search" | "form"
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewPatient = (query) => {
    setSearchQuery(query);
    setStep("form");
  };

  const handleBack = () => {
    setStep("search");
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/patients"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">
            {step === "search" ? "Register New Patient" : "Patient Registration Form"}
          </h1>
          <p className="mt-0.5 text-sm text-[#7B8882] dark:text-[#87938E]">
            {step === "search"
              ? "Step 1 of 2 — Verify patient does not already exist"
              : "Step 2 of 2 — Fill in patient details to complete registration"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <StepPip active={step === "search"} done={step === "form"} n={1} label="Search" />
          <div className="h-px w-6 bg-[#DDD9CE] dark:bg-white/10" />
          <StepPip active={step === "form"} done={false} n={2} label="Register" />
        </div>
      </div>

      {step === "search" ? (
        <SearchGate onNewPatient={handleNewPatient} onExistingFound={() => {}} />
      ) : (
        <RegistrationForm searchQuery={searchQuery} onBack={handleBack} />
      )}
    </div>
  );
}

function StepPip({ n, label, active, done }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
          done
            ? "bg-emerald-500 text-white"
            : active
            ? "bg-[#0F766E] text-white"
            : "bg-[#E5E2D9] text-[#87938E] dark:bg-white/10 dark:text-[#87938E]"
        }`}
      >
        {done ? <CheckCircle2 size={13} /> : n}
      </div>
      <span
        className={`text-xs font-semibold ${
          active ? "text-[#17201D] dark:text-white" : "text-[#87938E]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}