"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Pill,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Boxes,
  ArrowRight,
  RefreshCw,
  X,
  ShieldAlert,
} from "lucide-react";
import { prescriptionAPI, inventoryAPI } from "../../../services/api";

const initialDummyInventory = [
  { itemId: "MED-101", name: "Amlodipine 5mg", stock: 800, reorderLevel: 100, capacity: 1000, unitPrice: 3.5 },
  { itemId: "MED-102", name: "Metformin 500mg", stock: 750, reorderLevel: 100, capacity: 1000, unitPrice: 2.1 },
  { itemId: "MED-103", name: "Cetirizine 10mg", stock: 600, reorderLevel: 80, capacity: 800, unitPrice: 1.2 },
  { itemId: "MED-104", name: "Ibuprofen 400mg", stock: 650, reorderLevel: 100, capacity: 800, unitPrice: 1.8 },
  { itemId: "MED-105", name: "Amoxicillin 250mg", stock: 700, reorderLevel: 100, capacity: 800, unitPrice: 4.0 },
  { itemId: "MED-106", name: "Insulin Glargine", stock: 250, reorderLevel: 30, capacity: 400, unitPrice: 320 },
];

const initialDummyPending = [
  {
    prescriptionId: "RX-4912",
    rxId: "RX-4912",
    recordId: "REC-802",
    patient: "Aarav Sharma",
    doctor: "Dr. Rajesh Gupta",
    diagnosis: "Hypertension & Type 2 Diabetes",
    date: "2026-09-12",
    status: "Pending Dispense",
    medicines: [
      { name: "Amlodipine 5mg", dosage: "5mg", frequency: "once_daily", duration: "30 days", quantity: 30 },
      { name: "Metformin 500mg", dosage: "500mg", frequency: "twice_daily", duration: "30 days", quantity: 60 },
    ],
  },
  {
    prescriptionId: "RX-4915",
    rxId: "RX-4915",
    recordId: "REC-805",
    patient: "Priya Patel",
    doctor: "Dr. Sneha Verma",
    diagnosis: "Acute Bronchitis & Fever",
    date: "2026-09-12",
    status: "Pending Dispense",
    medicines: [
      { name: "Amoxicillin 250mg", dosage: "250mg", frequency: "three_times_daily", duration: "7 days", quantity: 21 },
      { name: "Ibuprofen 400mg", dosage: "400mg", frequency: "twice_daily", duration: "5 days", quantity: 10 },
    ],
  },
  {
    prescriptionId: "RX-4918",
    rxId: "RX-4918",
    recordId: "REC-809",
    patient: "Vikram Malhotra",
    doctor: "Dr. Ananya Roy",
    diagnosis: "Seasonal Allergies",
    date: "2026-09-11",
    status: "Pending Dispense",
    medicines: [
      { name: "Cetirizine 10mg", dosage: "10mg", frequency: "once_daily", duration: "10 days", quantity: 10 },
    ],
  },
];

