"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, ArrowLeft, TestTube2, LayoutGrid, List,
  CheckCircle2, Clock, Barcode, Loader2, RefreshCw
} from "lucide-react";
import { labStore } from "../../../services/labStore";
import LabStatusBadge from "../../../components/laboratory/LabStatusBadge";
import CollectSampleModal from "../../../components/laboratory/CollectSampleModal";


export default function LabSamplesPage() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [activeCollectOrder, setActiveCollectOrder] = useState(null);

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

    if (tab === "PENDING") return matchesQuery && o.status === "ORDERED";
    if (tab === "COLLECTED") return matchesQuery && (o.status === "SAMPLE_COLLECTED" || o.status === "PROCESSING");
    return matchesQuery;
  });

  const pendingCount = orders.filter((o) => o.status === "ORDERED").length;
  const collectedCount = orders.filter((o) => o.status === "SAMPLE_COLLECTED" || o.status === "PROCESSING").length;

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
            <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Sample Collection & Specimen Tracking</h1>
            <p className="mt-0.5 text-xs text-[#7B8882] dark:text-[#87938E]">
              Log new collections and track specimens — data from MongoDB
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
              placeholder="Search by patient, sample ID, test..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "ALL", label: "All Specimen Requests", count: orders.length },
              { id: "PENDING", label: "Awaiting Collection", count: pendingCount },
              { id: "COLLECTED", label: "Collected & Tagged", count: collectedCount },
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
          <p className="text-sm">Fetching specimens from MongoDB...</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => {
            const sample = order.sample;
            return (
              <div key={order.id} className="group flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#17201D]">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                        <TestTube2 size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#17201D] dark:text-white">{order.patientName}</h3>
                        <p className="text-xs text-[#87938E]">{order.testType}</p>
                      </div>
                    </div>
                    <LabStatusBadge status={order.status} size="sm" />
                  </div>

                  <div className="mt-4 rounded-xl bg-[#FAFAF7] p-3 text-xs dark:bg-[#202B27]">
                    {sample ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between font-mono font-bold text-[#0F766E] dark:text-[#5EEAD4]">
                          <span className="flex items-center gap-1"><Barcode size={14} /> {sample.sampleId}</span>
                          <span className="text-[10px] text-gray-500">{sample.tubeColor}</span>
                        </div>
                        <p className="text-[#52615B] dark:text-[#AAB6B0]">Specimen: <strong>{sample.specimenType}</strong></p>
                        <p className="text-[#87938E] text-[11px]">Collected by {sample.collectedBy} at {sample.collectedAt}</p>
                      </div>
                    ) : (
                      <div className="py-2 text-center text-amber-700 dark:text-amber-300">
                        <p className="font-bold flex items-center justify-center gap-1"><Clock size={14} /> Pending Sample Collection</p>
                        <p className="text-[11px] text-[#87938E] mt-0.5">Order placed by {order.doctor}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 border-t border-[#EEECE5] pt-4 dark:border-white/10">
                  {order.status === "ORDERED" ? (
                    <button
                      onClick={() => setActiveCollectOrder(order)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-2 text-xs font-bold text-white transition hover:bg-[#0B625C]"
                    >
                      <TestTube2 size={15} /> Collect Sample Now
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-[#0F766E] font-bold dark:text-[#5EEAD4]">
                      <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Sample Logged & Sent to Bench</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-sm text-[#87938E]">
              No specimens found matching criteria.
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E5E2D9] bg-white overflow-hidden shadow-sm dark:border-white/10 dark:bg-[#17201D]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EEECE5] bg-[#FAFAF7] text-[10px] font-bold uppercase tracking-wider text-[#87938E] dark:border-white/10 dark:bg-[#202B27]">
                  <th className="px-5 py-3.5">Sample ID</th>
                  <th className="px-5 py-3.5">Patient</th>
                  <th className="px-5 py-3.5">Test Type</th>
                  <th className="px-5 py-3.5">Specimen Type</th>
                  <th className="px-5 py-3.5">Collected By</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEECE5] dark:divide-white/5">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAFAF7] dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-mono font-bold text-[#0F766E] dark:text-[#5EEAD4]">{order.sample?.sampleId || "Awaiting"}</td>
                    <td className="px-5 py-4 font-bold text-[#17201D] dark:text-white">{order.patientName}</td>
                    <td className="px-5 py-4 text-[#52615B] dark:text-[#AAB6B0]">{order.testType}</td>
                    <td className="px-5 py-4 text-[#52615B] dark:text-[#AAB6B0]">{order.sample?.specimenType || "Blood / Serum"}</td>
                    <td className="px-5 py-4 text-[#52615B] dark:text-[#AAB6B0]">{order.sample?.collectedBy || "Uncollected"}</td>
                    <td className="px-5 py-4"><LabStatusBadge status={order.status} size="sm" /></td>
                    <td className="px-5 py-4 text-right">
                      {order.status === "ORDERED" ? (
                        <button onClick={() => setActiveCollectOrder(order)} className="rounded-lg bg-[#0F766E] px-3 py-1.5 font-bold text-white hover:bg-[#0B625C]">Collect Sample</button>
                      ) : (
                        <span className="text-[11px] font-semibold text-gray-500">Log Saved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeCollectOrder && (
        <CollectSampleModal order={activeCollectOrder} onClose={() => setActiveCollectOrder(null)} onSuccess={loadData} />
      )}
    </div>
  );
}
