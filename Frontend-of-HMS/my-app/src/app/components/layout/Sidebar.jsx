"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Ambulance,
  BedDouble,
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileBarChart,
  FileText,
  FlaskConical,
  Gauge,
  HeartPulse,
  Hospital,
  Landmark,
  LayoutDashboard,
  LogOut,
  Package,
  Pill,
  Receipt,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserCog,
  Users,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useRole } from "../../hooks/usePermission";
import { filterMenuGroups } from "../../utils/permission";
import { ROLE_META, SIDEBAR_GROUPS } from "../../utils/constant";

// ---------------------------------------------------------------------------
// Menu group definitions
// `title` values MUST match SIDEBAR_GROUPS constants (used for RBAC filtering)
// ---------------------------------------------------------------------------
const menuGroups = [
  {
    title: SIDEBAR_GROUPS.OVERVIEW,
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: SIDEBAR_GROUPS.PATIENT_CARE,
    items: [
      {
        label: "Patients",
        href: "/patients",
        icon: Users,
      },
      {
        label: "Appointments",
        href: "/appointments",
        icon: CalendarDays,
      },
      {
        label: "Queue",
        href: "/queue",
        icon: ClipboardList,
      },
      {
        label: "Admissions",
        href: "/admissions",
        icon: Ambulance,
      },
    ],
  },

  {
    title: SIDEBAR_GROUPS.CLINICAL,
    items: [
      {
        label: "Medical Records",
        href: "/medical-records",
        icon: FileText,
      },
      {
        label: "Prescriptions",
        href: "/prescriptions",
        icon: Pill,
      },
      {
        label: "Laboratory",
        href: "/laboratory",
        icon: FlaskConical,
      },
      {
        label: "Radiology",
        href: "/radiology",
        icon: Activity,
      },
    ],
  },

  {
    title: SIDEBAR_GROUPS.HOSPITAL_OPERATIONS,
    items: [
      {
        label: "Doctors",
        href: "/doctors",
        icon: Stethoscope,
      },
      {
        label: "Nurses",
        href: "/nurses",
        icon: HeartPulse,
      },
      {
        label: "Nursing Station",
        href: "/nursing",
        icon: ClipboardCheck,
      },
      {
        label: "Departments",
        href: "/departments",
        icon: Building2,
      },
      {
        label: "Wards",
        href: "/wards",
        icon: Hospital,
      },
      {
        label: "Beds",
        href: "/beds",
        icon: BedDouble,
      },
      {
        label: "Operation Theater",
        href: "/operation-theater",
        icon: Activity,
      },
      {
        label: "Surgeries",
        href: "/surgeries",
        icon: ClipboardList,
      },
    ],
  },

  {
    title: SIDEBAR_GROUPS.PHARMACY_INVENTORY,
    items: [
      {
        label: "Pharmacy",
        href: "/pharmacy",
        icon: Pill,
      },
      {
        label: "Inventory",
        href: "/inventory",
        icon: Package,
      },
      {
        label: "Suppliers",
        href: "/suppliers",
        icon: Building2,
      },
      {
        label: "Purchase Orders",
        href: "/purchase-orders",
        icon: Receipt,
      },
    ],
  },

  {
    title: SIDEBAR_GROUPS.FINANCE,
    items: [
      {
        label: "Billing",
        href: "/billing",
        icon: Receipt,
      },
      {
        label: "Payments",
        href: "/payments",
        icon: CreditCard,
      },
      {
        label: "Insurance",
        href: "/insurance",
        icon: ShieldCheck,
      },
      {
        label: "Finance",
        href: "/finance",
        icon: Wallet,
      },
    ],
  },

  {
    title: SIDEBAR_GROUPS.ADMINISTRATION,
    items: [
      {
        label: "HR",
        href: "/hr",
        icon: UserCog,
      },
      {
        label: "Assets",
        href: "/assets",
        icon: Wrench,
      },
      {
        label: "Reports",
        href: "/reports",
        icon: FileBarChart,
      },
    ],
  },

  {
    title: SIDEBAR_GROUPS.SYSTEM,
    items: [
      {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
      },
      {
        label: "Audit Logs",
        href: "/audit-logs",
        icon: ShieldCheck,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
export default function Sidebar({ mobile = false, onClose }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const { activeRole } = useRole();

  // Filter menu groups based on the active role
  const visibleGroups = filterMenuGroups(activeRole, menuGroups);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const [openGroups, setOpenGroups] = useState({
    [SIDEBAR_GROUPS.PATIENT_CARE]:        true,
    [SIDEBAR_GROUPS.CLINICAL]:            true,
    [SIDEBAR_GROUPS.HOSPITAL_OPERATIONS]: true,
    [SIDEBAR_GROUPS.PHARMACY_INVENTORY]:  false,
    [SIDEBAR_GROUPS.FINANCE]:             false,
    [SIDEBAR_GROUPS.ADMINISTRATION]:      false,
    [SIDEBAR_GROUPS.SYSTEM]:              false,
  });

  const toggleGroup = (title) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const userInitials = (user?.name || "Super Admin")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleMeta = ROLE_META[activeRole] ?? {
    label: activeRole,
    color: "#0F766E",
    bgColor: "#0F766E1A",
  };

  return (
    <aside
      className={`
        flex h-full w-[270px] flex-col
        bg-[#17201D] text-white
        ${mobile ? "w-full" : ""}
      `}
    >
      {/* Logo */}

      <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-5">

        <Link href="/dashboard" className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E]">
            <Hospital size={22} />
          </div>

          <div>
            <p className="text-base font-bold tracking-wide">
              MediCare
            </p>

            <p className="text-[10px] text-[#91A19A]">
              HOSPITAL MANAGEMENT
            </p>
          </div>

        </Link>

        {mobile && (
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#91A19A] hover:bg-white/10 hover:text-white"
          >
            <X size={19} />
          </button>
        )}

      </div>


      {/* Navigation */}

      <div className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

        {visibleGroups.map((group) => {
          const isOverview = group.title === SIDEBAR_GROUPS.OVERVIEW;

          return (
            <div key={group.title} className="mb-5">

              {!isOverview && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="mb-2 flex w-full items-center justify-between px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#71817B]"
                >
                  <span>{group.title}</span>

                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      openGroups[group.title]
                        ? "rotate-0"
                        : "-rotate-90"
                    }`}
                  />
                </button>
              )}

              {(isOverview || openGroups[group.title]) && (
                <div className="space-y-1">

                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={mobile ? onClose : undefined}
                        className={`
                          group flex items-center gap-3 rounded-xl
                          px-3 py-2.5 text-sm font-medium
                          transition-all
                          ${
                            active
                              ? "bg-[#0F766E] text-white shadow-lg shadow-black/10"
                              : "text-[#AAB6B0] hover:bg-white/[0.06] hover:text-white"
                          }
                        `}
                      >
                        <Icon
                          size={18}
                          className={
                            active
                              ? "text-white"
                              : "text-[#7F8E87] group-hover:text-[#5EEAD4]"
                          }
                        />

                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                </div>
              )}

            </div>
          );
        })}

      </div>


      {/* Bottom User */}

      <div className="border-t border-white/10 p-3">

        <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F766E] text-sm font-bold">
            {userInitials}
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-white">
              {user?.name || "Super Admin"}
            </p>

            {/* Role badge */}
            <span
              className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                backgroundColor: roleMeta.bgColor,
                color: roleMeta.color,
              }}
            >
              {roleMeta.label}
            </span>

          </div>

        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#9AA7A1] transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={17} />
          Logout
        </button>

      </div>

    </aside>
  );
}