"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { billingAPI, patientAPI } from "../../../services/api";

export default function CreateBillPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patientOptions, setPatientOptions] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    billDate: new Date().toISOString().slice(0, 10),
    doctorCharge: "",
    roomCharge: "",
    medicineCharge: "",
    labCharge: "",
    paymentStatus: "Pending",
  });

  useEffect(() => {
    async function loadPatientSuggestions() {
      let pList = ["Aditi Sharma", "Rohan Verma", "Meera Nair", "Karan Malhotra", "Sneha Patil"];

      try {
        const res = await patientAPI.getPatients();
        if (res.success && Array.isArray(res.data)) {
          res.data.forEach((p) => {
            const name = p.name || p.patientName || p.patient || p.userId?.name;
            if (name && !pList.includes(name)) pList.push(name);
          });
        }
      } catch (e) {}

      setPatientOptions(pList);
      setForm((prev) => ({ ...prev, patient: prev.patient || pList[0] || "" }));
    }

    loadPatientSuggestions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const totalAmount =
    (Number(form.doctorCharge) || 0) +
    (Number(form.roomCharge) || 0) +
    (Number(form.medicineCharge) || 0) +
    (Number(form.labCharge) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalPatient = form.patient.trim() || "Patient";
    const billId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBillObj = {
      id: billId,
      billId,
      patient: finalPatient,
      patientName: finalPatient,
      billDate: form.billDate || "Today",
      date: form.billDate || "Today",
      doctorCharge: Number(form.doctorCharge) || 0,
      roomCharge: Number(form.roomCharge) || 0,
      medicineCharge: Number(form.medicineCharge) || 0,
      labCharge: Number(form.labCharge) || 0,
      totalAmount,
      paidAmount: form.paymentStatus === "Paid" ? totalAmount : 0,
      balance: form.paymentStatus === "Paid" ? 0 : totalAmount,
      paymentStatus: form.paymentStatus,
    };

    try {
      await billingAPI.createBilling(newBillObj);
    } catch (err) {
      console.warn("Billing API creation notice:", err.message);
    } finally {
      setLoading(false);
      router.push("/billing");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/billing"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Create Bill</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Generate a new patient bill</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Typeable Patient Input */}
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
              list="billing-patient-suggestions"
              placeholder="Type or select patient full name"
              className={inputClass}
            />
            {patientOptions.length > 0 && (
              <datalist id="billing-patient-suggestions">
                {patientOptions.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Bill Date</label>
            <input required type="date" name="billDate" value={form.billDate} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Payment Status</label>
            <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} className={inputClass}>
              <option>Pending</option>
              <option>Paid</option>
              <option>Partially Paid</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Doctor Charge (₹)</label>
            <input required type="number" min="0" name="doctorCharge" value={form.doctorCharge} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Room Charge (₹)</label>
            <input required type="number" min="0" name="roomCharge" value={form.roomCharge} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Medicine Charge (₹)</label>
            <input required type="number" min="0" name="medicineCharge" value={form.medicineCharge} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Lab Charge (₹)</label>
            <input required type="number" min="0" name="labCharge" value={form.labCharge} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl border border-[#EEECE5] bg-[#FAFAF7] px-4 py-3 dark:border-white/10 dark:bg-[#202B27]">
          <span className="text-sm font-semibold text-[#52615B] dark:text-[#AAB6B0]">Total Amount</span>
          <span className="text-lg font-bold text-[#0F766E] dark:text-[#5EEAD4]">₹{totalAmount.toLocaleString()}</span>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link href="/billing" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">Cancel</Link>
          <button type="submit" disabled={loading} className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90">
            {loading ? "Generating..." : "Generate Bill"}
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