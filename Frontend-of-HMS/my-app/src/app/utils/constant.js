// =============================================================================
//  MediCare HMS — Role & Permission Constants
//  Single source of truth for RBAC. Import from here; never hardcode in pages.
// =============================================================================

// ---------------------------------------------------------------------------
// 1. ROLES
// ---------------------------------------------------------------------------
/** All system roles as a frozen constant — use these keys everywhere. */
export const ROLES = Object.freeze({
  SUPER_ADMIN:       "SuperAdmin",
  ADMIN:             "Admin",
  DOCTOR:            "Doctor",
  RECEPTIONIST:      "Receptionist",
  NURSE:             "Nurse",
  PHARMACIST:        "Pharmacist",
  BILLING_EXECUTIVE: "BillingExecutive",
  LAB_TECHNICIAN:    "LabTechnician",
  PATIENT:           "Patient",
});

/** Ordered list of all roles (used in the dev role-switcher dropdown). */
export const ALL_ROLES = Object.values(ROLES);

// ---------------------------------------------------------------------------
// 2. PERMISSIONS
//    Naming convention:  <resource>.<action>
//    Keep alphabetical within each resource group.
// ---------------------------------------------------------------------------
export const PERMISSIONS = Object.freeze({
  // ── Admissions ───────────────────────────────────────────────────────────
  ADMISSION_CREATE:       "admission.create",
  ADMISSION_DELETE:       "admission.delete",
  ADMISSION_EDIT:         "admission.edit",
  ADMISSION_VIEW:         "admission.view",

  // ── Administration ────────────────────────────────────────────────────────
  ADMIN_MANAGE:           "admin.manage",

  // ── Appointments ─────────────────────────────────────────────────────────
  APPOINTMENT_CREATE:     "appointment.create",
  APPOINTMENT_DELETE:     "appointment.delete",
  APPOINTMENT_EDIT:       "appointment.edit",
  APPOINTMENT_VIEW:       "appointment.view",

  // ── Assets ───────────────────────────────────────────────────────────────
  ASSET_CREATE:           "asset.create",
  ASSET_DELETE:           "asset.delete",
  ASSET_VIEW:             "asset.view",

  // ── Audit ────────────────────────────────────────────────────────────────
  AUDIT_VIEW:             "audit.view",

  // ── Beds ─────────────────────────────────────────────────────────────────
  BED_ASSIGN:             "bed.assign",
  BED_VIEW:               "bed.view",

  // ── Billing ──────────────────────────────────────────────────────────────
  BILLING_CREATE:         "billing.create",
  BILLING_DELETE:         "billing.delete",
  BILLING_EDIT:           "billing.edit",
  BILLING_VIEW:           "billing.view",

  // ── Dashboard ────────────────────────────────────────────────────────────
  DASHBOARD_VIEW:         "dashboard.view",

  // ── Departments ──────────────────────────────────────────────────────────
  DEPARTMENT_CREATE:      "department.create",
  DEPARTMENT_DELETE:      "department.delete",
  DEPARTMENT_VIEW:        "department.view",

  // ── Diagnosis ────────────────────────────────────────────────────────────
  DIAGNOSIS_CREATE:       "diagnosis.create",
  DIAGNOSIS_EDIT:         "diagnosis.edit",
  DIAGNOSIS_VIEW:         "diagnosis.view",

  // ── Doctors ──────────────────────────────────────────────────────────────
  DOCTOR_CREATE:          "doctor.create",
  DOCTOR_DELETE:          "doctor.delete",
  DOCTOR_EDIT:            "doctor.edit",
  DOCTOR_VIEW:            "doctor.view",

  // ── Finance ──────────────────────────────────────────────────────────────
  FINANCE_VIEW:           "finance.view",
  FINANCE_MANAGE:         "finance.manage",

  // ── HR ───────────────────────────────────────────────────────────────────
  HR_CREATE:              "hr.create",
  HR_DELETE:              "hr.delete",
  HR_EDIT:                "hr.edit",
  HR_VIEW:                "hr.view",

  // ── Insurance ────────────────────────────────────────────────────────────
  INSURANCE_CREATE:       "insurance.create",
  INSURANCE_VIEW:         "insurance.view",

  // ── Inventory ────────────────────────────────────────────────────────────
  INVENTORY_CREATE:       "inventory.create",
  INVENTORY_EDIT:         "inventory.edit",
  INVENTORY_VIEW:         "inventory.view",

  // ── Laboratory ───────────────────────────────────────────────────────────
  LAB_ORDER_CREATE:       "lab.order.create",
  LAB_RESULT_CREATE:      "lab.result.create",
  LAB_RESULT_EDIT:        "lab.result.edit",
  LAB_VIEW:               "lab.view",

  // ── Medical Records ──────────────────────────────────────────────────────
  MEDICAL_RECORD_CREATE:  "medical.record.create",
  MEDICAL_RECORD_EDIT:    "medical.record.edit",
  MEDICAL_RECORD_VIEW:    "medical.record.view",

  // ── Notifications ────────────────────────────────────────────────────────
  NOTIFICATION_VIEW:      "notification.view",
  NOTIFICATION_MANAGE:    "notification.manage",

  // ── Nurses ───────────────────────────────────────────────────────────────
  NURSE_CREATE:           "nurse.create",
  NURSE_VIEW:             "nurse.view",

  // ── Operation Theater ────────────────────────────────────────────────────
  OT_SCHEDULE:            "ot.schedule",
  OT_VIEW:                "ot.view",

  // ── Patients ─────────────────────────────────────────────────────────────
  PATIENT_CREATE:         "patient.create",
  PATIENT_DELETE:         "patient.delete",
  PATIENT_EDIT:           "patient.edit",
  PATIENT_VIEW:           "patient.view",

  // ── Payments ─────────────────────────────────────────────────────────────
  PAYMENT_PROCESS:        "payment.process",
  PAYMENT_VIEW:           "payment.view",

  // ── Pharmacy ─────────────────────────────────────────────────────────────
  PHARMACY_DISPENSE:      "pharmacy.dispense",
  PHARMACY_MANAGE:        "pharmacy.manage",
  PHARMACY_VIEW:          "pharmacy.view",

  // ── Prescriptions ────────────────────────────────────────────────────────
  PRESCRIPTION_CREATE:    "prescription.create",
  PRESCRIPTION_EDIT:      "prescription.edit",
  PRESCRIPTION_VIEW:      "prescription.view",

  // ── Purchase Orders ──────────────────────────────────────────────────────
  PO_CREATE:              "po.create",
  PO_VIEW:                "po.view",

  // ── Queue ────────────────────────────────────────────────────────────────
  QUEUE_MANAGE:           "queue.manage",
  QUEUE_VIEW:             "queue.view",

  // ── Radiology ────────────────────────────────────────────────────────────
  RADIOLOGY_ORDER:        "radiology.order",
  RADIOLOGY_VIEW:         "radiology.view",

  // ── Reports ──────────────────────────────────────────────────────────────
  REPORTS_VIEW:           "reports.view",
  REPORTS_EXPORT:         "reports.export",

  // ── Settings ─────────────────────────────────────────────────────────────
  SETTINGS_VIEW:          "settings.view",
  SETTINGS_MANAGE:        "settings.manage",

  // ── Suppliers ────────────────────────────────────────────────────────────
  SUPPLIER_CREATE:        "supplier.create",
  SUPPLIER_VIEW:          "supplier.view",

  // ── Surgeries ────────────────────────────────────────────────────────────
  SURGERY_SCHEDULE:       "surgery.schedule",
  SURGERY_VIEW:           "surgery.view",

  // ── Wards ────────────────────────────────────────────────────────────────
  WARD_ASSIGN:            "ward.assign",
  WARD_VIEW:              "ward.view",
});

