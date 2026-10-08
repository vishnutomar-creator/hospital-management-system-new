const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ─── Fresh login helper ───────────────────────────────────────────────────────
async function freshLogin() {
  const email    = process.env.NEXT_PUBLIC_ADMIN_EMAIL    || "admin@hms.com";
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "password123";
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const d = await res.json();
    const token = d?.data?.token || d?.token;
    if (token) {
      localStorage.setItem("hms_token", token);
      if (d.data?.user) localStorage.setItem("hms_user", JSON.stringify(d.data.user));
    }
    return token || null;
  } catch (_) {
    return null;
  }
}

// ─── Get token, auto-login if missing ────────────────────────────────────────
const getAuthToken = async () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("hms_token");
    if (token) return token;
    return await freshLogin();
  }
  return null;
};

// ─── Core fetch wrapper with automatic 401 token-refresh ─────────────────────
async function apiFetch(endpoint, options = {}, _isRetry = false) {
  const token = await getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  // If the token is stale/expired and this is the first attempt, clear it and retry
  if (response.status === 401 && !_isRetry) {
    localStorage.removeItem("hms_token");
    localStorage.removeItem("hms_user");
    const newToken = await freshLogin();
    if (newToken) {
      // Retry the original request once with the fresh token
      return apiFetch(endpoint, options, true);
    }
  }

  if (!response.ok) {
    const errorMsg =
      (Array.isArray(data?.errors) && data.errors.map((e) => e.msg || e.message).join(", ")) ||
      data?.message ||
      `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}


// ==========================================
// 1. AUTH & USER API
// ==========================================
export const authAPI = {
  login: (credentials) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getMe: () => apiFetch("/auth/me"),
};

export const userAPI = {
  getUsers: () => apiFetch("/users"),
  updateProfile: (id, data) =>
    apiFetch(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ==========================================
// 2. DASHBOARD API
// ==========================================
export const dashboardAPI = {
  getDashboard: () => apiFetch("/dashboard"),
};

// ==========================================
// 3. PATIENTS API  (REST — /patients)
// ==========================================
export const patientAPI = {
  getPatients: () => apiFetch("/patients"),
  getPatientById: (id) => apiFetch(`/patients/${id}`),
  createPatient: (data) => {
    // Format patient object to match MongoDB Mongoose schema and express-validator
    const cleanData = { ...data };
    if (!cleanData.bloodGroup) delete cleanData.bloodGroup;
    if (!cleanData.gender) delete cleanData.gender;
    if (!cleanData.email) delete cleanData.email;
    if (!cleanData.phone) delete cleanData.phone;
    if (cleanData.dob && !cleanData.dateOfBirth) {
      cleanData.dateOfBirth = cleanData.dob;
    }
    if (typeof cleanData.allergies === "string") {
      cleanData.allergies = cleanData.allergies ? [cleanData.allergies] : [];
    }
    if (cleanData.emergencyContact && typeof cleanData.emergencyContact === "object") {
      cleanData.emergencyContactName = cleanData.emergencyContact.name || undefined;
      cleanData.emergencyContactPhone = cleanData.emergencyContact.phone || undefined;
      cleanData.emergencyContactRelation = cleanData.emergencyContact.relation || undefined;
    }

    return apiFetch("/patients", {
      method: "POST",
      body: JSON.stringify(cleanData),
    });
  },
  updatePatient: (id, data) =>
    apiFetch(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePatient: (id) =>
    apiFetch(`/patients/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 4. DOCTORS API
// ==========================================
export const doctorAPI = {
  getDoctors: () => apiFetch("/doctors"),
  getDoctorById: (id) => apiFetch(`/doctors/${id}`),
  createDoctor: (data) =>
    apiFetch("/doctors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateDoctor: (id, data) =>
    apiFetch(`/doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteDoctor: (id) =>
    apiFetch(`/doctors/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 5. DEPARTMENTS API
// ==========================================
export const departmentAPI = {
  getDepartments: () => apiFetch("/departments"),
  getDepartmentById: (id) => apiFetch(`/departments/${id}`),
  createDepartment: (data) =>
    apiFetch("/departments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateDepartment: (id, data) =>
    apiFetch(`/departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteDepartment: (id) =>
    apiFetch(`/departments/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 6. APPOINTMENTS API
// ==========================================
export const appointmentAPI = {
  getAppointments: () => apiFetch("/appointments"),
  getAppointmentById: (id) => apiFetch(`/appointments/${id}`),
  createAppointment: (data) =>
    apiFetch("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAppointment: (id, data) =>
    apiFetch(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  cancelAppointment: (id, reason = "") =>
    apiFetch(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "cancelled", cancellationReason: reason }),
    }),
  deleteAppointment: (id) =>
    apiFetch(`/appointments/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 7. MEDICAL RECORDS API
// ==========================================
export const medicalRecordAPI = {
  getMedicalRecords: () => apiFetch("/medical-records"),
  getMedicalRecordById: (id) => apiFetch(`/medical-records/${id}`),
  getMedicalRecordsByPatient: (patientId) => apiFetch(`/medical-records/patient/${patientId}`),
  getMedicalRecordsByDoctor: (doctorId) => apiFetch(`/medical-records/doctor/${doctorId}`),
  createMedicalRecord: (data) =>
    apiFetch("/medical-records", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateMedicalRecord: (id, data) =>
    apiFetch(`/medical-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteMedicalRecord: (id) =>
    apiFetch(`/medical-records/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 8. PRESCRIPTIONS API
// ==========================================
export const prescriptionAPI = {
  getPrescriptions: () => apiFetch("/prescriptions"),
  getPrescriptionById: (id) => apiFetch(`/prescriptions/${id}`),
  getPrescriptionsByPatient: (patientId) => apiFetch(`/prescriptions/patient/${patientId}`),
  getPrescriptionsByDoctor: (doctorId) => apiFetch(`/prescriptions/doctor/${doctorId}`),
  createPrescription: (data) =>
    apiFetch("/prescriptions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePrescription: (id, data) =>
    apiFetch(`/prescriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePrescription: (id) =>
    apiFetch(`/prescriptions/${id}`, {
      method: "DELETE",
    }),
  dispensePrescription: (id, data = {}) =>
    apiFetch(`/prescriptions/${id}/dispense`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  returnPrescription: (id, data = {}) =>
    apiFetch(`/prescriptions/${id}/return`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ==========================================
// 8.5. INVENTORY API
// ==========================================
export const inventoryAPI = {
  getInventory: () => apiFetch("/inventory"),
  getInventoryById: (id) => apiFetch(`/inventory/${id}`),
  createInventoryItem: (data) =>
    apiFetch("/inventory", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateInventoryItem: (id, data) =>
    apiFetch(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ==========================================
// 9. BILLING API  (/billings — plural)
// ==========================================
export const billingAPI = {
  getBillings: () => apiFetch("/billings"),
  getBillingById: (id) => apiFetch(`/billings/${id}`),
  createBilling: (data) =>
    apiFetch("/billings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateBilling: (id, data) =>
    apiFetch(`/billings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteBilling: (id) =>
    apiFetch(`/billings/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 10. PAYMENTS API
// ==========================================
export const paymentAPI = {
  getPayments: () => apiFetch("/payments"),
  getPaymentById: (id) => apiFetch(`/payments/${id}`),
  createPayment: (data) =>
    apiFetch("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePayment: (id, data) =>
    apiFetch(`/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePayment: (id) =>
    apiFetch(`/payments/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 11. NOTIFICATIONS API
// ==========================================
export const notificationAPI = {
  getNotifications: () => apiFetch("/notifications"),
  markAsRead: (id) =>
    apiFetch(`/notifications/${id}/read`, {
      method: "PUT",
    }),
  markAllAsRead: () =>
    apiFetch("/notifications/read-all", {
      method: "PUT",
    }),
};

// ==========================================
// 12. AUDIT LOGS API
// ==========================================
export const auditAPI = {
  getLogs: () => apiFetch("/audit-logs"),
};

// ==========================================
// 13. LAB TESTS API  (/lab-tests)
// ==========================================
export const labAPI = {
  // GET all lab tests
  getLabTests: () => apiFetch("/lab-tests/getlabtests"),

  // GET pending lab tests (status=Ordered)
  getPendingLabTests: () => apiFetch("/lab-tests/getpendinglabtests"),

  // GET single lab test by ID
  getLabTestById: (id) => apiFetch(`/lab-tests/getlabtestby/${id}`),

  // GET lab tests by patient ID
  getLabTestsByPatient: (patientId) => apiFetch(`/lab-tests/getlabtestsbypatient/${patientId}`),

  // POST create / order a new lab test
  orderLabTest: (data) =>
    apiFetch("/lab-tests/orderlabtest", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // PATCH collect sample (moves to SampleCollected)
  collectSample: (id) =>
    apiFetch(`/lab-tests/collectsample/${id}`, {
      method: "PATCH",
    }),

  // PATCH start processing (moves to InProgress)
  startProcessing: (id) =>
    apiFetch(`/lab-tests/startprocessing/${id}`, {
      method: "PATCH",
    }),

  // PATCH submit result (moves to Completed)
  submitResult: (id, data) =>
    apiFetch(`/lab-tests/submitresult/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // PATCH verify result
  verifyResult: (id, verifiedBy) =>
    apiFetch(`/lab-tests/verifyresult/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ verifiedBy }),
    }),

  // PATCH cancel lab test
  cancelLabTest: (id) =>
    apiFetch(`/lab-tests/cancellabtest/${id}`, {
      method: "PATCH",
    }),

  // DELETE lab test
  deleteLabTest: (id) =>
    apiFetch(`/lab-tests/deletelabtestby/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 14. BEDS API
// ==========================================
export const bedAPI = {
  getBeds: () => apiFetch("/beds/getbeds"),
  getBedById: (id) => apiFetch(`/beds/getbedby/${id}`),
  createBed: (data) =>
    apiFetch("/beds/createbed", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateBed: (id, data) =>
    apiFetch(`/beds/updatebedby/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  allocateBed: (id, data) =>
    apiFetch(`/beds/allocatebed/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  releaseBed: (id) =>
    apiFetch(`/beds/releasebed/${id}`, {
      method: "PATCH",
    }),
  deleteBed: (id) =>
    apiFetch(`/beds/deletebedby/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 15. WARDS API
// ==========================================
export const wardAPI = {
  getWards: () => apiFetch("/wards/getwards"),
  getWardById: (id) => apiFetch(`/wards/getwardby/${id}`),
  createWard: (data) =>
    apiFetch("/wards/createward", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateWard: (id, data) =>
    apiFetch(`/wards/updatewardby/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteWard: (id) =>
    apiFetch(`/wards/deletewardby/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 16. NURSES API
// ==========================================
export const nurseAPI = {
  getNurses: () => apiFetch("/nurses/getnurses"),
  getNurseById: (id) => apiFetch(`/nurses/getnurseby/${id}`),
  getNursesByWard: (wardId) => apiFetch(`/nurses/getnursesbyward/${wardId}`),
  createNurse: (data) =>
    apiFetch("/nurses/createnurse", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateNurse: (id, data) =>
    apiFetch(`/nurses/updatenurseby/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteNurse: (id) =>
    apiFetch(`/nurses/deletenurseby/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 17. ADMISSIONS API
// ==========================================
export const admissionAPI = {
  getAdmissions: () => apiFetch("/admissions/getadmissions"),
  getAdmissionById: (id) => apiFetch(`/admissions/getadmissionby/${id}`),
  createAdmission: (data) =>
    apiFetch("/admissions/admitpatient", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  dischargePatient: (id, data = {}) =>
    apiFetch(`/admissions/dischargepatient/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  transferPatient: (id, data = {}) =>
    apiFetch(`/admissions/transferpatient/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ==========================================
// 18. RADIOLOGY API
// ==========================================
export const radiologyAPI = {
  getRadiologyTests: () => apiFetch("/radiology/getscans"),
  getPendingScans: () => apiFetch("/radiology/getpendingscans"),
  getRadiologyById: (id) => apiFetch(`/radiology/getscanby/${id}`),
  getScansByPatient: (patientId) => apiFetch(`/radiology/getscansbypatient/${patientId}`),
  orderRadiology: (data) =>
    apiFetch("/radiology/orderscan", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  scheduleScan: (id, data) =>
    apiFetch(`/radiology/schedulescan/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  startScan: (id) =>
    apiFetch(`/radiology/startscan/${id}`, {
      method: "PATCH",
    }),
  submitReport: (id, data) =>
    apiFetch(`/radiology/submitreport/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  verifyReport: (id, data) =>
    apiFetch(`/radiology/verifyreport/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  cancelScan: (id) =>
    apiFetch(`/radiology/cancelscan/${id}`, {
      method: "PATCH",
    }),
  deleteScan: (id) =>
    apiFetch(`/radiology/deletescanby/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 19. QUEUE API
// ==========================================
export const queueAPI = {
  getQueue: () => apiFetch("/queue/getqueues"),
  getQueueById: (id) => apiFetch(`/queue/getqueueby/${id}`),
  getQueueByDoctor: (doctorId) => apiFetch(`/queue/getqueuebydoctor/${doctorId}`),
  joinQueue: (data) =>
    apiFetch("/queue/joinqueue", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  callNext: (doctorId) =>
    apiFetch(`/queue/callnext/${doctorId}`, {
      method: "PATCH",
    }),
  completeConsultation: (id) =>
    apiFetch(`/queue/completeconsultation/${id}`, {
      method: "PATCH",
    }),
  skipPatient: (id) =>
    apiFetch(`/queue/skippatient/${id}`, {
      method: "PATCH",
    }),
  cancelQueueEntry: (id) =>
    apiFetch(`/queue/cancelqueueentry/${id}`, {
      method: "PATCH",
    }),
};

// ==========================================
// 20. SURGERIES API
// ==========================================
export const surgeryAPI = {
  getSurgeries: () => apiFetch("/surgeries/getsurgeries"),
  getSurgeryById: (id) => apiFetch(`/surgeries/getsurgeryby/${id}`),
  createSurgery: (data) =>
    apiFetch("/surgeries/createsurgery", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // scheduleSurgery is an alias for createSurgery — use createSurgery instead
  updateSurgery: (id, data) =>
    apiFetch(`/surgeries/updatesurgeryby/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteSurgery: (id) =>
    apiFetch(`/surgeries/deletesurgeryby/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 21. OPERATION THEATER API
// ==========================================
export const operationTheaterAPI = {
  getTheaters: () => apiFetch("/operation-theater/getots"),
  getTheaterById: (id) => apiFetch(`/operation-theater/getotby/${id}`),
  createTheater: (data) =>
    apiFetch("/operation-theater/createot", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTheater: (id, data) =>
    apiFetch(`/operation-theater/updateotby/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  setMaintenance: (id) =>
    apiFetch(`/operation-theater/setmaintenance/${id}`, {
      method: "PATCH",
    }),
  setAvailable: (id) =>
    apiFetch(`/operation-theater/setavailable/${id}`, {
      method: "PATCH",
    }),
  deleteTheater: (id) =>
    apiFetch(`/operation-theater/deleteotby/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 22. ASSETS API
// ==========================================
export const assetAPI = {
  getAssets: () => apiFetch("/assets/getassets"),
  getAssetById: (id) => apiFetch(`/assets/getassetby/${id}`),
  createAsset: (data) =>
    apiFetch("/assets/createasset", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAsset: (id, data) =>
    apiFetch(`/assets/updateassetby/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  retireAsset: (id) =>
    apiFetch(`/assets/retireasset/${id}`, {
      method: "PATCH",
    }),
  deleteAsset: (id) =>
    apiFetch(`/assets/deleteassetby/${id}`, {
      method: "DELETE",
    }),
  getMaintenanceRecords: () => apiFetch("/assets/maintenance"),
  logMaintenance: (data) =>
    apiFetch("/assets/maintenance/log", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  completeMaintenance: (assetId, data = {}) =>
    apiFetch(`/assets/maintenance/complete/${assetId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ==========================================
// 23. SUPPLIERS API
// ==========================================
export const supplierAPI = {
  getSuppliers: () => apiFetch("/suppliers/getsuppliers"),
  getSupplierById: (id) => apiFetch(`/suppliers/getsupplierby/${id}`),
  createSupplier: (data) =>
    apiFetch("/suppliers/createsupplier", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSupplier: (id, data) =>
    apiFetch(`/suppliers/updatesupplierby/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteSupplier: (id) =>
    apiFetch(`/suppliers/deletesupplierby/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 24. PURCHASE ORDERS API
// ==========================================
export const purchaseOrderAPI = {
  getPurchaseOrders: () => apiFetch("/purchase-orders/getpos"),
  getPurchaseOrderById: (id) => apiFetch(`/purchase-orders/getposby/${id}`),
  createPurchaseOrder: (data) =>
    apiFetch("/purchase-orders/createpo", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  approvePurchaseOrder: (id) =>
    apiFetch(`/purchase-orders/approvepo/${id}`, {
      method: "PATCH",
    }),
  orderPurchaseOrder: (id) =>
    apiFetch(`/purchase-orders/markordered/${id}`, {
      method: "PATCH",
    }),
  receivePurchaseOrder: (id) =>
    apiFetch(`/purchase-orders/receivepo/${id}`, {
      method: "PATCH",
    }),
  cancelPurchaseOrder: (id) =>
    apiFetch(`/purchase-orders/cancelpo/${id}`, {
      method: "PATCH",
    }),
  deletePurchaseOrder: (id) =>
    apiFetch(`/purchase-orders/deletepoby/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 25. INSURANCE CLAIMS API
// ==========================================
export const insuranceAPI = {
  getClaims: () => apiFetch("/insurance/getclaims"),
  getClaimById: (id) => apiFetch(`/insurance/getclaimby/${id}`),
  submitClaim: (data) =>
    apiFetch("/insurance/submitclaim", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  reviewClaim: (id) =>
    apiFetch(`/insurance/startreview/${id}`, {
      method: "PATCH",
    }),
  approveClaim: (id, data) =>
    apiFetch(`/insurance/approveclaim/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  rejectClaim: (id, data) =>
    apiFetch(`/insurance/rejectclaim/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  settleClaim: (id) =>
    apiFetch(`/insurance/settleclaim/${id}`, {
      method: "PATCH",
    }),
  deleteClaim: (id) =>
    apiFetch(`/insurance/deleteclaimby/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 26. FINANCE API
// ==========================================
export const financeAPI = {
  getSummary: () => apiFetch("/finance/summary"),
  getLedger: () => apiFetch("/finance/ledger"),
  createLedgerEntry: (data) =>
    apiFetch("/finance/ledger/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPayables: () => apiFetch("/finance/payables"),
  createPayable: (data) =>
    apiFetch("/finance/payables/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  markPayablePaid: (id) =>
    apiFetch(`/finance/payables/${id}/mark-paid`, {
      method: "PATCH",
    }),
  getReceivables: () => apiFetch("/finance/receivables"),
  createReceivable: (data) =>
    apiFetch("/finance/receivables/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  markReceivablePaid: (id) =>
    apiFetch(`/finance/receivables/${id}/mark-paid`, {
      method: "PATCH",
    }),
};

// ==========================================
// 27. PHARMACY DISPENSE API
// ==========================================
export const pharmacyAPI = {
  getDispenseRecords: () => apiFetch("/pharmacy/getdispenserecords"),
  getDispenseById: (id) => apiFetch(`/pharmacy/getdispenseby/${id}`),
  dispenseMedicine: (data) =>
    apiFetch("/pharmacy/dispensemedicine", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  returnMedicine: (id, data = {}) =>
    apiFetch(`/pharmacy/returnmedicine/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};


