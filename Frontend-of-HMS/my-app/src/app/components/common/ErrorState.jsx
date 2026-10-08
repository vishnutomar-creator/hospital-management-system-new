"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the requested information. Please try again.",
  onRetry,
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-6 py-12 text-center">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AlertCircle size={29} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#17201D]">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#71817B]">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17201D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#26332F]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}

    </div>
  );
}