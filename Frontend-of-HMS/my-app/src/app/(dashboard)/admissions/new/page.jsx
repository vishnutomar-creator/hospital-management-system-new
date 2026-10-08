"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, ArrowRight, BedDouble, CheckCircle2, UserPlus,
  Building2, Stethoscope, User, FileText, Wrench, AlertTriangle, Loader2,
} from "lucide-react";
import { patientAPI, doctorAPI, bedAPI, admissionAPI } from "../../../services/api";

const inputClass = `w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]`;

const BED_STATUS_CONFIG = {
  Available:   { color:"text-[#0F766E] dark:text-[#5EEAD4]", border:"border-emerald-300 dark:border-emerald-700/60", bg:"bg-white hover:bg-emerald-50/50 dark:bg-[#16221E] dark:hover:bg-[#1a2b25]", badge:"bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800", iconBg:"bg-emerald-50 text-[#0F766E] border border-emerald-200 dark:bg-[#1C2824] dark:text-[#5EEAD4] dark:border-emerald-800", selectable:true },
  Occupied:    { color:"text-red-600 dark:text-red-400",       border:"border-red-200 dark:border-red-900/50",         bg:"bg-white dark:bg-[#16221E]",                              badge:"bg-red-100 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",             iconBg:"bg-red-50 text-red-600 border border-red-200 dark:bg-[#1C2824] dark:text-red-400 dark:border-red-900/50",         selectable:false },
  Reserved:    { color:"text-amber-600 dark:text-amber-400",   border:"border-amber-200 dark:border-amber-900/50",     bg:"bg-white dark:bg-[#16221E]",                              badge:"bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",     iconBg:"bg-amber-50 text-amber-600 border border-amber-200 dark:bg-[#1C2824] dark:text-amber-400 dark:border-amber-900/50", selectable:false },
  Cleaning:    { color:"text-blue-600 dark:text-blue-400",     border:"border-blue-200 dark:border-blue-900/50",       bg:"bg-white dark:bg-[#16221E]",                              badge:"bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",         iconBg:"bg-blue-50 text-blue-600 border border-blue-200 dark:bg-[#1C2824] dark:text-blue-400 dark:border-blue-900/50",     selectable:false },
  Maintenance: { color:"text-gray-600 dark:text-gray-300",     border:"border-gray-200 dark:border-gray-800",          bg:"bg-white dark:bg-[#16221E]",                              badge:"bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",           iconBg:"bg-gray-100 text-gray-600 border border-gray-200 dark:bg-[#1C2824] dark:text-gray-300 dark:border-gray-800",       selectable:false },
};

const BED_TYPE_ICONS = {
  ICU: <Stethoscope size={18}/>,
  General: <BedDouble size={18}/>,
  Private: <User size={18}/>,
  Pediatric: <User size={18}/>,
  Emergency: <AlertTriangle size={18}/>,
};

