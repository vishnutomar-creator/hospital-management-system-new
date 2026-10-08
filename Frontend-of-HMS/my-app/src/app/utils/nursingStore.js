// utils/nursingStore.js
// Client-side store for Nursing Station operations: Vitals, Medication Administration (MAR), and Nursing Notes.

import { getBedsFromStorage } from "./bedStore";

const VITALS_STORAGE_KEY = "hms_local_vitals";
const MED_LOGS_STORAGE_KEY = "hms_local_medication_logs";
const NOTES_STORAGE_KEY = "hms_local_nursing_notes";
const ADMISSIONS_STORAGE_KEY = "hms_local_admissions";
const PRESCRIPTIONS_STORAGE_KEY = "hms_local_prescriptions";

// Default seed IPD patients for rich initial display
export const DEFAULT_IPD_PATIENTS = [
  {
    admissionId: "ADM-3001",
    ipdNumber: "IPD-2026-1042",
    patientId: "HSP-2026-000101",
    patient: "Aditi Sharma",
    age: 48,
    gender: "Female",
    bloodGroup: "B+",
    ward: "ICU",
    wardId: "WRD-005",
    bedNumber: "ICU-01",
    bedId: "BED-001",
    doctor: "Dr. Rajiv Sharma",
    admissionDate: "2026-08-12",
    status: "Admitted",
    acuity: "Critical",
    diagnosis: "Acute Respiratory Distress Syndrome",
    allergies: "Penicillin, NSAIDs",
    diet: "NPO (Fasting)",
    nurseInCharge: "Sarah Jenkins, RN",
  },
  {
    admissionId: "ADM-3003",
    ipdNumber: "IPD-2026-1043",
    patientId: "HSP-2026-000102",
    patient: "Rohan Verma",
    age: 36,
    gender: "Male",
    bloodGroup: "O+",
    ward: "General Medicine Ward",
    wardId: "WRD-007",
    bedNumber: "GEN-101",
    bedId: "BED-003",
    doctor: "Dr. Rajesh Gupta",
    admissionDate: "2026-08-11",
    status: "Admitted",
    acuity: "Stable",
    diagnosis: "Community Acquired Pneumonia",
    allergies: "Sulfa Drugs",
    diet: "Soft Diet, High Protein",
    nurseInCharge: "David Chen, RN",
  },
  {
    admissionId: "ADM-3008",
    ipdNumber: "IPD-2026-1067",
    patientId: "HSP-2026-000103",
    patient: "Karan Malhotra",
    age: 54,
    gender: "Male",
    bloodGroup: "A+",
    ward: "Cardiology Ward A",
    wardId: "WRD-001",
    bedNumber: "CARD-201",
    bedId: "BED-005",
    doctor: "Dr. Rajiv Sharma",
    admissionDate: "2026-08-12",
    status: "Admitted",
    acuity: "Observation",
    diagnosis: "Unstable Angina & Hypertension",
    allergies: "None Known",
    diet: "Low Sodium, Diabetic Diet",
    nurseInCharge: "Sarah Jenkins, RN",
  },
  {
    admissionId: "ADM-3012",
    ipdNumber: "IPD-2026-1081",
    patientId: "HSP-2026-000104",
    patient: "Meera Nair",
    age: 62,
    gender: "Female",
    bloodGroup: "AB+",
    ward: "Orthopedic Ward A",
    wardId: "WRD-003",
    bedNumber: "ORTH-301",
    bedId: "BED-007",
    doctor: "Dr. Karan Patel",
    admissionDate: "2026-08-12",
    status: "Admitted",
    acuity: "Post-Op",
    diagnosis: "Post-Op Right Femur ORIF",
    allergies: "Aspirin",
    diet: "Normal Diet",
    nurseInCharge: "Emily Watson, RN",
  },
  {
    admissionId: "ADM-3016",
    ipdNumber: "IPD-2026-1104",
    patientId: "PT-1104",
    patient: "Priya Sharma",
    age: 29,
    gender: "Female",
    bloodGroup: "O-",
    ward: "Private Care Ward",
    wardId: "WRD-008",
    bedNumber: "PVT-402",
    bedId: "BED-010",
    doctor: "Dr. Rahul Mehta",
    admissionDate: "2026-08-12",
    status: "Admitted",
    acuity: "Stable",
    diagnosis: "Severe Migraine with Aura",
    allergies: "Codeine",
    diet: "Light Diet",
    nurseInCharge: "David Chen, RN",
  },
  {
    admissionId: "ADM-3024",
    ipdNumber: "IPD-2026-1120",
    patientId: "PT-1120",
    patient: "Sunil Mehta",
    age: 67,
    gender: "Male",
    bloodGroup: "B-",
    ward: "Neurology Ward B",
    wardId: "WRD-002",
    bedNumber: "NEURO-202",
    bedId: "BED-015",
    doctor: "Dr. Priya Sharma",
    admissionDate: "2026-08-12",
    status: "Admitted",
    acuity: "Observation",
    diagnosis: "Transient Ischemic Attack Recovery",
    allergies: "None Known",
    diet: "Low Salt, Soft Puree",
    nurseInCharge: "Emily Watson, RN",
  },
];

