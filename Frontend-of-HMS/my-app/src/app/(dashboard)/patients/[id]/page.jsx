"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, User, Phone, Mail, Building2, MapPin, BedDouble, Edit,
  CheckCircle2, Hash, Heart, Droplets, Calendar, FileText, Pill,
  FlaskConical, Ambulance, AlertTriangle, Clock, ChevronRight,
  Stethoscope, ThumbsUp, Download, Printer, Eye, ShieldCheck, Loader2,
} from "lucide-react";
import { patientAPI, appointmentAPI, medicalRecordAPI, prescriptionAPI } from "../../../services/api";
import { labStore } from "../../../services/labStore";
import LabReportModal from "../../../components/laboratory/LabReportModal";

const statusStyles = {
  Admitted:   "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Discharged: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",
  Outpatient: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
};

function HistorySection({ icon: Icon, title, count, children, color = "#0F766E", loading = false }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
      <button onClick={() => setCollapsed((v) => !v)} className="flex w-full items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "18" }}>
            <Icon size={18} style={{ color }} />
          </div>
          <p className="text-sm font-bold text-[#17201D] dark:text-white">{title}</p>
          {loading
            ? <Loader2 size={14} className="animate-spin text-[#87938E]" />
            : <span className="rounded-full bg-[#F1F3EF] px-2 py-0.5 text-[10px] font-black text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">{count}</span>
          }
        </div>
        <ChevronRight size={16} className={`text-[#87938E] transition-transform ${collapsed ? "" : "rotate-90"}`} />
      </button>
      {!collapsed && <div className="border-t border-[#EEECE5] dark:border-white/10">{children}</div>}
    </div>
  );
}

function EmptyRow({ message }) {
  return <p className="px-6 py-5 text-sm text-[#87938E]">{message}</p>;
}

