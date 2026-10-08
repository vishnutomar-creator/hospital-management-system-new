"use client";

import { useState } from "react";
import { X, FileCheck, CheckCircle2, Loader2 } from "lucide-react";
import { labStore } from "../../services/labStore";

export default function EnterResultsModal({ order, onClose, onSuccess }) {
  const [form, setForm] = useState({
    value: "",
    normalRange: "Standard reference range",
    interpretation: "Normal",
    technician: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await labStore.enterResults(order.id, {
        value: form.value || "Normal limits",
        normalRange: form.normalRange,
        interpretation: form.interpretation,
        technician: form.technician,
        remarks: form.remarks,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between border-b border-[#EEECE5] pb-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              <FileCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17201D] dark:text-white">Enter Diagnostic Results</h2>
              <p className="text-xs text-[#7B8882] font-semibold dark:text-[#87938E]">
                Order {String(order.id).slice(-8)} · {order.testType}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-1 text-[#87938E] hover:bg-[#F1F3EF] dark:hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-[#FAFAF7] p-3 text-xs dark:bg-[#202B27]">
          <div className="flex items-center justify-between">
            <p className="font-bold text-[#17201D] dark:text-white">{order.patientName}</p>
            <p className="font-mono text-[#0F766E] font-bold dark:text-[#5EEAD4]">
              Sample: {order.sample?.sampleId || "SMP-LOGGED"}
            </p>
          </div>
          <p className="text-[#87938E] mt-0.5">Specimen: {order.sample?.specimenType || "Blood"}</p>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Primary Observed Result / Value</label>
            <input
              required
              type="text"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="e.g. LDL 142 mg/dL or WBC: 8.2, RBC: 4.8"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Normal Reference Range</label>
            <input
              type="text"
              value={form.normalRange}
              onChange={(e) => setForm({ ...form, normalRange: e.target.value })}
              placeholder="e.g. < 130 mg/dL or 4.0 - 5.6%"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Clinical Interpretation</label>
              <select
                value={form.interpretation}
                onChange={(e) => setForm({ ...form, interpretation: e.target.value })}
                className={inputClass}
              >
                <option value="Normal">Normal</option>
                <option value="Abnormal">Abnormal</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Technician Name</label>
              <input
                type="text"
                value={form.technician}
                onChange={(e) => setForm({ ...form, technician: e.target.value })}
                placeholder="e.g. Tech. John Smith"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Technical Notes / Remarks</label>
            <textarea
              rows={2}
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              placeholder="Observations or comments for Pathologist review"
              className={inputClass}
            />
          </div>

          <p className="text-[11px] text-[#7B8882] italic dark:text-[#87938E]">
            * Submitting results saves to MongoDB and moves this order to{" "}
            <strong className="text-indigo-600 dark:text-indigo-400">RESULT_READY</strong> status for Pathologist Verification.
          </p>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-4 dark:border-white/10">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-xs font-semibold text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              {loading ? "Saving to DB..." : "Submit Results for Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7]
  bg-[#FAFAF7] px-3 py-2 text-xs
  text-[#17201D] outline-none
  placeholder:text-[#9AA49F]
  focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10
  dark:border-white/10 dark:bg-[#202B27] dark:text-white
`;
