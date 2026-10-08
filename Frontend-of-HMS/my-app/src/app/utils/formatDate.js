/**
 * Format a date as "04 Oct 2026"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return String(date).slice(0, 10);
  }
}

/**
 * Format a date-time as "04 Oct 2026, 09:30 AM"
 */
export function formatDateTime(date) {
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  } catch {
    return String(date).slice(0, 16);
  }
}

/**
 * Returns "2 hours ago", "just now", etc.
 */
export function timeAgo(date) {
  if (!date) return "—";
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Return ISO date string YYYY-MM-DD for today
 */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
