// utils/bedStore.js
// Shared source of truth for bed status across Beds, Wards, and Admissions pages.
// Synchronized with backend models and localStorage.

export const initialBeds = [
  { id:"BED-001", bedNumber:"ICU-01",    ward:"ICU",                  wardId:"WRD-005", floor:"Ground Floor", type:"ICU",       status:"Occupied",    patient:"Aditi Sharma",   patientId:"HSP-2026-000101", admissionId:"ADM-3001", assignedDoctor:"Dr. Rajiv Sharma",  lastCleaned:"12 Aug 2026", equipment:"Ventilator Available" },
  { id:"BED-002", bedNumber:"ICU-02",    ward:"ICU",                  wardId:"WRD-005", floor:"Ground Floor", type:"ICU",       status:"Available",   patient:null,             patientId:null,      admissionId:null,       assignedDoctor:null,                 lastCleaned:"13 Aug 2026", equipment:"Fully Equipped" },
  { id:"BED-003", bedNumber:"GEN-101",   ward:"General Medicine Ward", wardId:"WRD-007", floor:"1st Floor",   type:"General",   status:"Occupied",    patient:"Rohan Verma",    patientId:"HSP-2026-000102", admissionId:"ADM-3003", assignedDoctor:"Dr. Rajesh Gupta",     lastCleaned:"11 Aug 2026", equipment:"Standard" },
  { id:"BED-004", bedNumber:"GEN-102",   ward:"General Medicine Ward", wardId:"WRD-007", floor:"1st Floor",   type:"General",   status:"Cleaning",    patient:null,             patientId:null,      admissionId:null,       assignedDoctor:null,                 lastCleaned:"13 Aug 2026", equipment:"Standard" },
  { id:"BED-005", bedNumber:"CARD-201",  ward:"Cardiology Ward A",    wardId:"WRD-001", floor:"2nd Floor",   type:"General",   status:"Occupied",    patient:"Karan Malhotra", patientId:"HSP-2026-000103", admissionId:"ADM-3008", assignedDoctor:"Dr. Rajiv Sharma",     lastCleaned:"12 Aug 2026", equipment:"Cardiac Monitor" },
  { id:"BED-006", bedNumber:"CARD-202",  ward:"Cardiology Ward A",    wardId:"WRD-001", floor:"2nd Floor",   type:"Private",   status:"Available",   patient:null,             patientId:null,      admissionId:null,       assignedDoctor:null,                 lastCleaned:"13 Aug 2026", equipment:"Cardiac Monitor" },
  { id:"BED-007", bedNumber:"ORTH-301",  ward:"Orthopedic Ward A",    wardId:"WRD-003", floor:"3rd Floor",   type:"General",   status:"Occupied",    patient:"Meera Nair",     patientId:"HSP-2026-000104", admissionId:"ADM-3012", assignedDoctor:"Dr. Karan Patel",    lastCleaned:"12 Aug 2026", equipment:"Standard" },
  { id:"BED-008", bedNumber:"ORTH-302",  ward:"Orthopedic Ward A",    wardId:"WRD-003", floor:"3rd Floor",   type:"General",   status:"Maintenance", patient:null,             patientId:null,      admissionId:null,       assignedDoctor:null,                 lastCleaned:"09 Aug 2026", equipment:"Bed Repair Required" },
  { id:"BED-009", bedNumber:"PVT-401",   ward:"Private Care Ward",    wardId:"WRD-008", floor:"4th Floor",   type:"Private",   status:"Available",   patient:null,             patientId:null,      admissionId:null,       assignedDoctor:null,                 lastCleaned:"13 Aug 2026", equipment:"Fully Equipped" },
  { id:"BED-010", bedNumber:"PVT-402",   ward:"Private Care Ward",    wardId:"WRD-008", floor:"4th Floor",   type:"Private",   status:"Occupied",    patient:"Priya Sharma",   patientId:"HSP-2026-000105", admissionId:"ADM-3016", assignedDoctor:"Dr. Rajesh Gupta",    lastCleaned:"12 Aug 2026", equipment:"Fully Equipped" },
  { id:"BED-011", bedNumber:"PED-101",   ward:"Pediatric Ward",       wardId:"WRD-004", floor:"1st Floor",   type:"Pediatric", status:"Available",   patient:null,             patientId:null,      admissionId:null,       assignedDoctor:null,                 lastCleaned:"13 Aug 2026", equipment:"Pediatric Equipment" },
  { id:"BED-012", bedNumber:"EMG-101",   ward:"Emergency Unit",       wardId:"WRD-006", floor:"Ground Floor", type:"Emergency", status:"Reserved",   patient:null,             patientId:null,      admissionId:"ADM-3020", assignedDoctor:"Dr. Rajesh Gupta",    lastCleaned:"13 Aug 2026", equipment:"Emergency Equipped" },
  { id:"BED-013", bedNumber:"GEN-103",   ward:"General Medicine Ward", wardId:"WRD-007", floor:"1st Floor",   type:"General",   status:"Available",   patient:null,             patientId:null,      admissionId:null,       assignedDoctor:null,                 lastCleaned:"13 Aug 2026", equipment:"Standard" },
  { id:"BED-014", bedNumber:"NEURO-201", ward:"Neurology Ward B",     wardId:"WRD-002", floor:"3rd Floor",   type:"General",   status:"Available",   patient:null,             patientId:null,      admissionId:null,       assignedDoctor:null,                 lastCleaned:"13 Aug 2026", equipment:"Neuro Monitor" },
  { id:"BED-015", bedNumber:"NEURO-202", ward:"Neurology Ward B",     wardId:"WRD-002", floor:"3rd Floor",   type:"General",   status:"Occupied",    patient:"Sunil Mehta",    patientId:"HSP-2026-000106", admissionId:"ADM-3024", assignedDoctor:"Dr. Priya Sharma",   lastCleaned:"12 Aug 2026", equipment:"Neuro Monitor" },
  { id:"BED-016", bedNumber:"PED-102",   ward:"Pediatric Ward",       wardId:"WRD-004", floor:"1st Floor",   type:"Pediatric", status:"Available",   patient:null,             patientId:null,      admissionId:null,       assignedDoctor:null,                 lastCleaned:"13 Aug 2026", equipment:"Pediatric Equipment" },
];

