"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical, CreditCard } from "lucide-react";
import { paymentAPI } from "../../services/api";

const methodStyles = {
  UPI: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Card: "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  Cash: "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  Insurance: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentAPI.getPayments();
      if (res.success && Array.isArray(res.data)) {
        const formatted = res.data.map((p) => ({
          paymentId: p.paymentId || p._id || p.id,
          billId: p.billingId?._id || p.billId || "BILL-501",
          patient: p.patientName || p.patientId?.name || p.patient || "Patient",
          amount: p.amount || 5000,
          method: p.paymentMethod || p.method || "UPI",
          date: p.createdAt ? String(p.createdAt).slice(0, 10) : p.date || "Today",
        }));
        setPayments(formatted);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.warn("Payment API load notice:", err.message);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this payment record?")) return;
    try {
      await paymentAPI.deletePayment(id);
    } catch (err) {
      console.warn("Delete payment notice:", err.message);
    } finally {
      setPayments((prev) => prev.filter((p) => p.paymentId !== id));
      setOpenMenuId(null);
    }
  };

  const filtered = payments.filter((p) =>
    `${p.patient} ${p.paymentId} ${p.billId}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Payments</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Payments received against bills</p>
        </div>
        <Link href="/payments/add" className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90">
          <Plus size={17} />
          Record Payment
        </Link>
      </div>

      <div className="rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search payments..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>
          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">{filtered.length} payments</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Bill</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.paymentId} className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        <CreditCard size={15} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">{p.patient}</p>
                        <p className="text-xs text-[#87938E]">{p.paymentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{p.billId}</td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">₹{p.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${methodStyles[p.method]}`}>{p.method}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{p.date}</td>
                  <td className="px-5 py-3.5">
                    <div className="relative flex justify-end">
                      <button onClick={() => setOpenMenuId(openMenuId === p.paymentId ? null : p.paymentId)} className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10">
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === p.paymentId && (
                        <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                          <Link href={`/payments/${p.paymentId}/edit`} className="block px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]">Edit</Link>
                          <button onClick={() => handleDelete(p.paymentId)} className="block w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#87938E]">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}