"use client";

import {
  Clock,
  TestTube2,
  Cpu,
  FileCheck,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export const PIPELINE_STATUS_CONFIG = {
  ORDERED: {
    label: "Ordered",
    icon: Clock,
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
    dotClass: "bg-amber-500",
    step: 1,
    desc: "Awaiting sample collection",
  },
  SAMPLE_COLLECTED: {
    label: "Sample Collected",
    icon: TestTube2,
    badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30",
    dotClass: "bg-purple-500",
    step: 2,
    desc: "Sample logged & tagged",
  },
  PROCESSING: {
    label: "In Processing",
    icon: Cpu,
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
    dotClass: "bg-blue-500 animate-pulse",
    step: 3,
    desc: "Bench analysis in progress",
  },
  RESULT_READY: {
    label: "Result Ready",
    icon: FileCheck,
    badgeClass: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30",
    dotClass: "bg-indigo-500",
    step: 4,
    desc: "Awaiting Pathologist verification",
  },
  VERIFIED: {
    label: "Verified",
    icon: ShieldCheck,
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
    dotClass: "bg-emerald-500",
    step: 5,
    desc: "Signed off by Pathologist",
  },
  REPORT_RELEASED: {
    label: "Report Released",
    icon: CheckCircle2,
    badgeClass: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4] border-[#0F766E]/30",
    dotClass: "bg-[#0F766E] dark:bg-[#5EEAD4]",
    step: 6,
    desc: "Final report available",
  },
};

export default function LabStatusBadge({ status, size = "md", showIcon = true }) {
  const config = PIPELINE_STATUS_CONFIG[status] || {
    label: status || "Unknown",
    icon: Clock,
    badgeClass: "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300",
    dotClass: "bg-gray-400",
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-xs gap-2 font-bold",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold tracking-wide transition-colors ${
        sizeClasses[size] || sizeClasses.md
      } ${config.badgeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {showIcon && <Icon className="shrink-0" size={size === "sm" ? 11 : 13} />}
      <span>{config.label}</span>
    </span>
  );
}
