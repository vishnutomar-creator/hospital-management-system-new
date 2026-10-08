"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreVertical,
  Pill,
  Package,
  AlertTriangle,
  Wallet,
  User,
  Clock,
  RotateCcw,
  CheckCircle2,
  Boxes,
  ShieldAlert,
  X,
  FileText,
  RefreshCw,
} from "lucide-react";
import { prescriptionAPI, inventoryAPI } from "../../services/api";

const initialCatalog = [
  {
    itemId: "MED-101",
    name: "Amlodipine 5mg",
    category: "Cardiac",
    form: "Tablet",
    stock: 420,
    reorderLevel: 150,
    capacity: 600,
    unitPrice: 3.5,
    supplier: "Sunrise Pharma Distributors",
    expiryDate: "2027-03-01",
    status: "In Stock",
  },
  {
    itemId: "MED-102",
    name: "Metformin 500mg",
    category: "Diabetes",
    form: "Tablet",
    stock: 750,
    reorderLevel: 100,
    capacity: 1000,
    unitPrice: 2.1,
    supplier: "Wellness Meditrade",
    expiryDate: "2027-12-15",
    status: "In Stock",
  },
  {
    itemId: "MED-103",
    name: "Cetirizine 10mg",
    category: "Allergy",
    form: "Tablet",
    stock: 600,
    reorderLevel: 80,
    capacity: 800,
    unitPrice: 1.2,
    supplier: "Sunrise Pharma Distributors",
    expiryDate: "2027-06-20",
    status: "In Stock",
  },
  {
    itemId: "MED-104",
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    form: "Tablet",
    stock: 650,
    reorderLevel: 100,
    capacity: 800,
    unitPrice: 1.8,
    supplier: "MedCore Supplies",
    expiryDate: "2027-09-30",
    status: "In Stock",
  },
  {
    itemId: "MED-105",
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    form: "Capsule",
    stock: 700,
    reorderLevel: 100,
    capacity: 800,
    unitPrice: 4.0,
    supplier: "Wellness Meditrade",
    expiryDate: "2027-10-05",
    status: "In Stock",
  },
  {
    itemId: "MED-106",
    name: "Insulin Glargine",
    category: "Diabetes",
    form: "Injection",
    stock: 250,
    reorderLevel: 30,
    capacity: 400,
    unitPrice: 320,
    supplier: "MedCore Supplies",
    expiryDate: "2027-08-25",
    status: "In Stock",
  },
];

const initialPending = [
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
];