// ---------------------------------------------------------------------------
// 3. ROLE → PERMISSIONS MAP
//    Each role gets a Set of permission strings for O(1) lookups.
// ---------------------------------------------------------------------------
const P = PERMISSIONS; // shorthand

/** @type {Record<string, Set<string>>} */
export const ROLE_PERMISSIONS = Object.freeze({

  // ── SuperAdmin ─────────────── gets EVERYTHING ───────────────────────────
  [ROLES.SUPER_ADMIN]: new Set(Object.values(P)),

  // ── Admin ─────────────────────────────────────────────────────────────────
  [ROLES.ADMIN]: new Set([
    P.DASHBOARD_VIEW,
    // Patients
    P.PATIENT_VIEW, P.PATIENT_CREATE, P.PATIENT_EDIT, P.PATIENT_DELETE,
    // Appointments
    P.APPOINTMENT_VIEW, P.APPOINTMENT_CREATE, P.APPOINTMENT_EDIT, P.APPOINTMENT_DELETE,
    // Admissions
    P.ADMISSION_VIEW, P.ADMISSION_CREATE, P.ADMISSION_EDIT, P.ADMISSION_DELETE,
    // Queue
    P.QUEUE_VIEW, P.QUEUE_MANAGE,
    // Clinical
    P.DIAGNOSIS_VIEW,
    P.MEDICAL_RECORD_VIEW,
    P.PRESCRIPTION_VIEW,
    P.LAB_VIEW,
    P.RADIOLOGY_VIEW,
    // Hospital ops
    P.DOCTOR_VIEW, P.DOCTOR_CREATE, P.DOCTOR_EDIT, P.DOCTOR_DELETE,
    P.NURSE_VIEW, P.NURSE_CREATE,
    P.DEPARTMENT_VIEW, P.DEPARTMENT_CREATE, P.DEPARTMENT_DELETE,
    P.WARD_VIEW, P.WARD_ASSIGN,
    P.BED_VIEW, P.BED_ASSIGN,
    P.OT_VIEW, P.OT_SCHEDULE,
    P.SURGERY_VIEW, P.SURGERY_SCHEDULE,
    // Pharmacy & Inventory
    P.PHARMACY_VIEW, P.PHARMACY_MANAGE,
    P.INVENTORY_VIEW, P.INVENTORY_CREATE, P.INVENTORY_EDIT,
    P.SUPPLIER_VIEW, P.SUPPLIER_CREATE,
    P.PO_VIEW, P.PO_CREATE,
    // Finance
    P.BILLING_VIEW, P.BILLING_CREATE, P.BILLING_EDIT, P.BILLING_DELETE,
    P.PAYMENT_VIEW, P.PAYMENT_PROCESS,
    P.INSURANCE_VIEW, P.INSURANCE_CREATE,
    P.FINANCE_VIEW,
    // Administration
    P.HR_VIEW, P.HR_CREATE, P.HR_EDIT, P.HR_DELETE,
    P.ASSET_VIEW, P.ASSET_CREATE,
    P.REPORTS_VIEW, P.REPORTS_EXPORT,
    // System
    P.NOTIFICATION_VIEW, P.NOTIFICATION_MANAGE,
    P.AUDIT_VIEW,
    P.SETTINGS_VIEW, P.SETTINGS_MANAGE,
  ]),

  // ── Doctor ────────────────────────────────────────────────────────────────
  [ROLES.DOCTOR]: new Set([
    P.DASHBOARD_VIEW,
    // Patients
    P.PATIENT_VIEW, P.PATIENT_EDIT,
    // Appointments
    P.APPOINTMENT_VIEW, P.APPOINTMENT_CREATE, P.APPOINTMENT_EDIT,
    // Admissions
    P.ADMISSION_VIEW,
    // Queue
    P.QUEUE_VIEW,
    // Clinical
    P.DIAGNOSIS_VIEW, P.DIAGNOSIS_CREATE, P.DIAGNOSIS_EDIT,
    P.MEDICAL_RECORD_VIEW, P.MEDICAL_RECORD_CREATE, P.MEDICAL_RECORD_EDIT,
    P.PRESCRIPTION_VIEW, P.PRESCRIPTION_CREATE, P.PRESCRIPTION_EDIT,
    P.LAB_VIEW, P.LAB_ORDER_CREATE,
    P.RADIOLOGY_VIEW, P.RADIOLOGY_ORDER,
    // Hospital ops
    P.NURSE_VIEW,
    P.WARD_VIEW,
    P.BED_VIEW,
    P.OT_VIEW, P.OT_SCHEDULE,
    P.SURGERY_VIEW, P.SURGERY_SCHEDULE,
    // Reports
    P.REPORTS_VIEW,
    // Notifications
    P.NOTIFICATION_VIEW,
  ]),

  // ── Receptionist ──────────────────────────────────────────────────────────
  [ROLES.RECEPTIONIST]: new Set([
    P.DASHBOARD_VIEW,
    // Patients
    P.PATIENT_VIEW, P.PATIENT_CREATE, P.PATIENT_EDIT,
    // Appointments
    P.APPOINTMENT_VIEW, P.APPOINTMENT_CREATE, P.APPOINTMENT_EDIT,
    // Admissions
    P.ADMISSION_VIEW, P.ADMISSION_CREATE,
    // Queue
    P.QUEUE_VIEW, P.QUEUE_MANAGE,
    // Billing
    P.BILLING_VIEW, P.BILLING_CREATE,
    P.PAYMENT_VIEW, P.PAYMENT_PROCESS,
    P.INSURANCE_VIEW,
    // Notifications
    P.NOTIFICATION_VIEW,
  ]),

  // ── Nurse ─────────────────────────────────────────────────────────────────
  [ROLES.NURSE]: new Set([
    P.DASHBOARD_VIEW,
    // Patients
    P.PATIENT_VIEW,
    // Appointments
    P.APPOINTMENT_VIEW,
    // Admissions
    P.ADMISSION_VIEW,
    // Queue
    P.QUEUE_VIEW,
    // Clinical
    P.DIAGNOSIS_VIEW,
    P.MEDICAL_RECORD_VIEW,
    P.PRESCRIPTION_VIEW,
    P.LAB_VIEW, P.LAB_ORDER_CREATE,
    P.RADIOLOGY_VIEW,
    // Hospital ops
    P.WARD_VIEW, P.WARD_ASSIGN,
    P.BED_VIEW, P.BED_ASSIGN,
    P.OT_VIEW,
    P.SURGERY_VIEW,
    // Notifications
    P.NOTIFICATION_VIEW,
  ]),

  // ── Pharmacist ────────────────────────────────────────────────────────────
  [ROLES.PHARMACIST]: new Set([
    P.DASHBOARD_VIEW,
    // Patients (read-only for context)
    P.PATIENT_VIEW,
    // Prescriptions (read to dispense)
    P.PRESCRIPTION_VIEW,
    // Pharmacy
    P.PHARMACY_VIEW, P.PHARMACY_DISPENSE, P.PHARMACY_MANAGE,
    // Inventory
    P.INVENTORY_VIEW, P.INVENTORY_CREATE, P.INVENTORY_EDIT,
    // Suppliers
    P.SUPPLIER_VIEW,
    // Purchase Orders
    P.PO_VIEW, P.PO_CREATE,
    // Notifications
    P.NOTIFICATION_VIEW,
  ]),

  // ── BillingExecutive ──────────────────────────────────────────────────────
  [ROLES.BILLING_EXECUTIVE]: new Set([
    P.DASHBOARD_VIEW,
    // Patients (read-only for billing context)
    P.PATIENT_VIEW,
    // Billing & Payments
    P.BILLING_VIEW, P.BILLING_CREATE, P.BILLING_EDIT,
    P.PAYMENT_VIEW, P.PAYMENT_PROCESS,
    P.INSURANCE_VIEW, P.INSURANCE_CREATE,
    P.FINANCE_VIEW,
    // Reports
    P.REPORTS_VIEW, P.REPORTS_EXPORT,
    // Notifications
    P.NOTIFICATION_VIEW,
  ]),

  // ── LabTechnician ─────────────────────────────────────────────────────────
  [ROLES.LAB_TECHNICIAN]: new Set([
    P.DASHBOARD_VIEW,
    // Patients (read-only)
    P.PATIENT_VIEW,
    // Lab
    P.LAB_VIEW, P.LAB_RESULT_CREATE, P.LAB_RESULT_EDIT,
    // Reports
    P.REPORTS_VIEW,
    // Notifications
    P.NOTIFICATION_VIEW,
  ]),

  // ── Patient ───────────────────────────────────────────────────────────────
  [ROLES.PATIENT]: new Set([
    P.DASHBOARD_VIEW,
    // Own record only (enforcement is server-side; UI just shows the section)
    P.PATIENT_VIEW,
    P.APPOINTMENT_VIEW,
    P.PRESCRIPTION_VIEW,
    P.BILLING_VIEW,
    P.PAYMENT_VIEW,
    // Notifications
    P.NOTIFICATION_VIEW,
  ]),
});

