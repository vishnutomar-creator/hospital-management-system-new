"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Hash,
  Sparkles,
  Loader2,
  ListOrdered,
} from "lucide-react";
import { appointmentAPI, patientAPI, doctorAPI } from "../../../services/api";
import { generateToken, peekToken, enqueue } from "../../../utils/opd";

const DEPARTMENTS = [
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "General Medicine",
  "Pediatrics",
  "Gynecology",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Psychiatry",
  "Oncology",
  "Nephrology",
  "Gastroenterology",
  "Pulmonology",
  "Endocrinology",
  "Radiology",
];

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7]
  bg-[#FAFAF7] px-4 py-2.5 text-sm
  text-[#17201D] outline-none
  placeholder:text-[#9AA49F]
  focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
  dark:border-white/10 dark:bg-[#202B27] dark:text-white
  dark:placeholder:text-[#71817B]
`;

export default function BookAppointmentPage() {
  const router = useRouter();
  const [loading,          setLoading]          = useState(false);
  const [patientOptions,   setPatientOptions]   = useState([]);
  const [doctorOptions,    setDoctorOptions]    = useState([]);
  const [useCustomPatient, setUseCustomPatient] = useState(false);
  const [useCustomDoctor,  setUseCustomDoctor]  = useState(false);
  const [booked,           setBooked]           = useState(null); // { token, aptId, patient, doctor }

  const [form, setForm] = useState({
    patient:    "",
    patientId:  "",
    patientUhid:"",
    doctor:     "",
    doctorId:   "",
    department: DEPARTMENTS[3], // General Medicine default
    date:       new Date().toISOString().slice(0, 10),
    time:       "10:00",
    status:     "Scheduled",
    notes:      "",
    sendToQueue: true, // always auto-queue for today's appointments
  });

  // Preview token updates live as department changes
  const tokenPreview = form.department ? peekToken(form.department) : "—";

  // ── Load patient & doctor options ──────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      let pList = [];
      let dList = [];

      // ── API — patients ────────────────────────────────────────────────
      try {
        const pResp = await patientAPI.getPatients();
        if (pResp.success && Array.isArray(pResp.data)) {
          pResp.data.forEach((p) => {
            const name = p.name || p.patientName || p.userId?.name;
            // Prefer MongoDB _id (ObjectId) over patientId which may be a UHID string
            const mongoId = p._id || p.id || p.patientId || "";
            if (name && !pList.find((x) => x.name === name)) {
              pList.push({ name, id: mongoId, uhid: p.uhid || p.patientId || "" });
            }
          });
        }
      } catch { /* ignore */ }

      // ── API — doctors ─────────────────────────────────────────────────
      try {
        const dResp = await doctorAPI.getDoctors();
        if (dResp.success && Array.isArray(dResp.data)) {
          dResp.data.forEach((d) => {
            const name = d.name || d.doctorName || d.userId?.name;
            // Prefer MongoDB _id (ObjectId) over any other id field
            const mongoId = d._id || d.id || "";
            if (name && !dList.find((x) => x.name === name))
              dList.push({ name, id: mongoId });
          });
        }
      } catch { /* ignore */ }

      setPatientOptions(pList);
      setDoctorOptions(dList);
      if (pList.length === 0) setUseCustomPatient(true);
      if (dList.length === 0) setUseCustomDoctor(true);

      setForm((prev) => ({
        ...prev,
        patient:    pList[0]?.name || "",
        patientId:  pList[0]?.id   || "",
        patientUhid:pList[0]?.uhid || "",
        doctor:     dList[0]?.name || "",
        doctorId:   dList[0]?.id   || "",
      }));
    }
    loadData();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "patient") {
      const found = patientOptions.find((p) => p.name === value);
      setForm((prev) => ({
        ...prev,
        patient:     value,
        patientId:   found?.id   ?? "",
        patientUhid: found?.uhid ?? "",
      }));
    } else if (name === "doctor") {
      const found = doctorOptions.find((d) => d.name === value);
      setForm((prev) => ({
        ...prev,
        doctor:   value,
        doctorId: found?.id ?? "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const aptId        = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const token        = generateToken(form.department);
    const finalPatient = form.patient.trim() || "Patient";
    const finalDoctor  = form.doctor.trim()  || "Dr. Specialist";

    const newAptObj = {
      id:          aptId,
      aptId,
      patient:     finalPatient,
      patientName: finalPatient,
      patientId:   form.patientId,
      patientUhid: form.patientUhid,
      doctor:      finalDoctor,
      doctorName:  finalDoctor,
      department:  form.department,
      date:        form.date || new Date().toISOString().slice(0, 10),
      time:        form.time || "10:00",
      status:      "Scheduled",
      type:        "Consultation",
      notes:       form.notes,
      token,                        // ← OPD token attached to appointment
    };

    // Persist appointment to backend API
    try { await appointmentAPI.createAppointment(newAptObj); } catch { /* ignore */ }

    // Auto-enqueue if today's date or sendToQueue
    const todayStr = new Date().toISOString().slice(0, 10);
    if (form.sendToQueue || form.date === todayStr) {
      enqueue({
        appointmentId: aptId,
        token,
        patient:      finalPatient,
        patientId:    form.patientId   || "",
        patientUhid:  form.patientUhid || "",
        doctor:       finalDoctor,
        doctorId:     form.doctorId    || "",
        department:   form.department,
        date:         form.date,
        time:         form.time,
        notes:        form.notes,
      });
    }

    setLoading(false);
    setBooked({ token, aptId, patient: finalPatient, doctor: finalDoctor, department: form.department });
  };

  // ── Success screen ──────────────────────────────────────────────────────
  if (booked) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/appointments" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Appointment Confirmed</h1>
        </div>

        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#17201D]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/10">
            <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-[#17201D] dark:text-white">Appointment Booked!</h2>
          <p className="mt-1 text-sm text-[#7B8882]">
            {booked.patient} → {booked.doctor} · {booked.department}
          </p>

          {/* OPD Token Hero */}
          <div className="mx-auto mt-6 max-w-[240px] rounded-2xl border-2 border-dashed border-[#0F766E]/40 bg-[#E7F5F2] px-6 py-5 dark:bg-[#0F766E]/10">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#0F766E]/70">
              OPD Token
            </p>
            <div className="flex items-center justify-center gap-2">
              <ListOrdered size={22} className="text-[#0F766E]" />
              <p className="font-mono text-4xl font-black tracking-wide text-[#0F766E] dark:text-[#5EEAD4]">
                {booked.token}
              </p>
            </div>
            <p className="mt-2 text-[11px] text-[#7B8882]">
              Patient has been added to the queue
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/queue" className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B625C]">
              <ListOrdered size={16} />
              View Queue
            </Link>
            <button
              onClick={() => setBooked(null)}
              className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]"
            >
              Book Another
            </button>
            <Link href="/appointments" className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]">
              All Appointments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/appointments" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Book Appointment</h1>
          <p className="mt-0.5 text-sm text-[#7B8882] dark:text-[#87938E]">
            Schedule a consultation — an OPD token is auto-generated and the patient joins the queue
          </p>
        </div>
      </div>

      {/* Token preview banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-[#0F766E]/20 bg-[#E7F5F2] px-5 py-3.5 dark:bg-[#0F766E]/10">
        <Sparkles size={16} className="shrink-0 text-[#0F766E]" />
        <p className="text-sm text-[#52615B] dark:text-[#AAB6B0]">
          OPD token that will be assigned:{" "}
          <span className="font-mono text-base font-black text-[#0F766E] dark:text-[#5EEAD4]">
            {tokenPreview}
          </span>
          <span className="ml-1 text-xs text-[#87938E]">(for {form.department})</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E2D9] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#17201D]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Patient */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Patient *</label>
              {patientOptions.length > 0 && (
                <button type="button" onClick={() => setUseCustomPatient((v) => !v)} className="text-[11px] font-semibold text-[#0F766E] underline">
                  {useCustomPatient ? "Select registered" : "+ Enter manually"}
                </button>
              )}
            </div>
            {useCustomPatient || patientOptions.length === 0 ? (
              <input required type="text" name="patient" value={form.patient} onChange={handleChange} placeholder="Patient full name" className={inputClass} />
            ) : (
              <select name="patient" value={form.patient} onChange={handleChange} className={inputClass}>
                {patientOptions.map((p) => <option key={p.name} value={p.name}>{p.name}{p.uhid ? ` — ${p.uhid}` : ""}</option>)}
              </select>
            )}
          </div>

          {/* Doctor */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Doctor *</label>
              {doctorOptions.length > 0 && (
                <button type="button" onClick={() => setUseCustomDoctor((v) => !v)} className="text-[11px] font-semibold text-[#0F766E] underline">
                  {useCustomDoctor ? "Select doctor" : "+ Enter manually"}
                </button>
              )}
            </div>
            {useCustomDoctor || doctorOptions.length === 0 ? (
              <input required type="text" name="doctor" value={form.doctor} onChange={handleChange} placeholder="e.g. Dr. Ankit Sharma" className={inputClass} />
            ) : (
              <select name="doctor" value={form.doctor} onChange={handleChange} className={inputClass}>
                {doctorOptions.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            )}
          </div>

          {/* Department — drives token prefix */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Department</label>
            <select name="department" value={form.department} onChange={handleChange} className={inputClass}>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Date *</label>
            <input required type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />
          </div>

          {/* Time */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Time *</label>
            <input required type="time" name="time" value={form.time} onChange={handleChange} className={inputClass} />
          </div>

          {/* Auto-queue checkbox */}
          <div className="flex items-center gap-3 rounded-xl border border-[#E5E2D9] bg-[#FAFAF7] px-4 py-3 dark:border-white/10 dark:bg-[#202B27]">
            <input
              id="sendToQueue"
              type="checkbox"
              name="sendToQueue"
              checked={form.sendToQueue}
              onChange={handleChange}
              className="h-4 w-4 rounded border-[#DDD9CE] accent-[#0F766E]"
            />
            <label htmlFor="sendToQueue" className="text-sm font-semibold text-[#17201D] dark:text-white">
              Auto-add to today's OPD queue
            </label>
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Notes / Symptoms</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Reason for visit, clinical symptoms, or referral notes" className={inputClass} />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link href="/appointments" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90 disabled:opacity-60"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Booking…</>
              : <><Calendar size={16} /> Book & Assign Token</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}