export default function PendingPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dispensingId, setDispensingId] = useState(null);

  // Warning Modal State
  const [warningData, setWarningData] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = async () => {
    setLoading(true);

    // 1. Fetch Inventory API
    try {
      const invRes = await inventoryAPI.getInventory();
      if (invRes.success && Array.isArray(invRes.data) && invRes.data.length > 0) {
        const normalized = invRes.data.map((item) => ({
          itemId: item.itemId || item.batchNumber || item._id,
          name: item.itemName || item.name || "Medicine",
          category: item.category || "Medicine",
          form: item.form || item.unit || "Tablet",
          stock: Number(item.quantityInStock ?? item.stock ?? 0),
          reorderLevel: Number(item.reorderLevel ?? 10),
          capacity: Number(item.capacity || 500),
          unitPrice: Number(item.unitPrice || 0),
          supplier: typeof item.supplierId === "object" ? (item.supplierId?.name || "Medical Supplies") : (item.supplier || "Medical Supplies"),
          expiryDate: item.expiryDate ? item.expiryDate.split("T")[0] : "2027-12-31",
          status: item.status || (Number(item.quantityInStock) <= 0 ? "Out of Stock" : Number(item.quantityInStock) <= 10 ? "Low Stock" : "In Stock"),
        }));
        setInventory(normalized);
      } else {
        setInventory(initialDummyInventory);
      }
    } catch (e) {
      setInventory(initialDummyInventory);
    }

    // 2. Fetch API Prescriptions
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
          date: p.createdAt ? p.createdAt.split("T")[0] : "2026-09-12",
          status: p.status || "Pending Dispense",
          medicines: Array.isArray(p.medicines) && p.medicines.length > 0 ? p.medicines : [
            {
              name: p.medicineName || "Amlodipine 5mg",
              dosage: p.dosage || "1 tablet",
              frequency: p.frequency || "once_daily",
              duration: p.duration || "7 days",
              quantity: Number(p.quantity) || 14,
            }
          ],
        }));
      } else {
        apiItems = initialDummyPending;
      }

      // Filter only pending/active prescriptions needing dispensing
      const pendingOnly = apiItems.filter((p) =>
        ["Pending Dispense", "Active", "active", "pending dispense"].includes(String(p.status).trim())
      );

      setPrescriptions(pendingOnly);
    } catch (e) {
      setPrescriptions(initialDummyPending);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Check stock availability for all medicines in this prescription
  const checkPrescriptionStock = (rxOrMedicines, invList = inventory) => {
    const medicines = Array.isArray(rxOrMedicines) 
      ? rxOrMedicines 
      : (rxOrMedicines?.medicines || []);
    let canDispense = true;
    let allAvailable = true;
    const items = medicines.map((m) => {
      const qtyReq = Number(m.quantity) || 1;
      const cleanName = (m.name || "").trim().toLowerCase();
      const matchItem = invList.find((inv) => {
        const invName = (inv.name || inv.itemName || "").trim().toLowerCase();
        return (
          invName &&
          (invName === cleanName ||
            cleanName.includes(invName) ||
            invName.includes(cleanName))
        );
      });

      const available = matchItem ? Number(matchItem.stock ?? matchItem.quantityInStock ?? 0) : 0;
      const hasStock = available >= qtyReq;
      if (!hasStock) {
        canDispense = false;
        allAvailable = false;
      }

      return {
        name: m.name,
        qtyReq,
        available,
        hasStock,
        matchItem,
      };
    });

    return { canDispense, allAvailable, items };
  };

  // Handle Dispense Action
  const handleDispense = async (rx) => {
    setDispensingId(rx.prescriptionId || rx.rxId);
    setSuccessMsg("");

    // 1. Check stock availability for all medicines in this prescription
    const stockEvaluation = checkPrescriptionStock(rx, inventory);

    if (!stockEvaluation.canDispense) {
      setWarningData({
        rx,
        evaluation: stockEvaluation,
      });
      setDispensingId(null);
      return;
    }

    // 2. Proceed with Dispensing: call backend API
    try {
      const targetId = rx.rxId || rx.prescriptionId || rx.mongoId;
      await prescriptionAPI.dispensePrescription(targetId, { dispensedBy: "Pharmacist" });

      // Deduct local inventory
      const updatedInv = [...inventory];
      stockEvaluation.items.forEach((item) => {
        if (item.matchItem) {
          const invIdx = updatedInv.findIndex((i) => i.itemId === item.matchItem.itemId || i.name === item.matchItem.name);
          if (invIdx !== -1) {
            const newStock = Math.max(0, updatedInv[invIdx].stock - item.qtyReq);
            updatedInv[invIdx] = {
              ...updatedInv[invIdx],
              stock: newStock,
              status: newStock <= 0 ? "Out of Stock" : newStock <= updatedInv[invIdx].reorderLevel ? "Low Stock" : "In Stock",
            };
          }
        }
      });
      setInventory(updatedInv);

      // Remove from pending list view
      setPrescriptions((prev) =>
        prev.filter((p) => String(p.prescriptionId || p.rxId) !== String(rx.prescriptionId || rx.rxId))
      );

      setSuccessMsg(`Prescription ${rx.rxId || rx.prescriptionId} successfully dispensed! Stock updated.`);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      alert(`Dispense failed: ${err.message}`);
    } finally {
      setDispensingId(null);
    }
  };

  const filtered = prescriptions.filter((p) =>
    `${p.patient} ${p.rxId} ${p.prescriptionId} ${p.doctor} ${p.diagnosis}`
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
          Pending Prescriptions
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Pending Prescriptions Queue
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Prescriptions created by doctors awaiting medication fulfillment & stock deduction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#DDD9CE] px-3.5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh Queue
          </button>

          <Link
            href="/pharmacy/dispensing"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90"
          >
            <Boxes size={16} />
            Dispensed Log & Returns
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
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
            placeholder="Search by patient name, Rx ID, doctor, or diagnosis..."
            className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#7B8882]">
          <Clock size={14} className="text-[#0F766E]" />
          <span>{filtered.length} pending prescriptions</span>
        </div>
      </div>

      {/* Pending Prescriptions Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((rx) => {
          const stockEval = evaluateStock(rx.medicines);

          return (
            <div
              key={rx.prescriptionId || rx.rxId}
              className="flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white p-5 transition hover:shadow-md dark:border-white/10 dark:bg-[#17201D]"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                      <Pill size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#17201D] dark:text-white">{rx.patient}</h3>
                      <p className="text-xs text-[#87938E]">{rx.rxId || rx.prescriptionId} · {rx.recordId}</p>
                    </div>
                  </div>

                  <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                    Pending Dispense
                  </span>
                </div>

                {/* Info Metadata */}
                <div className="mt-3 space-y-1.5 rounded-xl border border-[#EEECE5] bg-[#FAFAF7] p-3 text-xs dark:border-white/10 dark:bg-[#202B27]">
                  <div className="flex items-center justify-between text-[#52615B] dark:text-[#AAB6B0]">
                    <span className="flex items-center gap-1.5"><User size={13} className="text-[#8A9691]" /> Doctor:</span>
                    <span className="font-semibold text-[#17201D] dark:text-white">{rx.doctor}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#52615B] dark:text-[#AAB6B0]">
                    <span className="flex items-center gap-1.5"><FileText size={13} className="text-[#8A9691]" /> Diagnosis:</span>
                    <span className="font-semibold text-[#17201D] dark:text-white">{rx.diagnosis}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#52615B] dark:text-[#AAB6B0]">
                    <span className="flex items-center gap-1.5"><Clock size={13} className="text-[#8A9691]" /> Prescribed On:</span>
                    <span className="font-semibold text-[#17201D] dark:text-white">{rx.date}</span>
                  </div>
                </div>

                {/* Prescribed Medicines List */}
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#87938E]">Prescribed Medicines ({rx.medicines?.length || 0})</p>
                  <div className="mt-2 space-y-2">
                    {rx.medicines?.map((m, idx) => {
                      const qtyReq = Number(m.quantity) || 1;
                      const cleanName = (m.name || "").trim().toLowerCase();
                      const matchItem = inventory.find((inv) => {
                        const invName = (inv.name || inv.itemName || "").trim().toLowerCase();
                        return invName && (invName === cleanName || cleanName.includes(invName) || invName.includes(cleanName));
                      });
                      const avail = matchItem ? Number(matchItem.stock ?? matchItem.quantityInStock ?? 0) : 0;
                      const hasEnough = avail >= qtyReq;

                      return (
                        <div key={idx} className="flex items-center justify-between rounded-xl border border-[#EEECE5] p-2.5 text-xs dark:border-white/10">
                          <div>
                            <p className="font-bold text-[#17201D] dark:text-white">{m.name}</p>
                            <p className="text-[11px] text-[#87938E]">{m.dosage || "Standard"} · {m.frequency || "Once daily"} · {m.duration || "7 days"}</p>
                          </div>
                          <div className="text-right">
                            <span className="block font-bold text-[#17201D] dark:text-white">{qtyReq} units</span>
                            <span className={`inline-block text-[10px] font-semibold ${hasEnough ? "text-[#0F766E] dark:text-[#5EEAD4]" : "text-red-600 dark:text-red-400 font-bold"}`}>
                              {hasEnough ? `${avail} in stock` : `LOW STOCK (${avail} left)`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 border-t border-[#EEECE5] pt-4 dark:border-white/10">
                {!stockEval.allAvailable && (
                  <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400">
                    <AlertTriangle size={14} />
                    <span>Insufficient inventory to fulfill!</span>
                  </div>
                )}

                <button
                  onClick={() => handleDispense(rx)}
                  disabled={dispensingId === (rx.prescriptionId || rx.rxId)}
                  className={`
                    flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition
                    ${stockEval.allAvailable ? "bg-[#0F766E] hover:bg-[#0F766E]/90" : "bg-amber-600 hover:bg-amber-700"}
                    disabled:opacity-50
                  `}
                >
                  <CheckCircle2 size={16} />
                  {dispensingId === (rx.prescriptionId || rx.rxId)
                    ? "Dispensing..."
                    : stockEval.allAvailable
                    ? "Dispense Medication"
                    : "Dispense (Low Stock Check)"}
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-[#E5E2D9] bg-white p-12 text-center dark:border-white/10 dark:bg-[#17201D]">
            <CheckCircle2 size={40} className="mx-auto text-[#0F766E]" />
            <h3 className="mt-3 text-lg font-bold text-[#17201D] dark:text-white">All Prescriptions Dispensed!</h3>
            <p className="mt-1 text-sm text-[#87938E]">There are currently no pending prescriptions in the queue.</p>
          </div>
        )}
      </div>

      {/* LOW STOCK WARNING MODAL */}
      {warningData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-red-200 bg-white shadow-2xl dark:border-red-500/20 dark:bg-[#17201D]">
            <div className="flex items-center justify-between border-b border-red-100 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
              <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                <ShieldAlert size={22} />
                <h3 className="font-bold">Low Stock Warning — Dispense Blocked</h3>
              </div>
              <button
                onClick={() => setWarningData(null)}
                className="rounded-lg p-1 text-[#87938E] hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-[#52615B] dark:text-[#AAB6B0]">
                Prescription <span className="font-bold text-[#17201D] dark:text-white">{warningData.rxId}</span> for <span className="font-bold text-[#17201D] dark:text-white">{warningData.patient}</span> cannot be fully dispensed because stock is insufficient in Inventory:
              </p>

              <div className="mt-4 space-y-3">
                {warningData.deficits.map((def, idx) => (
                  <div key={idx} className="rounded-xl border border-red-200 bg-red-50/40 p-3 text-xs dark:border-red-500/20 dark:bg-red-500/5">
                    <div className="flex items-center justify-between font-bold text-red-700 dark:text-red-400">
                      <span>{def.name}</span>
                      <span>Deficit: {def.qtyReq - def.available} units</span>
                    </div>
                    <div className="mt-1.5 flex justify-between text-[#7B8882] dark:text-[#87938E]">
                      <span>Available Stock: <strong className="text-red-600">{def.available} units</strong></span>
                      <span>Required Stock: <strong>{def.qtyReq} units</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-[#87938E]">
                Please restock these items in Inventory or issue a partial order before dispensing.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#EEECE5] bg-[#FAFAF7] px-5 py-4 dark:border-white/10 dark:bg-[#202B27]">
              <button
                onClick={() => setWarningData(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#52615B] transition hover:bg-[#E5E2D9] dark:text-[#AAB6B0]"
              >
                Close
              </button>
              <Link
                href="/inventory"
                className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F766E]/90"
              >
                <Boxes size={14} /> Reorder Stock in Inventory
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
