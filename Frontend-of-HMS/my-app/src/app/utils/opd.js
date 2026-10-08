/**
 * MediCare HMS — OPD (Out-Patient Department) Utilities
 *
 * Handles:
 *  - Token generation:  C-24 for Cardiology, G-07 for General Medicine, etc.
 *  - Queue store:       localStorage-backed queue, per-day reset, CRUD helpers
 *  - Token status:      Waiting → In Consultation → Completed | Cancelled
 */

// ---------------------------------------------------------------------------
// 1. Department → token prefix map
// ---------------------------------------------------------------------------
export const DEPT_PREFIX = Object.freeze({
  "Cardiology":        "C",
  "Orthopedics":       "O",
  "Neurology":         "N",
  "General Medicine":  "G",
  "Pediatrics":        "P",
  "Gynecology":        "GY",
  "Dermatology":       "D",
  "Ophthalmology":     "OP",
  "ENT":               "E",
  "Psychiatry":        "PS",
  "Oncology":          "ON",
  "Nephrology":        "NE",
  "Gastroenterology":  "GA",
  "Pulmonology":       "PU",
  "Endocrinology":     "EN",
  "Radiology":         "R",
  "Emergency":         "EM",
});

/** Get department prefix, fallback to first two uppercase letters */
export function getDeptPrefix(department) {
  if (!department) return "Q";
  return DEPT_PREFIX[department] ?? department.slice(0, 2).toUpperCase();
}

// ---------------------------------------------------------------------------
// 2. Token sequence storage (per department, resets daily)
// ---------------------------------------------------------------------------
const SEQ_KEY_PREFIX = "hms_opd_seq_"; // + dept prefix + date

function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function seqKey(deptPrefix) {
  return `${SEQ_KEY_PREFIX}${deptPrefix}_${todayStr()}`;
}

function readSeq(deptPrefix) {
  try {
    const n = parseInt(localStorage.getItem(seqKey(deptPrefix)), 10);
    return isNaN(n) ? 0 : n;
  } catch {
    return 0;
  }
}

function writeSeq(deptPrefix, n) {
  try { localStorage.setItem(seqKey(deptPrefix), String(n)); } catch { /* ignore */ }
}

/** Remove OPD sequence keys older than 7 days to prevent localStorage bloat */
function cleanupOldSeqKeys() {
  try {
    const today   = new Date();
    const cutoff  = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const keys    = Object.keys(localStorage).filter(k => k.startsWith(SEQ_KEY_PREFIX));
    keys.forEach(k => {
      // key format: hms_opd_seq_{prefix}_YYYY-MM-DD
      const parts    = k.split("_");
      const dateStr  = parts[parts.length - 1]; // last segment
      const keyDate  = new Date(dateStr);
      if (!isNaN(keyDate) && keyDate < cutoff) {
        localStorage.removeItem(k);
      }
    });
  } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// 3. generateToken
// ---------------------------------------------------------------------------
/**
 * Generate the next OPD token for a department.
 * Format: {PREFIX}-{NN}  e.g. C-24, G-07
 *
 * @param {string} department
 * @returns {string}
 */
export function generateToken(department) {
  cleanupOldSeqKeys(); // prune stale keys (>7 days)
  const prefix = getDeptPrefix(department);
  const next   = readSeq(prefix) + 1;
  writeSeq(prefix, next);
  return `${prefix}-${String(next).padStart(2, "0")}`;
}

/** Preview next token without incrementing */
export function peekToken(department) {
  const prefix = getDeptPrefix(department);
  const next   = readSeq(prefix) + 1;
  return `${prefix}-${String(next).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// 4. Queue store  (localStorage key: hms_opd_queue)
// ---------------------------------------------------------------------------
const QUEUE_KEY = "hms_opd_queue";

/** @returns {QueueEntry[]} */
export function readQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

/** @param {QueueEntry[]} queue */
function saveQueue(queue) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); } catch { /* ignore */ }
}

/**
 * Add a new entry to the OPD queue.
 *
 * @param {{
 *   appointmentId: string,
 *   token:         string,
 *   patient:       string,
 *   patientId:     string,
 *   patientUhid:   string,
 *   doctor:        string,
 *   department:    string,
 *   date:          string,
 *   time:          string,
 *   notes:         string,
 * }} entry
 * @returns {QueueEntry}
 */
export function enqueue(entry) {
  const queue = readQueue();
  const queueEntry = {
    ...entry,
    id:              entry.appointmentId || `QE-${Date.now()}`,
    status:          "Waiting",   // Waiting | In Consultation | Completed | Cancelled
    enqueuedAt:      new Date().toISOString(),
    consultationStartedAt: null,
    completedAt:     null,
    vitals:          null,
    consultation:    null,        // { symptoms, diagnosis, notes }
    prescription:    null,        // { drugs[] }
    labOrders:       null,        // { tests[] }
  };
  queue.unshift(queueEntry); // newest at top for easy searching
  saveQueue(queue);
  return queueEntry;
}

/**
 * Update the status of a queue entry.
 * @param {string} id
 * @param {"Waiting"|"In Consultation"|"Completed"|"Cancelled"} status
 * @param {object} [extra] - additional fields to merge
 */
export function updateQueueStatus(id, status, extra = {}) {
  const queue = readQueue();
  const idx   = queue.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  queue[idx] = {
    ...queue[idx],
    ...extra,
    status,
    ...(status === "In Consultation" ? { consultationStartedAt: now } : {}),
    ...(status === "Completed"       ? { completedAt: now }           : {}),
  };
  saveQueue(queue);
  return queue[idx];
}

/**
 * Save consultation data (vitals, diagnosis, prescription, lab orders).
 * @param {string} id
 * @param {object} data
 */
export function saveConsultation(id, data) {
  return updateQueueStatus(id, "Completed", data);
}

/**
 * Get a single queue entry by id.
 * @param {string} id
 * @returns {QueueEntry|null}
 */
export function getQueueEntry(id) {
  return readQueue().find((e) => e.id === id || e.token === id || e.appointmentId === id) ?? null;
}

/**
 * Get today's queue, optionally filtered by doctor name.
 * @param {string} [doctorFilter]
 * @returns {QueueEntry[]}
 */
export function getTodayQueue(doctorFilter) {
  const today = todayStr();
  const queue = readQueue().filter((e) => (e.date ?? "").startsWith(today));
  if (doctorFilter) {
    return queue.filter((e) =>
      e.doctor.toLowerCase().includes(doctorFilter.toLowerCase())
    );
  }
  return queue;
}

// ---------------------------------------------------------------------------
// 5. Status ordering helper
// ---------------------------------------------------------------------------
const STATUS_ORDER = { "In Consultation": 0, "Waiting": 1, "Completed": 2, "Cancelled": 3 };

/** Sort queue: In Consultation first, then Waiting by token, then Completed */
export function sortQueue(queue) {
  return [...queue].sort((a, b) => {
    const oa = STATUS_ORDER[a.status] ?? 9;
    const ob = STATUS_ORDER[b.status] ?? 9;
    if (oa !== ob) return oa - ob;
    // Within same status, sort by token number
    const na = parseInt(a.token?.split("-")[1] ?? "0", 10);
    const nb = parseInt(b.token?.split("-")[1] ?? "0", 10);
    return na - nb;
  });
}
