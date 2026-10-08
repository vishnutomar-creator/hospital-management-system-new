"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

const labelMap = {
  dashboard: "Dashboard",
  patients: "Patients",
  appointments: "Appointments",
  doctors: "Doctors",
  nurses: "Nurses",
  departments: "Departments",
  queue: "Queue",
  "medical-records": "Medical Records",
  prescriptions: "Prescriptions",
  admissions: "Admissions",
  wards: "Wards",
  beds: "Beds",
  laboratory: "Laboratory",
  radiology: "Radiology",
  pharmacy: "Pharmacy",
  inventory: "Inventory",
  suppliers: "Suppliers",
  "purchase-orders": "Purchase Orders",
  billing: "Billing",
  payments: "Payments",
  insurance: "Insurance",
  finance: "Finance",
  hr: "HR",
  assets: "Assets",
  reports: "Reports",
  notifications: "Notifications",
  "audit-logs": "Audit Logs",
  profile: "Profile",
  settings: "Settings",
  users: "Users",
  roles: "Roles",
  permissions: "Permissions",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav className="mb-5 flex items-center gap-1.5 overflow-x-auto text-sm">

      <Link
        href="/dashboard"
        className="flex shrink-0 items-center gap-1.5 text-[#87938E] transition hover:text-[#0F766E]"
      >
        <Home size={15} />
        <span>Home</span>
      </Link>


      {segments.map((segment, index) => {

        const href =
          "/" + segments.slice(0, index + 1).join("/");

        const isLast = index === segments.length - 1;

        const label =
          labelMap[segment] ||
          segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) =>
              char.toUpperCase()
            );

        return (
          <div
            key={href}
            className="flex shrink-0 items-center gap-1.5"
          >

            <ChevronRight
              size={14}
              className="text-[#B4BBB7]"
            />

            {isLast ? (
              <span className="font-semibold text-[#17201D] dark:text-white">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-[#87938E] transition hover:text-[#0F766E] dark:hover:text-[#5EEAD4]"
              >
                {label}
              </Link>
            )}

          </div>
        );
      })}

    </nav>
  );
}