// Default Inpatient Medication Orders
const DEFAULT_MED_ORDERS = {
  "ADM-3001": [
    { id: "MED-01", name: "Ceftriaxone IV", dose: "1g", route: "IV", frequency: "Q12H", timing: "Every 12 hrs", doctor: "Dr. Rajiv Sharma", status: "Active", instructions: "Infuse over 30 mins in 100ml NS" },
    { id: "MED-02", name: "Methylprednisolone", dose: "40mg", route: "IV", frequency: "Q8H", timing: "Every 8 hrs", doctor: "Dr. Rajiv Sharma", status: "Active", instructions: "Slow IV push" },
    { id: "MED-03", name: "Paracetamol IV", dose: "1000mg", route: "IV", frequency: "PRN", timing: "SOS for Temp > 38.5C", doctor: "Dr. Rajiv Sharma", status: "Active", instructions: "Max 4g/24hrs" },
    { id: "MED-04", name: "Pantoprazole IV", dose: "40mg", route: "IV", frequency: "OD", timing: "Morning (Fasting)", doctor: "Dr. Rajiv Sharma", status: "Active", instructions: "Before morning meal" },
  ],
  "ADM-3003": [
    { id: "MED-11", name: "Amoxicillin-Clavulanate", dose: "625mg", route: "Oral", frequency: "TID", timing: "After meals (8am - 2pm - 8pm)", doctor: "Dr. Amit Verma", status: "Active", instructions: "Take with water after meal" },
    { id: "MED-12", name: "Azithromycin", dose: "500mg", route: "Oral", frequency: "OD", timing: "Once Daily (10am)", doctor: "Dr. Amit Verma", status: "Active", instructions: "Complete 5 day course" },
    { id: "MED-13", name: "Nebulization Levosalbutamol", dose: "0.63mg", route: "Inhalation", frequency: "Q6H", timing: "Every 6 hrs", doctor: "Dr. Amit Verma", status: "Active", instructions: "With 2.5ml NS" },
    { id: "MED-14", name: "Paracetamol", dose: "650mg", route: "Oral", frequency: "TID", timing: "SOS for Fever/Bodyache", doctor: "Dr. Amit Verma", status: "Active", instructions: "Min 6 hours apart" },
  ],
  "ADM-3008": [
    { id: "MED-21", name: "Aspirin (Ecosprin)", dose: "75mg", route: "Oral", frequency: "OD", timing: "Post Lunch", doctor: "Dr. Neha Singh", status: "Active", instructions: "Do not crush" },
    { id: "MED-22", name: "Clopidogrel", dose: "75mg", route: "Oral", frequency: "OD", timing: "Post Lunch", doctor: "Dr. Neha Singh", status: "Active", instructions: "Cardio protection" },
    { id: "MED-23", name: "Atorvastatin", dose: "40mg", route: "Oral", frequency: "HS", timing: "Bedtime (10pm)", doctor: "Dr. Neha Singh", status: "Active", instructions: "Daily lipid control" },
    { id: "MED-24", name: "Metoprolol Succinate", dose: "25mg", route: "Oral", frequency: "OD", timing: "Morning with Breakfast", doctor: "Dr. Neha Singh", status: "Active", instructions: "Hold if HR < 55 bpm" },
  ],
  "ADM-3012": [
    { id: "MED-31", name: "Cefuroxime Axetil", dose: "500mg", route: "Oral", frequency: "BD", timing: "After Meals (9am - 9pm)", doctor: "Dr. Karan Patel", status: "Active", instructions: "Post-op prophylaxis" },
    { id: "MED-32", name: "Tramadol + Paracetamol", dose: "37.5mg/325mg", route: "Oral", frequency: "TID", timing: "Post Meals", doctor: "Dr. Karan Patel", status: "Active", instructions: "Pain management" },
    { id: "MED-33", name: "Enoxaparin (Clexane)", dose: "40mg (0.4ml)", route: "Subcutaneous", frequency: "OD", timing: "Evening (8pm)", doctor: "Dr. Karan Patel", status: "Active", instructions: "DVT prophylaxis. Abdomen SC" },
    { id: "MED-34", name: "Pantoprazole", dose: "40mg", route: "Oral", frequency: "OD", timing: "Morning (Fasting)", doctor: "Dr. Karan Patel", status: "Active", instructions: "GI protection" },
  ],
  "ADM-3016": [
    { id: "MED-41", name: "Sumatriptan Succinate", dose: "50mg", route: "Oral", frequency: "PRN", timing: "At onset of headache", doctor: "Dr. Rahul Mehta", status: "Active", instructions: "May repeat once after 2 hrs" },
    { id: "MED-42", name: "Ondansetron", dose: "4mg", route: "Oral", frequency: "BD", timing: "Before Meals", doctor: "Dr. Rahul Mehta", status: "Active", instructions: "Anti-emetic" },
    { id: "MED-43", name: "Propranolol ER", dose: "40mg", route: "Oral", frequency: "OD", timing: "Morning", doctor: "Dr. Rahul Mehta", status: "Active", instructions: "Migraine prophylaxis" },
  ],
  "ADM-3024": [
    { id: "MED-51", name: "Aspirin", dose: "150mg", route: "Oral", frequency: "OD", timing: "Post Breakfast", doctor: "Dr. Priya Sharma", status: "Active", instructions: "Antiplatelet" },
    { id: "MED-52", name: "Rosuvastatin", dose: "20mg", route: "Oral", frequency: "HS", timing: "Bedtime", doctor: "Dr. Priya Sharma", status: "Active", instructions: "Plaque stabilization" },
    { id: "MED-53", name: "Telmisartan", dose: "40mg", route: "Oral", frequency: "OD", timing: "Morning", doctor: "Dr. Priya Sharma", status: "Active", instructions: "BP target < 130/80" },
  ],
};

