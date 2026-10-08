"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2, AlertCircle } from "lucide-react";
import { labStore } from "../../../../services/labStore";
import { patientAPI, doctorAPI } from "../../../../services/api";

const testTypes = [
  "Lipid Profile",
  "HbA1c",
  "Complete Blood Count (CBC)",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT)",
  "Thyroid Profile (T3, T4, TSH)",
  "Blood Glucose (Fasting)",
  "Blood Glucose (Post Prandial)",
  "Urine Routine",
  "X-Ray Chest (PA View)",
  "X-Ray Knee (Left)",
  "MRI Brain",
  "CT Scan Abdomen",
  "Ultrasound Abdomen",
  "Allergy Panel",
  "COVID-19 RT-PCR",
  "Dengue NS1 Antigen",
  "Malaria Parasite Test",
  "Blood Culture",
  "Urine Culture",
];

const testCategoryMap = {
  "Lipid Profile": "Biochemistry",
  "HbA1c": "Biochemistry",
  "Complete Blood Count (CBC)": "Blood",
  "Liver Function Test (LFT)": "Biochemistry",
  "Kidney Function Test (KFT)": "Biochemistry",
  "Thyroid Profile (T3, T4, TSH)": "Biochemistry",
  "Blood Glucose (Fasting)": "Biochemistry",
  "Blood Glucose (Post Prandial)": "Biochemistry",
  "Urine Routine": "Urine",
  "X-Ray Chest (PA View)": "Imaging",
  "X-Ray Knee (Left)": "Imaging",
  "MRI Brain": "Imaging",
  "CT Scan Abdomen": "Imaging",
  "Ultrasound Abdomen": "Imaging",
  "Allergy Panel": "Blood",
  "COVID-19 RT-PCR": "Microbiology",
  "Dengue NS1 Antigen": "Microbiology",
  "Malaria Parasite Test": "Microbiology",
  "Blood Culture": "Microbiology",
  "Urine Culture": "Microbiology",
};

export default function AddLabOrderPage() {
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    testType: testTypes[0],
    orderDate: new Date().toISOString().split("T")[0],
    priority: "Routine",
    cost: "",
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, dRes] = await Promise.all([patientAPI.getPatients(), doctorAPI.getDoctors()]);
        const patientList = pRes?.data || [];
        const doctorList = dRes?.data || [];
        setPatients(patientList);
        setDoctors(doctorList);
        if (patientList.length > 0) setForm((f) => ({ ...f, patientId: patientList[0]._id }));
        if (doctorList.length > 0) setForm((f) => ({ ...f, doctorId: doctorList[0]._id }));
      } catch (err) {
        setDataError("Failed to load patients and doctors. Please ensure the backend is running.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.doctorId) {
      setSubmitError("Please select a patient and doctor.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await labStore.createOrder({
        patientId: form.patientId,
        doctorId: form.doctorId,
        testType: form.testType,
        testCategory: testCategoryMap[form.testType] || "Other",
        orderDate: form.orderDate,
        priority: form.priority,
        cost: form.cost ? parseFloat(form.cost) : 0,
        notes: form.notes,
      });
      router.push("/laboratory/orders");
    } catch (err) {
      setSubmitError(err.message || "Failed to create lab order. Please try again.");
      setSubmitting(false);
    }
  };

  const getPatientDisplayName = (p) => {
    return p.name || `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Unknown Patient";
  };

  const getDoctorDisplayName = (d) => {
    return d.name || `Dr. ${d.firstName || ""} ${d.lastName || ""}`.trim() || "Unknown Doctor";
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#87938E]">
        <Loader2 size={32} className="animate-spin mb-3" />
        <p className="text-sm">Loading patients and doctors from database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/laboratory/orders"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">New Diagnostic Lab Order</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Create a lab test request. Order will be saved to MongoDB and start at Stage 1:{" "}
            <strong className="text-amber-600 dark:text-amber-400">ORDERED</strong>.
          </p>
        </div>
      </div>

      {dataError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300">
          <AlertCircle size={18} className="shrink-0" />
          {dataError}
        </div>
      )}

      {submitError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300">
          <AlertCircle size={18} className="shrink-0" />
          {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Patient Name <span className="text-red-500">*</span>
            </label>
            <select name="patientId" value={form.patientId} onChange={handleChange} required className={inputClass}>
              {patients.length === 0 ? (
                <option value="">No patients found</option>
              ) : (
                patients.map((p, idx) => (
                  <option key={p._id || p.id || `pat-${idx}`} value={p._id || p.id}>{getPatientDisplayName(p)}</option>
                ))
              )}
            </select>
            {patients.length === 0 && !dataError && (
              <p className="mt-1 text-[10px] text-amber-600">No patients in the database. Please add patients first.</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Ordering Physician <span className="text-red-500">*</span>
            </label>
            <select name="doctorId" value={form.doctorId} onChange={handleChange} required className={inputClass}>
              {doctors.length === 0 ? (
                <option value="">No doctors found</option>
              ) : (
                doctors.map((d, idx) => (
                  <option key={d._id || d.id || `doc-${idx}`} value={d._id || d.id}>{getDoctorDisplayName(d)}</option>
                ))
              )}
            </select>
            {doctors.length === 0 && !dataError && (
              <p className="mt-1 text-[10px] text-amber-600">No doctors in the database. Please add doctors first.</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Diagnostic Test Category / Type</label>
            <select name="testType" value={form.testType} onChange={handleChange} className={inputClass}>
              {testTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-[#87938E]">
              Category auto-assigned: <strong>{testCategoryMap[form.testType] || "Other"}</strong>
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Order Date</label>
            <input required type="date" name="orderDate" value={form.orderDate} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Priority Level</label>
            <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
              <option value="Routine">Routine</option>
              <option value="Urgent">Urgent</option>
              <option value="STAT">STAT (Emergency)</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Test Cost (₹)</label>
            <input
              type="number"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              placeholder="e.g. 500"
              min="0"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Clinical Notes & Instructions</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Fasting requirements, clinical indications, or special handling instructions..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link
            href="/laboratory/orders"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || patients.length === 0 || doctors.length === 0}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90 shadow-sm disabled:opacity-60"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {submitting ? "Saving to MongoDB..." : "Create Order"}
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
