"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BedDouble,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock3,
  Edit3,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

const ward = {
  id: "WRD-001",
  name: "Cardiology Ward A",
  department: "Cardiology",
  floor: "2nd Floor",
  type: "General",
  status: "Operational",
  totalBeds: 42,
  occupiedBeds: 28,
  availableBeds: 14,
  nurses: 12,
  patients: 28,
  headNurse: "Anjali Verma",
  description:
    "Cardiology Ward A provides specialized inpatient care for patients with cardiovascular conditions and post-cardiac procedures.",
  facilities: [
    "Cardiac Monitoring",
    "Oxygen Support",
    "Emergency Equipment",
    "Nurse Station",
    "Patient Monitoring",
    "24/7 Nursing Care",
  ],
};

export default function WardDetailsPage() {
  const occupancy = Math.round(
    (ward.occupiedBeds / ward.totalBeds) * 100
  );

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">

      {/* ================= HEADER ================= */}

      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>

          <div className="flex items-center gap-2 text-xs text-[#87938E]">

            <Link
              href="/wards"
              className="hover:text-[#0F766E]"
            >
              Wards
            </Link>

            <ChevronRight size={13} />

            <span className="text-[#0F766E]">
              {ward.id}
            </span>

          </div>

          <div className="mt-2 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
              <Building2 size={22} />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">
                {ward.name}
              </h1>

              <p className="mt-1 text-sm text-[#7B8882]">
                {ward.department} • {ward.floor}
              </p>

            </div>

          </div>

        </div>


        <div className="flex flex-wrap gap-2">

          <Link
            href="/wards"
            className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] bg-white px-4 py-2.5 text-sm font-semibold text-[#52615B] hover:bg-[#F4F3EE] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <Link
            href={`/wards/${ward.id}/edit`}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B625C]"
          >
            <Edit3 size={16} />
            Edit Ward
          </Link>

        </div>

      </div>


      {/* ================= TOP STATS ================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Stat
          title="Total Beds"
          value={ward.totalBeds}
          icon={<BedDouble size={19} />}
        />

        <Stat
          title="Occupied Beds"
          value={ward.occupiedBeds}
          icon={<Users size={19} />}
        />

        <Stat
          title="Available Beds"
          value={ward.availableBeds}
          icon={<Activity size={19} />}
        />

        <Stat
          title="Assigned Nurses"
          value={ward.nurses}
          icon={<UserRound size={19} />}
        />

      </div>


      {/* ================= MAIN CONTENT ================= */}

      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        {/* LEFT */}

        <div className="space-y-6 xl:col-span-2">

          {/* Bed Occupancy */}

          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
                  Bed Occupancy
                </h2>

                <p className="mt-1 text-[10px] text-[#87938E]">
                  Current ward bed utilization
                </p>
              </div>

              <span className="rounded-full bg-[#ECFDF5] px-3 py-1.5 text-[10px] font-bold text-[#0F766E]">
                {occupancy}% Occupied
              </span>

            </div>


            <div className="mt-6">

              <div className="h-3 overflow-hidden rounded-full bg-[#EEF0EC] dark:bg-white/10">

                <div
                  className="h-full rounded-full bg-[#0F766E]"
                  style={{
                    width: `${occupancy}%`,
                  }}
                />

              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">

                <BedStat
                  label="Occupied"
                  value={ward.occupiedBeds}
                />

                <BedStat
                  label="Available"
                  value={ward.availableBeds}
                />

                <BedStat
                  label="Total Capacity"
                  value={ward.totalBeds}
                />

              </div>

            </div>

          </div>


          {/* Facilities */}

          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              Ward Facilities
            </h2>

            <p className="mt-1 text-[10px] text-[#87938E]">
              Available facilities and services
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

              {ward.facilities.map((facility) => (

                <div
                  key={facility}
                  className="flex items-center gap-3 rounded-xl bg-[#FAFAF7] px-4 py-3 dark:bg-[#202B27]"
                >

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7F5F2] text-[#0F766E]">
                    <ShieldCheck size={15} />
                  </div>

                  <span className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
                    {facility}
                  </span>

                </div>

              ))}

            </div>

          </div>


          {/* Description */}

          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              About This Ward
            </h2>

            <p className="mt-3 text-xs leading-6 text-[#7B8882] dark:text-[#AAB6B0]">
              {ward.description}
            </p>

          </div>

        </div>


        {/* RIGHT */}

        <div className="space-y-6">

          {/* Ward Information */}

          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              Ward Information
            </h2>

            <div className="mt-5 space-y-4">

              <Info
                icon={<Building2 size={15} />}
                label="Department"
                value={ward.department}
              />

              <Info
                icon={<Building2 size={15} />}
                label="Floor"
                value={ward.floor}
              />

              <Info
                icon={<BedDouble size={15} />}
                label="Ward Type"
                value={ward.type}
              />

              <Info
                icon={<Activity size={15} />}
                label="Status"
                value={ward.status}
                status
              />

              <Info
                icon={<CalendarDays size={15} />}
                label="Ward ID"
                value={ward.id}
              />

            </div>

          </div>


          {/* Head Nurse */}

          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              Head Nurse
            </h2>

            <div className="mt-4 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF2FF] text-[#5367B8]">
                <UserRound size={19} />
              </div>

              <div>

                <p className="text-xs font-bold text-[#17201D] dark:text-white">
                  {ward.headNurse}
                </p>

                <p className="mt-1 text-[10px] text-[#87938E]">
                  Ward Supervisor
                </p>

              </div>

            </div>

            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E3E0D7] py-2.5 text-xs font-semibold text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
              <UserRound size={14} />
              View Staff
            </button>

          </div>


          {/* Current Patients */}

          <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
                  Current Patients
                </h2>

                <p className="mt-1 text-[10px] text-[#87938E]">
                  Patients in this ward
                </p>

              </div>

              <Users
                size={18}
                className="text-[#0F766E]"
              />

            </div>

            <p className="mt-5 text-3xl font-bold text-[#17201D] dark:text-white">
              {ward.patients}
            </p>

            <p className="mt-1 text-[10px] text-[#87938E]">
              Active admitted patients
            </p>

            <Link
              href="/patients"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E7F5F2] py-2.5 text-xs font-bold text-[#0F766E] hover:bg-[#D9EFEB]"
            >
              View Patients
              <ChevronRight size={14} />
            </Link>

          </div>

        </div>

      </div>


      {/* Footer */}

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#E3E0D7] bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
          <ShieldCheck size={17} />
        </div>

        <div>

          <p className="text-xs font-bold text-[#17201D] dark:text-white">
            Ward Status
          </p>

          <p className="mt-0.5 text-[10px] text-[#87938E]">
            {ward.name} is currently operational and being monitored.
          </p>

        </div>

      </div>

    </div>
  );
}


/* ================= STAT ================= */

function Stat({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
        {icon}
      </div>

      <p className="mt-4 text-xs text-[#87938E]">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">
        {value}
      </p>

    </div>
  );
}


/* ================= BED STAT ================= */

function BedStat({ label, value }) {
  return (
    <div className="rounded-xl bg-[#FAFAF7] p-4 dark:bg-[#202B27]">

      <p className="text-[9px] text-[#9AA49F]">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-[#17201D] dark:text-white">
        {value}
      </p>

    </div>
  );
}


/* ================= INFO ================= */

function Info({
  icon,
  label,
  value,
  status = false,
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F3EF] text-[#0F766E] dark:bg-white/5">
          {icon}
        </div>

        <span className="text-[10px] text-[#87938E]">
          {label}
        </span>

      </div>

      {status ? (
        <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[9px] font-bold text-[#0F766E]">
          {value}
        </span>
      ) : (
        <span className="text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
          {value}
        </span>
      )}

    </div>
  );
}