function LoadingRow({ message }) {
  return (
    <div className="flex items-center gap-2 px-6 py-5 text-sm text-[#87938E]">
      <Loader2 size={15} className="animate-spin" /> {message}
    </div>
  );
}

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);

  const [visits, setVisits] = useState([]);
  const [medRecords, setMedRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [verifiedLabReports, setVerifiedLabReports] = useState([]);
  const [pendingLabOrders, setPendingLabOrders] = useState([]);

  const [visitsLoading, setVisitsLoading] = useState(false);
  const [medLoading, setMedLoading] = useState(false);
  const [prescLoading, setPrescLoading] = useState(false);
  const [admissionsLoading, setAdmissionsLoading] = useState(false);

  // Load patient profile
  useEffect(() => {
    async function loadPatient() {
      if (!params?.id) return;
      try {
        let found = null;
        try {
          const res = await patientAPI.getPatientById(params.id);
          if (res.success && res.data) found = res.data;
        } catch (_) {}
        if (!found) {
          const allRes = await patientAPI.getPatients();
          if (allRes.success && Array.isArray(allRes.data)) {
            found = allRes.data.find(
              (p) => p.patientId === params.id || p.uhid === params.id || p._id === params.id || p.id === params.id
            );
          }
        }
        if (found) {
          const d = found;
          setPatient({
            id: d.uhid || d.patientId || d._id || params.id,
            mongoId: d._id || d.id,
            uhid: d.uhid || d.patientId || d._id || params.id,
            name: d.name || d.patientName || "Patient",
            age: d.age || "",
            dob: d.dob || d.dateOfBirth || "",
            gender: d.gender || "",
            phone: d.phone || "",
            email: d.email || "",
            bloodGroup: d.bloodGroup || "",
            department: d.department || "",
            status: d.status || "Outpatient",
            address: [d.address, d.city, d.state].filter(Boolean).join(", ") || "",
            allergies: Array.isArray(d.allergies) ? d.allergies : [],
            medicalHistory: d.medicalHistory || "",
            emergencyContact: d.emergencyContactName
              ? { name: d.emergencyContactName, phone: d.emergencyContactPhone, relation: d.emergencyContactRelation }
              : null,
            registeredAt: d.registeredAt || d.createdAt || "",
            insuranceProvider: d.insuranceProvider || "",
            insuranceNumber: d.insuranceNumber || "",
          });
        }
      } catch (err) {
        console.warn("Error fetching patient:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPatient();
  }, [params]);

  // Load lab reports whenever patient changes
  useEffect(() => {
    if (!patient) return;
    async function loadLabReports() {
      try {
        const [verified, pending] = await Promise.all([
          labStore.getVerifiedReportsForPatient(patient.name),
          labStore.getPendingOrdersForPatient(patient.name),
        ]);
        setVerifiedLabReports(Array.isArray(verified) ? verified : []);
        setPendingLabOrders(Array.isArray(pending) ? pending : []);
      } catch (e) {
        console.warn("Lab reports:", e.message);
      }
    }
    loadLabReports();
  }, [patient]);

  // Load history when switching to history tab
  useEffect(() => {
    if (tab !== "history" || !patient) return;

    async function loadVisits() {
      setVisitsLoading(true);
      try {
        const res = await appointmentAPI.getAppointments();
        if (res.success && Array.isArray(res.data)) {
          setVisits(res.data.filter(
            (a) =>
              a.patientId === patient.mongoId ||
              a.patientId === patient.id ||
              a.patientId?._id === patient.mongoId ||
              a.patientName === patient.name
          ));
        }
      } catch (e) { console.warn("Appointments:", e.message); }
      finally { setVisitsLoading(false); }
    }

    async function loadMedRecords() {
      setMedLoading(true);
      try {
        let res = await medicalRecordAPI.getMedicalRecordsByPatient(patient.mongoId || patient.id);
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setMedRecords(res.data);
        } else {
          const allRes = await medicalRecordAPI.getMedicalRecords();
          if (allRes.success && Array.isArray(allRes.data)) {
            setMedRecords(allRes.data.filter(
              (r) =>
                r.patientId === patient.mongoId ||
                r.patientId?._id === patient.mongoId ||
                String(r.patientId) === String(patient.mongoId) ||
                r.patientId === patient.id
            ));
          }
        }
      } catch (e) { console.warn("Medical records:", e.message); }
      finally { setMedLoading(false); }
    }

    async function loadPrescriptions() {
      setPrescLoading(true);
      try {
        let res = await prescriptionAPI.getPrescriptionsByPatient(patient.mongoId || patient.id);
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPrescriptions(res.data);
        } else {
          const allRes = await prescriptionAPI.getPrescriptions();
          if (allRes.success && Array.isArray(allRes.data)) {
            setPrescriptions(allRes.data.filter(
              (p) =>
                p.patientId === patient.mongoId ||
                p.patientId?._id === patient.mongoId ||
                p.patient === patient.name ||
                p.patientName === patient.name
            ));
          }
        }
      } catch (e) { console.warn("Prescriptions:", e.message); }
      finally { setPrescLoading(false); }
    }

    async function loadAdmissions() {
      setAdmissionsLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("hms_token") : null;
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const res = await fetch(`${apiBase}/admissions/getadmissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setAdmissions(data.data.filter(
            (a) =>
              a.patientId === patient.mongoId ||
              a.patientId?._id === patient.mongoId ||
              String(a.patientId) === String(patient.mongoId) ||
              a.patientName === patient.name
          ));
        }
      } catch (e) { console.warn("Admissions:", e.message); }
      finally { setAdmissionsLoading(false); }
    }

    loadVisits();
    loadMedRecords();
    loadPrescriptions();
    loadAdmissions();
  }, [tab, patient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm font-semibold text-[#87938E]">
        <Loader2 size={20} className="mr-2 animate-spin" /> Loading patient profile...
      </div>
    );
  }

  if (!patient) {
    return <div className="p-6 text-center text-sm font-semibold text-[#87938E]">Patient record not found.</div>;
  }

  const initials = patient.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  // verifiedLabReports and pendingLabOrders are loaded asynchronously via useEffect above

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patients" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Patient Record</h1>
            <p className="text-xs text-[#7B8882] dark:text-[#87938E]">Full clinical profile and visit history</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-3 py-2 text-xs font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]">
            <Printer size={15} /><span className="hidden sm:inline">Print</span>
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-3 py-2 text-xs font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]">
            <Download size={15} /><span className="hidden sm:inline">Export</span>
          </button>
          {patient.status !== "Admitted" && (
            <button
              onClick={() => router.push(`/admissions/new?patientName=${encodeURIComponent(patient.name)}&patientId=${patient.id}`)}
              className="flex items-center gap-2 rounded-xl border border-[#0F766E] bg-[#E7F5F2] px-4 py-2 text-sm font-bold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white dark:border-[#5EEAD4] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
            >
              <BedDouble size={16} /> Admit to IPD
            </button>
          )}
          <Link href={`/patients/${patient.id}/edit`} className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0B625C]">
            <Edit size={16} /> Edit Record
          </Link>
        </div>
      </div>

      {/* Hero Card */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-white shadow-sm dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex flex-col gap-6 border-b border-[#EEECE5] p-6 sm:flex-row sm:items-center dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F766E]/10 text-xl font-black text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">{initials}</div>
            <div>
              <h2 className="text-xl font-bold text-[#17201D] dark:text-white">{patient.name}</h2>
              <p className="mt-0.5 text-sm text-[#7B8882] dark:text-[#87938E]">
                {patient.age ? `${patient.age} yrs` : ""}{patient.age && patient.gender ? " Â· " : ""}{patient.gender}
                {patient.dob && <> Â· DOB: {new Date(patient.dob).toLocaleDateString("en-IN")}</>}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${statusStyles[patient.status] || "bg-gray-100 text-gray-600"}`}>
                  â— {patient.status}
                </span>
                {patient.bloodGroup && (
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    <Droplets size={10} className="mr-0.5 inline" />{patient.bloodGroup}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="sm:ml-auto">
            <div className="rounded-2xl border-2 border-dashed border-[#0F766E]/30 bg-[#E7F5F2] px-5 py-4 text-center dark:bg-[#0F766E]/10">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#0F766E]/60 dark:text-[#5EEAD4]/60">Unique Hospital ID (UHID)</p>
              <div className="flex items-center justify-center gap-2">
                <Hash size={18} className="text-[#0F766E] dark:text-[#5EEAD4]" />
                <p className="font-mono text-2xl font-black tracking-wider text-[#0F766E] dark:text-[#5EEAD4]">{patient.uhid || patient.id}</p>
              </div>
              <p className="mt-1 text-[10px] text-[#7B8882] dark:text-[#87938E]">Quote this ID at every visit</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Phone, label: "Mobile", value: patient.phone },
            { icon: Mail, label: "Email", value: patient.email },
            { icon: Building2, label: "Department", value: patient.department },
            { icon: MapPin, label: "Address", value: patient.address },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 border-r border-b border-[#EEECE5] p-5 last:border-r-0 dark:border-white/10">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FAFAF7] text-[#52615B] dark:bg-[#202B27] dark:text-[#AAB6B0]"><Icon size={17} /></div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#87938E]">{label}</p>
                <p className="truncate text-sm font-semibold text-[#17201D] dark:text-white">{value || "â€”"}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 border-t border-[#EEECE5] px-6 py-4 dark:border-white/10">
          {patient.emergencyContact?.name && (
            <div className="flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
              <Heart size={13} className="text-red-500" />
              <span className="font-semibold">Emergency:</span>
              <span>{patient.emergencyContact.name}</span>
              <span className="text-[#C5C9C6]">Â·</span>
              <span>{patient.emergencyContact.phone}</span>
              {patient.emergencyContact.relation && (
                <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] text-red-500 dark:bg-red-500/10">{patient.emergencyContact.relation}</span>
              )}
            </div>
          )}
          {patient.insuranceProvider && (
            <div className="flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
              <ShieldCheck size={13} className="text-blue-500" />
              <span className="font-semibold">Insurance:</span>
              <span>{patient.insuranceProvider}</span>
              {patient.insuranceNumber && <span className="font-mono text-[#87938E]">#{patient.insuranceNumber}</span>}
            </div>
          )}
          {patient.registeredAt && (
            <div className="flex items-center gap-1.5 text-xs text-[#87938E]">
              <Calendar size={12} />
              Registered: {new Date(patient.registeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          )}
        </div>

        {patient.allergies.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-[#EEECE5] px-6 py-3 dark:border-white/10">
            <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400"><AlertTriangle size={12} /> Allergies:</span>
            {patient.allergies.map((a, i) => (
              <span key={i} className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">{a}</span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl border border-[#E5E2D9] bg-white p-1.5 dark:border-white/10 dark:bg-[#17201D]">
        {[{ key: "overview", label: "Overview", icon: User }, { key: "history", label: "Patient History", icon: Clock }].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tab === key ? "bg-[#0F766E] text-white shadow-sm" : "text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/[0.06]"}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Appointments",    value: visits.length,             icon: Calendar,      color: "#2563EB" },
              { label: "Medical Records", value: medRecords.length,         icon: Stethoscope,   color: "#7C3AED" },
              { label: "Prescriptions",   value: prescriptions.length,      icon: Pill,          color: "#0F766E" },
              { label: "Lab Reports",     value: verifiedLabReports.length,  icon: FlaskConical,  color: "#059669" },
              { label: "Admissions",      value: admissions.length,          icon: Ambulance,     color: "#EA580C" },
              { label: "Known Allergies", value: patient.allergies.length,   icon: AlertTriangle, color: "#D95C4F" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: color + "18" }}><Icon size={20} style={{ color }} /></div>
                <div>
                  <p className="text-2xl font-black text-[#17201D] dark:text-white">{value}</p>
                  <p className="text-xs font-semibold text-[#87938E]">{label}</p>
                </div>
              </div>
            ))}
          </div>
          {patient.medicalHistory && (
            <div className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]">
              <div className="mb-2 flex items-center gap-2"><FileText size={15} className="text-[#0F766E]" /><p className="text-sm font-bold text-[#17201D] dark:text-white">Medical History Notes</p></div>
              <p className="text-sm text-[#52615B] dark:text-[#AAB6B0]">{patient.medicalHistory}</p>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {tab === "history" && (
        <div className="space-y-4">

          <HistorySection icon={AlertTriangle} title="Known Allergies" count={patient.allergies.length} color="#D95C4F">
            <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
              {patient.allergies.length === 0
                ? <EmptyRow message="No known allergies recorded." />
                : patient.allergies.map((a, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/10"><AlertTriangle size={15} className="text-red-600" /></div>
                      <p className="text-sm font-semibold text-[#17201D] dark:text-white">{a}</p>
                    </div>
                  ))
              }
            </div>
          </HistorySection>

          <HistorySection icon={Calendar} title="Appointments" count={visits.length} color="#2563EB" loading={visitsLoading}>
            <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
              {visitsLoading ? <LoadingRow message="Loading appointments..." />
                : visits.length === 0 ? <EmptyRow message="No appointments found for this patient." />
                : visits.map((v) => (
                    <div key={v._id || v.id} className="px-6 py-4">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${v.type === "Emergency" ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"}`}>{v.type || v.appointmentType || "OPD"}</span>
                          <span className="text-xs text-[#87938E]">{v.date || v.appointmentDate ? new Date(v.date || v.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "â€”"}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#87938E]">{v.appointmentId || v._id}</span>
                      </div>
                      <p className="text-sm font-bold text-[#17201D] dark:text-white">{v.reason || v.chiefComplaint || v.notes || "Consultation"}</p>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                        {v.doctorName && <span className="flex items-center gap-1"><Stethoscope size={11} />{v.doctorName}</span>}
                        {v.department && <><span>Â·</span><span className="flex items-center gap-1"><Building2 size={11} />{v.department}</span></>}
                      </div>
                      {v.status && <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${v.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" : v.status === "cancelled" ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}>{v.status}</span>}
                    </div>
                  ))
              }
            </div>
          </HistorySection>

          <HistorySection icon={Stethoscope} title="Medical Records" count={medRecords.length} color="#7C3AED" loading={medLoading}>
            <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
              {medLoading ? <LoadingRow message="Loading medical records..." />
                : medRecords.length === 0 ? <EmptyRow message="No medical records found for this patient." />
                : medRecords.map((r) => (
                    <div key={r._id || r.id} className="flex items-start gap-4 px-6 py-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10"><Stethoscope size={16} className="text-purple-600 dark:text-purple-400" /></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#17201D] dark:text-white">{r.diagnosis || r.chiefComplaint || "Consultation"}</p>
                        <p className="mt-0.5 text-xs text-[#87938E]">{r.doctorName || r.doctor} Â· {r.date || r.visitDate ? new Date(r.date || r.visitDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "â€”"}</p>
                        {r.treatment && <p className="mt-1 text-xs text-[#52615B] dark:text-[#AAB6B0]">Treatment: {r.treatment}</p>}
                        {r.notes && <p className="mt-1 text-xs text-[#7B8882]">{r.notes}</p>}
                      </div>
                    </div>
                  ))
              }
            </div>
          </HistorySection>

          <HistorySection icon={Pill} title="Prescription History" count={prescriptions.length} color="#0F766E" loading={prescLoading}>
            <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
              {prescLoading ? <LoadingRow message="Loading prescriptions..." />
                : prescriptions.length === 0 ? <EmptyRow message="No prescriptions found for this patient." />
                : prescriptions.map((rx) => {
                    const drugs = Array.isArray(rx.medicines) && rx.medicines.length > 0
                      ? rx.medicines.map((m) => `${m.name || m} ${m.dosage || ""}`.trim())
                      : rx.medicineName ? [rx.medicineName] : [];
                    return (
                      <div key={rx._id || rx.rxId} className="px-6 py-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${rx.status === "Active" || rx.status === "Pending Dispense" ? "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]" : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400"}`}>{rx.status || "Active"}</span>
                            <span className="font-mono text-[10px] text-[#87938E]">{rx.rxId || rx._id}</span>
                          </div>
                          <span className="text-xs text-[#87938E]">{rx.createdAt ? new Date(rx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "â€”"}</span>
                        </div>
                        {drugs.length > 0
                          ? <div className="flex flex-wrap gap-2">{drugs.map((drug, i) => <span key={i} className="flex items-center gap-1 rounded-lg bg-[#FAFAF7] px-3 py-1.5 text-xs font-semibold text-[#52615B] dark:bg-[#202B27] dark:text-[#AAB6B0]"><Pill size={10} className="text-[#0F766E]" />{drug}</span>)}</div>
                          : <p className="text-sm text-[#87938E]">No medicines recorded</p>
                        }
                        {rx.diagnosis && <p className="mt-2 text-xs text-[#87938E]">Diagnosis: {rx.diagnosis}</p>}
                      </div>
                    );
                  })
              }
            </div>
          </HistorySection>

          <HistorySection icon={FlaskConical} title="Lab Reports (Verified Only)" count={verifiedLabReports.length} color="#059669">
            <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
              {pendingLabOrders.length > 0 && (
                <div className="flex items-center justify-between bg-amber-50 p-4 text-xs dark:bg-amber-500/10">
                  <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300"><Clock size={16} /><span>{pendingLabOrders.length} Lab Order(s) in progress ({pendingLabOrders.map((p) => p.testType).join(", ")}).</span></div>
                  <span className="rounded bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-500/30 dark:text-amber-200">Hidden until Pathologist Verification</span>
                </div>
              )}
              {verifiedLabReports.length === 0 ? <EmptyRow message="No verified lab reports available." />
                : verifiedLabReports.map((lb) => (
                    <div key={lb.id} className="flex items-start gap-4 px-6 py-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10"><ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" /></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-[#17201D] dark:text-white">{lb.testType}</p>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"><CheckCircle2 size={11} /> VERIFIED & RELEASED</span>
                          </div>
                          <button onClick={() => setSelectedReportOrder(lb)} className="flex items-center gap-1 text-xs font-bold text-[#0F766E] hover:underline dark:text-[#5EEAD4]"><Eye size={14} /> View Full Report</button>
                        </div>
                        <p className="mt-0.5 text-xs text-[#87938E]">Ordered by {lb.doctor} Â· Verified by {lb.verification?.verifiedBy || "Pathologist"} on {lb.verification?.verifiedAt || lb.orderDate}</p>
                        <div className="mt-2 flex items-center justify-between rounded-lg bg-[#FAFAF7] px-3 py-2 text-xs dark:bg-[#202B27]">
                          <span className="font-mono font-bold text-[#17201D] dark:text-white">Result: {lb.results?.value}</span>
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${lb.results?.interpretation === "High" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"}`}>{lb.results?.interpretation || "Normal"}</span>
                        </div>
                      </div>
                    </div>
                  ))
              }
            </div>
          </HistorySection>

          <HistorySection icon={Ambulance} title="Admission History" count={admissions.length} color="#EA580C" loading={admissionsLoading}>
            <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
              {admissionsLoading ? <LoadingRow message="Loading admissions..." />
                : admissions.length === 0 ? <EmptyRow message="No hospital admissions recorded." />
                : admissions.map((adm) => (
                    <div key={adm._id || adm.id} className="px-6 py-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${adm.status === "Discharged" ? "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400" : "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"}`}>{adm.status || "Admitted"}</span>
                        <span className="font-mono text-[10px] text-[#87938E]">{adm.admissionId || adm._id}</span>
                      </div>
                      <p className="text-sm font-bold text-[#17201D] dark:text-white">{adm.reason || adm.diagnosis || "Admission"}</p>
                      <div className="mt-1.5 flex flex-wrap gap-4 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                        {adm.admissionDate && <span className="flex items-center gap-1"><Calendar size={11} />Admitted: {new Date(adm.admissionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                        {adm.dischargeDate && <span className="flex items-center gap-1"><ThumbsUp size={11} />Discharged: {new Date(adm.dischargeDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                        {(adm.ward || adm.bed) && <span className="flex items-center gap-1"><BedDouble size={11} />{[adm.ward, adm.bed].filter(Boolean).join(" Â· ")}</span>}
                        {(adm.doctorName || adm.doctor) && <span className="flex items-center gap-1"><Stethoscope size={11} />{adm.doctorName || adm.doctor}</span>}
                      </div>
                    </div>
                  ))
              }
            </div>
          </HistorySection>

        </div>
      )}

      {selectedReportOrder && <LabReportModal order={selectedReportOrder} onClose={() => setSelectedReportOrder(null)} />}
    </div>
  );
}