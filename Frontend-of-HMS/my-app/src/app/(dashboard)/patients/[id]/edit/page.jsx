"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { patientAPI } from "../../../../services/api";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    department: "General",
  });

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
              (p) => p.patientId === params.id || p.uhid === params.id || p._id === params.id
            );
          }
        }

        if (found) {
          setPatient({
            name: found.name || found.patientName || "",
            age: found.age || "",
            gender: found.gender || "Male",
            phone: found.phone || "",
            email: found.email || "",
            department: found.department || "General",
            status: found.status || "Outpatient",
            address: found.address || "",
          });
        }
      } catch (err) {
        console.warn("Load patient error:", err.message);
      }
    }
    loadPatient();
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (params?.id) {
        await patientAPI.updatePatient(params.id, {
          name: patient.name,
          age: Number(patient.age) || undefined,
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email,
          department: patient.department,
          status: patient.status,
          address: patient.address,
        });
      }
    } catch (err) {
      console.warn("Update patient notice:", err.message);
    } finally {
      setLoading(false);
      router.push("/patients");
    }
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center gap-3">
        <Link href="/patients" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Edit Patient Record</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Update patient info in Express backend</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Full Name</label>
            <input required value={patient.name} onChange={(e) => setPatient((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Age</label>
            <input required type="number" value={patient.age} onChange={(e) => setPatient((p) => ({ ...p, age: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Phone</label>
            <input value={patient.phone} onChange={(e) => setPatient((p) => ({ ...p, phone: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Email</label>
            <input type="email" value={patient.email} onChange={(e) => setPatient((p) => ({ ...p, email: e.target.value }))} className={inputClass} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link href="/patients" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:text-[#AAB6B0]">Cancel</Link>
          <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]">
            <Save size={16} />
            {loading ? "Saving..." : "Update Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm text-[#17201D] outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white
`;
