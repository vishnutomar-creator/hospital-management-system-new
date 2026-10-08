"use client";

import { Check } from "lucide-react";

const STAGES = [
  { key: "ORDERED", label: "Ordered", step: 1 },
  { key: "SAMPLE_COLLECTED", label: "Sample", step: 2 },
  { key: "PROCESSING", label: "Processing", step: 3 },
  { key: "RESULT_READY", label: "Results", step: 4 },
  { key: "VERIFIED", label: "Verified", step: 5 },
  { key: "REPORT_RELEASED", label: "Released", step: 6 },
];

export default function LabPipelineStepper({ currentStatus }) {
  const currentStepIndex = STAGES.findIndex((s) => s.key === currentStatus);
  const activeStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between">
        {STAGES.map((s, idx) => {
          const isCompleted = idx + 1 < activeStep;
          const isCurrent = idx + 1 === activeStep;

          return (
            <div key={s.key} className="flex flex-1 flex-col items-center relative">
              {/* Connector line */}
              {idx > 0 && (
                <div
                  className={`absolute top-3.5 right-[50%] left-[-50%] h-0.5 transition-colors ${
                    idx < activeStep
                      ? "bg-[#0F766E] dark:bg-[#5EEAD4]"
                      : "bg-[#E3E0D7] dark:bg-white/10"
                  }`}
                />
              )}

              {/* Dot / Icon */}
              <div
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isCompleted
                    ? "bg-[#0F766E] text-white dark:bg-[#5EEAD4] dark:text-[#17201D]"
                    : isCurrent
                    ? "border-2 border-[#0F766E] bg-white text-[#0F766E] shadow-sm dark:border-[#5EEAD4] dark:bg-[#17201D] dark:text-[#5EEAD4]"
                    : "border border-[#DDD9CE] bg-[#FAFAF7] text-[#87938E] dark:border-white/10 dark:bg-[#202B27]"
                }`}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : idx + 1}
              </div>

              {/* Label */}
              <span
                className={`mt-1.5 text-[10px] font-semibold transition-colors ${
                  isCurrent
                    ? "font-bold text-[#0F766E] dark:text-[#5EEAD4]"
                    : isCompleted
                    ? "text-[#17201D] dark:text-white"
                    : "text-[#87938E]"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
