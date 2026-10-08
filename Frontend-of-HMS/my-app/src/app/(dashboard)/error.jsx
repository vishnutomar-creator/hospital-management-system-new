"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
        <AlertTriangle size={40} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[#17201D] dark:text-white">Something went wrong</h2>
        <p className="mt-2 max-w-sm text-sm text-[#7B8882] dark:text-[#87938E]">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}
