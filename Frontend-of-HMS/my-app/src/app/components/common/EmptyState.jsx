"use client";

import { FileSearch, Plus } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "There is no information available to display.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8D9D2] bg-white px-6 py-12 text-center">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]">
        <FileSearch size={28} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#17201D]">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-[#71817B]">
        {description}
      </p>

      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B5F59]"
        >
          <Plus size={16} />
          {actionLabel}
        </button>
      )}

    </div>
  );
}