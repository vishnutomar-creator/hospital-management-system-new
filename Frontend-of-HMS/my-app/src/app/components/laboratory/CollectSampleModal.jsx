"use client";

import { useState } from "react";
import { X, TestTube2, CheckCircle, Loader2 } from "lucide-react";
import { labStore } from "../../services/labStore";

export default function CollectSampleModal({ order, onClose, onSuccess }) {
  const [form, setForm] = useState({
    specimenType: "EDTA Whole Blood",
    tubeColor: "Lavender Top (EDTA)",
    collectedBy: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await labStore.collectSample(order.id, form);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to collect sample. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between border-b border-[#EEECE5] pb-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
              <TestTube2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17201D] dark:text-white">Collect Diagnostic Sample</h2>
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
            <span className="rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 text-[10px]">
              {order.status}
            </span>
          </div>
          <p className="text-[#87938E] mt-0.5">Doctor: {order.doctor}</p>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Specimen / Sample Type</label>
            <select value={form.specimenType} onChange={(e) => setForm({ ...form, specimenType: e.target.value })} className={inputClass}>
              <option>EDTA Whole Blood</option>
              <option>Serum (SST)</option>
              <option>Plasma (Heparin)</option>
              <option>Clean Catch Urine</option>
              <option>Nasopharyngeal Swab</option>
              <option>Imaging Scan</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Container / Tube Color</label>
            <select value={form.tubeColor} onChange={(e) => setForm({ ...form, tubeColor: e.target.value })} className={inputClass}>
              <option>Lavender Top (EDTA)</option>
              <option>Red / Gel Top (Serum)</option>
              <option>Purple Top</option>
              <option>Grey Top (Sodium Fluoride)</option>
              <option>Sterile Container</option>
              <option>N/A (Radiology/Imaging)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Collected By (Staff Name)</label>
            <input
              type="text"
              value={form.collectedBy}
              onChange={(e) => setForm({ ...form, collectedBy: e.target.value })}
              placeholder="e.g. Nurse Jane Doe"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Notes / Condition</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g. Fasting sample collected, no hemolysis"
              className={inputClass}
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-4 dark:border-white/10">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-xs font-semibold text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0B625C] disabled:opacity-60">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
              {loading ? "Saving..." : "Confirm Sample Collection"}
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
