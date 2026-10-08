"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Pill,
  CheckCircle2,
  RotateCcw,
  Clock,
  User,
  FileText,
  Boxes,
  X,
  AlertCircle,
} from "lucide-react";
import { prescriptionAPI, inventoryAPI } from "../../../services/api";

const dummyDispensed = [
  {
    prescriptionId: "RX-4820",
    rxId: "RX-4820",
    recordId: "REC-710",
    patient: "Sunita Verma",
    doctor: "Dr. Rajesh Gupta",
    diagnosis: "Post-op Recovery & Pain Management",
    dispensedAt: "2026-09-11 14:30",
    dispensedBy: "Pharmacist Ramesh",
    status: "Dispensed",
    medicines: [
      { name: "Ibuprofen 400mg", dosage: "400mg", quantity: 20, returnedQty: 0 },
      { name: "Amoxicillin 250mg", dosage: "250mg", quantity: 14, returnedQty: 0 },
    ],
  },
  {
    prescriptionId: "RX-4805",
    rxId: "RX-4805",
    recordId: "REC-690",
    patient: "Rohan Kapoor",
    doctor: "Dr. Sneha Verma",
    diagnosis: "Hypertension",
    dispensedAt: "2026-09-10 11:15",
    dispensedBy: "Pharmacist Meena",
    status: "Dispensed",
    medicines: [
      { name: "Amlodipine 5mg", dosage: "5mg", quantity: 30, returnedQty: 0 },
    ],
  },
];

