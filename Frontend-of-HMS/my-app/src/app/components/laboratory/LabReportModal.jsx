"use client";

import { X, Printer, Download, CheckCircle2, ShieldCheck, TestTube2, Building2 } from "lucide-react";

export default function LabReportModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const results = order.results || {};
  const sample = order.sample || {};
  const verification = order.verification || {};
  const parameters = results.parameters || [
    { name: order.testType, value: results.value || "Normal", unit: "-", reference: results.normalRange || "Normal", flag: results.interpretation || "Normal" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-[#17201D] dark:border dark:border-white/10">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#EEECE5] px-6 py-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#0F766E] dark:text-[#5EEAD4]" />
            <h2 className="text-base font-bold text-[#17201D] dark:text-white">
              Official Diagnostic Lab Report
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-[#DDD9CE] px-3 py-1.5 text-xs font-semibold text-[#52615B] hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]"
            >
              <Printer size={14} />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-[#87938E] hover:bg-[#F1F3EF] dark:hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Report Document Body */}
        <div className="p-8 space-y-6 text-[#17201D] dark:text-white" id="printable-report">
          
          {/* Hospital Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-[#0F766E] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E] text-white font-bold">
                  M
                </div>
                <div>
                  <h1 className="text-xl font-black text-[#0F766E] dark:text-[#5EEAD4] tracking-tight">
                    MediCare Central Diagnostics
                  </h1>
                  <p className="text-xs text-[#7B8882] dark:text-[#87938E]">
                    NABH & CAP Accredited Clinical Laboratory
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 sm:mt-0 text-left sm:text-right text-xs text-[#7B8882] dark:text-[#87938E]">
              <p className="font-semibold text-[#17201D] dark:text-white">Report No: {order.id.replace("LO-", "REP-")}</p>
              <p>Issued: {verification.verifiedAt || order.orderDate}</p>
            </div>
          </div>

          {/* Patient & Order Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl bg-[#FAFAF7] p-4 text-xs dark:bg-[#202B27]">
            <div>
              <p className="text-[10px] font-bold uppercase text-[#87938E]">Patient Name</p>
              <p className="font-bold text-[#17201D] dark:text-white text-sm mt-0.5">{order.patientName}</p>
              <p className="text-[#87938E]">ID: {order.patientId}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-[#87938E]">Referring Doctor</p>
              <p className="font-semibold text-[#17201D] dark:text-white text-sm mt-0.5">{order.doctor}</p>
              <p className="text-[#87938E]">{order.department}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-[#87938E]">Sample ID</p>
              <p className="font-mono font-bold text-[#0F766E] dark:text-[#5EEAD4] text-sm mt-0.5">
                {sample.sampleId || "SMP-LOGGED"}
              </p>
              <p className="text-[#87938E]">{sample.specimenType || "Blood"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-[#87938E]">Order Status</p>
              <span className="inline-flex items-center gap-1 mt-0.5 rounded-md bg-[#0F766E]/10 px-2 py-0.5 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                <CheckCircle2 size={12} /> VERIFIED & RELEASED
              </span>
            </div>
          </div>

          {/* Test Name */}
          <div className="border-l-4 border-[#0F766E] pl-3 py-1">
            <h3 className="text-base font-bold text-[#17201D] dark:text-white">
              {order.testType}
            </h3>
            <p className="text-xs text-[#7B8882] dark:text-[#87938E]">
              Clinical Notes: {order.notes || "Standard diagnostic evaluation"}
            </p>
          </div>

          {/* Result Parameters Table */}
          <div className="overflow-x-auto rounded-xl border border-[#EEECE5] dark:border-white/10">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F1F3EF] text-[#52615B] font-bold uppercase tracking-wider dark:bg-white/5 dark:text-[#AAB6B0]">
                  <th className="px-4 py-3">Parameter Test</th>
                  <th className="px-4 py-3">Observed Value</th>
                  <th className="px-4 py-3">Reference Range</th>
                  <th className="px-4 py-3">Flag / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEECE5] dark:divide-white/10">
                {parameters.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#FAFAF7] dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-[#17201D] dark:text-white">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 font-bold font-mono text-[#0F766E] dark:text-[#5EEAD4]">
                      {p.value} {p.unit || ""}
                    </td>
                    <td className="px-4 py-3 text-[#7B8882] dark:text-[#87938E]">
                      {p.reference}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.flag === "High" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300" :
                        p.flag === "Low" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" :
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                      }`}>
                        {p.flag || "Normal"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          {results.remarks && (
            <div className="rounded-xl bg-[#FAFAF7] p-4 text-xs dark:bg-[#202B27]">
              <p className="font-bold text-[#52615B] dark:text-[#AAB6B0]">Pathologist Remarks & Clinical Impression:</p>
              <p className="mt-1 text-[#17201D] dark:text-white italic">{results.remarks}</p>
            </div>
          )}

          {/* Signatures Footer */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#EEECE5] dark:border-white/10">
            <div>
              <p className="text-[10px] font-bold text-[#87938E] uppercase">Prepared By</p>
              <p className="text-xs font-semibold text-[#17201D] dark:text-white mt-1">
                {results.technician || "Medical Lab Technician"}
              </p>
              <p className="text-[10px] text-[#87938E]">Entered: {results.enteredAt || order.orderDate}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#87938E] uppercase">Verified & Approved By</p>
              <p className="text-xs font-bold text-[#0F766E] dark:text-[#5EEAD4] mt-1">
                {verification.verifiedBy || "Dr. Pathologist"}
              </p>
              <p className="text-[10px] text-[#87938E]">
                {verification.pathologistTitle || "Consultant Pathologist"}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                <CheckCircle2 size={11} /> Digitally Signed ({verification.verifiedAt || "Verified"})
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex justify-end border-t border-[#EEECE5] px-6 py-4 dark:border-white/10">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#0F766E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0B625C]"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}
