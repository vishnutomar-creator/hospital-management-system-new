"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PatientOverviewRedirect() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.patientId;

  useEffect(() => {
    if (patientId) {
      router.replace(`/nursing/${encodeURIComponent(patientId)}/vitals`);
    }
  }, [patientId, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-7">
      <div className="flex items-center gap-3 text-sm font-semibold text-[#0F766E]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0F766E] border-t-transparent" />
        <span>Loading patient clinical chart...</span>
      </div>
    </div>
  );
}