const STORAGE_KEY = "hms_local_beds";

/** Read beds from localStorage, seed from initialBeds if empty */
export function getBedsFromStorage() {
  if (typeof window === "undefined") return initialBeds;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (_) {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBeds));
  return initialBeds;
}

/** Persist full beds array and fire a custom event */
export function saveBedsToStorage(beds) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(beds));
    window.dispatchEvent(new Event("hms_beds_updated"));
  } catch (_) {}
}

/**
 * Mark a bed Occupied.
 * @returns updated beds array
 */
export function occupyBed(bedId, { patient, patientId, admissionId, assignedDoctor }) {
  const beds = getBedsFromStorage();
  const updated = beds.map((b) =>
    b.id === bedId
      ? { ...b, status: "Occupied", patient: patient || null, patientId: patientId || null, admissionId, assignedDoctor: assignedDoctor || null }
      : b
  );
  saveBedsToStorage(updated);
  return updated;
}

/**
 * Free a bed after discharge.
 * @param {"Available"|"Cleaning"} nextStatus
 * @returns updated beds array
 */
export function freeBed(bedId, nextStatus = "Cleaning") {
  const beds = getBedsFromStorage();
  const updated = beds.map((b) =>
    b.id === bedId
      ? { ...b, status: nextStatus, patient: null, patientId: null, admissionId: null, assignedDoctor: null }
      : b
  );
  saveBedsToStorage(updated);
  return updated;
}

/** Derive per-ward stats { wardId -> { total, occupied, available } } from a beds array */
export function deriveWardStats(beds) {
  const map = {};
  beds.forEach((b) => {
    if (!map[b.wardId]) map[b.wardId] = { wardId: b.wardId, ward: b.ward, total: 0, occupied: 0, available: 0 };
    map[b.wardId].total++;
    if (b.status === "Occupied") map[b.wardId].occupied++;
    if (b.status === "Available") map[b.wardId].available++;
  });
  return map;
}

/** Generate a unique IPD number */
export function generateIPD() {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `IPD-${year}-${num}`;
}
