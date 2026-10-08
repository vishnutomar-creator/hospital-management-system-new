"use client";

import Link from "next/link";
import {
  Users,
  CalendarDays,
  Receipt,
  Package,
  UserCog,
  ArrowRight,
} from "lucide-react";

const reports = [
  { title: "Patient Reports", description: "Admissions, discharges, and demographics", href: "/reports/patients", icon: Users, stat: "Updated daily" },
  { title: "Appointment Reports", description: "Scheduled, completed, and no-show trends", href: "/reports/appointments", icon: CalendarDays, stat: "Updated daily" },
  { title: "Financial Reports", description: "Revenue, billing, and outstanding dues", href: "/reports/finance", icon: Receipt, stat: "Updated weekly" },
  { title: "Inventory Reports", description: "Stock levels, expiries, and reorders", href: "/reports/inventory", icon: Package, stat: "Updated weekly" },
  { title: "Staff Reports", description: "Attendance, leaves, and payroll summaries", href: "/reports/staff", icon: UserCog, stat: "Updated monthly" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Reports</h1>
        <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Generate and review reports across the hospital</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <Link
              key={r.href}
              href={r.href}
              className="group flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white p-5 transition hover:border-[#0F766E] hover:shadow-lg hover:shadow-black/5 dark:border-white/10 dark:bg-[#17201D] dark:hover:border-[#0F766E]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                    <Icon size={20} />
                  </div>
                  <ArrowRight size={17} className="text-[#B8BFBB] transition group-hover:translate-x-0.5 group-hover:text-[#0F766E] dark:group-hover:text-[#5EEAD4]" />
                </div>
                <h2 className="mt-4 text-base font-bold text-[#17201D] dark:text-white">{r.title}</h2>
                <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">{r.description}</p>
              </div>
              <p className="mt-5 text-xs font-semibold text-[#0F766E] dark:text-[#5EEAD4]">{r.stat}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}