// ---------------------------------------------------------------------------
// 4. SIDEBAR ACCESS — which menu group titles each role can see
//    Must match the `title` strings in Sidebar.jsx's menuGroups array.
// ---------------------------------------------------------------------------

/** All sidebar group titles that exist in the nav. */
export const SIDEBAR_GROUPS = Object.freeze({
  OVERVIEW:              "Overview",
  PATIENT_CARE:          "Patient Care",
  CLINICAL:              "Clinical",
  HOSPITAL_OPERATIONS:   "Hospital Operations",
  PHARMACY_INVENTORY:    "Pharmacy & Inventory",
  FINANCE:               "Finance",
  ADMINISTRATION:        "Administration",
  SYSTEM:                "System",
});

const G = SIDEBAR_GROUPS;

/** @type {Record<string, string[]>} role → allowed group titles */
export const SIDEBAR_ACCESS = Object.freeze({
  [ROLES.SUPER_ADMIN]:       Object.values(G),            // everything
  [ROLES.ADMIN]:             Object.values(G),            // everything
  [ROLES.DOCTOR]:            [G.OVERVIEW, G.PATIENT_CARE, G.CLINICAL, G.HOSPITAL_OPERATIONS],
  [ROLES.RECEPTIONIST]:      [G.OVERVIEW, G.PATIENT_CARE, G.FINANCE],
  [ROLES.NURSE]:             [G.OVERVIEW, G.PATIENT_CARE, G.CLINICAL, G.HOSPITAL_OPERATIONS],
  [ROLES.PHARMACIST]:        [G.OVERVIEW, G.PHARMACY_INVENTORY],
  [ROLES.BILLING_EXECUTIVE]: [G.OVERVIEW, G.FINANCE],
  [ROLES.LAB_TECHNICIAN]:    [G.OVERVIEW, G.CLINICAL],
  [ROLES.PATIENT]:           [G.OVERVIEW],
});

