"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity, BedDouble, Building2, ChevronRight, Plus, Search,
  ShieldCheck, UserRound, Users, RefreshCw, UserPlus,
} from "lucide-react";
import { wardAPI, bedAPI } from "../../services/api";

const WARD_STATUS_STYLES = {
  "Operational":    "bg-[#ECFDF5] text-[#0F766E]",
  "High Occupancy": "bg-[#FFF3E8] text-[#C87924]",
  "Critical":       "bg-[#FFF1F1] text-[#C84B4B]",
};

export default function WardsPage() {
  const [wards, setWards] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [typeFilter, setTypeFilter] = useState("All Ward Types");

  const loadData = async () => {
    setLoading(true);
    try {
      const [wRes, bRes] = await Promise.all([
        wardAPI.getWards().catch(() => ({ success: false })),
        bedAPI.getBeds().catch(() => ({ success: false })),
      ]);

      const rawWards = wRes?.data || (Array.isArray(wRes) ? wRes : []);
      const rawBeds = bRes?.data || (Array.isArray(bRes) ? bRes : []);
      setBeds(rawBeds);

      // Map backend wards
      const mappedWards = rawWards.map((w, idx) => {
        const wardId = w._id || `WRD-${String(idx + 1).padStart(3, "0")}`;
        const wardBeds = rawBeds.filter((b) => (b.wardId?._id || b.wardId) === (w._id || wardId));
        const totalBeds = w.totalBeds || wardBeds.length || 20;
        const occupiedBeds = wardBeds.filter((b) => b.status === "Occupied").length;
        const availableBeds = w.availableBeds ?? (totalBeds - occupiedBeds);
        const occupancy = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
        const wardStatus = occupancy >= 90 ? "Critical" : occupancy >= 75 ? "High Occupancy" : "Operational";

        return {
          id: wardId,
          name: w.wardName || w.name || `Ward ${idx + 1}`,
          department: w.departmentId?.name || w.department || "General Medicine",
          floor: w.floor || "1st Floor",
          type: w.wardType || w.type || "General",
          nurses: w.nursesCount || 8,
          headNurse: w.inChargeNurseId?.Name || w.inChargeNurseId?.name || "Senior Nurse, RN",
          totalBeds,
          occupiedBeds,
          availableBeds: Math.max(0, availableBeds),
          occupancy,
          wardStatus,
        };
      });

      setWards(mappedWards);
    } catch (err) {
      console.error("Error loading wards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = wards.filter((w) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${w.name} ${w.department} ${w.id}`.toLowerCase().includes(q);
    const matchDept   = deptFilter === "All Departments" || w.department === deptFilter;
    const matchType   = typeFilter === "All Ward Types"  || w.type === typeFilter;
    return matchSearch && matchDept && matchType;
  });

  const totalBeds     = wards.reduce((a, w) => a + w.totalBeds, 0);
  const totalOccupied = wards.reduce((a, w) => a + w.occupiedBeds, 0);
  const totalAvail    = wards.reduce((a, w) => a + w.availableBeds, 0);

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#87938E]">
            <span>Hospital</span><ChevronRight size={13} /><span className="text-[#0F766E]">Wards</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">Wards</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Live bed availability — admit patients directly from any ward card.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-3.5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
            <RefreshCw size={15} />Refresh
          </button>
          <Link href="/admissions/new" className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-3.5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
            <UserPlus size={15} />New Admission
          </Link>
          <Link href="/wards/add" className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]">
            <Plus size={17} />Add Ward
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Wards"    value={wards.length}  subtitle="Hospital units"     icon={<Building2 size={20}/>} iconBg="bg-[#E7F5F2]" iconColor="text-[#0F766E]" />
        <StatCard title="Total Beds"     value={totalBeds}     subtitle="Total capacity"      icon={<BedDouble size={20}/>} iconBg="bg-[#EEF2FF]" iconColor="text-[#5367B8]" />
        <StatCard title="Occupied Beds"  value={totalOccupied} subtitle={`${totalBeds > 0 ? Math.round(totalOccupied/totalBeds*100) : 0}% occupancy`} icon={<Users size={20}/>} iconBg="bg-[#FFF3E8]" iconColor="text-[#C87924]" />
        <StatCard title="Available Beds" value={totalAvail}    subtitle="Ready for admission" icon={<Activity size={20}/>} iconBg="bg-[#ECFDF5]" iconColor="text-[#0F766E]" />
      </div>

      <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-[380px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA49F]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ward name, department, ID…"
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2.5 pl-10 pr-4 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white" />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs font-medium text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]">
              <option>All Departments</option><option>Cardiology</option><option>Neurology</option>
              <option>Orthopedics</option><option>Pediatrics</option><option>Critical Care</option>
              <option>Emergency</option><option>General Medicine</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs font-medium text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]">
              <option>All Ward Types</option><option>General</option><option>Private</option>
              <option>Pediatric</option><option>Critical Care</option><option>Emergency</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((ward) => <WardCard key={ward.id} ward={ward} />)}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-[#87938E]">No wards match your filters.</div>
        )}
      </div>

      <div className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-[#E3E0D7] bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center dark:border-white/10 dark:bg-[#18211E]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]"><ShieldCheck size={17} /></div>
          <div>
            <p className="text-xs font-bold text-[#17201D] dark:text-white">Live Bed Tracking</p>
            <p className="mt-0.5 text-[10px] text-[#87938E]">Bed counts update in real time when admissions are created or discharged.</p>
          </div>
        </div>
        <span className="rounded-full bg-[#ECFDF5] px-3 py-1.5 text-[9px] font-bold text-[#0F766E]">{totalAvail} Beds Available Now</span>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, iconBg, iconColor }) {
  return (
    <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#18211E]">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>{icon}</div>
      <p className="mt-5 text-xs font-medium text-[#87938E]">{title}</p>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-2xl font-bold text-[#17201D] dark:text-white">{value}</p>
        <span className="mb-1 text-[9px] font-semibold text-[#87938E]">{subtitle}</span>
      </div>
    </div>
  );
}

function WardCard({ ward }) {
  const { occupancy, availableBeds, wardStatus } = ward;
  const barColor = occupancy >= 90 ? "bg-[#C84B4B]" : occupancy >= 75 ? "bg-amber-500" : "bg-[#0F766E]";
  const pctColor = occupancy >= 90 ? "text-[#C84B4B]" : occupancy >= 75 ? "text-amber-600" : "text-[#0F766E]";

  return (
    <div className="group rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#18211E]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]"><Building2 size={20} /></div>
          <div>
            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">{ward.name}</h2>
            <p className="mt-0.5 text-[9px] text-[#A1AAA6]">{ward.id}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${WARD_STATUS_STYLES[wardStatus] || "bg-gray-100 text-gray-600"}`}>{wardStatus}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[9px] font-semibold text-[#66736D] dark:bg-white/5 dark:text-[#AAB6B0]">{ward.department}</span>
        <span className="rounded-full bg-[#E7F5F2] px-2.5 py-1 text-[9px] font-semibold text-[#0F766E]">{ward.floor}</span>
        <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[9px] font-semibold text-[#5367B8]">{ward.type}</span>
      </div>

      <div className="mt-5 rounded-xl bg-[#FAFAF7] p-4 dark:bg-[#202B27]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BedDouble size={16} className="text-[#0F766E]" />
            <span className="text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">Bed Occupancy</span>
          </div>
          <span className={`text-xs font-bold ${pctColor}`}>{occupancy}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E7E8E3] dark:bg-white/10">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${occupancy}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-3 text-center text-xs">
          <div><p className="text-[9px] text-[#9AA49F]">Occupied</p><p className="mt-0.5 font-bold text-[#17201D] dark:text-white">{ward.occupiedBeds}</p></div>
          <div><p className="text-[9px] text-[#9AA49F]">Available</p><p className={`mt-0.5 font-bold ${availableBeds > 0 ? "text-[#0F766E]" : "text-[#C84B4B]"}`}>{availableBeds}</p></div>
          <div><p className="text-[9px] text-[#9AA49F]">Total</p><p className="mt-0.5 font-bold text-[#17201D] dark:text-white">{ward.totalBeds}</p></div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#EEECE5] bg-[#FAFAF7] px-3 py-3 dark:border-white/10 dark:bg-[#202B27]">
          <div className="flex items-center gap-1.5 text-[#0F766E]"><Users size={13}/><span className="text-[9px] text-[#87938E]">Patients</span></div>
          <p className="mt-1 text-base font-bold text-[#17201D] dark:text-white">{ward.occupiedBeds}</p>
        </div>
        <div className="rounded-xl border border-[#EEECE5] bg-[#FAFAF7] px-3 py-3 dark:border-white/10 dark:bg-[#202B27]">
          <div className="flex items-center gap-1.5 text-[#0F766E]"><UserRound size={13}/><span className="text-[9px] text-[#87938E]">Nurses</span></div>
          <p className="mt-1 text-base font-bold text-[#17201D] dark:text-white">{ward.nurses}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF] text-[#5367B8]"><UserRound size={15} /></div>
        <div>
          <p className="text-[9px] text-[#9AA49F]">Head Nurse</p>
          <p className="mt-0.5 text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">{ward.headNurse}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#EEECE5] pt-4 dark:border-white/10">
        <Link
          href={availableBeds > 0 ? `/admissions/new?wardId=${ward.id}&wardName=${encodeURIComponent(ward.name)}` : "#"}
          onClick={(e) => availableBeds === 0 && e.preventDefault()}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold transition ${availableBeds > 0 ? "bg-[#0F766E] text-white hover:bg-[#0B625C]" : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-white/30"}`}
        >
          <UserPlus size={13} />
          {availableBeds > 0 ? `Admit Patient (${availableBeds} free)` : "No Beds Available"}
        </Link>
        <Link href={`/wards/${ward.id}`} className="flex items-center gap-1 text-[10px] font-bold text-[#0F766E] transition hover:gap-2">
          Details <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}
