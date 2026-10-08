"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ClipboardList, FlaskConical, TestTube2, ArrowRight, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { labStore } from "../../services/labStore";
import LabStatusBadge from "../../components/laboratory/LabStatusBadge";


export default function LaboratoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
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

  const pendingCollection = orders.filter((o) => o.status === "ORDERED").length;
  const inProcessing = orders.filter((o) => o.status === "SAMPLE_COLLECTED" || o.status === "PROCESSING").length;
  const readyVerification = orders.filter((o) => o.status === "RESULT_READY").length;
  const totalReleased = orders.filter((o) => o.status === "VERIFIED" || o.status === "REPORT_RELEASED").length;

  const sections = [
    {
      title: "Lab Orders Pipeline",
      description: "Diagnostic test orders and 6-stage lifecycle tracking",
      href: "/laboratory/orders",
      icon: ClipboardList,
      stat: loading ? "Loading..." : `${orders.length} total orders`,
      subStat: loading ? "" : `${pendingCollection} pending collection`,
    },
    {
      title: "Samples & Specimen Tracking",
      description: "Collect samples, assign barcodes & track transit to lab bench",
      href: "/laboratory/samples",
      icon: TestTube2,
      stat: loading ? "Loading..." : `${inProcessing} specimens active`,
      subStat: loading ? "" : `${pendingCollection} needs collection`,
    },
    {
      title: "Lab Results & Verification",
      description: "Enter technician results and pathologist verification",
      href: "/laboratory/results",
      icon: FlaskConical,
      stat: loading ? "Loading..." : `${readyVerification} awaiting verification`,
      subStat: loading ? "" : `${totalReleased} reports released`,
    },
  ];

  return (
    <div className="space-y-6 min-h-screen">
      <div>
        <h1 className="text-xl font-bold text-[#17201D] dark:text-white">
          Laboratory Diagnostics Command Center
        </h1>
        <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
          Connected diagnostic status pipeline: ORDERED → SAMPLE_COLLECTED → PROCESSING → RESULT_READY → VERIFIED → REPORT_RELEASED
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "1. Pending Sample", count: pendingCollection, color: "text-amber-700 dark:text-amber-300", Icon: Clock },
          { label: "2-3. In Bench Analysis", count: inProcessing, color: "text-purple-700 dark:text-purple-300", Icon: TestTube2 },
          { label: "4. Awaiting Verification", count: readyVerification, color: "text-indigo-700 dark:text-indigo-300", Icon: FlaskConical },
          { label: "5-6. Reports Released", count: totalReleased, color: "text-emerald-700 dark:text-emerald-300", Icon: CheckCircle2 },
        ].map(({ label, count, color, Icon }) => (
          <div key={label} className="rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#17201D]">
            <div className={`flex items-center gap-2 ${color}`}>
              <Icon size={18} />
              <span className="text-xs font-bold">{label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-[#17201D] dark:text-white">
              {loading ? <Loader2 size={20} className="animate-spin" /> : count}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#0F766E] hover:shadow-lg dark:border-white/10 dark:bg-[#17201D] dark:hover:border-[#5EEAD4]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                    <Icon size={22} />
                  </div>
                  <ArrowRight size={18} className="text-[#B8BFBB] transition group-hover:translate-x-1 group-hover:text-[#0F766E] dark:group-hover:text-[#5EEAD4]" />
                </div>
                <h2 className="mt-5 text-base font-bold text-[#17201D] dark:text-white">{section.title}</h2>
                <p className="mt-1 text-xs text-[#7B8882] dark:text-[#87938E] leading-relaxed">{section.description}</p>
              </div>
              <div className="mt-6 border-t border-[#EEECE5] pt-3 dark:border-white/10 flex justify-between items-center text-xs">
                <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">{section.stat}</span>
                <span className="text-[10px] text-[#87938E]">{section.subStat}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#E5E2D9] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between border-b border-[#EEECE5] pb-4 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-[#17201D] dark:text-white">Recent Lab Pipeline Activity</h3>
            <p className="text-xs text-[#87938E]">Live data from MongoDB</p>
          </div>
          <Link href="/laboratory/orders" className="text-xs font-bold text-[#0F766E] hover:underline dark:text-[#5EEAD4]">
            View All Orders →
          </Link>
        </div>

        <div className="mt-4 divide-y divide-[#EEECE5] dark:divide-white/5">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-[#87938E]">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span className="text-sm">Loading lab orders from database…</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#87938E]">
              No lab orders found.{" "}
              <Link href="/laboratory/orders/add" className="text-[#0F766E] font-bold hover:underline">
                Create the first order →
              </Link>
            </div>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAFAF7] font-bold text-xs text-[#0F766E] dark:bg-[#202B27] dark:text-[#5EEAD4]">
                    {String(order.id).slice(-3)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#17201D] dark:text-white">{order.patientName}</p>
                    <p className="text-[11px] text-[#87938E]">{order.testType} · {order.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LabStatusBadge status={order.status} size="sm" />
                  <span className="text-[10px] text-[#87938E] hidden sm:inline">{order.orderDate}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
