"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { doctorAPI } from "../../../../services/api";

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mongoId, setMongoId] = useState(null);
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Cardiology",
    specialization: "Cardiologist",
    experience: "5",
    shift: "Morning",
    status: "Available",
  });

  useEffect(() => {
    async function loadDoctor() {
      if (!params?.id) return;

      try {
        let found = null;
        try {
          const res = await doctorAPI.getDoctorById(params.id);
          if (res.success && res.data) found = res.data;
        } catch (_) {}

        if (!found) {
          const allRes = await doctorAPI.getDoctors();
          if (allRes.success && Array.isArray(allRes.data)) {
            found = allRes.data.find((d) => d.doctorId === params.id || d._id === params.id || d.id === params.id);
          }
        }

        if (found) {
          setMongoId(found._id || found.id || null);
          setDoctor({
            name: found.name || found.doctorName || "",
            email: found.email || "",
            phone: found.phone || "",
            department: found.department?.name || found.department || "Cardiology",
            specialization: found.specialization || "Cardiologist",
            experience: String(found.experience || "5").replace(" Years", ""),
            shift: found.shift || "Morning",
            status: found.availability || found.status || "Available",
          });
        }
      } catch (err) {
        console.warn("Load doctor error:", err.message);
      }
    }

    loadDoctor();
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const idToUse = mongoId || params?.id;
      if (idToUse) {
        const availabilityMap = {
          Available: "Available",
          Unavailable: "Unavailable",
          "On Leave": "On Leave",
        };
        await doctorAPI.updateDoctor(idToUse, {
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          specialization: doctor.specialization,
          experience: Number(doctor.experience) || undefined,
          availability: availabilityMap[doctor.status] || "Available",
        });
        router.push("/doctors");
      }
    } catch (err) {
      console.error("Update doctor error:", err.message);
      setError(err.message || "Failed to update doctor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center gap-3">
        <Link href="/doctors" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Edit Doctor Profile</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Doctor ID: {params.id}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Full Name *</label>
            <input required value={doctor.name} onChange={(e) => setDoctor((d) => ({ ...d, name: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Email *</label>
            <input required type="email" value={doctor.email} onChange={(e) => setDoctor((d) => ({ ...d, email: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Phone *</label>
            <input required type="tel" value={doctor.phone} onChange={(e) => setDoctor((d) => ({ ...d, phone: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Department *</label>
            <select value={doctor.department} onChange={(e) => setDoctor((d) => ({ ...d, department: e.target.value }))} className={inputClass}>
              {["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine", "Radiology"].map((dep) => (
                <option key={dep}>{dep}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Specialization *</label>
            <input required value={doctor.specialization} onChange={(e) => setDoctor((d) => ({ ...d, specialization: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Availability</label>
            <select value={doctor.status} onChange={(e) => setDoctor((d) => ({ ...d, status: e.target.value }))} className={inputClass}>
              <option>Available</option>
              <option>Unavailable</option>
              <option>On Leave</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link href="/doctors" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:text-[#AAB6B0]">Cancel</Link>
          <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]">
            <Save size={16} />
            {loading ? "Saving..." : "Update Doctor"}      
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm text-[#17201D] outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white
`;