// Seed Vitals
const DEFAULT_VITALS = {
  "ADM-3001": [
    { id: "V-101", timestamp: "2026-08-13 14:00", temp: 38.6, bpSystolic: 138, bpDiastolic: 88, pulse: 104, spo2: 92, resp: 24, consciousness: "Alert", nurseName: "Sarah Jenkins, RN", notes: "SpO2 dropping on room air, started O2 via nasal cannula 2L/min." },
    { id: "V-102", timestamp: "2026-08-13 10:00", temp: 38.2, bpSystolic: 132, bpDiastolic: 84, pulse: 98, spo2: 94, resp: 22, consciousness: "Alert", nurseName: "David Chen, RN", notes: "Patient resting, complains of mild chest tightness." },
    { id: "V-103", timestamp: "2026-08-13 06:00", temp: 37.8, bpSystolic: 128, bpDiastolic: 80, pulse: 92, spo2: 95, resp: 20, consciousness: "Alert", nurseName: "Sarah Jenkins, RN", notes: "Morning vitals stable, IV line patent." },
  ],
  "ADM-3003": [
    { id: "V-201", timestamp: "2026-08-13 13:30", temp: 37.3, bpSystolic: 122, bpDiastolic: 78, pulse: 78, spo2: 97, resp: 18, consciousness: "Alert", nurseName: "David Chen, RN", notes: "Productive cough decreasing, breath sounds clearer." },
    { id: "V-202", timestamp: "2026-08-13 08:00", temp: 37.6, bpSystolic: 124, bpDiastolic: 80, pulse: 82, spo2: 96, resp: 19, consciousness: "Alert", nurseName: "David Chen, RN", notes: "Oral antibiotics tolerated well without nausea." },
  ],
  "ADM-3008": [
    { id: "V-301", timestamp: "2026-08-13 14:15", temp: 36.8, bpSystolic: 142, bpDiastolic: 92, pulse: 74, spo2: 98, resp: 16, consciousness: "Alert", nurseName: "Sarah Jenkins, RN", notes: "ECG monitored; sinus rhythm. BP slightly elevated." },
    { id: "V-302", timestamp: "2026-08-13 09:00", temp: 36.7, bpSystolic: 138, bpDiastolic: 88, pulse: 72, spo2: 99, resp: 16, consciousness: "Alert", nurseName: "Sarah Jenkins, RN", notes: "No chest discomfort reported this morning." },
  ],
  "ADM-3012": [
    { id: "V-401", timestamp: "2026-08-13 12:00", temp: 37.1, bpSystolic: 118, bpDiastolic: 76, pulse: 80, spo2: 98, resp: 17, consciousness: "Alert", nurseName: "Emily Watson, RN", notes: "Post-op Day 1. Pain score 4/10 on Tramadol." },
  ],
  "ADM-3016": [
    { id: "V-501", timestamp: "2026-08-13 11:00", temp: 36.6, bpSystolic: 116, bpDiastolic: 74, pulse: 68, spo2: 99, resp: 15, consciousness: "Alert", nurseName: "David Chen, RN", notes: "Patient sleeping in dimmed room. Headache subsided." },
  ],
  "ADM-3024": [
    { id: "V-601", timestamp: "2026-08-13 10:30", temp: 36.9, bpSystolic: 130, bpDiastolic: 82, pulse: 76, spo2: 97, resp: 16, consciousness: "Alert", nurseName: "Emily Watson, RN", notes: "Neuro check: GCS 15/15. Bilateral limb power 5/5." },
  ],
};

