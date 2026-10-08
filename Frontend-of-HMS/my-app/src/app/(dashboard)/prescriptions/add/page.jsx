"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, Pill, ArrowRight } from "lucide-react";
import { prescriptionAPI, patientAPI, medicalRecordAPI, doctorAPI } from "../../../services/api";

const FREQUENCY_OPTIONS = [
  { value: "once_daily", label: "Once daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_times_daily", label: "Thrice daily" },
  { value: "four_times_daily", label: "Four times daily" },
  { value: "as_needed", label: "As needed" },
];

const TIMING_OPTIONS = [
  { value: "before_meal", label: "Before meal" },
  { value: "after_meal", label: "After meal" },
  { value: "with_meal", label: "With meal" },
  { value: "anytime", label: "Anytime" },
];

const emptyMedicine = () => ({
  name: "",
  dosage: "",
  frequency: "once_daily",
  timing: "anytime",
  duration: "",
  quantity: "",
  instructions: "",
});

export default function AddPrescriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [saved, setSaved] = useState(null); // { rxId, patient }

  // Patient list — stores full objects {_id, displayName}
  const [patientOptions, setPatientOptions] = useState([]);
  // Medical record list — stores full objects {_id, label}
  const [recordOptions, setRecordOptions] = useState([]);
  // Doctor list — stores full objects {_id, displayName}
  const [doctorOptions, setDoctorOptions] = useState([]);

  const [form, setForm] = useState({
    patientId: "",        // ObjectId — the correct key
    patientName: "",      // display only
    recordId: "",         // MedicalRecord._id or custom ID
    doctorId: "",
    doctorName: "",       // display only
    diagnosis: "",
    symptoms: "",
    medicines: [emptyMedicine()],
    advice: "",
    followUpDate: "",
    status: "Pending Dispense",
  });

  useEffect(() => {
    async function loadData() {
      // Load patients
      try {
        const resP = await patientAPI.getPatients();
        if (resP.success && Array.isArray(resP.data)) {
          const patients = resP.data.map((p) => ({
            _id: p._id,
            displayName: p.name || p.patientName || p.patientId || "Unknown",
          }));
          setPatientOptions(patients);
          if (patients.length > 0) {
            setForm((prev) => ({
              ...prev,
              patientId: patients[0]._id,
              patientName: patients[0].displayName,
            }));
          }
        }
      } catch (e) {
        console.warn("Could not load patients:", e.message);
      }

      // Load medical records
      try {
        const resR = await medicalRecordAPI.getMedicalRecords();
        if (resR.success && Array.isArray(resR.data)) {
          const records = resR.data.map((r) => ({
            _id: r._id,
            label: `${r._id} · ${r.diagnosis || "Consultation"}`,
          }));
          setRecordOptions(records);
        }
      } catch (e) {
        console.warn("Could not load medical records:", e.message);
      }

      // Load doctors
      try {
        const resD = await doctorAPI.getDoctors();
        if (resD.success && Array.isArray(resD.data)) {
          const doctors = resD.data.map((d) => ({
            _id: d._id,
            displayName: d.name || d.doctorName || "Doctor",
          }));
          setDoctorOptions(doctors);
          if (doctors.length > 0) {
            setForm((prev) => ({
              ...prev,
              doctorId: doctors[0]._id,
              doctorName: `Dr. ${doctors[0].displayName}`,
            }));
          }
        }
      } catch (e) {
        console.warn("Could not load doctors:", e.message);
      }
    }

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "patientId") {
      const selected = patientOptions.find((p) => p._id === value);
      setForm((prev) => ({
        ...prev,
        patientId: value,
        patientName: selected?.displayName || "",
      }));
    } else if (name === "doctorId") {
      const selected = doctorOptions.find((d) => d._id === value);
      setForm((prev) => ({
        ...prev,
        doctorId: value,
        doctorName: selected ? `Dr. ${selected.displayName}` : "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMedicineChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.medicines];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, medicines: updated };
    });
  };

  const addMedicine = () => {
    setForm((prev) => ({
      ...prev,
      medicines: [...prev.medicines, emptyMedicine()],
    }));
  };

  const removeMedicine = (index) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);

    const rxId = `RX-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      rxId,
      patientId: form.patientId || null,
      patientName: form.patientName || null,
      doctorId: form.doctorId || null,
      doctorName: form.doctorName || null,
      recordId: form.recordId || null,
      diagnosis: form.diagnosis.trim() || "General Consultation",
      symptoms: form.symptoms
        ? form.symptoms.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      medicines: form.medicines.filter((m) => m.name.trim()),
      advice: form.advice.trim(),
      followUpDate: form.followUpDate || null,
      status: "Pending Dispense",
    };

    try {
      await prescriptionAPI.createPrescription(payload);
      setLoading(false);
      setSaved({ rxId, patient: form.patientName || "Patient" });
    } catch (err) {
      console.error("Create prescription error:", err.message);
      setSubmitError(err.message || "Failed to save prescription. Please try again.");
      setLoading(false);
    }
  };

  // ── Saved confirmation screen ──────────────────────────────────────────
  if (saved) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
          <CheckCircle2 size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Prescription Saved &amp; Sent to Pharmacy
          </h2>
          <p className="mt-2 text-sm text-[#7B8882] dark:text-[#87938E]">
            <strong className="text-[#17201D] dark:text-white">{saved.rxId}</strong> for{" "}
            <strong className="text-[#17201D] dark:text-white">{saved.patient}</strong> is now
            queued in the Pharmacy Pending Prescriptions queue — no re-entry required.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/prescriptions"
            className="rounded-xl border border-[#DDD9CE] px-5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-white/10"
          >
            Back to Prescriptions
          </Link>
          <Link
            href="/pharmacy"
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90"
          >
            <Pill size={16} />
            Go to Pharmacy Queue
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/prescriptions"
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-[#DDD9CE] text-[#52615B]
            transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E]
            dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20
          "
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">
            Add Prescription
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Prescribe medicines — automatically queued in Pharmacy on save
          </p>
        </div>
      </div>

      {/* Pharmacy Integration Notice */}
      <div className="flex items-center gap-3 rounded-2xl border border-[#0F766E]/20 bg-[#0F766E]/5 p-4 text-sm text-[#0F766E] dark:border-[#0F766E]/30 dark:bg-[#0F766E]/10 dark:text-[#5EEAD4]">
        <Pill size={18} className="shrink-0" />
        <span>
          On save, this prescription is <strong>automatically forwarded</strong> to the{" "}
          <Link href="/pharmacy" className="underline underline-offset-2 hover:opacity-80">
            Pharmacy Pending Queue
          </Link>{" "}
          — no re-entry needed by the pharmacist.
        </span>
      </div>

      {/* Error Banner */}
      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {submitError}
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="
          rounded-2xl border border-[#E5E2D9] bg-white p-6
          dark:border-white/10 dark:bg-[#17201D]
        "
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Patient Selection — stores ObjectId */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Patient *
            </label>
            {patientOptions.length > 0 ? (
              <select
                required
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">— Select patient —</option>
                {patientOptions.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.displayName}
                  </option>
                ))}
              </select>
            ) : (
              <input
                required
                type="text"
                name="patientName"
                value={form.patientName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, patientName: e.target.value }))
                }
                placeholder="Type patient name"
                className={inputClass}
              />
            )}
          </div>

          {/* Prescribing Doctor */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Prescribing Doctor *
            </label>
            {doctorOptions.length > 0 ? (
              <select
                required
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">— Select doctor —</option>
                {doctorOptions.map((d) => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.displayName}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="doctorName"
                value={form.doctorName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, doctorName: e.target.value }))
                }
                placeholder="e.g. Dr. Rajesh Gupta"
                className={inputClass}
              />
            )}
          </div>

          {/* Related Medical Record */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Medical Record Reference
              <span className="ml-1 font-normal text-[#9AA49F]">(optional)</span>
            </label>
            {recordOptions.length > 0 ? (
              <select
                name="recordId"
                value={form.recordId}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">— Select a medical record —</option>
                {recordOptions.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="recordId"
                value={form.recordId}
                onChange={handleChange}
                placeholder="Medical record ID (optional)"
                className={inputClass}
              />
            )}
          </div>

          {/* Diagnosis */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Diagnosis
            </label>
            <input
              type="text"
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              placeholder="e.g. Hypertension, Type 2 Diabetes"
              className={inputClass}
            />
          </div>

          {/* Symptoms */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Symptoms
              <span className="ml-1 font-normal text-[#9AA49F]">(comma separated)</span>
            </label>
            <input
              type="text"
              name="symptoms"
              value={form.symptoms}
              onChange={handleChange}
              placeholder="e.g. headache, fever, nausea"
              className={inputClass}
            />
          </div>

          {/* Medicines */}
          <div className="sm:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
                Medicines *
              </label>
              <button
                type="button"
                onClick={addMedicine}
                className="flex items-center gap-1.5 rounded-lg bg-[#0F766E]/10 px-3 py-1.5 text-xs font-semibold text-[#0F766E] transition hover:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
              >
                <Plus size={13} /> Add Medicine
              </button>
            </div>

            <div className="space-y-4">
              {form.medicines.map((med, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E5E2D9] p-4 dark:border-white/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
                      Medicine {idx + 1}
                    </span>
                    {form.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-[#52615B] dark:text-[#AAB6B0]">Name *</label>
                      <input
                        required
                        type="text"
                        value={med.name}
                        onChange={(e) => handleMedicineChange(idx, "name", e.target.value)}
                        placeholder="e.g. Amlodipine 5mg"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-[#52615B] dark:text-[#AAB6B0]">Dosage *</label>
                      <input
                        required
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)}
                        placeholder="e.g. 1 tablet"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-[#52615B] dark:text-[#AAB6B0]">Frequency</label>
                      <select
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(idx, "frequency", e.target.value)}
                        className={inputClass}
                      >
                        {FREQUENCY_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-[#52615B] dark:text-[#AAB6B0]">Timing</label>
                      <select
                        value={med.timing}
                        onChange={(e) => handleMedicineChange(idx, "timing", e.target.value)}
                        className={inputClass}
                      >
                        {TIMING_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-[#52615B] dark:text-[#AAB6B0]">Duration *</label>
                      <input
                        required
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(idx, "duration", e.target.value)}
                        placeholder="e.g. 7 days"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-[#52615B] dark:text-[#AAB6B0]">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={med.quantity}
                        onChange={(e) => handleMedicineChange(idx, "quantity", e.target.value)}
                        placeholder="e.g. 14"
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-[#52615B] dark:text-[#AAB6B0]">Instructions</label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => handleMedicineChange(idx, "instructions", e.target.value)}
                        placeholder="e.g. Take with food, avoid alcohol"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Doctor&apos;s Advice
            </label>
            <textarea
              name="advice"
              value={form.advice}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Rest, drink plenty of water, avoid spicy food"
              className={inputClass}
            />
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Follow-up Date
            </label>
            <input
              type="date"
              name="followUpDate"
              value={form.followUpDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Status is always Pending Dispense for new prescriptions — set automatically */}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link
            href="/prescriptions"
            className="
              rounded-xl px-4 py-2.5 text-sm font-semibold
              text-[#52615B] transition hover:bg-[#F1F3EF]
              dark:text-[#AAB6B0] dark:hover:bg-white/10
            "
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="
              flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5
              text-sm font-semibold text-white
              transition hover:bg-[#0F766E]/90 disabled:opacity-60
            "
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save & Send to Pharmacy"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7]
  bg-[#FAFAF7] px-4 py-2.5 text-sm
  text-[#17201D] outline-none
  placeholder:text-[#9AA49F]
  focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
  dark:border-white/10 dark:bg-[#202B27] dark:text-white
  dark:placeholder:text-[#71817B]
`;