const statusStyles = {
  "In Stock": "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  "Low Stock": "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  "Expiring Soon": "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  "Out of Stock": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const categories = ["All Categories", "Cardiac", "Diabetes", "Allergy", "Pain Relief", "Antibiotic"];
const statuses = ["All Status", "In Stock", "Low Stock", "Expiring Soon"];

export default function PharmacyPage() {
  const [activeTab, setActiveTab] = useState("pending"); // "catalog", "pending", "dispensed"
  const [medicines, setMedicines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dispense & Return States
  const [dispensingId, setDispensingId] = useState(null);
  const [warningData, setWarningData] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [selectedRxForReturn, setSelectedRxForReturn] = useState(null);
  const [returnQtys, setReturnQtys] = useState({});
  const [returnReason, setReturnReason] = useState("Patient return / Excess stock");
  const [processingReturn, setProcessingReturn] = useState(false);

  // Load Inventory & Prescriptions
  const loadData = async () => {
    setLoading(true);

    // Try fetching inventory API
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
        setMedicines(normalized);
      } else {
        setMedicines(initialCatalog);
      }
    } catch (e) {
      setMedicines(initialCatalog);
    }

    // Try fetching prescriptions API
    try {
      const rxRes = await prescriptionAPI.getPrescriptions();
      let apiItems = [];
      if (rxRes.success && Array.isArray(rxRes.data) && rxRes.data.length > 0) {
        apiItems = rxRes.data.map((p) => ({
          prescriptionId: p.rxId || p._id || p.id,
          rxId: p.rxId || p._id,
          recordId: p.recordId || "REC-101",
          patient: p.patientName || p.patient || "Patient",
          doctor: p.doctorName || p.doctorId?.name || "Attending Doctor",
          diagnosis: p.diagnosis || "Consultation",
          date: p.createdAt ? p.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
          status: p.status || "Pending Dispense",
          medicines: Array.isArray(p.medicines) && p.medicines.length > 0 ? p.medicines : [
            {
              name: p.medicineName || "Amlodipine 5mg",
              dosage: p.dosage || "1 tablet",
              quantity: Number(p.quantity) || 14,
            }
          ],
        }));
        setPrescriptions(apiItems);
      } else {
        setPrescriptions(initialPending);
      }
    } catch (e) {
      setPrescriptions(initialPending);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Medicines Catalog
  const filteredMedicines = medicines.filter((m) => {
    const medName = m.name || m.itemName || "";
    const medId = m.itemId || "";
    const supp = typeof m.supplier === "string" ? m.supplier : (m.supplier?.name || "");
    const matchesQuery = `${medName} ${medId} ${supp}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory = category === "All Categories" || m.category === category;
    const matchesStatus = statusFilter === "All Status" || m.status === statusFilter;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  // Filter Pending Prescriptions
  const pendingPrescriptions = prescriptions.filter(
    (p) =>
      ["Pending Dispense", "Active", "active", "pending dispense"].includes(String(p.status).trim()) &&
      `${p.patient || ""} ${p.rxId || ""} ${p.prescriptionId || ""} ${p.doctor || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  // Filter Dispensed Prescriptions
  const dispensedPrescriptions = prescriptions.filter(
    (p) =>
      ["Dispensed", "Returned", "dispensed", "returned"].includes(String(p.status).trim()) &&
      `${p.patient || ""} ${p.rxId || ""} ${p.prescriptionId || ""} ${p.doctor || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  // Stock evaluation helper
  const evaluateStock = (meds = []) => {
    let allAvailable = true;
    const items = (meds || []).map((m) => {
      const qtyReq = Number(m.quantity) || 1;
      const cleanName = (m.name || "").trim().toLowerCase();
      const match = medicines.find((inv) => {
        const invName = (inv.name || inv.itemName || "").trim().toLowerCase();
        return (
          invName &&
          (invName === cleanName ||
            cleanName.includes(invName) ||
            invName.includes(cleanName))
        );
      });
      const available = match ? Number(match.stock ?? match.quantityInStock ?? 0) : 0;
      const hasStock = available >= qtyReq;
      if (!hasStock) allAvailable = false;
      return { name: m.name, qtyReq, available, hasStock, matchItem: match };
    });
    return { allAvailable, items };
  };

  // Handle Dispense
  const handleDispense = async (rx) => {
    setDispensingId(rx.prescriptionId || rx.rxId);
    setSuccessMsg("");

    const stockEval = evaluateStock(rx.medicines);

    if (!stockEval.allAvailable) {
      const deficits = stockEval.items.filter((i) => !i.hasStock);
      setWarningData({
        rxId: rx.prescriptionId || rx.rxId,
        patient: rx.patient,
        deficits,
      });
      setDispensingId(null);
      return;
    }

    try {
      const targetId = rx.rxId || rx.prescriptionId || rx.mongoId;
      await prescriptionAPI.dispensePrescription(targetId, { dispensedBy: "Pharmacist" });

      // Update inventory stock
      const updatedMeds = [...medicines];
      stockEval.items.forEach((item) => {
        if (item.matchItem) {
          const idx = updatedMeds.findIndex((i) => i.itemId === item.matchItem.itemId || i.name === item.matchItem.name);
          if (idx !== -1) {
            const newStock = Math.max(0, updatedMeds[idx].stock - item.qtyReq);
            updatedMeds[idx] = {
              ...updatedMeds[idx],
              stock: newStock,
              status: newStock <= 0 ? "Out of Stock" : newStock <= updatedMeds[idx].reorderLevel ? "Low Stock" : "In Stock",
            };
          }
        }
      });
      setMedicines(updatedMeds);

      // Update prescription list
      setPrescriptions((prev) =>
        prev.map((p) =>
          String(p.prescriptionId || p.rxId) === String(rx.prescriptionId || rx.rxId)
            ? { ...p, status: "Dispensed", dispensedAt: new Date().toISOString() }
            : p
        )
      );

      setSuccessMsg(`Prescription ${rx.rxId || rx.prescriptionId} successfully dispensed! Inventory stock updated.`);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      alert(`Dispense failed: ${err.message}`);
    } finally {
      setDispensingId(null);
    }
  };

  // Handle Pharmacy Return
  const handleConfirmReturn = async () => {
    if (!selectedRxForReturn) return;
    setProcessingReturn(true);

    const itemsToReturn = [];
    selectedRxForReturn.medicines?.forEach((m, idx) => {
      const qtyToReturn = Number(returnQtys[idx]) || 0;
      if (qtyToReturn > 0) {
        itemsToReturn.push({ medicineName: m.name, quantity: qtyToReturn });
      }
    });

    if (itemsToReturn.length === 0) {
      alert("Please select at least 1 unit to return.");
      setProcessingReturn(false);
      return;
    }

    try {
      const targetId = selectedRxForReturn.rxId || selectedRxForReturn.prescriptionId || selectedRxForReturn.mongoId;
      await prescriptionAPI.returnPrescription(targetId, {
        returnedItems: itemsToReturn,
        reason: returnReason,
      });

      // Add returned quantity back to inventory stock
      const updatedMeds = [...medicines];
      itemsToReturn.forEach((ret) => {
        const cleanName = ret.medicineName.toLowerCase();
        const idx = updatedMeds.findIndex(
          (i) => i.name.toLowerCase() === cleanName || cleanName.includes(i.name.toLowerCase())
        );
        if (idx !== -1) {
          updatedMeds[idx].stock = (updatedMeds[idx].stock || 0) + ret.quantity;
          updatedMeds[idx].status = updatedMeds[idx].stock > updatedMeds[idx].reorderLevel ? "In Stock" : "Low Stock";
        }
      });
      setMedicines(updatedMeds);

      // Update prescriptions list status
      setPrescriptions((prev) =>
        prev.map((p) =>
          String(p.prescriptionId || p.rxId) === String(selectedRxForReturn.prescriptionId || selectedRxForReturn.rxId)
            ? { ...p, status: "Returned" }
            : p
        )
      );

      const returnedNames = itemsToReturn.map((i) => `${i.quantity}x ${i.medicineName}`).join(", ");
      setSuccessMsg(`Returned [${returnedNames}] back to Inventory stock!`);
      setTimeout(() => setSuccessMsg(""), 6000);
      setSelectedRxForReturn(null);
    } catch (err) {
      alert(`Return failed: ${err.message}`);
    } finally {
      setProcessingReturn(false);
    }
  };

  const totalInStock = medicines.reduce((acc, m) => acc + (m.stock || 0), 0);
  const lowStockCount = medicines.filter((m) => m.stock <= m.reorderLevel).length;

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">Pharmacy</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">Pharmacy & Dispensing Module</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Connected workflow for prescription fulfillment, inventory stock deduction, and returns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#DDD9CE] px-3.5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Sync Stock
          </button>

          <Link
            href="/prescriptions/add"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#DDD9CE] px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            <FileText size={17} />
            New Prescription
          </Link>

          <Link
            href="/pharmacy/add"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90"
          >
            <Plus size={17} />
            Add Medicine
          </Link>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
            <Pill size={20} />
          </div>
          <p className="mt-4 text-xs text-[#87938E]">Total Medicines</p>
          <p className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">{medicines.length}</p>
        </div>

        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
            <Package size={20} />
          </div>
          <p className="mt-4 text-xs text-[#87938E]">In Stock Units</p>
          <p className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">{totalInStock.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]">
            <Clock size={20} />
          </div>
          <p className="mt-4 text-xs text-[#87938E]">Pending Prescriptions</p>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingPrescriptions.length}</p>
        </div>

        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <AlertTriangle size={20} />
          </div>
          <p className="mt-4 text-xs text-[#87938E]">Low Stock Warnings</p>
          <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{lowStockCount}</p>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#0F766E]/30 bg-[#0F766E]/10 p-4 text-sm font-semibold text-[#0F766E] dark:text-[#5EEAD4]">
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E2D9] pb-3 dark:border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              activeTab === "catalog"
                ? "bg-[#0F766E] text-white shadow-md shadow-[#0F766E]/20"
                : "border border-[#E5E2D9] bg-white text-[#52615B] hover:bg-[#FAFAF7] dark:border-white/10 dark:bg-[#17201D] dark:text-[#AAB6B0]"
            }`}
          >
            <Boxes size={16} />
            Medicine Catalog ({medicines.length})
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              activeTab === "pending"
                ? "bg-[#0F766E] text-white shadow-md shadow-[#0F766E]/20"
                : "border border-[#E5E2D9] bg-white text-[#52615B] hover:bg-[#FAFAF7] dark:border-white/10 dark:bg-[#17201D] dark:text-[#AAB6B0]"
            }`}
          >
            <Clock size={16} />
            Pending Prescriptions Queue
            {pendingPrescriptions.length > 0 && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {pendingPrescriptions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("dispensed")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              activeTab === "dispensed"
                ? "bg-[#0F766E] text-white shadow-md shadow-[#0F766E]/20"
                : "border border-[#E5E2D9] bg-white text-[#52615B] hover:bg-[#FAFAF7] dark:border-white/10 dark:bg-[#17201D] dark:text-[#AAB6B0]"
            }`}
          >
            <RotateCcw size={16} />
            Dispensed Log & Returns ({dispensedPrescriptions.length})
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="relative w-full max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
          />
        </div>
      </div>

      {/* TAB 1: MEDICINE CATALOG */}
      {activeTab === "catalog" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMedicines.map((m) => {
            const stockPct = Math.min(100, Math.round((m.stock / (m.capacity || 500)) * 100));

            return (
              <div key={m.itemId || m.name} className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                      <Pill size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[#17201D] dark:text-white">{m.name}</p>
                      <p className="text-xs text-[#87938E]">{m.itemId}</p>
                    </div>
                  </div>

                  <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[m.status] || statusStyles["In Stock"]}`}>
                    {m.status}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  <span className="rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                    {m.category}
                  </span>
                  <span className="rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                    {m.form || "Tablet"}
                  </span>
                </div>

                {/* Stock Level Bar */}
                <div className="mt-4 rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#17201D] dark:text-white">Stock Quantity</span>
                    <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">{stockPct}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EEECE5] dark:bg-white/10">
                    <div className="h-full rounded-full bg-[#0F766E]" style={{ width: `${stockPct}%` }} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 text-center text-xs">
                    <div>
                      <p className="text-[#87938E]">In Stock</p>
                      <p className="font-bold text-[#17201D] dark:text-white">{m.stock}</p>
                    </div>
                    <div>
                      <p className="text-[#87938E]">Reorder At</p>
                      <p className="font-bold text-[#17201D] dark:text-white">{m.reorderLevel}</p>
                    </div>
                    <div>
                      <p className="text-[#87938E]">Capacity</p>
                      <p className="font-bold text-[#17201D] dark:text-white">{m.capacity || 500}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-[#EEECE5] p-2.5 dark:border-white/10">
                    <p className="text-[#87938E]">Price</p>
                    <p className="font-bold text-[#17201D] dark:text-white">₹{m.unitPrice}</p>
                  </div>
                  <div className="rounded-xl border border-[#EEECE5] p-2.5 dark:border-white/10">
                    <p className="text-[#87938E]">Expiry</p>
                    <p className="font-bold text-[#17201D] dark:text-white">{m.expiryDate || "2027-12"}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: PENDING PRESCRIPTIONS QUEUE */}
      {activeTab === "pending" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pendingPrescriptions.map((rx) => {
            const stockEval = evaluateStock(rx.medicines);
            const today = new Date().toISOString().split("T")[0];
            const isNew = rx.date === today || (rx.createdAt && rx.createdAt.split("T")[0] === today);

            return (
              <div key={rx.prescriptionId || rx.rxId} className="flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        <Pill size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#17201D] dark:text-white">{rx.patient}</h3>
                        <p className="text-xs text-[#87938E]">{rx.rxId || rx.prescriptionId}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                        Pending Dispense
                      </span>
                      {isNew && (
                        <span className="rounded-full bg-[#0F766E]/10 px-2 py-0.5 text-[10px] font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                          ✦ New from Doctor
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 rounded-xl border border-[#EEECE5] bg-[#FAFAF7] p-3 text-xs dark:border-white/10 dark:bg-[#202B27]">
                    <p><span className="text-[#87938E]">Doctor:</span> <strong className="text-[#17201D] dark:text-white">{rx.doctor || "Attending Doctor"}</strong></p>
                    <p><span className="text-[#87938E]">Diagnosis:</span> <strong className="text-[#17201D] dark:text-white">{rx.diagnosis}</strong></p>
                    {rx.date && <p><span className="text-[#87938E]">Date:</span> <strong className="text-[#17201D] dark:text-white">{rx.date}</strong></p>}
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#87938E]">Medicines</p>
                    <div className="mt-2 space-y-2">
                      {rx.medicines?.map((m, idx) => {
                        const qtyReq = Number(m.quantity) || 1;
                        const cleanName = (m.name || "").trim().toLowerCase();
                        const matchItem = medicines.find((inv) => {
                          const invName = (inv.name || inv.itemName || "").trim().toLowerCase();
                          return invName && (invName === cleanName || cleanName.includes(invName) || invName.includes(cleanName));
                        });
                        const avail = matchItem ? matchItem.stock : 0;
                        const hasEnough = avail >= qtyReq;

                        return (
                          <div key={idx} className="flex items-center justify-between rounded-xl border border-[#EEECE5] p-2 text-xs dark:border-white/10">
                            <div>
                              <p className="font-bold text-[#17201D] dark:text-white">{m.name}</p>
                              <p className="text-[10px] text-[#87938E]">{m.dosage || "Standard"}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-[#17201D] dark:text-white">{qtyReq} units</span>
                              <span className={`block text-[10px] font-semibold ${hasEnough ? "text-[#0F766E]" : "text-red-600 font-bold"}`}>
                                {hasEnough ? `${avail} in stock` : `LOW STOCK (${avail} left)`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#EEECE5] pt-4 dark:border-white/10">
                  <button
                    onClick={() => handleDispense(rx)}
                    disabled={dispensingId === (rx.prescriptionId || rx.rxId)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-2.5 text-xs font-bold text-white transition hover:bg-[#0F766E]/90 disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    {dispensingId === (rx.prescriptionId || rx.rxId) ? "Dispensing..." : "Dispense Action"}
                  </button>
                </div>
              </div>
            );
          })}

          {pendingPrescriptions.length === 0 && (
            <div className="col-span-full py-12 text-center text-sm text-[#87938E]">
              No pending prescriptions in queue.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DISPENSED LOG & RETURNS */}
      {activeTab === "dispensed" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dispensedPrescriptions.map((rx) => (
            <div key={rx.prescriptionId || rx.rxId} className="flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#17201D] dark:text-white">{rx.patient}</h3>
                      <p className="text-xs text-[#87938E]">{rx.rxId || rx.prescriptionId}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${rx.status === "Returned" ? "bg-purple-500/10 text-purple-600" : "bg-[#0F766E]/10 text-[#0F766E]"}`}>
                    {rx.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1 rounded-xl border border-[#EEECE5] bg-[#FAFAF7] p-3 text-xs dark:border-white/10 dark:bg-[#202B27]">
                  <p><span className="text-[#87938E]">Doctor:</span> <strong className="text-[#17201D] dark:text-white">{rx.doctor}</strong></p>
                  <p><span className="text-[#87938E]">Diagnosis:</span> <strong className="text-[#17201D] dark:text-white">{rx.diagnosis}</strong></p>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#87938E]">Dispensed Medicines</p>
                  <div className="mt-2 space-y-2">
                    {rx.medicines?.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl border border-[#EEECE5] p-2 text-xs dark:border-white/10">
                        <span>{m.name}</span>
                        <span className="font-bold text-[#0F766E]">{m.quantity} units</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-[#EEECE5] pt-4 dark:border-white/10">
                <button
                  onClick={() => {
                    setSelectedRxForReturn(rx);
                    const init = {};
                    rx.medicines?.forEach((_, i) => (init[i] = 0));
                    setReturnQtys(init);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DDD9CE] py-2.5 text-xs font-bold text-[#52615B] transition hover:border-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-white/10 dark:text-[#AAB6B0]"
                >
                  <RotateCcw size={15} />
                  Process Pharmacy Return
                </button>
              </div>
            </div>
          ))}

          {dispensedPrescriptions.length === 0 && (
            <div className="col-span-full py-12 text-center text-sm text-[#87938E]">
              No dispensed prescription records found.
            </div>
          )}
        </div>
      )}

      {/* LOW STOCK WARNING MODAL */}
      {warningData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-red-200 bg-white shadow-2xl dark:border-red-500/20 dark:bg-[#17201D]">
            <div className="flex items-center justify-between border-b border-red-100 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                <ShieldAlert size={22} />
                <span>Low Stock Warning — Cannot Dispense</span>
              </div>
              <button onClick={() => setWarningData(null)}><X size={18} /></button>
            </div>
            <div className="p-5 text-xs space-y-3">
              <p className="text-sm text-[#52615B] dark:text-[#AAB6B0]">
                Cannot dispense prescription <strong className="text-[#17201D] dark:text-white">{warningData.rxId}</strong> due to insufficient stock in Inventory:
              </p>
              {warningData.deficits.map((def, i) => (
                <div key={i} className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs dark:border-red-500/20 dark:bg-red-500/5">
                  <p className="font-bold text-red-700 dark:text-red-400">{def.name}</p>
                  <p className="mt-1">Available: <strong>{def.available} units</strong> | Required: <strong>{def.qtyReq} units</strong></p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 border-t border-[#EEECE5] p-4 dark:border-white/10">
              <button onClick={() => setWarningData(null)} className="rounded-xl px-4 py-2 text-xs font-semibold text-[#52615B]">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* RETURN MODAL */}
      {selectedRxForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white shadow-2xl dark:border-white/10 dark:bg-[#17201D]">
            <div className="flex items-center justify-between border-b border-[#EEECE5] bg-[#FAFAF7] p-4 dark:border-white/10 dark:bg-[#202B27]">
              <div className="flex items-center gap-2 text-[#0F766E] font-bold">
                <RotateCcw size={20} />
                <span>Pharmacy Return — {selectedRxForReturn.rxId}</span>
              </div>
              <button onClick={() => setSelectedRxForReturn(null)}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <p>Return medicines for patient: <strong className="text-[#17201D] dark:text-white">{selectedRxForReturn.patient}</strong></p>
              <div className="space-y-2">
                {selectedRxForReturn.medicines?.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                    <div>
                      <p className="font-bold text-[#17201D] dark:text-white">{m.name}</p>
                      <p className="text-[11px] text-[#87938E]">Dispensed: {m.quantity} units</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Return Qty:</span>
                      <input
                        type="number"
                        min="0"
                        max={m.quantity}
                        value={returnQtys[idx] || 0}
                        onChange={(e) => {
                          const val = Math.min(m.quantity, Math.max(0, Number(e.target.value) || 0));
                          setReturnQtys((prev) => ({ ...prev, [idx]: val }));
                        }}
                        className="w-16 rounded-lg border border-[#E3E0D7] p-1 text-center font-bold outline-none focus:border-[#0F766E] dark:bg-[#202B27] dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#EEECE5] p-4 dark:border-white/10">
              <button onClick={() => setSelectedRxForReturn(null)} className="rounded-xl px-4 py-2 text-xs font-semibold">Cancel</button>
              <button
                onClick={handleConfirmReturn}
                disabled={processingReturn}
                className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F766E]/90 disabled:opacity-50"
              >
                <RotateCcw size={14} />
                {processingReturn ? "Restocking..." : "Confirm Return & Add Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
