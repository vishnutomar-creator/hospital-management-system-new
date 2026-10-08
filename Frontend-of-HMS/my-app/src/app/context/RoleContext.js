"use client";

/**
 * MediCare HMS — RoleContext
 *
 * Manages the "active role" for dev/testing purposes.
 * Stored in localStorage under `hms_dev_role` so it survives page refreshes.
 *
 * This is completely separate from AuthContext (real auth).
 * When real auth is wired up, replace `activeRole` here with the role
 * field from the JWT / user profile — all downstream consumers
 * (usePermission, Sidebar, PermissionGuard) will just work.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { ROLES } from "../utils/constant";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const RoleContext = createContext(null);

const STORAGE_KEY = "hms_dev_role";
const DEFAULT_ROLE = ROLES.SUPER_ADMIN;

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function RoleProvider({ children }) {
  const [activeRole, setActiveRoleState] = useState(DEFAULT_ROLE);
  const [hydrated, setHydrated] = useState(false);

  // Restore role from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allRoles = Object.values(ROLES);

      if (stored && allRoles.includes(stored)) {
        setActiveRoleState(stored);
      }
    } catch {
      // localStorage unavailable (SSR or private browsing edge case)
    } finally {
      setHydrated(true);
    }
  }, []);

  /** Switch the active role and persist the choice. */
  const setRole = useCallback((newRole) => {
    const allRoles = Object.values(ROLES);

    if (!allRoles.includes(newRole)) {
      console.warn(`[RoleContext] Unknown role: "${newRole}". Ignoring.`);
      return;
    }

    setActiveRoleState(newRole);

    try {
      localStorage.setItem(STORAGE_KEY, newRole);
    } catch {
      // ignore storage errors
    }
  }, []);

  /** Reset to the default SuperAdmin role. */
  const resetRole = useCallback(() => {
    setRole(DEFAULT_ROLE);
  }, [setRole]);

  return (
    <RoleContext.Provider
      value={{
        activeRole,
        setRole,
        resetRole,
        hydrated,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// useRoleContext — internal hook (use useRole from hooks/usePermission.js
// for a cleaner public API)
// ---------------------------------------------------------------------------
export function useRoleContext() {
  const ctx = useContext(RoleContext);

  if (!ctx) {
    throw new Error("useRoleContext must be used inside <RoleProvider>");
  }

  return ctx;
}