// Seed Nursing Notes
const DEFAULT_NOTES = {
  "ADM-3001": [
    { id: "N-101", timestamp: "2026-08-13 14:10", category: "Urgent Observation", nurseName: "Sarah Jenkins, RN", priority: "High", text: "SpO2 dipped to 92% on ambient air. Titrated O2 via nasal cannula at 2 L/min, SpO2 climbed to 96%. Dr. Rajiv Sharma notified during rounds; recommended chest X-ray review and continuing IV Ceftriaxone." },
    { id: "N-102", timestamp: "2026-08-13 08:30", category: "Shift Summary", nurseName: "David Chen, RN", priority: "Routine", text: "Handover taken from night shift. Patient conscious and oriented. IV cannula in right forearm patent and non-tender. Fluid intake restricted per ICU protocol." },
  ],
  "ADM-3003": [
    { id: "N-201", timestamp: "2026-08-13 13:45", category: "Routine Care", nurseName: "David Chen, RN", priority: "Routine", text: "Patient ambulated in room for 10 minutes without shortness of breath. Completed afternoon dose of oral antibiotics. Sputum now mucoid, less purulent." },
  ],
  "ADM-3008": [
    { id: "N-301", timestamp: "2026-08-13 09:30", category: "Physician Round", nurseName: "Sarah Jenkins, RN", priority: "Routine", text: "Dr. Neha Singh reviewed cardiac enzymes (Troponin I trending down). Patient counseled on low sodium diet and medication compliance. Echo scheduled for tomorrow 11 AM." },
  ],
  "ADM-3012": [
    { id: "N-401", timestamp: "2026-08-13 12:30", category: "Post-Procedure", nurseName: "Emily Watson, RN", priority: "Routine", text: "Surgical site dressing inspected — clean, dry, and intact with no active ooze. Distal pulses palpable and warm. Cryo cuff applied for 20 minutes." },
  ],
};

