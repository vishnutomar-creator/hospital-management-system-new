"use client";

import Link from "next/link";
import {
  BedDouble,
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  HeartPulse,
  Hospital,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F4ED] text-[#17201D]">

      {/* ================= NAVBAR ================= */}

      <nav className="border-b border-[#E5E2D9] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Logo */}

          <Link href="/" className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E] text-white shadow-sm">
              <Hospital size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                MediCare
              </h1>

              <p className="text-[9px] font-semibold tracking-[0.16em] text-[#7B8882]">
                HOSPITAL MANAGEMENT
              </p>
            </div>

          </Link>


          {/* Navigation */}

          <div className="hidden items-center gap-8 md:flex">

            <a
              href="#features"
              className="text-sm font-medium text-[#64746E] hover:text-[#0F766E]"
            >
              Features
            </a>

            <a
              href="#modules"
              className="text-sm font-medium text-[#64746E] hover:text-[#0F766E]"
            >
              Modules
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-[#64746E] hover:text-[#0F766E]"
            >
              About
            </a>

          </div>


          {/* Auth */}

          <div className="flex items-center gap-2">

            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] sm:block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B625C]"
            >
              Get Started
            </Link>

          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden">

        {/* Background decoration */}

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#B8DDD6]/30 blur-3xl" />

        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#DDE9E5]/50 blur-3xl" />


        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-20">

          {/* Left */}

          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#B8DDD6] bg-white px-3 py-1.5">

              <span className="h-2 w-2 rounded-full bg-[#0F766E]" />

              <span className="text-xs font-semibold text-[#0F766E]">
                Smart Hospital Management
              </span>

            </div>


            <h2 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-[#17201D] sm:text-5xl lg:text-6xl">

              One Platform.

              <span className="block text-[#0F766E]">
                Complete Hospital Care.
              </span>

            </h2>


            <p className="mt-6 max-w-xl text-base leading-7 text-[#64746E] sm:text-lg">
              Manage patients, doctors, appointments, clinical records,
              pharmacy, billing, laboratory and hospital operations from
              one powerful platform.
            </p>


            {/* Buttons */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0F766E]/20 transition hover:-translate-y-0.5 hover:bg-[#0B625C]"
              >
                Access Dashboard

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />

              </Link>


              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl border border-[#D7D3C9] bg-white px-6 py-3.5 text-sm font-bold text-[#52615B] transition hover:border-[#0F766E] hover:text-[#0F766E]"
              >
                Create Account
              </Link>

            </div>


            {/* Trust */}

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">

              <TrustItem text="Secure Data" />

              <TrustItem text="Role Based Access" />

              <TrustItem text="Real-time Operations" />

            </div>

          </div>


          {/* Right Dashboard Preview */}

          <div className="relative">

            {/* Main card */}

            <div className="relative rounded-3xl border border-[#DAD7CE] bg-white p-4 shadow-2xl shadow-[#17201D]/10 sm:p-5">

              {/* Fake header */}

              <div className="flex items-center justify-between border-b border-[#EEECE5] pb-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E7F5F2] text-[#0F766E]">
                    <HeartPulse size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-bold">
                      Hospital Overview
                    </p>

                    <p className="text-[9px] text-[#87938E]">
                      Today's activity
                    </p>
                  </div>

                </div>

                <div className="h-7 w-7 rounded-full bg-[#E7F5F2]" />

              </div>


              {/* Stats */}

              <div className="mt-5 grid grid-cols-2 gap-3">

                <MiniStat
                  icon={<Users size={17} />}
                  label="Patients"
                  value="12,540"
                />

                <MiniStat
                  icon={<CalendarDays size={17} />}
                  label="Appointments"
                  value="248"
                />

                <MiniStat
                  icon={<BedIcon />}
                  label="Beds Occupied"
                  value="78%"
                />

                <MiniStat
                  icon={<Stethoscope size={17} />}
                  label="Doctors"
                  value="126"
                />

              </div>


              {/* Chart */}

              <div className="mt-4 rounded-2xl bg-[#FAFAF7] p-4">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold">
                      Patient Activity
                    </p>

                    <p className="mt-1 text-[9px] text-[#87938E]">
                      Last 7 days
                    </p>
                  </div>

                  <span className="text-xs font-bold text-[#0F766E]">
                    +12.8%
                  </span>

                </div>


                <div className="mt-5 flex h-28 items-end gap-2">

                  {[45, 62, 52, 75, 68, 88, 58, 78, 92, 70].map(
                    (height, index) => (
                      <div
                        key={index}
                        className={`flex-1 rounded-t-md ${
                          index === 8
                            ? "bg-[#0F766E]"
                            : "bg-[#CDE5E0]"
                        }`}
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    )
                  )}

                </div>

              </div>


              {/* Appointment */}

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#E5E2D9] p-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F766E] text-[10px] font-bold text-white">
                  AS
                </div>

                <div className="flex-1">

                  <p className="text-[11px] font-bold">
                    Dr. Ankit Sharma
                  </p>

                  <p className="text-[9px] text-[#87938E]">
                    Cardiology • 10:30 AM
                  </p>

                </div>

                <span className="rounded-full bg-[#ECFDF5] px-2 py-1 text-[8px] font-bold text-[#0F766E]">
                  Confirmed
                </span>

              </div>

            </div>


            {/* Floating notification */}

            <div className="absolute -left-5 top-20 hidden rounded-2xl border border-[#DDD9CE] bg-white p-3 shadow-xl sm:block">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#0F766E]">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-bold">
                    System Healthy
                  </p>

                  <p className="text-[9px] text-[#87938E]">
                    All services operational
                  </p>
                </div>

              </div>

            </div>


            {/* Floating security */}

            <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-[#DDD9CE] bg-white p-3 shadow-xl sm:block">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2ECFA] text-[#7954A6]">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-bold">
                    Protected
                  </p>

                  <p className="text-[9px] text-[#87938E]">
                    Secure patient data
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section
        id="features"
        className="border-y border-[#E5E2D9] bg-white"
      >

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">

          <div className="max-w-2xl">

            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#0F766E]">
              Built for modern hospitals
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your hospital needs
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#64746E]">
              A centralized ERP platform designed to simplify
              healthcare operations and improve patient care.
            </p>

          </div>


          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              icon={<Users size={21} />}
              title="Patient Management"
              description="Registration, admissions, medical records and patient history."
            />

            <FeatureCard
              icon={<CalendarDays size={21} />}
              title="Appointments"
              description="Manage doctor schedules, appointments and patient queues."
            />

            <FeatureCard
              icon={<ShieldCheck size={21} />}
              title="Secure Access"
              description="Role-based permissions for administrators and hospital staff."
            />

            <FeatureCard
              icon={<Activity size={21} />}
              title="Real-time Insights"
              description="Monitor hospital performance through intelligent dashboards."
            />

          </div>

        </div>

      </section>


      {/* ================= MODULES ================= */}

      <section
        id="modules"
        className="bg-[#F7F4ED]"
      >

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">

          <div className="text-center">

            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#0F766E]">
              Complete ERP
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              One system for every department
            </h2>

          </div>


          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {[
              "Patient Management",
              "Doctor & Staff Management",
              "Appointments",
              "Clinical / EMR",
              "IPD & Ward Management",
              "Laboratory & Radiology",
              "Pharmacy & Inventory",
              "Billing & Payments",
              "Insurance Claims",
              "Finance & Accounting",
              "HR & Payroll",
              "Asset Management",
            ].map((module) => (
              <div
                key={module}
                className="flex items-center gap-3 rounded-xl border border-[#DDD9CE] bg-white p-4"
              >

                <CheckCircle2
                  size={17}
                  className="shrink-0 text-[#0F766E]"
                />

                <span className="text-sm font-semibold text-[#52615B]">
                  {module}
                </span>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section
        id="about"
        className="bg-[#17201D]"
      >

        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F766E] text-white">
            <Hospital size={24} />
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to modernize your hospital?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#AAB6B0]">
            Bring your hospital's clinical, administrative and
            financial operations together in one secure platform.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0B625C]"
          >
            Enter Hospital System
            <ArrowRight size={17} />
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="border-t border-[#E5E2D9] bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-[#87938E] sm:flex-row sm:px-8">

          <div className="flex items-center gap-2">

            <Hospital
              size={16}
              className="text-[#0F766E]"
            />

            <span>
              © {new Date().getFullYear()} MediCare HMS
            </span>

          </div>

          <span>
            Secure • Reliable • Connected
          </span>

        </div>

      </footer>

    </main>
  );
}


/* ============================================================
   COMPONENTS
============================================================ */

function TrustItem({ text }) {
  return (
    <div className="flex items-center gap-2">

      <CheckCircle2
        size={15}
        className="text-[#0F766E]"
      />

      <span className="text-xs font-medium text-[#64746E]">
        {text}
      </span>

    </div>
  );
}


function MiniStat({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-[#E5E2D9] bg-white p-3">

      <div className="flex items-center gap-2">

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E7F5F2] text-[#0F766E]">
          {icon}
        </div>

        <span className="text-[9px] font-medium text-[#87938E]">
          {label}
        </span>

      </div>

      <p className="mt-2 text-lg font-bold text-[#17201D]">
        {value}
      </p>

    </div>
  );
}


function BedIcon() {
  return (
    <BedDouble size={17} />
  );
}


function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-[#E3E0D7] bg-[#FAFAF7] p-5 transition hover:-translate-y-1 hover:border-[#B8DDD6] hover:bg-[#E7F5F2]">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E] transition group-hover:bg-[#0F766E] group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-bold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-[#87938E]">
        {description}
      </p>

    </div>
  );
}
