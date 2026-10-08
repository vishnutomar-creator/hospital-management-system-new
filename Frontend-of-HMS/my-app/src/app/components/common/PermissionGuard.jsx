"use client";

/**
 * MediCare HMS — PermissionGuard
 *
 * Renders children only when the active role has the required permission(s).
 * Supports a `fallback` prop for showing a disabled/locked state instead
 * of hiding the element entirely.
 *
 * Usage examples:
 *
 *   // Hide completely
 *   <PermissionGuard permission="patient.create">
 *     <CreatePatientButton />
 *   </PermissionGuard>
 *
 *   // Show disabled fallback
 *   <PermissionGuard
 *     permission="billing.delete"
 *     fallback={<button disabled className="opacity-40 cursor-not-allowed">Delete</button>}
 *   >
 *     <DeleteBillButton />
 *   </PermissionGuard>
 *
 *   // Require ALL of multiple permissions
 *   <PermissionGuard permissions={["lab.view", "lab.result.create"]} requireAll>
 *     <LabResultForm />
 *   </PermissionGuard>
 *
 *   // Require ANY of multiple permissions
 *   <PermissionGuard permissions={["billing.create", "billing.edit"]}>
 *     <BillForm />
 *   </PermissionGuard>
 */

import { useHasAllPermissions, useHasAnyPermission, usePermission } from "../../hooks/usePermission";

// ---------------------------------------------------------------------------
// PermissionGuard
// ---------------------------------------------------------------------------
/**
 * @param {object}         props
 * @param {string}         [props.permission]   - Single permission to check
 * @param {string[]}       [props.permissions]  - Multiple permissions (use with requireAll)
 * @param {boolean}        [props.requireAll]   - If true, ALL permissions must be held; default is ANY
 * @param {React.ReactNode}[props.fallback]     - Rendered when access is denied; null = hidden
 * @param {React.ReactNode} props.children
 */
export default function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}) {
  // Single-permission fast path
  const singlePerm = usePermission(permission ?? "__none__");
  const anyPerm    = useHasAnyPermission(permissions ?? []);
  const allPerm    = useHasAllPermissions(permissions ?? []);

  let granted = false;

  if (permission) {
    granted = singlePerm;
  } else if (permissions?.length) {
    granted = requireAll ? allPerm : anyPerm;
  } else {
    // No permission specified → always render (guard is a no-op)
    granted = true;
  }

  if (!granted) {
    return fallback;
  }

  return children;
}
