"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search, Plus, MoreVertical, BedDouble, Building2,
  CheckCircle2, LogOut, UserPlus, RefreshCw, AlertCircle, X,
} from "lucide-react";
import { admissionAPI, bedAPI } from "../../services/api";
import { getBedsFromStorage, freeBed } from "../../utils/bedStore";

const statusStyles = {
  Admitted:    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Discharged:  "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  Transferred: "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
};

export default function AdmissionsPage() {
  const [admissions, setAdmissions]         = useState([]);
  const [beds, setBeds]                     = useState([]);
  const [query, setQuery]                   = useState("");
  const [openMenuId, setOpenMenuId]         = useState(null);
  const [loading, setLoading]               = useState(true);
  const [actionLoading, setActionLoading]   = useState(false);
  const [successMsg, setSuccessMsg]         = useState("");
  const [errorMsg, setErrorMsg]             = useState("");

  // Modal State for Discharge Confirmation
  const [dischargeTarget, setDischargeTarget]   = useState(null);
  const [dischargeNotes, setDischargeNotes]     = useState("Patient recovered and ready for discharge.");

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");

    let localAdmissions = [];
    try {
      localAdmissions = JSON.parse(localStorage.getItem("hms_local_admissions") || "[]");
    } catch (_) {}

    let apiAdmissions = [];
    try {
      const res = await admissionAPI.getAdmissions();
      const raw = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(raw)) {
        apiAdmissions = raw.map((a) => ({
          _id:           a._id,
          admissionId:   a.admissionId || `ADM-${a._id ? a._id.slice(-6).toUpperCase() : ""}`,
          patient:       a.patientId?.name || a.patientId?.patientName || a.patient || "Patient",
          patientId:     a.patientId?._id || a.patientId,
          ward:          a.wardId?.wardName || a.wardId?.name || a.ward || "—",
          wardId:        a.wardId?._id || a.wardId,
          bedNumber:     a.bedId?.bedNumber || a.bedNumber || "—",
          bedId:         a.bedId?._id || a.bedId,
          doctor:        a.doctorId?.name || a.doctorId?.doctorName || a.doctor || "—",
          doctorId:      a.doctorId?._id || a.doctorId,
          ipdNumber:     a.ipdNumber || "—",
          admissionDate: a.admissionDate ? String(a.admissionDate).slice(0, 10) : "—",
          dischargeDate: a.dischargeDate ? String(a.dischargeDate).slice(0, 10) : null,
          status:        a.status || "Admitted",
          reason:        a.reasonForAdmission || a.diagnosis || "",
        }));
      }
    } catch (err) {
      console.warn("Could not fetch admissions from API, using cached records:", err?.message);
    }

    // Combine API admissions and local admissions (API takes priority, fallback to local)
    const map = new Map();
    localAdmissions.forEach((a) => map.set(a.admissionId || a.id || a._id, a));
    apiAdmissions.forEach((a) => map.set(a.admissionId || a._id, { ...map.get(a.admissionId || a._id), ...a }));

    setAdmissions(Array.from(map.values()));
    setBeds(getBedsFromStorage());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handler = () => setBeds(getBedsFromStorage());
    window.addEventListener("hms_beds_updated", handler);
    return () => window.removeEventListener("hms_beds_updated", handler);
  }, []);

  const handleDelete = (id) => {
    if (!confirm("Delete this admission record?")) return;
    const updated = admissions.filter((a) => (a.admissionId || a.id || a._id) !== id);
    setAdmissions(updated);
    try {
      localStorage.setItem("hms_local_admissions", JSON.stringify(updated));
    } catch (_) {}
    setOpenMenuId(null);
  };

  const handleOpenDischarge = (admission) => {
    setOpenMenuId(null);
    setDischargeNotes("Patient recovered and ready for discharge.");
    setDischargeTarget(admission);
  };

  const executeDischarge = async () => {
    if (!dischargeTarget) return;
    setActionLoading(true);
    setErrorMsg("");

    const admission = dischargeTarget;
    const admissionKey = admission.admissionId || admission.id || admission._id;
    const todayIso = new Date().toISOString().slice(0, 10);

    try {
      // 1. If we have a MongoDB admission _id, call backend discharge
      if (admission._id) {
        try {
          await admissionAPI.dischargePatient(admission._id, {
            dischargeSummary: dischargeNotes || "Discharged from inpatient care.",
          });
        } catch (apiErr) {
          console.warn("Backend discharge API note:", apiErr.message);
        }
      }

      // 2. Release bed in backend if bedId exists
      if (admission.bedId) {
        try {
          await bedAPI.releaseBed(admission.bedId);
        } catch (_) {}
      }

      // 3. Free the bed locally in bedStore
      if (admission.bedId || admission.bedNumber) {
        freeBed(admission.bedId || admission.bedNumber, "Available");
      }

      // 4. Update admission status locally and in storage
      const updated = admissions.map((a) =>
        (a.admissionId || a.id || a._id) === admissionKey
          ? { ...a, status: "Discharged", dischargeDate: todayIso, dischargeSummary: dischargeNotes }
          : a
      );
      setAdmissions(updated);
      setBeds(getBedsFromStorage());

      try {
        localStorage.setItem("hms_local_admissions", JSON.stringify(updated));
      } catch (_) {}

      // Notify bed components
      window.dispatchEvent(new Event("hms_beds_updated"));

      setSuccessMsg(`✓ ${admission.patient} discharged successfully! Bed ${admission.bedNumber || ""} is now available.`);
      setTimeout(() => setSuccessMsg(""), 6000);
      setDischargeTarget(null);
    } catch (err) {
      console.error("Discharge execution error:", err);
      setErrorMsg(err?.message || "Failed to complete discharge");
    } finally {
      setActionLoading(false);
    }
  };

  const isAdmitted = (status) => String(status).toLowerCase() === "admitted";

  const filtered = admissions.filter((a) =>
    `${a.patient} ${a.admissionId} ${a.ipdNumber} ${a.ward} ${a.bedNumber} ${a.doctor}`
      .toLowerCase().includes(query.toLowerCase())
  );

  const admittedCount   = admissions.filter((a) => isAdmitted(a.status)).length;
  const availableBeds   = beds.filter((b) => b.status === "Available").length;
  const dischargedToday = admissions.filter((a) => a.dischargeDate === new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">IPD Admissions</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Manage inpatient admissions, ward beds, and discharges</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            id="refresh-admissions-btn"
            className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-3.5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />Refresh
          </button>
          <Link
            href="/admissions/new"
            id="new-admission-btn"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90 shadow-sm"
          >
            <UserPlus size={17} />New Admission
          </Link>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D] shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"><UserPlus size={20}/></div>
          <p className="mt-4 text-xs text-[#87938E]">Currently Admitted</p>
          <p className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">{admittedCount}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D] shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#0F766E]"><BedDouble size={20}/></div>
          <p className="mt-4 text-xs text-[#87938E]">Available Beds</p>
          <p className="mt-1 text-2xl font-bold text-[#0F766E] dark:text-[#5EEAD4]">{availableBeds}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D] shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F3EF] text-[#52615B] dark:bg-white/10"><LogOut size={20}/></div>
          <p className="mt-4 text-xs text-[#87938E]">Discharged Today</p>
          <p className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">{dischargedToday}</p>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#0F766E]/30 bg-[#0F766E]/10 p-4 text-sm font-semibold text-[#0F766E] dark:text-[#5EEAD4] shadow-sm animate-fade-in">
          <CheckCircle2 size={20}/><span>{successMsg}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle size={20}/><span>{errorMsg}</span>
        </div>
      )}

      {/* Table Card */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D] shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input
              type="text"
              id="search-admissions-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patient, IPD, ward, bed…"
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>
          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">{filtered.length} admissions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">IPD No.</th>
                <th className="px-5 py-3">Ward / Bed</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Admitted</th>
                <th className="px-5 py-3">Discharged</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const id = a.admissionId || a.id || a._id;
                const active = isAdmitted(a.status);
                return (
                  <tr key={id} className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                          {(a.patient || "P").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#17201D] dark:text-white">{a.patient}</p>
                          <p className="text-xs text-[#87938E]">{id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="rounded-lg bg-[#0F766E]/10 px-2.5 py-1 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        {a.ipdNumber || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#17201D] dark:text-white">
                          <Building2 size={12} className="text-[#8A9691]" />{a.ward || "—"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#87938E]">
                          <BedDouble size={12} />{a.bedNumber || "—"}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-[#52615B] dark:text-[#AAB6B0]">{a.doctor || "—"}</td>

                    <td className="px-5 py-3.5 text-xs text-[#52615B] dark:text-[#AAB6B0]">{a.admissionDate || "—"}</td>

                    <td className="px-5 py-3.5 text-xs text-[#52615B] dark:text-[#AAB6B0]">{a.dischargeDate || "—"}</td>

                    <td className="px-5 py-3.5">
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[a.status] || (active ? statusStyles.Admitted : statusStyles.Discharged)}`}>
                        {a.status || "Admitted"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {active && (
                          <button
                            onClick={() => handleOpenDischarge(a)}
                            id={`discharge-btn-${id}`}
                            className="flex items-center gap-1.5 rounded-lg border border-[#0F766E]/30 bg-[#0F766E]/10 px-3 py-1.5 text-xs font-semibold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white dark:bg-[#0F766E]/20 dark:text-[#5EEAD4] dark:hover:bg-[#0F766E] dark:hover:text-white"
                          >
                            <LogOut size={13} />
                            Discharge
                          </button>
                        )}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
                            className="rounded-lg p-1.5 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {openMenuId === id && (
                            <div className="absolute right-0 top-9 z-20 min-w-[150px] overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                              {active && (
                                <button
                                  onClick={() => handleOpenDischarge(a)}
                                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-semibold text-[#0F766E] hover:bg-[#E7F5F2] dark:text-[#5EEAD4] dark:hover:bg-[#0F766E]/20"
                                >
                                  <LogOut size={14} /> Discharge Patient
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(id)}
                                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                              >
                                Delete Record
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]"><BedDouble size={24}/></div>
                      <p className="text-sm font-semibold text-[#17201D] dark:text-white">{loading ? "Loading admissions…" : "No admissions found"}</p>
                      <p className="max-w-xs text-xs text-[#87938E]">{loading ? "Fetching records…" : "Admit a patient to IPD using the New Admission button."}</p>
                      {!loading && (
                        <Link href="/admissions/new" className="mt-2 flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F766E]/90">
                          <Plus size={15}/>New Admission
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discharge Confirmation Modal */}
      {dischargeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E2D9] bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#17201D]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEECE5] dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                  <LogOut size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#17201D] dark:text-white">Discharge Patient</h2>
                  <p className="text-xs text-[#87938E]">Confirm patient discharge & free bed</p>
                </div>
              </div>
              <button
                onClick={() => setDischargeTarget(null)}
                className="rounded-lg p-1.5 text-[#87938E] hover:bg-[#F1F3EF] hover:text-[#17201D] dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-[#FAFAF7] p-3.5 dark:bg-[#202B27] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#87938E]">Patient:</span>
                  <span className="font-semibold text-[#17201D] dark:text-white">{dischargeTarget.patient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#87938E]">IPD Number:</span>
                  <span className="font-semibold text-[#0F766E] dark:text-[#5EEAD4]">{dischargeTarget.ipdNumber || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#87938E]">Ward / Bed:</span>
                  <span className="font-semibold text-[#17201D] dark:text-white">{dischargeTarget.ward || "—"} / {dischargeTarget.bedNumber || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#87938E]">Attending Doctor:</span>
                  <span className="text-[#17201D] dark:text-white">{dischargeTarget.doctor || "—"}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0] mb-1.5">
                  Discharge Summary / Notes
                </label>
                <textarea
                  rows={3}
                  id="discharge-notes-input"
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                  placeholder="Enter discharge notes, clinical status, or post-discharge advice…"
                  className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] p-3 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                />
              </div>

              <p className="text-[11px] text-[#87938E]">
                * Confirming will update the status to <span className="font-bold text-[#52615B] dark:text-white">Discharged</span> and mark Bed <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">{dischargeTarget.bedNumber}</span> as available for new admissions.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDischargeTarget(null)}
                disabled={actionLoading}
                className="rounded-xl border border-[#DDD9CE] px-4 py-2 text-xs font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-discharge-btn"
                onClick={executeDischarge}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F766E]/90 disabled:opacity-60 shadow-sm"
              >
                {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <LogOut size={14} />}
                {actionLoading ? "Discharging…" : "Confirm Discharge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