// Seed MAR Logs
const DEFAULT_MAR_LOGS = {
  "ADM-3001": [
    { id: "MAR-01", timestamp: "2026-08-13 08:00", medicineName: "Ceftriaxone IV 1g", dose: "1g IV", status: "Given", reason: "", nurseName: "David Chen, RN" },
    { id: "MAR-02", timestamp: "2026-08-13 08:00", medicineName: "Pantoprazole IV 40mg", dose: "40mg IV", status: "Given", reason: "", nurseName: "David Chen, RN" },
    { id: "MAR-03", timestamp: "2026-08-13 12:00", medicineName: "Paracetamol IV 1000mg", dose: "1000mg IV", status: "Not Given", reason: "Patient afebrile (Temp 37.3C), SOS criteria not met", nurseName: "Sarah Jenkins, RN" },
  ],
  "ADM-3003": [
    { id: "MAR-11", timestamp: "2026-08-13 08:00", medicineName: "Amoxicillin-Clavulanate 625mg", dose: "625mg Oral", status: "Given", reason: "", nurseName: "David Chen, RN" },
    { id: "MAR-12", timestamp: "2026-08-13 10:00", medicineName: "Azithromycin 500mg", dose: "500mg Oral", status: "Given", reason: "", nurseName: "David Chen, RN" },
  ],
};

// ---------------------------------------------------------------------------
// Store Functions
// ---------------------------------------------------------------------------

