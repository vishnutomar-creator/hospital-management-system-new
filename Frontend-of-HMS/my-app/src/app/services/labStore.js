"use client";

import { labAPI } from "./api";

// ─────────────────────────────────────────────────────────────
// Status mapping: Backend → Frontend display names
// Backend: Ordered | SampleCollected | InProgress | Completed | Cancelled
// Frontend pipeline: ORDERED | SAMPLE_COLLECTED | PROCESSING | RESULT_READY | REPORT_RELEASED
// ─────────────────────────────────────────────────────────────
export function mapBackendStatus(backendStatus) {
  const map = {
    Ordered: "ORDERED",
    SampleCollected: "SAMPLE_COLLECTED",
    InProgress: "PROCESSING",
    Completed: "RESULT_READY",
    Cancelled: "CANCELLED",
  };
  return map[backendStatus] || backendStatus;
}

export function mapFrontendStatus(frontendStatus) {
  const map = {
    ORDERED: "Ordered",
    SAMPLE_COLLECTED: "SampleCollected",
    PROCESSING: "InProgress",
    RESULT_READY: "Completed",
    REPORT_RELEASED: "Completed",
    CANCELLED: "Cancelled",
  };
  return map[frontendStatus] || frontendStatus;
}

// ─────────────────────────────────────────────────────────────
// Normalize a raw backend lab-test document into the shape
// the frontend components expect.
// ─────────────────────────────────────────────────────────────
export function normalizeLabTest(raw) {
  if (!raw) return null;

  // Determine patient display name
  let patientName = "Unknown Patient";
  if (raw.patientId && typeof raw.patientId === "object") {
    const p = raw.patientId;
    patientName = p.name || p.patientName || p.Name || `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.patientId || "Unknown Patient";
  } else if (raw.patientName) {
    patientName = raw.patientName;
  } else if (raw.patient) {
    patientName = typeof raw.patient === "object" ? (raw.patient.name || raw.patient.patientName || "Unknown Patient") : raw.patient;
  } else if (typeof raw.patientId === "string" && raw.patientId) {
    patientName = raw.patientId;
  }

  // Determine doctor display name
  let doctorName = "Unknown Doctor";
  if (raw.doctorId && typeof raw.doctorId === "object") {
    const d = raw.doctorId;
    doctorName = d.name || `Dr. ${d.firstName || ""} ${d.lastName || ""}`.trim() || "Unknown Doctor";
  } else if (raw.doctorName) {
    doctorName = raw.doctorName;
  } else if (raw.doctor) {
    doctorName = raw.doctor;
  }

  let frontendStatus = mapBackendStatus(raw.status);
  if (raw.status === "Completed" || raw.status === "Verified" || raw.status === "ReportReleased") {
    if (raw.verifiedBy) {
      frontendStatus = "REPORT_RELEASED";
    } else {
      frontendStatus = "RESULT_READY";
    }
  }

  // Build results object if result data exists
  let results = null;
  if (raw.resultValue) {
    results = {
      value: raw.resultValue,
      normalRange: raw.normalRange || "—",
      interpretation: raw.interpretation || "Normal",
      technician: raw.technician || "Lab Technician",
      enteredAt: raw.resultDate
        ? new Date(raw.resultDate).toLocaleString("en-IN")
        : new Date().toLocaleString("en-IN"),
      remarks: raw.remarks || "",
      parameters: raw.parameters || [],
      reportFile: raw.reportFile || null,
    };
  }

  // Build verification info if verifiedBy is populated
  let verification = null;
  if (raw.verifiedBy) {
    let verifierName;
    if (typeof raw.verifiedBy === "object") {
      const v = raw.verifiedBy;
      verifierName = v.name || `Dr. ${v.firstName || ""} ${v.lastName || ""}`.trim();
    } else {
      verifierName = raw.verifiedBy;
    }
    verification = {
      verifiedBy: verifierName,
      pathologistTitle: raw.pathologistTitle || "Consultant Pathologist",
      verifiedAt: raw.updatedAt
        ? new Date(raw.updatedAt).toLocaleString("en-IN")
        : new Date().toLocaleString("en-IN"),
      comments: raw.verificationComments || "Verified and signed digitally.",
    };
  }

  // Build sample object if sample was collected
  let sample = null;
  if (raw.sampleCollectedAt) {
    sample = {
      sampleId: raw.sampleId || `SMP-${String(raw._id).slice(-5).toUpperCase()}`,
      specimenType: raw.specimenType || "Blood / Serum",
      tubeColor: raw.tubeColor || "Lavender Top",
      collectedBy: raw.collectedBy || "Lab Staff",
      collectedAt: new Date(raw.sampleCollectedAt).toLocaleString("en-IN"),
      notes: raw.sampleNotes || "",
    };
  }

  return {
    id: raw._id,
    _id: raw._id,
    patientId:
      typeof raw.patientId === "object" ? raw.patientId?._id : raw.patientId,
    patientName,
    doctorId:
      typeof raw.doctorId === "object" ? raw.doctorId?._id : raw.doctorId,
    doctor: doctorName,
    department: raw.department || raw.testCategory || "General",
    testType: raw.testName,
    testCategory: raw.testCategory || "Other",
    orderDate: raw.orderDate
      ? new Date(raw.orderDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    priority: raw.priority || "Routine",
    status: frontendStatus,
    notes: raw.notes || "",
    cost: raw.cost || 0,
    sample,
    results,
    verification,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

// ─────────────────────────────────────────────────────────────
// Dispatch a custom event so all pages that are listening
// can re-fetch fresh data from the API.
// ─────────────────────────────────────────────────────────────
function dispatchUpdateEvent() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("medicare_lab_store_updated"));
  }
}

// ─────────────────────────────────────────────────────────────
// labStore – thin async facade consumed by page components.
// All methods now hit the real backend API and persist to MongoDB.
// ─────────────────────────────────────────────────────────────
export const labStore = {
  // Fetch all lab tests and normalize them
  async getOrders() {
    try {
      const res = await labAPI.getLabTests();
      const raw = res?.data || [];
      return raw.map(normalizeLabTest);
    } catch (err) {
      console.error("labStore.getOrders error:", err);
      return [];
    }
  },

  // Fetch a single order by MongoDB _id
  async getOrderById(id) {
    try {
      const res = await labAPI.getLabTestById(id);
      return normalizeLabTest(res?.data);
    } catch (err) {
      console.error("labStore.getOrderById error:", err);
      return null;
    }
  },

  // Create a new lab order
  async createOrder(formData) {
    try {
      const payload = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        testName: formData.testType || formData.testName,
        testCategory: formData.testCategory || "Other",
        priority: formData.priority || "Routine",
        orderDate: formData.orderDate || new Date().toISOString(),
        notes: formData.notes || "",
        cost: formData.cost || 0,
      };
      const res = await labAPI.orderLabTest(payload);
      dispatchUpdateEvent();
      return normalizeLabTest(res?.data);
    } catch (err) {
      console.error("labStore.createOrder error:", err);
      throw err;
    }
  },

  // Collect sample – moves status to SampleCollected
  async collectSample(orderId, sampleDetails) {
    try {
      const res = await labAPI.collectSample(orderId);
      dispatchUpdateEvent();
      return normalizeLabTest(res?.data);
    } catch (err) {
      console.error("labStore.collectSample error:", err);
      throw err;
    }
  },

  // Start processing – moves status to InProgress
  async markProcessing(orderId) {
    try {
      const res = await labAPI.startProcessing(orderId);
      dispatchUpdateEvent();
      return normalizeLabTest(res?.data);
    } catch (err) {
      console.error("labStore.markProcessing error:", err);
      throw err;
    }
  },

  // Submit result – moves status to Completed (displayed as RESULT_READY)
  async enterResults(orderId, resultData) {
    try {
      const payload = {
        resultValue: resultData.value,
        normalRange: resultData.normalRange,
        interpretation: resultData.interpretation,
        technician: resultData.technician,
        remarks: resultData.remarks,
      };
      const res = await labAPI.submitResult(orderId, payload);
      dispatchUpdateEvent();
      return normalizeLabTest(res?.data);
    } catch (err) {
      console.error("labStore.enterResults error:", err);
      throw err;
    }
  },

  // Verify and release report – marks verifiedBy doctor
  async verifyAndReleaseReport(orderId, verificationData) {
    try {
      const verifierId =
        typeof verificationData === "string"
          ? verificationData
          : verificationData?.verifiedBy || undefined;
      const res = await labAPI.verifyResult(orderId, verifierId);
      dispatchUpdateEvent();
      return normalizeLabTest(res?.data);
    } catch (err) {
      console.error("labStore.verifyAndReleaseReport error:", err);
      throw err;
    }
  },

  // Cancel a lab test
  async cancelOrder(orderId) {
    try {
      const res = await labAPI.cancelLabTest(orderId);
      dispatchUpdateEvent();
      return normalizeLabTest(res?.data);
    } catch (err) {
      console.error("labStore.cancelOrder error:", err);
      throw err;
    }
  },

  // Delete a lab test (admin only)
  async deleteOrder(orderId) {
    try {
      await labAPI.deleteLabTest(orderId);
      dispatchUpdateEvent();
    } catch (err) {
      console.error("labStore.deleteOrder error:", err);
      throw err;
    }
  },

  // Helper: get verified/released reports for a patient
  async getVerifiedReportsForPatient(patientId) {
    const orders = await this.getOrders();
    return orders.filter(
      (o) =>
        (o.patientId === patientId ||
          o.patientName?.toLowerCase().includes(patientId?.toLowerCase())) &&
        (o.status === "RESULT_READY" || o.status === "REPORT_RELEASED")
    );
  },

  // Helper: get pending orders for a patient
  async getPendingOrdersForPatient(patientId) {
    const orders = await this.getOrders();
    return orders.filter(
      (o) =>
        (o.patientId === patientId ||
          o.patientName?.toLowerCase().includes(patientId?.toLowerCase())) &&
        o.status !== "RESULT_READY" &&
        o.status !== "REPORT_RELEASED" &&
        o.status !== "CANCELLED"
    );
  },
};