// ---------------------------------------------------------------------------
// 5. ROLE DISPLAY METADATA  (label, color, description for the UI)
// ---------------------------------------------------------------------------
export const ROLE_META = Object.freeze({
  [ROLES.SUPER_ADMIN]: {
    label:       "Super Admin",
    description: "Full system access",
    color:       "#D946EF",  // purple
    bgColor:     "#D946EF1A",
  },
  [ROLES.ADMIN]: {
    label:       "Admin",
    description: "Hospital administrator",
    color:       "#0F766E",  // teal
    bgColor:     "#0F766E1A",
  },
  [ROLES.DOCTOR]: {
    label:       "Doctor",
    description: "Clinical staff – physician",
    color:       "#2563EB",  // blue
    bgColor:     "#2563EB1A",
  },
  [ROLES.RECEPTIONIST]: {
    label:       "Receptionist",
    description: "Front-desk & appointments",
    color:       "#059669",  // green
    bgColor:     "#0596691A",
  },
  [ROLES.NURSE]: {
    label:       "Nurse",
    description: "Clinical support staff",
    color:       "#DB2777",  // pink
    bgColor:     "#DB27771A",
  },
  [ROLES.PHARMACIST]: {
    label:       "Pharmacist",
    description: "Pharmacy & dispensing",
    color:       "#EA580C",  // orange
    bgColor:     "#EA580C1A",
  },
  [ROLES.BILLING_EXECUTIVE]: {
    label:       "Billing Executive",
    description: "Finance & billing",
    color:       "#CA8A04",  // amber
    bgColor:     "#CA8A041A",
  },
  [ROLES.LAB_TECHNICIAN]: {
    label:       "Lab Technician",
    description: "Laboratory operations",
    color:       "#7C3AED",  // violet
    bgColor:     "#7C3AED1A",
  },
  [ROLES.PATIENT]: {
    label:       "Patient",
    description: "Patient portal access",
    color:       "#64748B",  // slate
    bgColor:     "#64748B1A",
  },
});
