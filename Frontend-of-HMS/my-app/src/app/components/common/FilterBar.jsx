"use client";

import { Filter, RotateCcw } from "lucide-react";

export default function FilterBar({
  children,
  onReset,
  showReset = false,
}) {
  return (
    <div className="rounded-2xl border border-[#DDD9CE] bg-white p-4">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex flex-1 flex-wrap items-end gap-3">

          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-[#26332F]">
            <Filter size={16} className="text-[#0F766E]" />
            Filters
          </div>

          {children}

        </div>

        {showReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#DDD9CE] px-3.5 py-2.5 text-sm font-semibold text-[#64746E] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] lg:self-end"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        )}

      </div>

    </div>
  );
}