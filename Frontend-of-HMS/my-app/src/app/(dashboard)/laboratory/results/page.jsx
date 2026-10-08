"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, ArrowLeft, FileCheck, ShieldCheck, Eye,
  CheckCircle2, LayoutGrid, List, FlaskConical, Loader2, RefreshCw
} from "lucide-react";
import { labStore } from "../../../services/labStore";
import LabStatusBadge from "../../../components/laboratory/LabStatusBadge";
import EnterResultsModal from "../../../components/laboratory/EnterResultsModal";
import VerifyReportModal from "../../../components/laboratory/VerifyReportModal";
import LabReportModal from "../../../components/laboratory/LabReportModal";


export default function LabResultsPage() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("ENTRY");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  const [activeResultsOrder, setActiveResultsOrder] = useState(null);
  const [activeVerifyOrder, setActiveVerifyOrder] = useState(null);
  const [activeReportOrder, setActiveReportOrder] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await labStore.getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load lab orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("medicare_lab_store_updated", handleUpdate);
    return () => window.removeEventListener("medicare_lab_store_updated", handleUpdate);
  }, []);

  const filtered = orders.filter((o) => {
    const matchesQuery = `${o.patientName} ${o.testType} ${o.id} ${o.sample?.sampleId || ""}`
      .toLowerCase()
      .includes(query.toLowerCase());

    if (tab === "ENTRY") return matchesQuery && (o.status === "SAMPLE_COLLECTED" || o.status === "PROCESSING");
    if (tab === "VERIFY") return matchesQuery && o.status === "RESULT_READY";
    if (tab === "RELEASED") return matchesQuery && (o.status === "VERIFIED" || o.status === "REPORT_RELEASED");
    return matchesQuery;
  });

  const entryCount = orders.filter((o) => o.status === "SAMPLE_COLLECTED" || o.status === "PROCESSING").length;
  const verifyCount = orders.filter((o) => o.status === "RESULT_READY").length;
  const releasedCount = orders.filter((o) => o.status === "VERIFIED" || o.status === "REPORT_RELEASED").length;

  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/laboratory"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Lab Results & Pathologist Verification</h1>
            <p className="mt-0.5 text-xs text-[#7B8882] dark:text-[#87938E]">
              Technician result entry → Pathologist verification → Final report release — data from MongoDB
            </p>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-3 py-2 text-xs font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search results by patient, test, ID..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "ENTRY", label: "1. Technician Result Entry", count: entryCount },
              { id: "VERIFY", label: "2. Pathologist Verify", count: verifyCount },
              { id: "RELEASED", label: "3. Released Reports", count: releasedCount },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  tab === t.id
                    ? "bg-[#0F766E] text-white shadow-sm"
                    : "bg-[#FAFAF7] text-[#52615B] hover:bg-[#F1F3EF] dark:bg-[#202B27] dark:text-[#AAB6B0]"
                }`}
              >
                <span>{t.label}</span>
                <span className={`rounded-full px-1.5 text-[10px] ${tab === t.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300"}`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-[#FAFAF7] p-1 border border-[#E3E0D7] dark:bg-[#202B27] dark:border-white/10">
            <button onClick={() => setViewMode("grid")} className={`rounded-lg p-1.5 transition ${viewMode === "grid" ? "bg-white text-[#0F766E] shadow-sm dark:bg-[#17201D] dark:text-[#5EEAD4]" : "text-[#87938E]"}`}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode("table")} className={`rounded-lg p-1.5 transition ${viewMode === "table" ? "bg-white text-[#0F766E] shadow-sm dark:bg-[#17201D] dark:text-[#5EEAD4]" : "text-[#87938E]"}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#87938E]">
          <Loader2 size={32} className="animate-spin mb-3" />
          <p className="text-sm">Fetching lab results from MongoDB...</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => {
            const results = order.results || {};
            const sample = order.sample || {};
            const verification = order.verification || {};
            return (
              <div key={order.id} className="group flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#17201D]">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                        <FlaskConical size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#17201D] dark:text-white">{order.patientName}</h3>
                        <p className="text-xs text-[#87938E]">{order.testType}</p>
                      </div>
                    </div>
                    <LabStatusBadge status={order.status} size="sm" />
                  </div>

                  <div className="mt-4 rounded-xl bg-[#FAFAF7] p-3 text-xs dark:bg-[#202B27]">
                    {results.value ? (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[#52615B] dark:text-[#AAB6B0]">Result Value:</span>
                          <span className="font-mono font-bold text-[#0F766E] dark:text-[#5EEAD4] text-xs">{results.value}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#52615B] dark:text-[#AAB6B0]">Interpretation:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            results.interpretation === "Abnormal" || results.interpretation === "High" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300" :
                            results.interpretation === "Critical" ? "bg-red-200 text-red-900 dark:bg-red-600/30 dark:text-red-200" :
                            "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          }`}>
                            {results.interpretation || "Normal"}
                          </span>
                        </div>
                        {verification.verifiedBy && (
                          <div className="pt-1.5 mt-1 border-t border-gray-200 dark:border-white/10 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} /> Verified by {verification.verifiedBy}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-2 text-center text-[#87938E]">
                        <p className="font-semibold text-xs text-[#17201D] dark:text-white">Sample Logged ({sample.sampleId || "SMP"})</p>
                        <p className="text-[11px] mt-0.5">Awaiting technician result entry</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 border-t border-[#EEECE5] pt-4 dark:border-white/10">
                  {tab === "ENTRY" && (
                    <button onClick={() => setActiveResultsOrder(order)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white transition hover:bg-indigo-700">
                      <FileCheck size={15} /> Enter Results
                    </button>
                  )}
                  {tab === "VERIFY" && (
                    <button onClick={() => setActiveVerifyOrder(order)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">
                      <ShieldCheck size={15} /> Pathologist Verify
                    </button>
                  )}
                  {tab === "RELEASED" && (
                    <button onClick={() => setActiveReportOrder(order)} className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#0F766E] bg-[#E7F5F2] py-2 text-xs font-bold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white dark:border-[#5EEAD4] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                      <Eye size={15} /> View Released Report
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-sm text-[#87938E]">
              No results found in this workflow stage.
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E5E2D9] bg-white overflow-hidden shadow-sm dark:border-white/10 dark:bg-[#17201D]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EEECE5] bg-[#FAFAF7] text-[10px] font-bold uppercase tracking-wider text-[#87938E] dark:border-white/10 dark:bg-[#202B27]">
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Patient</th>
                  <th className="px-5 py-3.5">Test Type</th>
                  <th className="px-5 py-3.5">Observed Result</th>
                  <th className="px-5 py-3.5">Interpretation</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEECE5] dark:divide-white/5">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAFAF7] dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-mono font-bold text-[#0F766E] dark:text-[#5EEAD4]">{String(order.id).slice(-8)}</td>
                    <td className="px-5 py-4 font-bold text-[#17201D] dark:text-white">{order.patientName}</td>
                    <td className="px-5 py-4 text-[#52615B] dark:text-[#AAB6B0]">{order.testType}</td>
                    <td className="px-5 py-4 font-mono text-[#52615B] dark:text-[#AAB6B0]">{order.results?.value || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                        {order.results?.interpretation || "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4"><LabStatusBadge status={order.status} size="sm" /></td>
                    <td className="px-5 py-4 text-right">
                      {tab === "ENTRY" && (
                        <button onClick={() => setActiveResultsOrder(order)} className="rounded-lg bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-700">Enter Results</button>
                      )}
                      {tab === "VERIFY" && (
                        <button onClick={() => setActiveVerifyOrder(order)} className="rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-700">Pathologist Verify</button>
                      )}
                      {tab === "RELEASED" && (
                        <button onClick={() => setActiveReportOrder(order)} className="rounded-lg border border-[#0F766E] bg-[#E7F5F2] px-3 py-1.5 font-bold text-[#0F766E] hover:bg-[#0F766E] hover:text-white dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">View Report</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeResultsOrder && (
        <EnterResultsModal order={activeResultsOrder} onClose={() => setActiveResultsOrder(null)} onSuccess={loadData} />
      )}
      {activeVerifyOrder && (
        <VerifyReportModal order={activeVerifyOrder} onClose={() => setActiveVerifyOrder(null)} onSuccess={loadData} />
      )}
      {activeReportOrder && (
        <LabReportModal order={activeReportOrder} onClose={() => setActiveReportOrder(null)} />
      )}
    </div>
  );
}
