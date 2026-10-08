"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical, DollarSign, RefreshCw, Eye, Trash2 } from "lucide-react";
import { billingAPI } from "../../services/api";

// Normalize status to title-case for consistent lookup
function normalizeStatus(raw) {
  const s = String(raw || "").toLowerCase();
  if (s === "paid") return "Paid";
  if (s === "partially paid" || s === "partial") return "Partially Paid";
  return "Pending";
}

const statusStyles = {
  Paid: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Pending: "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  "Partially Paid": "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

function SkeletonRow() {
  return (
    <tr className="border-b border-[#EEECE5] dark:border-white/5">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 animate-pulse rounded-md bg-[#E8F0EE] dark:bg-white/10" />
        </td>
      ))}
    </tr>
  );
}

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBillings = async () => {
    setLoading(true);
    try {
      const res = await billingAPI.getBillings();
      if (res.success && Array.isArray(res.data)) {
        const formatted = res.data.map((b) => ({
          billId: b.billId || b._id || b.id,
          patient: b.patientName || b.patientId?.name || b.patient || "Patient",
          billDate: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : b.billDate || "—",
          totalAmount: Number(b.totalAmount || b.total || 0),
          paymentStatus: normalizeStatus(b.paymentStatus || b.status),
        }));
        setBills(formatted);
      } else {
        setBills([]);
      }
    } catch (err) {
      console.warn("Billing API load notice:", err.message);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillings();
  }, []);

  // Fix: only remove from state AFTER successful API deletion
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bill?")) return;
    try {
      await billingAPI.deleteBilling(id);
      setBills((prev) => prev.filter((b) => b.billId !== id));
    } catch (err) {
      alert(err.message || "Failed to delete bill.");
    } finally {
      setOpenMenuId(null);
    }
  };

  const filtered = bills.filter((b) =>
    `${b.patient} ${b.billId}`.toLowerCase().includes(query.toLowerCase())
  );

  const totalPaid = bills.filter((b) => b.paymentStatus === "Paid").reduce((s, b) => s + b.totalAmount, 0);
  const totalPending = bills.filter((b) => b.paymentStatus === "Pending").reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Billing</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Patient bills and payment status</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchBillings}
            className="flex items-center gap-1.5 rounded-xl border border-[#DDD9CE] px-3 py-2.5 text-xs font-semibold text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/billing/create"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90"
          >
            <Plus size={17} />
            Create Bill
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#17201D]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
            <DollarSign size={18} />
          </div>
          <p className="mt-4 text-xs text-[#87938E]">Total Bills</p>
          <p className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">{bills.length}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#17201D]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <DollarSign size={18} />
          </div>
          <p className="mt-4 text-xs text-[#87938E]">Total Collected</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ₹{totalPaid.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#17201D]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <DollarSign size={18} />
          </div>
          <p className="mt-4 text-xs text-[#87938E]">Pending Collection</p>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
            ₹{totalPending.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by patient or bill ID..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>
          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">{filtered.length} bills</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Bill Date</th>
                <th className="px-5 py-3">Total Amount</th>
                <th className="px-5 py-3">Payment Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Loading skeletons */}
              {loading && [...Array(4)].map((_, i) => <SkeletonRow key={i} />)}

              {/* Data rows */}
              {!loading && filtered.map((b) => (
                <tr key={b.billId} className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        {(b.patient || "P").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">{b.patient}</p>
                        <p className="text-xs text-[#87938E]">{String(b.billId).slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{b.billDate}</td>
                  <td className="px-5 py-3.5 font-semibold text-[#17201D] dark:text-white">
                    ₹{b.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[b.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === b.billId ? null : b.billId)}
                        className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === b.billId && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                            <Link
                              href={`/billing/${b.billId}`}
                              className="flex items-center gap-2 px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                            >
                              <Eye size={14} /> View Bill
                            </Link>
                            <button
                              onClick={() => handleDelete(b.billId)}
                              className="flex w-full items-center gap-2 border-t border-[#EEECE5] px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:border-white/10 dark:text-red-400 dark:hover:bg-red-500/10"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]">
                        <DollarSign size={24} />
                      </div>
                      <p className="text-sm font-semibold text-[#17201D] dark:text-white">
                        {query ? `No bills matching "${query}"` : "No bills found"}
                      </p>
                      <p className="text-xs text-[#87938E]">
                        {query ? "Try a different search term." : "Create the first bill to get started."}
                      </p>
                      {!query && (
                        <Link
                          href="/billing/create"
                          className="mt-1 flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white hover:bg-[#0F766E]/90"
                        >
                          <Plus size={14} /> Create Bill
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="border-t border-[#EEECE5] px-5 py-3 dark:border-white/10">
            <p className="text-xs text-[#87938E]">Showing {filtered.length} of {bills.length} bills</p>
          </div>
        )}
      </div>
    </div>
  );
}