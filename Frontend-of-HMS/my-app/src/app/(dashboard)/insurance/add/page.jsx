"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const patients = ["Aditi Sharma", "Rohan Verma", "Meera Nair", "Karan Malhotra", "Sneha Patil"];
const companies = ["Star Health", "HDFC Ergo", "ICICI Lombard", "Bajaj Allianz"];

export default function AddInsuranceClaimPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    patient: patients[0],
    insuranceCompany: companies[0],
    policyNo: "",
    claimAmount: "",
    status: "Submitted",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to POST /api/insurance
    console.log("New insurance claim:", form);
    router.push("/insurance");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/insurance" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">New Insurance Claim</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">File a claim on behalf of a patient</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Patient</label>
            <select name="patient" value={form.patient} onChange={handleChange} className={inputClass}>
              {patients.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Insurance Company</label>
            <select name="insuranceCompany" value={form.insuranceCompany} onChange={handleChange} className={inputClass}>
              {companies.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Policy No.</label>
            <input required name="policyNo" value={form.policyNo} onChange={handleChange} placeholder="e.g. SH-88213421" className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Claim Amount (₹)</label>
            <input required type="number" min="0" name="claimAmount" value={form.claimAmount} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option>Submitted</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link href="/insurance" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">Cancel</Link>
          <button type="submit" className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90">Submit Claim</button>
        </div>
      </form>
    </div>
  );
}

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7]
  bg-[#FAFAF7] px-4 py-2.5 text-sm
  text-[#17201D] outline-none
  placeholder:text-[#9AA49F]
  focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
  dark:border-white/10 dark:bg-[#202B27] dark:text-white
  dark:placeholder:text-[#71817B]
`;