function AdmissionWizard() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const preWardName  = searchParams.get("wardName") || "";

  const [step,           setStep]           = useState(1);
  const [patients,       setPatients]       = useState([]); // full objects from API
  const [doctors,        setDoctors]        = useState([]); // full objects from API
  const [allBeds,        setAllBeds]        = useState([]);
  const [loadingData,    setLoadingData]    = useState(true);
  const [wardFilter,     setWardFilter]     = useState(preWardName || "All Wards");
  const [selectedBedId,  setSelectedBedId]  = useState(null); // MongoDB _id of bed
  const [ipdNumber,      setIpdNumber]      = useState("");
  const [saving,         setSaving]         = useState(false);
  const [saveError,      setSaveError]      = useState("");

  const [form, setForm] = useState({
    patientId:   "",
    doctorId:    "",
    reason:      "",
    diagnosis:   "",
    admissionDate: new Date().toISOString().slice(0, 10),
  });

  // ── Load patients, doctors, beds from MongoDB ─────────────────────
  useEffect(() => {
    async function load() {
      setLoadingData(true);
      try {
        const [pRes, dRes, bRes] = await Promise.allSettled([
          patientAPI.getPatients(),
          doctorAPI.getDoctors(),
          bedAPI.getBeds(),
        ]);

        if (pRes.status === "fulfilled" && pRes.value.success) {
          const pts = pRes.value.data || [];
          setPatients(pts);
          if (pts.length > 0) setForm(f => ({ ...f, patientId: pts[0]._id || pts[0].id }));
        }

        if (dRes.status === "fulfilled" && dRes.value.success) {
          const drs = dRes.value.data || [];
          setDoctors(drs);
          if (drs.length > 0) setForm(f => ({ ...f, doctorId: drs[0]._id || drs[0].id }));
        }

        if (bRes.status === "fulfilled" && bRes.value.success) {
          const rawBeds = bRes.value.data || [];
          const mapped = rawBeds.map((b, idx) => ({
            ...b,
            _id: b._id,
            id: b._id || `BED-${String(idx + 1).padStart(3, "0")}`,
            bedNumber: b.bedNumber || b.bedNo,
            ward: b.wardId?.wardName || b.ward || b.wardName || "General Medicine Ward",
            wardName: b.wardId?.wardName || b.ward || b.wardName || "General Medicine Ward",
            wardId: b.wardId?._id || b.wardId,
            floor: b.wardId?.floor || b.floor || "1st Floor",
            type: b.bedType || b.type || b.wardId?.wardType || "General",
            bedType: b.bedType || b.type || b.wardId?.wardType || "General",
            status: b.status === "UnderMaintenance" ? "Maintenance" : (b.status || "Available"),
            patient: b.currentPatientId?.name || b.currentPatientId?.patientName || b.patient || null,
            equipment: b.equipment || (b.bedType === "ICU" ? "Ventilator Available" : (b.bedType === "Private" ? "Fully Equipped" : "Standard")),
          }));
          setAllBeds(mapped);
        }
      } catch (_) {}
      setLoadingData(false);
    }
    load();
  }, []);

  // ── Derived ──────────────────────────────────────────────────────
  const wardNames   = ["All Wards", ...Array.from(new Set(allBeds.map(b => b.ward || b.wardName || (b.wardId?.wardName) || "")))].filter(Boolean);
  const visibleBeds = allBeds.filter(b => wardFilter === "All Wards" || (b.ward || b.wardName || b.wardId?.wardName) === wardFilter);
  const selectedBed = allBeds.find(b => (b._id || b.id) === selectedBedId) || null;

  const selectedPatient = patients.find(p => (p._id || p.id) === form.patientId);
  const selectedDoctor  = doctors.find(d => (d._id || d.id)  === form.doctorId);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const goToStep2 = e => { e.preventDefault(); if (!form.patientId) return; setStep(2); };

  const goToStep3 = () => {
    if (!selectedBed) return;
    const year = new Date().getFullYear();
    setIpdNumber(`IPD-${year}-${Math.floor(1000 + Math.random() * 9000)}`);
    setStep(3);
  };

  // ── Confirm & Admit — saves to MongoDB ───────────────────────────
  const handleConfirm = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const bedMongoId = selectedBed._id || selectedBed.id;
      await admissionAPI.createAdmission({
        patientId:          form.patientId,
        doctorId:           form.doctorId,
        bedId:              bedMongoId,
        reasonForAdmission: form.reason || form.diagnosis || "General Admission",
        admissionDate:      form.admissionDate,
      });

      // Update patient status in MongoDB
      try {
        await patientAPI.updatePatient(form.patientId, {
          status: "Admitted",
          ward:   selectedBed.ward || selectedBed.wardName,
          roomNo: selectedBed.bedNumber || selectedBed.bedNo,
        });
      } catch (_) { /* non-critical */ }

      setStep(4);
    } catch (err) {
      setSaveError(err.message || "Failed to create admission. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Step 4: Success ──────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
          <CheckCircle2 size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#17201D] dark:text-white">Patient Admitted Successfully</h2>
          <p className="mt-2 text-sm text-[#7B8882] dark:text-[#87938E]">
            <strong className="text-[#17201D] dark:text-white">
              {selectedPatient?.name || selectedPatient?.patientName || "Patient"}
            </strong>{" "}
            has been admitted to{" "}
            <strong className="text-[#17201D] dark:text-white">
              {selectedBed?.bedNumber || selectedBed?.bedNo}
            </strong>{" "}
            — {selectedBed?.ward || selectedBed?.wardName}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-[#0F766E]/20 bg-[#0F766E]/5 px-6 py-3">
            <span className="text-xs text-[#87938E]">IPD Number</span>
            <span className="text-lg font-bold text-[#0F766E] dark:text-[#5EEAD4]">{ipdNumber}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/admissions" className="rounded-xl border border-[#DDD9CE] px-5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-white/10">
            View Admissions
          </Link>
          <Link href="/wards" className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]">
            <Building2 size={16} />View Wards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => step === 1 ? router.back() : setStep(s => s - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">New IPD Admission</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Step {step} of 3 — {["Patient & Doctor", "Select Bed", "Confirm Admission"][step - 1]}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-0">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${step >= s ? "bg-[#0F766E] text-white" : "border-2 border-[#DDD9CE] text-[#87938E] dark:border-white/20"}`}>{s}</div>
            {i < 2 && <div className={`h-0.5 w-12 transition-all ${step > s ? "bg-[#0F766E]" : "bg-[#DDD9CE] dark:bg-white/20"}`} />}
          </div>
        ))}
        <div className="ml-3 flex gap-4 text-xs text-[#87938E]">
          <span className={step === 1 ? "font-bold text-[#0F766E]" : ""}>Patient</span>
          <span className={step === 2 ? "font-bold text-[#0F766E]" : ""}>Bed</span>
          <span className={step === 3 ? "font-bold text-[#0F766E]" : ""}>Confirm</span>
        </div>
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <form onSubmit={goToStep2} className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
          {loadingData ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-[#87938E]">
              <Loader2 size={18} className="animate-spin" /> Loading patients & doctors…
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Patient */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Patient *</label>
                <select name="patientId" value={form.patientId} onChange={handleChange} required className={inputClass}>
                  {patients.length === 0 && <option value="">No patients found</option>}
                  {patients.map(p => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.name || p.patientName} {p.uhid ? `(${p.uhid})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Attending Doctor *</label>
                <select name="doctorId" value={form.doctorId} onChange={handleChange} required className={inputClass}>
                  {doctors.length === 0 && <option value="">No doctors found</option>}
                  {doctors.map(d => (
                    <option key={d._id || d.id} value={d._id || d.id}>
                      Dr. {d.name || d.doctorName}{d.specialization ? ` — ${d.specialization}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Diagnosis</label>
                <input type="text" name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="e.g. Acute MI, Fracture…" className={inputClass} />
              </div>

              {/* Admission Date */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Admission Date</label>
                <input required type="date" name="admissionDate" value={form.admissionDate} onChange={handleChange} className={inputClass} />
              </div>

              {/* Reason */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Reason for Admission *</label>
                <textarea name="reason" value={form.reason} onChange={handleChange} rows={3} placeholder="Symptoms, referral notes, clinical summary…" className={inputClass} />
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
            <Link href="/admissions" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">Cancel</Link>
            <button type="submit" disabled={loadingData || !form.patientId}
              className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C] disabled:opacity-50">
              Next: Select Bed <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Ward filter */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
            <label className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Filter by Ward:</label>
            <div className="flex flex-wrap gap-2">
              {wardNames.map(wn => (
                <button key={wn} type="button" onClick={() => setWardFilter(wn)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${wardFilter === wn ? "bg-[#0F766E] text-white" : "border border-[#DDD9CE] text-[#52615B] hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"}`}>
                  {wn}
                </button>
              ))}
            </div>
            <div className="ml-auto text-xs text-[#87938E]">
              {visibleBeds.filter(b => b.status === "Available").length} available of {visibleBeds.length} shown
            </div>
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#87938E]">
              <Loader2 size={18} className="animate-spin" /> Loading beds…
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleBeds.map(bed => {
                const status = bed.status || "Available";
                const cfg    = BED_STATUS_CONFIG[status] || BED_STATUS_CONFIG.Maintenance;
                const bedMongoId = bed._id || bed.id;
                const isSelected = selectedBedId === bedMongoId;
                return (
                  <button key={bedMongoId} type="button"
                    disabled={!cfg.selectable}
                    onClick={() => cfg.selectable && setSelectedBedId(bedMongoId)}
                    className={`group relative w-full rounded-2xl border p-5 text-left transition-all duration-200 shadow-sm ${
                      isSelected
                        ? "border-[#0F766E] bg-teal-50/80 ring-2 ring-[#0F766E] shadow-md dark:border-[#0F766E] dark:bg-[#0F766E]/20"
                        : `${cfg.border} ${cfg.bg} ${cfg.selectable ? "hover:border-[#0F766E] hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : "cursor-not-allowed bg-slate-50/70 dark:bg-white/[0.03]"}`
                    }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${isSelected ? "border-[#0F766E] bg-[#0F766E] text-white" : cfg.iconBg}`}>
                          {BED_TYPE_ICONS[bed.type] || <BedDouble size={18} />}
                        </div>
                        <div>
                          <p className="text-base font-bold text-gray-900 dark:text-white">{bed.bedNumber || bed.bedNo}</p>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{bed.type}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${cfg.badge}`}>{status}</span>
                    </div>

                    <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 dark:border-white/10 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                        <Building2 size={14} className="text-gray-500 shrink-0" />
                        <span>{bed.ward || bed.wardName || "—"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-gray-600 dark:text-gray-300">
                        <span className="font-medium">{bed.floor || "—"} · {bed.type || "—"}</span>
                        {bed.equipment && (
                          <span className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-gray-200">
                            {bed.equipment}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-[#0F766E] px-3 py-2 text-xs font-bold text-white shadow-sm">
                        <CheckCircle2 size={16} /> Selected Bed
                      </div>
                    )}
                  </button>
                );
              })}
              {visibleBeds.length === 0 && (
                <div className="col-span-full py-12 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  No beds found for this ward.
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
            <button type="button" onClick={() => setStep(1)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">← Back</button>
            <button type="button" onClick={goToStep3} disabled={!selectedBedId}
              className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C] disabled:opacity-40 disabled:cursor-not-allowed">
              Next: Review &amp; Confirm <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && selectedBed && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#87938E]">Admission Summary</p>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#0F766E]/20 bg-[#0F766E]/5 p-4 dark:border-[#0F766E]/30 dark:bg-[#0F766E]/10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs text-[#87938E]">Generated IPD Number</p>
                <p className="text-xl font-bold text-[#0F766E] dark:text-[#5EEAD4]">{ipdNumber}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Patient",       value: selectedPatient?.name || selectedPatient?.patientName,      icon: <User size={16}/> },
                { label: "Attending Dr",  value: `Dr. ${selectedDoctor?.name || selectedDoctor?.doctorName}`, icon: <Stethoscope size={16}/> },
                { label: "Bed",           value: selectedBed.bedNumber || selectedBed.bedNo,                 icon: <BedDouble size={16}/> },
                { label: "Ward",          value: selectedBed.ward || selectedBed.wardName,                   icon: <Building2 size={16}/> },
                { label: "Floor",         value: selectedBed.floor,                                          icon: <Building2 size={16}/> },
                { label: "Bed Type",      value: selectedBed.type,                                           icon: <BedDouble size={16}/> },
                { label: "Admission Date",value: form.admissionDate,                                         icon: <FileText size={16}/> },
                { label: "Equipment",     value: selectedBed.equipment,                                      icon: <Wrench size={16}/> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                  <p className="flex items-center gap-1.5 text-[10px] text-[#87938E]">{icon}{label}</p>
                  <p className="mt-1 text-sm font-bold text-[#17201D] dark:text-white">{value || "—"}</p>
                </div>
              ))}
            </div>

            {(form.diagnosis || form.reason) && (
              <div className="mt-4 rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                {form.diagnosis && <p className="text-xs"><span className="text-[#87938E]">Diagnosis: </span><strong className="text-[#17201D] dark:text-white">{form.diagnosis}</strong></p>}
                {form.reason    && <p className="mt-1 text-xs text-[#52615B] dark:text-[#AAB6B0]">{form.reason}</p>}
              </div>
            )}

            {/* Error banner */}
            {saveError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                {saveError}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
            <button type="button" onClick={() => setStep(2)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">← Change Bed</button>
            <button type="button" onClick={handleConfirm} disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C] disabled:opacity-60">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Admitting…</> : <><UserPlus size={16} /> Confirm &amp; Admit Patient</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddAdmissionPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#87938E]">Loading admission form…</div>}>
      <AdmissionWizard />
    </Suspense>
  );
}