export default function PharmacyDispensingPage() {
  const [dispensedList, setDispensedList] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Pharmacy Return Modal State
  const [selectedRx, setSelectedRx] = useState(null);
  const [returnQtys, setReturnQtys] = useState({});
  const [returnReason, setReturnReason] = useState("Patient Recovery / Dosage Adjustment");
  const [processingReturn, setProcessingReturn] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = async () => {
    setLoading(true);

    try {
      const res = await prescriptionAPI.getPrescriptions();
      let apiItems = [];
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        apiItems = res.data.map((p) => ({
          prescriptionId: p.rxId || p._id || p.id,
          rxId: p.rxId || p._id,
          recordId: p.recordId || "REC-101",
          patient: p.patientName || p.patient || "Patient",
          doctor: p.doctorId?.name || "Attending Doctor",
          diagnosis: p.diagnosis || "Consultation",
          dispensedAt: p.dispensedAt ? new Date(p.dispensedAt).toLocaleString() : "2026-09-12 10:00",
          dispensedBy: p.dispensedBy || "Pharmacist",
          status: p.status || "Dispensed",
          medicines: Array.isArray(p.medicines) && p.medicines.length > 0 ? p.medicines : [
            {
              name: p.medicineName || "Amlodipine 5mg",
              dosage: p.dosage || "1 tablet",
              quantity: Number(p.quantity) || 14,
              returnedQty: 0,
            }
          ],
        }));
      } else {
        apiItems = dummyDispensed;
      }

      const dispensedOnly = apiItems.filter((p) =>
        ["Dispensed", "Returned", "dispensed", "returned"].includes(String(p.status).trim())
      );

      setDispensedList(dispensedOnly);
    } catch (e) {
      setDispensedList(dummyDispensed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open Return Modal
  const handleOpenReturnModal = (rx) => {
    setSelectedRx(rx);
    const initial = {};
    rx.medicines?.forEach((m, idx) => {
      initial[idx] = 0;
    });
    setReturnQtys(initial);
  };

  // Handle return submission
  const handleConfirmReturn = async () => {
    if (!selectedRx) return;
    setProcessingReturn(true);

    const itemsToReturn = [];
    selectedRx.medicines?.forEach((m, idx) => {
      const qtyToReturn = Number(returnQtys[idx]) || 0;
      if (qtyToReturn > 0) {
        itemsToReturn.push({
          medicineName: m.name,
          quantity: qtyToReturn,
        });
      }
    });

    if (itemsToReturn.length === 0) {
      alert("Please select at least 1 unit of medicine to return.");
      setProcessingReturn(false);
      return;
    }

    try {
      // 1. Call Backend Return API
      const targetId = selectedRx.rxId || selectedRx.prescriptionId || selectedRx.mongoId;
      await prescriptionAPI.returnPrescription(targetId, {
        returnedItems: itemsToReturn,
        reason: returnReason,
        returnedAt: new Date().toISOString(),
      });

      // Update state
      setDispensedList((prev) =>
        prev.map((item) =>
          String(item.prescriptionId || item.rxId) === String(selectedRx.prescriptionId || selectedRx.rxId)
            ? { ...item, status: "Returned" }
            : item
        )
      );

      const returnedNames = itemsToReturn.map((i) => `${i.quantity}x ${i.medicineName}`).join(", ");
      setSuccessMsg(`Successfully returned [${returnedNames}] to Inventory stock!`);
      setTimeout(() => setSuccessMsg(""), 6000);
      setSelectedRx(null);
    } catch (err) {
      alert(`Return failed: ${err.message}`);
    } finally {
      setProcessingReturn(false);
    }
  };

  const filtered = dispensedList.filter((p) =>
    `${p.patient || ""} ${p.rxId || ""} ${p.prescriptionId || ""} ${p.doctor || ""} ${p.diagnosis || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <Link href="/pharmacy" className="hover:text-[#0F766E]">Pharmacy</Link>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Dispensed Prescriptions & Returns
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Dispensed Prescriptions & Return Log
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            History of fulfilled prescriptions and automated stock return flow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pharmacy/prescriptions"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#DDD9CE] px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            <Clock size={16} />
            Pending Queue
          </Link>

          <Link
            href="/pharmacy"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90"
          >
            <Boxes size={16} />
            Inventory Stock
          </Link>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#0F766E]/30 bg-[#0F766E]/10 p-4 text-sm font-semibold text-[#0F766E] dark:text-[#5EEAD4]">
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dispensed prescription by patient, Rx ID, or doctor..."
            className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
          />
        </div>

        <p className="text-xs font-semibold text-[#87938E]">{filtered.length} dispensed records</p>
      </div>

      {/* Dispensed Prescription Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((rx) => (
          <div
            key={rx.prescriptionId || rx.rxId}
            className="flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#17201D] dark:text-white">{rx.patient}</h3>
                    <p className="text-xs text-[#87938E]">{rx.rxId || rx.prescriptionId} · {rx.recordId}</p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    rx.status === "Returned"
                      ? "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                      : "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
                  }`}
                >
                  {rx.status}
                </span>
              </div>

              {/* Info Box */}
              <div className="mt-3 space-y-1 rounded-xl border border-[#EEECE5] bg-[#FAFAF7] p-3 text-xs dark:border-white/10 dark:bg-[#202B27]">
                <div className="flex items-center justify-between text-[#52615B] dark:text-[#AAB6B0]">
                  <span className="flex items-center gap-1.5"><User size={13} className="text-[#8A9691]" /> Doctor:</span>
                  <span className="font-semibold text-[#17201D] dark:text-white">{rx.doctor}</span>
                </div>
                <div className="flex items-center justify-between text-[#52615B] dark:text-[#AAB6B0]">
                  <span className="flex items-center gap-1.5"><FileText size={13} className="text-[#8A9691]" /> Diagnosis:</span>
                  <span className="font-semibold text-[#17201D] dark:text-white">{rx.diagnosis}</span>
                </div>
                <div className="flex items-center justify-between text-[#52615B] dark:text-[#AAB6B0]">
                  <span className="flex items-center gap-1.5"><Clock size={13} className="text-[#8A9691]" /> Dispensed At:</span>
                  <span className="font-semibold text-[#17201D] dark:text-white">{rx.dispensedAt}</span>
                </div>
              </div>

              {/* Dispensed Items */}
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#87938E]">Dispensed Items</p>
                <div className="mt-2 space-y-2">
                  {rx.medicines?.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-[#EEECE5] p-2.5 text-xs dark:border-white/10">
                      <div>
                        <p className="font-bold text-[#17201D] dark:text-white">{m.name}</p>
                        <p className="text-[11px] text-[#87938E]">{m.dosage || "Standard"}</p>
                      </div>
                      <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">{m.quantity} units</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Return Action */}
            <div className="mt-5 border-t border-[#EEECE5] pt-4 dark:border-white/10">
              <button
                onClick={() => handleOpenReturnModal(rx)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DDD9CE] bg-white py-2.5 text-xs font-bold text-[#52615B] transition hover:border-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0] dark:hover:border-purple-400 dark:hover:bg-purple-500/10 dark:hover:text-purple-400"
              >
                <RotateCcw size={15} />
                Process Pharmacy Return
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-[#87938E]">
            No dispensed prescriptions matching your search query.
          </div>
        )}
      </div>

      {/* PHARMACY RETURN MODAL */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white shadow-2xl dark:border-white/10 dark:bg-[#17201D]">
            <div className="flex items-center justify-between border-b border-[#EEECE5] bg-[#FAFAF7] p-4 dark:border-white/10 dark:bg-[#202B27]">
              <div className="flex items-center gap-2 text-[#0F766E] dark:text-[#5EEAD4]">
                <RotateCcw size={20} />
                <h3 className="font-bold text-[#17201D] dark:text-white">Pharmacy Return — {selectedRx.rxId}</h3>
              </div>
              <button
                onClick={() => setSelectedRx(null)}
                className="rounded-lg p-1 text-[#87938E] hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="rounded-xl border border-[#EEECE5] bg-[#FAFAF7] p-3 text-xs dark:border-white/10 dark:bg-[#202B27]">
                <p><span className="text-[#87938E]">Patient:</span> <strong className="text-[#17201D] dark:text-white">{selectedRx.patient}</strong></p>
                <p><span className="text-[#87938E]">Diagnosis:</span> <strong className="text-[#17201D] dark:text-white">{selectedRx.diagnosis}</strong></p>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#87938E]">
                  Select Medicine(s) & Quantity to Return to Inventory Stock
                </label>
                <div className="space-y-3">
                  {selectedRx.medicines?.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-[#EEECE5] p-3 text-xs dark:border-white/10">
                      <div>
                        <p className="font-bold text-[#17201D] dark:text-white">{m.name}</p>
                        <p className="text-[11px] text-[#87938E]">Dispensed: {m.quantity} units</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#87938E]">Return Qty:</span>
                        <input
                          type="number"
                          min="0"
                          max={m.quantity}
                          value={returnQtys[idx] || 0}
                          onChange={(e) => {
                            const val = Math.min(m.quantity, Math.max(0, Number(e.target.value) || 0));
                            setReturnQtys((prev) => ({ ...prev, [idx]: val }));
                          }}
                          className="w-16 rounded-lg border border-[#E3E0D7] bg-[#FAFAF7] px-2 py-1 text-center font-bold text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
                  Reason for Return
                </label>
                <input
                  type="text"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Dosage changed by doctor, unused excess"
                  className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-xs text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#EEECE5] bg-[#FAFAF7] px-5 py-4 dark:border-white/10 dark:bg-[#202B27]">
              <button
                onClick={() => setSelectedRx(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#52615B] transition hover:bg-[#E5E2D9] dark:text-[#AAB6B0]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReturn}
                disabled={processingReturn}
                className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F766E]/90 disabled:opacity-50"
              >
                <RotateCcw size={14} />
                {processingReturn ? "Restocking..." : "Process Return & Add to Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
