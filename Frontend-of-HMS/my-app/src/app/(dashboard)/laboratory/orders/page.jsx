"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Plus, ArrowLeft, LayoutGrid, List,
  ClipboardList, TestTube2, Cpu, FileCheck,
  CheckCircle2, Eye, User, Calendar, Loader2, RefreshCw
} from "lucide-react";
import { labStore } from "../../../services/labStore";
import LabStatusBadge from "../../../components/laboratory/LabStatusBadge";
import LabPipelineStepper from "../../../components/laboratory/LabPipelineStepper";
import CollectSampleModal from "../../../components/laboratory/CollectSampleModal";
import EnterResultsModal from "../../../components/laboratory/EnterResultsModal";
import VerifyReportModal from "../../../components/laboratory/VerifyReportModal";
import LabReportModal from "../../../components/laboratory/LabReportModal";


export default function LabOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  const [activeCollectOrder, setActiveCollectOrder] = useState(null);
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
    const matchesQuery =
      `${o.patientName} ${o.testType} ${o.id} ${o.doctor}`
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const totalCount = orders.length;
  const orderedCount = orders.filter((o) => o.status === "ORDERED").length;
  const sampleCount = orders.filter((o) => o.status === "SAMPLE_COLLECTED" || o.status === "PROCESSING").length;
  const readyCount = orders.filter((o) => o.status === "RESULT_READY").length;
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
            <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Diagnostic Lab Orders Pipeline</h1>
            <p className="mt-0.5 text-xs text-[#7B8882] dark:text-[#87938E]">Track tests across the 6 connected pipeline stages — data from MongoDB</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            href="/laboratory/orders/add"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C] shadow-sm"
          >
            <Plus size={17} />
            New Lab Order
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Orders" value={loading ? "—" : totalCount} subtitle="All active requests" icon={ClipboardList} iconBg="bg-[#E7F5F2]" iconColor="text-[#0F766E]" />
        <StatCard title="Pending Samples" value={loading ? "—" : orderedCount} subtitle="Awaiting collection" icon={TestTube2} iconBg="bg-amber-100 dark:bg-amber-500/20" iconColor="text-amber-700 dark:text-amber-300" />
        <StatCard title="Needs Verification" value={loading ? "—" : readyCount} subtitle="Technician result ready" icon={FileCheck} iconBg="bg-indigo-100 dark:bg-indigo-500/20" iconColor="text-indigo-700 dark:text-indigo-300" />
        <StatCard title="Released Reports" value={loading ? "—" : releasedCount} subtitle="Verified & final" icon={CheckCircle2} iconBg="bg-emerald-100 dark:bg-emerald-500/20" iconColor="text-emerald-700 dark:text-emerald-300" />
      </div>

      <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patient, test, doctor, or ID..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
            {[
              { id: "ALL", label: "All Statuses" },
              { id: "ORDERED", label: "1. Ordered" },
              { id: "SAMPLE_COLLECTED", label: "2. Sampled" },
              { id: "PROCESSING", label: "3. Processing" },
              { id: "RESULT_READY", label: "4. Result Ready" },
              { id: "REPORT_RELEASED", label: "5-6. Released" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === st.id
                    ? "bg-[#0F766E] text-white shadow-sm"
                    : "bg-[#FAFAF7] text-[#52615B] hover:bg-[#F1F3EF] dark:bg-[#202B27] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-[#FAFAF7] p-1 border border-[#E3E0D7] dark:bg-[#202B27] dark:border-white/10">
            <button onClick={() => setViewMode("grid")} className={`rounded-lg p-1.5 transition ${viewMode === "grid" ? "bg-white text-[#0F766E] shadow-sm dark:bg-[#17201D] dark:text-[#5EEAD4]" : "text-[#87938E]"}`} title="Card Grid View">
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode("table")} className={`rounded-lg p-1.5 transition ${viewMode === "table" ? "bg-white text-[#0F766E] shadow-sm dark:bg-[#17201D] dark:text-[#5EEAD4]" : "text-[#87938E]"}`} title="Table View">
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#87938E]">
          <Loader2 size={32} className="animate-spin mb-3" />
          <p className="text-sm">Fetching lab orders from MongoDB...</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => (
            <div key={order.id} className="group flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#17201D]">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F766E]/10 text-sm font-black text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                      {order.patientName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#17201D] dark:text-white">{order.patientName}</h3>
                      <p className="text-[10px] font-mono font-semibold text-[#87938E]">
                        {String(order.id).slice(-8)}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    order.priority === "Urgent" || order.priority === "STAT"
                      ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                      : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"
                  }`}>
                    {order.priority}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#EEECE5] pt-3 dark:border-white/10">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#87938E]">Test Category</p>
                    <p className="text-xs font-bold text-[#17201D] dark:text-white mt-0.5">{order.testType}</p>
                  </div>
                  <LabStatusBadge status={order.status} size="sm" />
                </div>

                <div className="mt-3 rounded-xl bg-[#FAFAF7] p-2 dark:bg-[#202B27]">
                  <LabPipelineStepper currentStatus={order.status} />
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-[#87938E]" />
                    <span>Doctor: {order.doctor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#87938E]" />
                    <span>Date: {order.orderDate}</span>
                  </div>
                  {order.sample?.sampleId && (
                    <div className="flex items-center gap-1.5 font-mono font-semibold text-[#0F766E] dark:text-[#5EEAD4]">
                      <TestTube2 size={13} />
                      <span>Sample ID: {order.sample.sampleId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 border-t border-[#EEECE5] pt-4 dark:border-white/10">
                {order.status === "ORDERED" && (
                  <button onClick={() => setActiveCollectOrder(order)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-2 text-xs font-bold text-white transition hover:bg-[#0B625C]">
                    <TestTube2 size={14} /> Collect Sample
                  </button>
                )}
                {(order.status === "SAMPLE_COLLECTED" || order.status === "PROCESSING") && (
                  <button onClick={() => setActiveResultsOrder(order)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white transition hover:bg-indigo-700">
                    <FileCheck size={14} /> Enter Test Results
                  </button>
                )}
                {order.status === "RESULT_READY" && (
                  <button onClick={() => setActiveVerifyOrder(order)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">
                    <CheckCircle2 size={14} /> Pathologist Verify
                  </button>
                )}
                {(order.status === "VERIFIED" || order.status === "REPORT_RELEASED") && (
                  <button onClick={() => setActiveReportOrder(order)} className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#0F766E] bg-[#E7F5F2] py-2 text-xs font-bold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white dark:border-[#5EEAD4] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                    <Eye size={14} /> View Released Report
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-sm text-[#87938E]">
              No lab orders found matching criteria.
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
                  <th className="px-5 py-3.5">Ordering Doctor</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Pipeline Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEECE5] dark:divide-white/5">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAFAF7] dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-mono font-bold text-[#0F766E] dark:text-[#5EEAD4]">{String(order.id).slice(-8)}</td>
                    <td className="px-5 py-4 font-bold text-[#17201D] dark:text-white">{order.patientName}</td>
                    <td className="px-5 py-4 text-[#52615B] dark:text-[#AAB6B0]">{order.testType}</td>
                    <td className="px-5 py-4 text-[#52615B] dark:text-[#AAB6B0]">{order.doctor}</td>
                    <td className="px-5 py-4">
                      <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">{order.priority}</span>
                    </td>
                    <td className="px-5 py-4"><LabStatusBadge status={order.status} size="sm" /></td>
                    <td className="px-5 py-4 text-right">
                      {order.status === "ORDERED" && (
                        <button onClick={() => setActiveCollectOrder(order)} className="rounded-lg bg-[#0F766E] px-3 py-1.5 font-bold text-white hover:bg-[#0B625C]">Collect Sample</button>
                      )}
                      {(order.status === "SAMPLE_COLLECTED" || order.status === "PROCESSING") && (
                        <button onClick={() => setActiveResultsOrder(order)} className="rounded-lg bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-700">Enter Results</button>
                      )}
                      {order.status === "RESULT_READY" && (
                        <button onClick={() => setActiveVerifyOrder(order)} className="rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-700">Verify Report</button>
                      )}
                      {(order.status === "VERIFIED" || order.status === "REPORT_RELEASED") && (
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

      {activeCollectOrder && (
        <CollectSampleModal order={activeCollectOrder} onClose={() => setActiveCollectOrder(null)} onSuccess={loadData} />
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

function StatCard({ title, value, subtitle, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-[#17201D]">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-xs font-medium text-[#87938E]">{title}</p>
      <div className="mt-0.5 flex items-end justify-between">
        <p className="text-2xl font-bold text-[#17201D] dark:text-white">{value}</p>
        <span className="text-[10px] font-semibold text-[#87938E]">{subtitle}</span>
      </div>
    </div>
  );
}
