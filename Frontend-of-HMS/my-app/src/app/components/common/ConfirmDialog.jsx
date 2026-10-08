"use client";

import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = true,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17201D]/50 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#DDD9CE] bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#EEECE5] px-6 py-5">

          <div className="flex items-center gap-3">

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                danger
                  ? "bg-red-50 text-red-600"
                  : "bg-[#E7F5F2] text-[#0F766E]"
              }`}
            >
              <AlertTriangle size={21} />
            </div>

            <h2 className="text-lg font-bold text-[#17201D]">
              {title}
            </h2>

          </div>

          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-[#87938E] transition hover:bg-[#F1F3EF] hover:text-[#17201D]"
          >
            <X size={18} />
          </button>

        </div>


        {/* Body */}

        <div className="px-6 py-5">

          <p className="text-sm leading-6 text-[#64746E]">
            {message}
          </p>

        </div>


        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-[#EEECE5] bg-[#FAFAF7] px-6 py-4">

          <button
            onClick={onCancel}
            className="rounded-xl border border-[#DDD9CE] bg-white px-4 py-2.5 text-sm font-semibold text-[#64746E] transition hover:bg-[#F1F3EF]"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#0F766E] hover:bg-[#0B5F59]"
            }`}
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}