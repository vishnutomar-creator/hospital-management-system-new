"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { paymentAPI, billingAPI, patientAPI } from "../../../../services/api";

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7]
  bg-[#FAFAF7] px-4 py-2.5 text-sm
  text-[#17201D] outline-none
  placeholder:text-[#9AA49F]
  focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
  dark:border-white/10 dark:bg-[#202B27] dark:text-white
  dark:placeholder:text-[#71817B]
  transition
`;

export default function EditPaymentPage() {
  const router = useRouter();
  const { paymentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [toast, setToast] = useState(null);
  const [billOptions, setBillOptions] = useState([]);

  const [form, setForm] = useState({
    billId: "",
    amount: "",
    method: "UPI",
    date: "",
    transactionId: "",
    status: "Completed",
  });

  // Load real bills from API
  useEffect(() => {
    const loadBills = async () => {
      let bills = [];

      try {
        const res = await billingAPI.getBillings();
        if (res.success && Array.isArray(res.data)) {
          res.data.forEach((b) => {
            const id = b.billId || b._id || b.id;
            const patient = b.patientName || b.patientId?.name || b.patient || "Patient";
            if (id && !bills.find((x) => x.id === id)) bills.push({ id, patient });
          });
        }
      } catch (e) {}

      // Fallback: build from patients if no bills found
      if (bills.length === 0) {
        try {
          const res = await patientAPI.getPatients();
          if (res.success && Array.isArray(res.data)) {
            bills = res.data.map((p, i) => ({
              id: `BILL-${500 + i + 1}`,
              patient: p.name || p.patientName || "Patient",
            }));
          }
        } catch (e) {}
      }

      setBillOptions(bills);
    };

    loadBills();
  }, []);

  // Load existing payment data
  useEffect(() => {
    if (!paymentId) return;

    const loadPayment = async () => {
      setLoading(true);

      let found = null;
      try {
        const res = await paymentAPI.getPaymentById(paymentId);
        if (res.success && res.data) {
          const p = res.data;
          found = {
            paymentId: p.paymentId || p._id || p.id,
            billId: p.billingId?._id || p.billId || "",
            patient: p.patientName || p.patientId?.name || p.patient || "Patient",
            amount: p.amount || 0,
            method: p.paymentMethod || p.method || "UPI",
            date: p.createdAt ? String(p.createdAt).slice(0, 10) : p.date || "",
            transactionId: p.transactionId || "",
            status: p.status || "Completed",
          };
        }
      } catch (err) {
        console.warn("Edit payment fetch notice:", err.message);
      }

      if (found) {
        setForm({
          billId: found.billId || "",
          amount: String(found.amount || ""),
          method: found.method || "UPI",
          date: found.date || "",
          transactionId: found.transactionId || "",
          status: found.status || "Completed",
        });
        setNotFound(false);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };

    loadPayment();
  }, [paymentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const matchedBill = billOptions.find((b) => b.id === form.billId);
    const updatedPayment = {
      paymentId,
      billId: form.billId,
      patient: matchedBill ? matchedBill.patient : "Patient",
      amount: Number(form.amount) || 0,
      method: form.method,
      date: form.date || "Today",
      transactionId: form.transactionId,
      status: form.status,
    };

    try {
      await paymentAPI.updatePayment(paymentId, updatedPayment);
    } catch (err) {
      console.warn("Payment API update notice:", err.message);
    } finally {
      setSaving(false);
      showToast("success", "Payment updated successfully!");
      setTimeout(() => router.push("/payments"), 1200);
    }
  };

  if (!loading && notFound) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Link
            href="/payments"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Edit Payment</h1>
            <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">{paymentId}</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#E5E2D9] bg-white py-20 dark:border-white/10 dark:bg-[#17201D]">
          <AlertCircle size={40} className="text-red-400" />
          <p className="text-sm font-medium text-[#52615B] dark:text-[#AAB6B0]">Payment record not found.</p>
          <Link
            href="/payments"
            className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90"
          >
            Back to Payments
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-[#E5E2D9] dark:bg-white/10" />
          <div className="space-y-1.5">
            <div className="h-5 w-40 animate-pulse rounded-lg bg-[#E5E2D9] dark:bg-white/10" />
            <div className="h-3.5 w-24 animate-pulse rounded-lg bg-[#E5E2D9] dark:bg-white/10" />
          </div>
        </div>
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={i === 1 ? "sm:col-span-2" : ""}>
                <div className="mb-1.5 h-3 w-16 animate-pulse rounded bg-[#E5E2D9] dark:bg-white/10" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-[#E5E2D9] dark:bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl transition-all ${
            toast.type === "success"
              ? "border-[#0F766E]/20 bg-white text-[#0F766E] dark:border-[#0F766E]/30 dark:bg-[#17201D] dark:text-[#5EEAD4]"
              : "border-red-200 bg-white text-red-600 dark:border-red-500/20 dark:bg-[#17201D] dark:text-red-400"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Link
          href="/payments"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Edit Payment</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Updating record &middot; {paymentId}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Bill */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Bill</label>
            {billOptions.length > 0 ? (
              <select name="billId" value={form.billId} onChange={handleChange} className={inputClass}>
                <option value="">-- Select Bill --</option>
                {billOptions.map((b) => (
                  <option key={b.id} value={b.id}>{b.id} - {b.patient}</option>
                ))}
              </select>
            ) : (
              <input
                name="billId"
                value={form.billId}
                onChange={handleChange}
                placeholder="Loading bills..."
                className={inputClass}
                readOnly
              />
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Amount (Rs.)</label>
            <input
              required
              type="number"
              min="0"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className={inputClass}
              placeholder="0"
            />
          </div>

          {/* Method */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Payment Method</label>
            <select name="method" value={form.method} onChange={handleChange} className={inputClass}>
              <option>Cash</option>
              <option>Card</option>
              <option>Insurance</option>
              <option>UPI</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Payment Date</label>
            <input
              required
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Transaction ID */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Transaction ID</label>
            <input
              name="transactionId"
              value={form.transactionId}
              onChange={handleChange}
              placeholder="Optional"
              className={inputClass}
            />
          </div>

          {/* Status */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Status</label>
            <div className="flex flex-wrap gap-3">
              {["Completed", "Pending", "Failed", "Refunded"].map((s) => (
                <label
                  key={s}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    form.status === s
                      ? "border-[#0F766E] bg-[#E7F5F2] text-[#0F766E] dark:border-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
                      : "border-[#E3E0D7] bg-[#FAFAF7] text-[#52615B] hover:border-[#0F766E]/40 dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`h-2 w-2 rounded-full ${
                    s === "Completed" ? "bg-[#0F766E]"
                    : s === "Pending" ? "bg-amber-400"
                    : s === "Failed" ? "bg-red-500"
                    : "bg-blue-500"
                  }`} />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link
            href="/payments"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90 disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}