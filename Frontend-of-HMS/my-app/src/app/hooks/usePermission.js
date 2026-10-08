"use client";

/**
 * MediCare HMS — Permission Hooks
 *
 * Public hooks that components and pages should use.
 * All hooks read the active role from RoleContext so they automatically
 * react when the dev role-switcher changes roles.
 *
 * Usage:
 *   const canCreate = usePermission("patient.create");
 *   const { "lab.view": canViewLab, "lab.order.create": canOrderLab } = usePermissions(["lab.view", "lab.order.create"]);
 *   const { activeRole, setRole } = useRole();
 */

import { useMemo } from "react";
import { useRoleContext } from "../context/RoleContext";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "../utils/permission";

// ---------------------------------------------------------------------------
// useRole
// ---------------------------------------------------------------------------
/**
 * Returns the active role and the setter for switching roles.
 *
 * @returns {{ activeRole: string, setRole: (role: string) => void, resetRole: () => void }}
 */
export function useRole() {
  const { activeRole, setRole, resetRole, hydrated } = useRoleContext();
  return { activeRole, setRole, resetRole, hydrated };
}

// ---------------------------------------------------------------------------
// usePermission
// ---------------------------------------------------------------------------
/**
 * Check a SINGLE permission for the current active role.
 *
 * @param {string} permission - e.g. "patient.create"
 * @returns {boolean}
 *
 * @example
 * function CreatePatientButton() {
 *   const can = usePermission("patient.create");
 *   if (!can) return null;
 *   return <button>Add Patient</button>;
 * }
 */
export function usePermission(permission) {
  const { activeRole } = useRoleContext();

  return useMemo(
    () => hasPermission(activeRole, permission),
    [activeRole, permission]
  );
}

// ---------------------------------------------------------------------------
// usePermissions  (batch)
// ---------------------------------------------------------------------------
/**
 * Check MULTIPLE permissions at once.
 * Returns an object keyed by permission string → boolean.
 *
 * @param {string[]} permissions
 * @returns {Record<string, boolean>}
 *
 * @example
 * const perms = usePermissions(["billing.create", "billing.delete"]);
 * // { "billing.create": true, "billing.delete": false }
 */
export function usePermissions(permissions = []) {
  const { activeRole } = useRoleContext();

  return useMemo(() => {
    return Object.fromEntries(
      permissions.map((p) => [p, hasPermission(activeRole, p)])
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, permissions.join(",")]);
}

// ---------------------------------------------------------------------------
// useHasAnyPermission
// ---------------------------------------------------------------------------
/**
 * Returns true if the active role has AT LEAST ONE of the given permissions.
 *
 * @param {string[]} permissions
 * @returns {boolean}
 */
export function useHasAnyPermission(permissions = []) {
  const { activeRole } = useRoleContext();

  return useMemo(
    () => hasAnyPermission(activeRole, permissions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeRole, permissions.join(",")]
  );
}

// ---------------------------------------------------------------------------
// useHasAllPermissions
// ---------------------------------------------------------------------------
/**
 * Returns true only if the active role has ALL of the given permissions.
 *
 * @param {string[]} permissions
 * @returns {boolean}
 */
export function useHasAllPermissions(permissions = []) {
  const { activeRole } = useRoleContext();

  return useMemo(
    () => hasAllPermissions(activeRole, permissions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeRole, permissions.join(",")]
  );
}
