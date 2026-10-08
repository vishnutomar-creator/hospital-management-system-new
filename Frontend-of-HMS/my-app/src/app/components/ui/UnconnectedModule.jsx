"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, ShieldAlert } from "lucide-react";

export default function UnconnectedModule({ moduleName }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
        <ShieldAlert size={32} />
      </div>

      <h1 className="mt-4 text-2xl font-bold text-[#17201D] dark:text-white">
        {moduleName} Module
      </h1>

      <div className="mt-3 flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
        <AlertCircle size={14} />
        No Backend Controller Available
      </div>

      <p className="mt-4 max-w-md text-sm text-[#7B8882] dark:text-[#87938E]">
        This module (<span className="font-mono text-xs font-semibold text-[#0F766E]">{moduleName}</span>) currently does not have an active controller in the Express backend. Only modules with backend controllers are connected.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]"
        >
          <ArrowLeft size={16} />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
