"use client";

import {
  Bell,
  ChevronDown,
  FlaskConical,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  UserCog,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { useRole } from "../../hooks/usePermission";
import { ALL_ROLES, ROLE_META } from "../../utils/constant";
import { useAuth } from "../../context/AuthContext";

// ---------------------------------------------------------------------------
// Dev Role Switcher
// ---------------------------------------------------------------------------
function DevRoleSwitcher() {
  const { activeRole, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const meta = ROLE_META[activeRole] ?? { label: activeRole, color: "#0F766E", bgColor: "#0F766E1A" };

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">

      {/* Trigger pill */}
      <button
        id="dev-role-switcher-btn"
        onClick={() => setOpen((v) => !v)}
        title="Dev Role Switcher — switch active role for testing"
        className="
          flex items-center gap-1.5
          rounded-xl border px-3 py-1.5
          text-xs font-semibold
          transition-all duration-150
          hover:opacity-90 active:scale-95
        "
        style={{
          borderColor: meta.color + "55",
          backgroundColor: meta.bgColor,
          color: meta.color,
        }}
      >
        {/* Blinking dot — signals "dev mode" */}
        <span
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ backgroundColor: meta.color }}
        />

        <span className="hidden sm:inline">{meta.label}</span>

        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          style={{ color: meta.color }}
        />
      </button>


      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 top-11 z-50
            w-56 overflow-hidden
            rounded-2xl border border-[#DDD9CE]
            bg-white shadow-2xl

            dark:border-white/10
            dark:bg-[#1C2723]
          "
        >
          {/* Header */}
          <div className="border-b border-[#EEECE5] px-4 py-3 dark:border-white/10">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#91A19A]">
              <FlaskConical size={10} />
              Dev Role Switcher
            </p>
            <p className="mt-0.5 text-[10px] text-[#B0BBB5] dark:text-[#71817B]">
              For testing only — not real auth
            </p>
          </div>

          {/* Role list */}
          <div className="p-1.5">
            {ALL_ROLES.map((role) => {
              const m = ROLE_META[role];
              const isActive = role === activeRole;

              return (
                <button
                  key={role}
                  id={`role-switch-${role.toLowerCase().replace(/\s/g, "-")}`}
                  onClick={() => {
                    setRole(role);
                    setOpen(false);
                  }}
                  className={`
                    flex w-full items-center gap-3 rounded-xl px-3 py-2.5
                    text-left text-xs font-medium
                    transition-all
                    ${isActive
                      ? "bg-[#F7F4ED] dark:bg-white/[0.06]"
                      : "hover:bg-[#F7F4ED] dark:hover:bg-white/[0.04]"
                    }
                  `}
                >
                  {/* Color swatch */}
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: m.bgColor }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className="font-semibold"
                      style={{ color: isActive ? m.color : undefined }}
                    >
                      {m.label}
                    </p>
                    <p className="truncate text-[10px] text-[#91A19A]">
                      {m.description}
                    </p>
                  </div>

                  {/* Active check */}
                  {isActive && (
                    <ShieldCheck
                      size={13}
                      style={{ color: m.color, flexShrink: 0 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
export default function Navbar({ onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();

  const { theme, toggleTheme } = useTheme();
  const { activeRole } = useRole();
  const { logout } = useAuth();
  const meta = ROLE_META[activeRole] ?? { label: activeRole };

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-[#E5E2D9] bg-white/95 px-4 backdrop-blur md:px-6 dark:border-white/10 dark:bg-[#17201D]/95">

      {/* =====================================================
          LEFT
      ====================================================== */}

      <div className="flex items-center gap-3">

        {/* Mobile Menu */}

        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] lg:hidden dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20"
        >
          <Menu size={20} />
        </button>


        {/* Search */}

        <div className="relative hidden w-[280px] md:block lg:w-[340px]">

          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9691]"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="
              w-full rounded-xl
              border border-[#E3E0D7]
              bg-[#FAFAF7]
              py-2.5 pl-11 pr-4
              text-sm text-[#17201D]
              outline-none
              placeholder:text-[#9AA49F]
              focus:border-[#0F766E]
              focus:ring-4
              focus:ring-[#0F766E]/10

              dark:border-white/10
              dark:bg-[#202B27]
              dark:text-white
              dark:placeholder:text-[#71817B]
            "
          />

        </div>

      </div>


      {/* =====================================================
          RIGHT
      ====================================================== */}

      <div className="flex items-center gap-2 sm:gap-3">

        {/* Mobile Search */}

        <button
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl text-[#64746E]
            hover:bg-[#F1F3EF]
            hover:text-[#0F766E]
            md:hidden

            dark:text-[#AAB6B0]
            dark:hover:bg-white/10
          "
        >
          <Search size={19} />
        </button>


        {/* =================================================
            DEV ROLE SWITCHER
        ================================================== */}

        <DevRoleSwitcher />


        {/* Divider */}

        <div className="mx-0.5 hidden h-8 w-px bg-[#E5E2D9] sm:block dark:bg-white/10" />


        {/* =================================================
            THEME TOGGLE
        ================================================== */}

        <button
          onClick={toggleTheme}
          title={
            theme === "light"
              ? "Switch to dark mode"
              : "Switch to light mode"
          }
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl text-[#64746E]
            transition
            hover:bg-[#E7F5F2]
            hover:text-[#0F766E]

            dark:text-[#AAB6B0]
            dark:hover:bg-[#0F766E]/20
            dark:hover:text-[#5EEAD4]
          "
        >
          {theme === "light" ? (
            <Moon size={19} />
          ) : (
            <Sun size={19} />
          )}
        </button>


        {/* =================================================
            NOTIFICATION
        ================================================== */}

        <button
          className="
            relative flex h-10 w-10
            items-center justify-center
            rounded-xl text-[#64746E]
            transition
            hover:bg-[#E7F5F2]
            hover:text-[#0F766E]

            dark:text-[#AAB6B0]
            dark:hover:bg-[#0F766E]/20
            dark:hover:text-[#5EEAD4]
          "
        >
          <Bell size={19} />

          <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-[#D95C4F] ring-2 ring-white dark:ring-[#17201D]" />
        </button>


        {/* =================================================
            SETTINGS
        ================================================== */}

        <button
          className="
            hidden h-10 w-10
            items-center justify-center
            rounded-xl text-[#64746E]
            transition
            hover:bg-[#E7F5F2]
            hover:text-[#0F766E]
            sm:flex

            dark:text-[#AAB6B0]
            dark:hover:bg-[#0F766E]/20
            dark:hover:text-[#5EEAD4]
          "
        >
          <Settings size={18} />
        </button>


        {/* Divider */}

        <div className="mx-1 hidden h-8 w-px bg-[#E5E2D9] sm:block dark:bg-white/10" />


        {/* =================================================
            PROFILE
        ================================================== */}

        <div ref={profileRef} className="relative">

          <button
            id="navbar-profile-btn"
            onClick={() =>
              setProfileOpen(!profileOpen)
            }
            className="
              flex items-center gap-2
              rounded-xl p-1.5
              transition
              hover:bg-[#F4F3EE]

              dark:hover:bg-white/10
            "
          >

            {/* Avatar */}

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F766E] text-xs font-bold text-white">
              {(meta.label ?? "SA")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>


            {/* User Info */}

            <div className="hidden text-left lg:block">

              <p className="text-xs font-bold text-[#17201D] dark:text-white">
                {meta.label}
              </p>

              <p className="text-[10px] text-[#7B8882] dark:text-[#87938E]">
                {meta.description}
              </p>

            </div>


            {/* Arrow */}

            <ChevronDown
              size={15}
              className={`
                hidden
                text-[#7B8882]
                transition-transform
                lg:block

                dark:text-[#87938E]

                ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />

          </button>


          {/* =================================================
              PROFILE DROPDOWN
          ================================================== */}

          {profileOpen && (
            <div
              className="
                absolute right-0 top-12
                w-52 overflow-hidden
                rounded-2xl
                border border-[#DDD9CE]
                bg-white
                p-2
                shadow-xl

                dark:border-white/10
                dark:bg-[#202B27]
              "
            >

              {/* User */}

              <div className="border-b border-[#EEECE5] px-3 py-3 dark:border-white/10">

                <p className="text-sm font-bold text-[#17201D] dark:text-white">
                  {meta.label}
                </p>

                <p className="mt-0.5 text-xs text-[#7B8882] dark:text-[#87938E]">
                  {meta.description}
                </p>

                {/* Role pill in dropdown */}
                <span
                  className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: (ROLE_META[activeRole]?.bgColor ?? "#0F766E1A"),
                    color: (ROLE_META[activeRole]?.color ?? "#0F766E"),
                  }}
                >
                  {activeRole}
                </span>

              </div>


              {/* Profile */}
              <Link
                href="/profile"
                onClick={() => setProfileOpen(false)}
                className="
                  mt-1 flex w-full items-center gap-2
                  rounded-xl px-3 py-2.5
                  text-left text-sm
                  text-[#52615B]
                  hover:bg-[#E7F5F2]
                  hover:text-[#0F766E]
                  dark:text-[#AAB6B0]
                  dark:hover:bg-[#0F766E]/20
                  dark:hover:text-[#5EEAD4]
                "
              >
                <UserCog size={14} />
                My Profile
              </Link>

              {/* Settings */}
              <Link
                href="/settings"
                onClick={() => setProfileOpen(false)}
                className="
                  flex w-full items-center gap-2
                  rounded-xl px-3 py-2.5
                  text-left text-sm
                  text-[#52615B]
                  hover:bg-[#E7F5F2]
                  hover:text-[#0F766E]
                  dark:text-[#AAB6B0]
                  dark:hover:bg-[#0F766E]/20
                  dark:hover:text-[#5EEAD4]
                "
              >
                <Settings size={14} />
                Settings
              </Link>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                  router.push("/login");
                }}
                className="
                  flex w-full items-center gap-2
                  rounded-xl px-3 py-2.5
                  text-left text-sm
                  text-red-600
                  hover:bg-red-50
                  dark:text-red-400
                  dark:hover:bg-red-500/10
                "
              >
                <LogOut size={14} />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}