"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical, Pill, Clock, ExternalLink } from "lucide-react";
import { prescriptionAPI } from "../../services/api";

const statusStyles = {
  Active:
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Completed:
    "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  "Pending Dispense":
    "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  Dispensed:
    "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  Returned:
    "bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  Cancelled:
    "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await prescriptionAPI.getPrescriptions();
      if (res.success && Array.isArray(res.data)) {
        const formatted = res.data.map((p) => {
          const med = Array.isArray(p.medicines) && p.medicines.length > 0 ? p.medicines[0] : {};
          return {
            prescriptionId: p.rxId || p.prescriptionId || p._id || p.id,
            mongoId: p._id || p.id,
            recordId: p.recordId || "REC-101",
            patient: p.patient || p.patientName || p.patientId?.name || "Patient",
            medicineName: p.medicineName || med.name || "Amlodipine 5mg",
            dosage: p.dosage || med.dosage || "1 tablet",
            frequency: p.frequency || med.frequency || "Once daily",
            duration: p.duration || med.duration || "7 days",
            status: p.status || "Active",
          };
        });
        setPrescriptions(formatted);
      } else {
        setPrescriptions([]);
      }
    } catch (err) {
      console.warn("Prescriptions API load notice:", err.message);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleDelete = async (p) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;
    const idToDelete = p.mongoId || p.prescriptionId;
    try {
      await prescriptionAPI.deletePrescription(idToDelete);
      setPrescriptions((prev) => prev.filter((x) => x.prescriptionId !== p.prescriptionId));
      setOpenMenuId(null);
    } catch (err) {
      console.error("Delete prescription error:", err.message);
      alert(`Failed to delete prescription: ${err.message}`);
      setOpenMenuId(null);
    }
  };

  const filtered = prescriptions.filter((p) =>
    `${p.patient} ${p.medicineName} ${p.prescriptionId}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const pendingCount = prescriptions.filter(
    (p) => String(p.status).toLowerCase().includes("pending")
  ).length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">
            Prescriptions
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Medicines prescribed against patient records
          </p>
        </div>

        <Link
          href="/prescriptions/add"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
          "
        >
          <Plus size={17} />
          Add Prescription
        </Link>
      </div>

      {/* Pending Dispense Banner */}
      {pendingCount > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                {pendingCount} prescription{pendingCount > 1 ? "s" : ""} awaiting pharmacy dispense
              </p>
              <p className="mt-0.5 text-xs text-amber-700/70 dark:text-amber-400/70">
                These have been sent to the Pharmacy Pending Queue automatically
              </p>
            </div>
          </div>
          <Link
            href="/pharmacy"
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700"
          >
            <ExternalLink size={13} />
            View Queue
          </Link>
        </div>
      )}

      {/* Card */}
      <div
        className="
          rounded-2xl border border-[#E5E2D9] bg-white
          dark:border-white/10 dark:bg-[#17201D]
        "
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-xs">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prescriptions..."
              className="
                w-full rounded-xl border border-[#E3E0D7]
                bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm
                text-[#17201D] outline-none
                placeholder:text-[#9AA49F]
                focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
                dark:border-white/10 dark:bg-[#202B27] dark:text-white
                dark:placeholder:text-[#71817B]
              "
            />
          </div>

          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">
            {filtered.length} prescriptions
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Medicine</th>
                <th className="px-5 py-3">Dosage</th>
                <th className="px-5 py-3">Frequency</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.prescriptionId}
                  className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        {p.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">
                          {p.patient}
                        </p>
                        <p className="text-xs text-[#87938E]">
                          {p.prescriptionId} · {p.recordId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    <div className="flex items-center gap-1.5">
                      <Pill size={13} className="text-[#8A9691]" />
                      {p.medicineName}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    {p.dosage}
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    {p.frequency}
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    {p.duration}
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[p.status] || statusStyles["Active"]
                      }`}
                    >
                      {p.status}
                    </span>
                    {String(p.status).toLowerCase().includes("pending") && (
                      <Link
                        href="/pharmacy"
                        className="ml-2 text-[10px] font-bold text-amber-600 underline underline-offset-2 hover:text-amber-800 dark:text-amber-400"
                      >
                        → Pharmacy
                      </Link>
                    )}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === p.prescriptionId
                              ? null
                              : p.prescriptionId
                          )
                        }
                        className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === p.prescriptionId && (
                        <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                          <Link
                            href={`/prescriptions/${p.prescriptionId}/edit`}
                            className="block px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p)}
                            className="block w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-[#87938E]"
                  >
                    No prescriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}