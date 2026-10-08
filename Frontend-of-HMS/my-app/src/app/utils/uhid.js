/**
 * MediCare HMS — UHID Utilities
 *
 * UHID format:  HSP-{YYYY}-{6-digit zero-padded sequence}
 * Example:      HSP-2026-000124
 *
 * The sequence counter is persisted in localStorage under `hms_uhid_seq`.
 * On init, we sync with the backend to ensure the local counter is always
 * AHEAD of the highest UHID already in the database, preventing collisions.
 */

const STORAGE_KEY = "hms_uhid_seq";
const PREFIX      = "HSP";

// ---------------------------------------------------------------------------
// Sync with backend — call once on app load or before generating a UHID
// ---------------------------------------------------------------------------
let _syncPromise = null; // singleton — only sync once per session

/**
 * Fetches all patients from the API and bumps the local sequence counter
 * so it's always higher than any existing UHID in the database.
 * Safe to call multiple times — deduped via a singleton promise.
 */
export async function syncUHIDSequenceWithDB() {
  if (_syncPromise) return _syncPromise; // already syncing/synced

  _syncPromise = (async () => {
    try {
      const API_BASE = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "http://localhost:8000/api";
      const token =
        (typeof window !== "undefined" && (
          localStorage.getItem("hms_token") ||
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken")
        )) || "";

      const resp = await fetch(`${API_BASE}/patients`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!resp.ok) return;

      const json = await resp.json();
      const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

      // Find the highest sequence number across all existing UHIDs
      let maxSeq = 0;
      list.forEach((p) => {
        const uhid = p.uhid || p.patientId || "";
        const parsed = parseUHID(uhid);
        if (parsed && parsed.sequence > maxSeq) {
          maxSeq = parsed.sequence;
        }
      });

      // Bump local counter if it's behind
      const current = _readSequence();
      if (maxSeq >= current) {
        _writeSequence(maxSeq); // next call to generateUHID will use maxSeq + 1
        console.log(`[UHID] Synced sequence to ${maxSeq} (was ${current}). Next UHID: HSP-${new Date().getFullYear()}-${String(maxSeq + 1).padStart(6, "0")}`);
      }
    } catch {
      // Silently ignore — we'll just use the local counter as-is
    }
  })();

  return _syncPromise;
}

// ---------------------------------------------------------------------------
// generateUHID
// ---------------------------------------------------------------------------
/**
 * Generates the next UHID and increments the stored sequence counter.
 * NOTE: Call syncUHIDSequenceWithDB() before this in the registration form
 * to ensure no collisions with existing database records.
 *
 * @param {number} [year]  - Override the year (defaults to current year)
 * @returns {string}       - e.g. "HSP-2026-000124"
 */
export function generateUHID(year) {
  const y      = year ?? new Date().getFullYear();
  const seq    = _nextSequence();
  const padded = String(seq).padStart(6, "0");
  return `${PREFIX}-${y}-${padded}`;
}

// ---------------------------------------------------------------------------
// parseUHID
// ---------------------------------------------------------------------------
/**
 * Parses a UHID string into its parts.
 *
 * @param {string} uhid
 * @returns {{ prefix: string, year: number, sequence: number } | null}
 */
export function parseUHID(uhid) {
  if (!uhid || typeof uhid !== "string") return null;
  const parts = uhid.split("-");
  if (parts.length !== 3) return null;
  const sequence = parseInt(parts[2], 10);
  if (isNaN(sequence)) return null;
  return {
    prefix:   parts[0],
    year:     parseInt(parts[1], 10),
    sequence,
  };
}

// ---------------------------------------------------------------------------
// isValidUHID
// ---------------------------------------------------------------------------
/**
 * Returns true if the string looks like a valid UHID.
 *
 * @param {string} value
 * @returns {boolean}
 */
export function isValidUHID(value) {
  if (!value) return false;
  return /^HSP-\d{4}-\d{6}$/.test(value.trim().toUpperCase());
}

// ---------------------------------------------------------------------------
// peekNextUHID
// ---------------------------------------------------------------------------
/**
 * Returns what the NEXT UHID will look like without incrementing the counter.
 * Useful for displaying a preview to the user before saving.
 *
 * @param {number} [year]
 * @returns {string}
 */
export function peekNextUHID(year) {
  const y      = year ?? new Date().getFullYear();
  const seq    = _peekSequence();
  const padded = String(seq).padStart(6, "0");
  return `${PREFIX}-${y}-${padded}`;
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------
function _readSequence() {
  if (typeof window === "undefined") return 100; // SSR fallback
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return 100; // start from 100 for realistic look
    const n = parseInt(raw, 10);
    return isNaN(n) ? 100 : n;
  } catch {
    return 100;
  }
}

function _writeSequence(n) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, String(n));
  } catch {
    // ignore storage errors
  }
}

function _nextSequence() {
  const current = _readSequence();
  const next    = current + 1;
  _writeSequence(next);
  return next;
}

function _peekSequence() {
  return _readSequence() + 1;
}
