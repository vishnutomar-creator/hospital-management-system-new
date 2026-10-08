/**
 * Format a number as Indian Rupees (or any currency).
 * @param {number} amount
 * @param {string} [currency="INR"]
 * @returns {string}  e.g. "₹1,23,456.00"
 */
export function formatCurrency(amount, currency = "INR") {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

/**
 * Compact format — no paise for whole numbers.
 * e.g. "₹1,23,456"
 */
export function formatCurrencyCompact(amount, currency = "INR") {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}