/** Get all current admitted IPD patients merging beds, admissions & defaults */
export function getIPDPatients() {
  if (typeof window === "undefined") return DEFAULT_IPD_PATIENTS;

  let localAdmissions = [];
  try {
    localAdmissions = JSON.parse(localStorage.getItem(ADMISSIONS_STORAGE_KEY) || "[]");
  } catch (_) {}

  const beds = getBedsFromStorage();
  const occupiedBeds = beds.filter((b) => b.status === "Occupied");

  const map = new Map();

  // 1. Put defaults first
  DEFAULT_IPD_PATIENTS.forEach((p) => {
    map.set(p.admissionId, { ...p });
  });

  // 2. Overlay localStorage admissions
  localAdmissions.forEach((a) => {
    if (a.status === "Admitted" || !a.status) {
      const id = a.admissionId || a.id;
      const existing = map.get(id) || {};
      map.set(id, {
        admissionId: id,
        ipdNumber: a.ipdNumber || existing.ipdNumber || `IPD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: a.patientId || existing.patientId || `PT-${id}`,
        patient: a.patient || existing.patient || "Admitted Patient",
        age: a.age || existing.age || 45,
        gender: a.gender || existing.gender || "Not specified",
        bloodGroup: a.bloodGroup || existing.bloodGroup || "O+",
        ward: a.ward || existing.ward || "General Ward",
        wardId: a.wardId || existing.wardId || "WRD-007",
        bedNumber: a.bedNumber || existing.bedNumber || "Bed 1",
        bedId: a.bedId || existing.bedId || "BED-001",
        doctor: a.doctor || existing.doctor || "Attending Physician",
        admissionDate: a.admissionDate || existing.admissionDate || new Date().toISOString().slice(0, 10),
        status: "Admitted",
        acuity: a.acuity || existing.acuity || "Stable",
        diagnosis: a.reason || a.diagnosis || existing.diagnosis || "Inpatient Care",
        allergies: a.allergies || existing.allergies || "None documented",
        diet: a.diet || existing.diet || "Standard Diet",
        nurseInCharge: a.nurseInCharge || existing.nurseInCharge || "Staff Nurse, RN",
      });
    }
  });

  // 3. Match occupied beds if any admission isn't registered yet
  occupiedBeds.forEach((bed) => {
    if (bed.patient && bed.admissionId && !map.has(bed.admissionId)) {
      map.set(bed.admissionId, {
        admissionId: bed.admissionId,
        ipdNumber: `IPD-2026-${bed.patientId?.replace(/\D/g, "") || "9001"}`,
        patientId: bed.patientId || `PT-${bed.id}`,
        patient: bed.patient,
        age: 42,
        gender: "Not specified",
        bloodGroup: "O+",
        ward: bed.ward,
        wardId: bed.wardId,
        bedNumber: bed.bedNumber,
        bedId: bed.id,
        doctor: bed.assignedDoctor || "Attending Physician",
        admissionDate: "2026-08-12",
        status: "Admitted",
        acuity: bed.type === "ICU" ? "Critical" : "Stable",
        diagnosis: bed.type === "ICU" ? "ICU Critical Care" : "Inpatient Observation",
        allergies: "None documented",
        diet: "Standard Diet",
        nurseInCharge: "Staff Nurse, RN",
      });
    }
  });

  return Array.from(map.values());
}

/** Get single IPD patient by admissionId or patientId */
export function getIPDPatientById(id) {
  if (!id) return null;
  const patients = getIPDPatients();
  const normalized = decodeURIComponent(String(id)).toLowerCase();
  return (
    patients.find(
      (p) =>
        p.admissionId.toLowerCase() === normalized ||
        p.patientId?.toLowerCase() === normalized ||
        p.ipdNumber?.toLowerCase() === normalized ||
        p.patient?.toLowerCase() === normalized
    ) || {
      admissionId: id,
      ipdNumber: `IPD-${id}`,
      patientId: id,
      patient: `Patient ${id}`,
      age: 40,
      gender: "Male",
      bloodGroup: "O+",
      ward: "General Medicine Ward",
      wardId: "WRD-007",
      bedNumber: "GEN-101",
      bedId: "BED-003",
      doctor: "Dr. Amit Verma",
      admissionDate: new Date().toISOString().slice(0, 10),
      status: "Admitted",
      acuity: "Stable",
      diagnosis: "Inpatient Clinical Management",
      allergies: "None Known",
      diet: "Regular Diet",
      nurseInCharge: "Sarah Jenkins, RN",
    }
  );
}

// ---------------------------------------------------------------------------
// Vitals Operations
// ---------------------------------------------------------------------------

export function getPatientVitals(patientKey) {
  if (typeof window === "undefined") return DEFAULT_VITALS[patientKey] || [];
  try {
    const raw = localStorage.getItem(VITALS_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    if (store[patientKey] && Array.isArray(store[patientKey])) {
      return store[patientKey];
    }
    // Seed default if not in store
    if (DEFAULT_VITALS[patientKey]) {
      store[patientKey] = DEFAULT_VITALS[patientKey];
      localStorage.setItem(VITALS_STORAGE_KEY, JSON.stringify(store));
      return DEFAULT_VITALS[patientKey];
    }
  } catch (_) {}
  return [];
}

export function savePatientVital(patientKey, vital) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VITALS_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const current = store[patientKey] || DEFAULT_VITALS[patientKey] || [];
    const newEntry = {
      id: `V-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      ...vital,
    };
    const updated = [newEntry, ...current];
    store[patientKey] = updated;
    localStorage.setItem(VITALS_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("hms_vitals_updated"));
    return updated;
  } catch (_) {}
  return [];
}

// ---------------------------------------------------------------------------
// Medication & MAR Operations
// ---------------------------------------------------------------------------

export function getPatientMedications(patientKey, patientName) {
  const orders = DEFAULT_MED_ORDERS[patientKey] ? [...DEFAULT_MED_ORDERS[patientKey]] : [];

  if (typeof window !== "undefined") {
    try {
      const rxRaw = localStorage.getItem(PRESCRIPTIONS_STORAGE_KEY);
      const rxList = rxRaw ? JSON.parse(rxRaw) : [];
      rxList.forEach((rx) => {
        const matchesPatient =
          (patientName && rx.patient && rx.patient.toLowerCase() === patientName.toLowerCase()) ||
          (rx.patientId && rx.patientId === patientKey);

        if (matchesPatient && Array.isArray(rx.medicines)) {
          rx.medicines.forEach((med, idx) => {
            if (med.name) {
              orders.push({
                id: `RX-${rx.prescriptionId || rx.id}-${idx}`,
                name: med.name,
                dose: med.dosage || "1 dose",
                route: "Oral",
                frequency: med.frequency || "Once daily",
                timing: med.timing || "After meal",
                doctor: rx.doctorName || "Prescribing Doctor",
                status: rx.status || "Active",
                instructions: med.instructions || "As prescribed",
              });
            }
          });
        }
      });
    } catch (_) {}
  }

  if (orders.length === 0) {
    return [
      { id: "MED-DEF-1", name: "Paracetamol", dose: "650mg", route: "Oral", frequency: "TID", timing: "Post Meals", doctor: "Attending Doctor", status: "Active", instructions: "SOS for body ache" },
      { id: "MED-DEF-2", name: "Pantoprazole", dose: "40mg", route: "Oral", frequency: "OD", timing: "Morning (Fasting)", doctor: "Attending Doctor", status: "Active", instructions: "Before breakfast" },
    ];
  }

  return orders;
}

export function getPatientMedicationLogs(patientKey) {
  if (typeof window === "undefined") return DEFAULT_MAR_LOGS[patientKey] || [];
  try {
    const raw = localStorage.getItem(MED_LOGS_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    if (store[patientKey] && Array.isArray(store[patientKey])) {
      return store[patientKey];
    }
    if (DEFAULT_MAR_LOGS[patientKey]) {
      store[patientKey] = DEFAULT_MAR_LOGS[patientKey];
      localStorage.setItem(MED_LOGS_STORAGE_KEY, JSON.stringify(store));
      return DEFAULT_MAR_LOGS[patientKey];
    }
  } catch (_) {}
  return [];
}

export function recordMedicationAdministration(patientKey, logEntry) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MED_LOGS_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const current = store[patientKey] || DEFAULT_MAR_LOGS[patientKey] || [];
    const newRecord = {
      id: `MAR-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      ...logEntry,
    };
    const updated = [newRecord, ...current];
    store[patientKey] = updated;
    localStorage.setItem(MED_LOGS_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("hms_mar_updated"));
    return updated;
  } catch (_) {}
  return [];
}

// ---------------------------------------------------------------------------
// Nursing Notes Operations
// ---------------------------------------------------------------------------

export function getPatientNotes(patientKey) {
  if (typeof window === "undefined") return DEFAULT_NOTES[patientKey] || [];
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    if (store[patientKey] && Array.isArray(store[patientKey])) {
      return store[patientKey];
    }
    if (DEFAULT_NOTES[patientKey]) {
      store[patientKey] = DEFAULT_NOTES[patientKey];
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(store));
      return DEFAULT_NOTES[patientKey];
    }
  } catch (_) {}
  return [];
}

export function savePatientNote(patientKey, note) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const current = store[patientKey] || DEFAULT_NOTES[patientKey] || [];
    const newNote = {
      id: `NOTE-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      priority: "Routine",
      ...note,
    };
    const updated = [newNote, ...current];
    store[patientKey] = updated;
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("hms_notes_updated"));
    return updated;
  } catch (_) {}
  return [];
}

export function deletePatientNote(patientKey, noteId) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const current = store[patientKey] || DEFAULT_NOTES[patientKey] || [];
    const updated = current.filter((n) => n.id !== noteId);
    store[patientKey] = updated;
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("hms_notes_updated"));
    return updated;
  } catch (_) {}
  return [];
}
