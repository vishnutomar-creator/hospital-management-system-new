"use client";

import { useState, useEffect } from "react";
import { X, ShieldCheck, CheckCircle2, Award, Loader2 } from "lucide-react";
import { labStore } from "../../services/labStore";
import { doctorAPI } from "../../services/api";

export default function VerifyReportModal({ order, onClose, onSuccess }) {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    verifiedBy: "",        // will hold the doctor's MongoDB _id
    pathologistTitle: "Consultant Pathologist",
    comments: "Report reviewed and verified. Released for clinical patient history.",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorAPI.getDoctors();
        const list = res?.data || [];
        setDoctors(list);
        if (list.length > 0) {
          const firstId = list[0]._id || list[0].id || "";
          setForm((f) => ({ ...f, verifiedBy: firstId }));
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setFetchingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  if (!order) return null;

  const results = order.results || {};

  const getDoctorDisplayName = (d) => {
    return d.name || `Dr. ${d.firstName || ""} ${d.lastName || ""}`.trim() || "Unknown Doctor";
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!form.verifiedBy) {
      setError("Please select a verifying pathologist.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await labStore.verifyAndReleaseReport(order.id, form);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to verify report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between border-b border-[#EEECE5] pb-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17201D] dark:text-white">Pathologist Verification & Release</h2>
              <p className="text-xs text-[#7B8882] font-semibold dark:text-[#87938E]">
                Order {String(order.id).slice(-8)} · {order.testType}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-1 text-[#87938E] hover:bg-[#F1F3EF] dark:hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex items-center justify-between font-bold text-[#17201D] dark:text-white">
            <span>Patient: {order.patientName}</span>
            <span className="rounded bg-emerald-200 px-2 py-0.5 text-[10px] text-emerald-900 dark:bg-emerald-500/30 dark:text-emerald-200">RESULT READY</span>
          </div>
          <div className="mt-3 space-y-1.5 border-t border-emerald-200/60 pt-2 dark:border-emerald-500/20">
            <div className="flex justify-between">
              <span className="text-[#52615B] dark:text-[#AAB6B0]">Entered Result:</span>
              <span className="font-mono font-bold text-[#0F766E] dark:text-[#5EEAD4]">{results.value || "Normal"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#52615B] dark:text-[#AAB6B0]">Normal Range:</span>
              <span>{results.normalRange || "Standard"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#52615B] dark:text-[#AAB6B0]">Interpretation:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">{results.interpretation || "Normal"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#52615B] dark:text-[#AAB6B0]">Technician:</span>
              <span>{results.technician || "Lab Tech"}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Verifying Pathologist <span className="text-red-500">*</span>
            </label>
            {fetchingDoctors ? (
              <div className="flex items-center gap-2 text-xs text-[#87938E] py-2">
                <Loader2 size={14} className="animate-spin" /> Loading doctors...
              </div>
            ) : (
              <select
                required
                value={form.verifiedBy}
                onChange={(e) => setForm({ ...form, verifiedBy: e.target.value })}
                className={inputClass}
              >
                <option value="">Select pathologist...</option>
                {doctors.map((d, idx) => (
                  <option key={d._id || d.id || `doc-${idx}`} value={d._id || d.id || d.name}>
                    {getDoctorDisplayName(d)}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Pathologist Designation / Seal</label>
            <input
              type="text"
              value={form.pathologistTitle}
              onChange={(e) => setForm({ ...form, pathologistTitle: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Pathologist Sign-Off Remarks</label>
            <textarea
              rows={2}
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#E7F5F2] p-3 text-xs text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
            <Award size={18} className="shrink-0" />
            <p>Verifying saves to MongoDB and marks this test as <strong className="font-bold">verified</strong>, enabling report access and patient history update.</p>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-4 dark:border-white/10">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-xs font-semibold text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">
              Cancel
            </button>
            <button type="submit" disabled={loading || fetchingDoctors || !form.verifiedBy} className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              {loading ? "Saving to DB..." : "Pathologist Verify & Release Report"}
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
