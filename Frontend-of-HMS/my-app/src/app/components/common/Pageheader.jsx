"use client";

import { ArrowLeft, Plus } from "lucide-react";

export default function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
  showBack = false,
  onBack,
  children,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">

        {showBack && (
          <button
            onClick={onBack}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DDD9CE] bg-white text-[#64746E] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E]"
          >
            <ArrowLeft size={17} />
          </button>
        )}

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17201D] sm:text-3xl">
            {title}
          </h1>

          {description && (
            <p className="mt-1.5 text-sm text-[#71817B]">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {children}

        {actionLabel && (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B5F59] hover:shadow-md active:scale-[0.98]"
          >
            <Plus size={17} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}