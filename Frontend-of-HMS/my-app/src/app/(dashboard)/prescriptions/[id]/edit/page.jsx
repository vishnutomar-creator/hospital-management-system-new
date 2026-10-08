"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { prescriptionAPI, patientAPI, medicalRecordAPI } from "../../../../services/api";

export default function EditPrescriptionPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [patientOptions, setPatientOptions] = useState([]);
  const [recordOptions, setRecordOptions] = useState([]);

  const [form, setForm] = useState({
    patient: "",
    recordId: "REC-101",
    medicineName: "",
    dosage: "",
    frequency: "Once daily",
    duration: "",
    instructions: "",
    status: "Active",
  });

  useEffect(() => {
    async function loadOptionsAndPrescription() {
      if (!params?.id) return;
      setFetching(true);

      let pList = [];
      let rList = [];

      // 1. Load options from API
      try {
        const resP = await patientAPI.getPatients();
        if (resP.success && Array.isArray(resP.data)) {
          resP.data.forEach((p) => {
            const name = p.name || p.patientName || p.patient || p.userId?.name;
            if (name && !pList.includes(name)) pList.push(name);
          });
        }
      } catch (e) {}

      try {
        const resR = await medicalRecordAPI.getMedicalRecords();
        if (resR.success && Array.isArray(resR.data)) {
          resR.data.forEach((r) => {
            const pName = r.patientName || r.patient || r.patientId?.name || "Patient";
            const label = `${r.recordId || r._id} · ${pName}`;
            if (!rList.includes(label)) rList.push(label);
          });
        }
      } catch (e) {}

      setPatientOptions(pList);
      setRecordOptions(rList);

      // 2. Load target prescription from API
      try {
        let found = null;
        try {
          const resRx = await prescriptionAPI.getPrescriptionById(params.id);
          if (resRx.success && resRx.data) found = resRx.data;
        } catch (_) {}

        if (!found) {
          const allRx = await prescriptionAPI.getPrescriptions();
          if (allRx.success && Array.isArray(allRx.data)) {
            found = allRx.data.find((item) => item.rxId === params.id || item._id === params.id || item.prescriptionId === params.id);
          }
        }

        if (found) {
          const d = found;
          const med = Array.isArray(d.medicines) && d.medicines.length > 0 ? d.medicines[0] : {};
          setForm({
            patient: d.patient || d.patientName || d.patientId?.name || "",
            recordId: d.recordId || "REC-101",
            medicineName: d.medicineName || med.name || "",
            dosage: d.dosage || med.dosage || "",
            frequency: d.frequency || med.frequency || "Once daily",
            duration: d.duration || med.duration || "",
            instructions: d.instructions || med.instructions || "",
            status: d.status || "Active",
          });
        }
      } catch (err) {
        console.warn("Error loading prescription:", err.message);
      } finally {
        setFetching(false);
      }
    }

    loadOptionsAndPrescription();
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalPatient = form.patient.trim() || "Patient";

    const updatedRxObj = {
      recordId: form.recordId || "REC-101",
      patient: finalPatient,
      patientName: finalPatient,
      medicineName: form.medicineName.trim(),
      dosage: form.dosage.trim(),
      frequency: form.frequency,
      duration: form.duration.trim(),
      instructions: form.instructions.trim(),
      status: form.status,
    };

    try {
      if (params?.id) {
        await prescriptionAPI.updatePrescription(params.id, updatedRxObj);
      }
    } catch (err) {
      console.warn("Prescription API update notice:", err.message);
    } finally {
      setLoading(false);
      router.push("/prescriptions");
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 text-sm font-semibold text-[#87938E]">
        Loading prescription record...
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
            Edit Prescription
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Update prescription details and dosage notes ({params?.id})
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
          {/* Patient Selection / Typeable Text Input */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Patient Name *
            </label>
            <input
              required
              type="text"
              name="patient"
              value={form.patient}
              onChange={handleChange}
              list="rx-edit-patient-suggestions"
              placeholder="Type or select patient full name"
              className={inputClass}
            />
            {patientOptions.length > 0 && (
              <datalist id="rx-edit-patient-suggestions">
                {patientOptions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            )}
          </div>

          {/* Related Medical Record */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Medical Record Reference
            </label>
            {recordOptions.length > 0 ? (
              <select
                name="recordId"
                value={form.recordId}
                onChange={handleChange}
                className={inputClass}
              >
                {recordOptions.map((opt) => (
                  <option key={opt} value={opt.split(" · ")[0]}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="recordId"
                value={form.recordId}
                onChange={handleChange}
                placeholder="e.g. REC-101"
                className={inputClass}
              />
            )}
          </div>

          {/* Medicine Name */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Medicine Name *
            </label>
            <input
              required
              name="medicineName"
              value={form.medicineName}
              onChange={handleChange}
              placeholder="e.g. Amlodipine 5mg, Paracetamol 500mg"
              className={inputClass}
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Dosage *
            </label>
            <input
              required
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              placeholder="e.g. 1 tablet"
              className={inputClass}
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Frequency
            </label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Once daily</option>
              <option>Twice daily</option>
              <option>Thrice daily</option>
              <option>Every 8 hours</option>
              <option>As needed</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Duration *
            </label>
            <input
              required
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 7 days, 30 days"
              className={inputClass}
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Active</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Instructions */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Instructions
            </label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Take after meals with water, avoid driving"
              className={inputClass}
            />
          </div>
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
              transition hover:bg-[#0F766E]/90
            "
          >
            <Save size={16} />
            {loading ? "Updating..." : "Update Prescription"}
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
