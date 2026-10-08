/**
 * MediCare HMS — Permission Utilities
 * Pure functions (no React). Safe to use in Server Components, middleware,
 * API route handlers, and client components alike.
 */

import {
  ROLE_PERMISSIONS,
  SIDEBAR_ACCESS,
  ROLES,
} from "./constant";

// ---------------------------------------------------------------------------
// hasPermission
// ---------------------------------------------------------------------------
/**
 * Check whether a given role has a specific permission.
 *
 * @param {string} role       - One of the ROLES values (e.g. "Doctor")
 * @param {string} permission - A permission string (e.g. "patient.create")
 * @returns {boolean}
 *
 * @example
 * hasPermission(ROLES.DOCTOR, PERMISSIONS.PRESCRIPTION_CREATE) // true
 * hasPermission(ROLES.PATIENT, PERMISSIONS.DIAGNOSIS_CREATE)   // false
 */
export function hasPermission(role, permission) {
  if (!role || !permission) return false;

  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;

  return perms.has(permission);
}

// ---------------------------------------------------------------------------
// hasAnyPermission
// ---------------------------------------------------------------------------
/**
 * Returns true if the role has AT LEAST ONE of the given permissions.
 *
 * @param {string}   role
 * @param {string[]} permissions
 * @returns {boolean}
 */
export function hasAnyPermission(role, permissions = []) {
  return permissions.some((p) => hasPermission(role, p));
}

// ---------------------------------------------------------------------------
// hasAllPermissions
// ---------------------------------------------------------------------------
/**
 * Returns true only if the role has ALL of the given permissions.
 *
 * @param {string}   role
 * @param {string[]} permissions
 * @returns {boolean}
 */
export function hasAllPermissions(role, permissions = []) {
  return permissions.every((p) => hasPermission(role, p));
}

// ---------------------------------------------------------------------------
// getPermissions
// ---------------------------------------------------------------------------
/**
 * Returns the full Set of permissions for a role.
 * Returns an empty Set for unknown roles.
 *
 * @param {string} role
 * @returns {Set<string>}
 */
export function getPermissions(role) {
  return ROLE_PERMISSIONS[role] ?? new Set();
}

// ---------------------------------------------------------------------------
// filterMenuGroups
// ---------------------------------------------------------------------------
/**
 * Filters a Sidebar menuGroups array to only the groups allowed for `role`.
 *
 * Each group must have a `title` property matching a SIDEBAR_GROUPS value.
 * Groups whose titles are not in the role's SIDEBAR_ACCESS list are removed.
 * Within each remaining group, items are kept as-is (item-level filtering
 * is handled at render time via usePermission / PermissionGuard).
 *
 * @param {string}   role        - Active role string
 * @param {object[]} menuGroups  - Array of { title, items[] } objects
 * @returns {object[]}           - Filtered array of groups
 *
 * @example
 * const visible = filterMenuGroups(ROLES.PHARMACIST, menuGroups);
 * // → [{ title: "Overview", ... }, { title: "Pharmacy & Inventory", ... }]
 */
export function filterMenuGroups(role, menuGroups) {
  const allowed = SIDEBAR_ACCESS[role];
  if (!allowed) return [];

  // SuperAdmin & Admin get everything; fast-path without Set construction
  if (allowed.length === Object.values(SIDEBAR_ACCESS[ROLES.SUPER_ADMIN]).length) {
    return menuGroups;
  }

  const allowedSet = new Set(allowed);
  return menuGroups.filter((group) => allowedSet.has(group.title));
}

// ---------------------------------------------------------------------------
// isSuperAdmin / isAdmin — convenience guards
// ---------------------------------------------------------------------------
export const isSuperAdmin = (role) => role === ROLES.SUPER_ADMIN;
export const isAdmin      = (role) => role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
