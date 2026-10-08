"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { medicalRecordAPI, patientAPI, doctorAPI } from "../../../services/api";

export default function AddMedicalRecordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patientOptions, setPatientOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    diagnosis: "",
    treatmentPlan: "",
    date: new Date().toISOString().slice(0, 10),
    followUpDate: "",
  });

  useEffect(() => {
    async function loadSuggestions() {
      let pList = [];
      let dList = [];

      try {
        const resP = await patientAPI.getPatients();
        if (resP.success && Array.isArray(resP.data)) {
          resP.data.forEach((p) => {
            const name = p.name || p.patientName || p.userId?.name;
            if (name && !pList.includes(name)) pList.push(name);
          });
        }
      } catch (e) {}

      try {
        const resD = await doctorAPI.getDoctors();
        if (resD.success && Array.isArray(resD.data)) {
          resD.data.forEach((d) => {
            const name = d.name || d.doctorName;
            if (name && !dList.includes(name)) dList.push(name);
          });
        }
      } catch (e) {}

      setPatientOptions(pList);
      setDoctorOptions(dList);
    }

    loadSuggestions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const recordId = `REC-${Math.floor(100 + Math.random() * 900)}`;

    const newRecordObj = {
      recordId,
      patient: form.patient.trim() || "Patient",
      patientName: form.patient.trim() || "Patient",
      doctor: form.doctor.trim() || "Dr. Specialist",
      doctorName: form.doctor.trim() || "Dr. Specialist",
      diagnosis: form.diagnosis.trim(),
      treatment: form.treatmentPlan || "Prescribed medication & rest",
      date: form.date || "Today",
      followUpDate: form.followUpDate || null,
    };

    try {
      await medicalRecordAPI.createMedicalRecord(newRecordObj);
    } catch (err) {
      console.warn("Medical record API creation notice:", err.message);
    } finally {
      setLoading(false);
      router.push("/medical-records");
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/medical-records"
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
            Add Medical Record
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Log a clinical diagnosis and treatment plan
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="
          rounded-2xl border border-[#E5E2D9] bg-white p-6
          dark:border-white/10 dark:bg-[#17201D]
        "
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Patient Name (Typeable Text Input with Datalist) */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Patient Name *
            </label>
            <input
              required
              type="text"
              name="patient"
              value={form.patient}
              onChange={handleChange}
              list="patient-suggestions"
              placeholder="Type patient full name"
              className={inputClass}
            />
            {patientOptions.length > 0 && (
              <datalist id="patient-suggestions">
                {patientOptions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            )}
          </div>

          {/* Doctor Name (Typeable Text Input with Datalist) */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Doctor Name *
            </label>
            <input
              required
              type="text"
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              list="doctor-suggestions"
              placeholder="Type doctor full name (e.g. Dr. Ankit Sharma)"
              className={inputClass}
            />
            {doctorOptions.length > 0 && (
              <datalist id="doctor-suggestions">
                {doctorOptions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            )}
          </div>

          {/* Diagnosis */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Diagnosis *
            </label>
            <input
              required
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              placeholder="e.g. Hypertension - Stage 1, Type 2 Diabetes"
              className={inputClass}
            />
          </div>

          {/* Treatment Plan */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Treatment Plan & Clinical Notes
            </label>
            <textarea
              name="treatmentPlan"
              value={form.treatmentPlan}
              onChange={handleChange}
              rows={4}
              placeholder="Describe prescribed medications, rest recommendations, and clinical findings"
              className={inputClass}
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Record Date *
            </label>
            <input
              required
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
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
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link
            href="/medical-records"
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
              transition hover:bg-[#0F766E]/90
            "
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save Record"}
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