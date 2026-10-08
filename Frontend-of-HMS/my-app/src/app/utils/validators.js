/**
 * HMS — Frontend Validators
 * Reusable validation functions for all form fields.
 */

/** True if the string is non-empty */
export const isRequired = (v) => Boolean(v && String(v).trim());

/** Indian mobile: 10 digits, starting with 6–9 */
export const isPhone = (v) => /^[6-9]\d{9}$/.test(String(v).replace(/\s/g, ""));

/** Basic email check */
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v));

/** Valid date string or Date object */
export const isDate = (v) => !isNaN(new Date(v).getTime());

/** Non-negative number */
export const isPositiveNumber = (v) => !isNaN(Number(v)) && Number(v) >= 0;

/** Age between 0 and 130 */
export const isValidAge = (v) => Number(v) >= 0 && Number(v) <= 130;

/** MongoDB ObjectId (24 hex chars) */
export const isObjectId = (v) => /^[a-f\d]{24}$/i.test(String(v));

/**
 * Validate a patient form object.
 * Returns { valid: boolean, errors: { field: message } }
 */
export function validatePatient(data) {
  const errors = {};
  if (!isRequired(data.name)) errors.name = "Patient name is required.";
  if (data.phone && !isPhone(data.phone)) errors.phone = "Enter a valid 10-digit mobile number.";
  if (data.email && !isEmail(data.email)) errors.email = "Enter a valid email address.";
  if (data.age && !isValidAge(data.age)) errors.age = "Age must be between 0 and 130.";
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate an appointment form object.
 */
export function validateAppointment(data) {
  const errors = {};
  if (!isRequired(data.patientId)) errors.patientId = "Patient is required.";
  if (!isRequired(data.doctorId)) errors.doctorId = "Doctor is required.";
  if (!data.appointmentDate || !isDate(data.appointmentDate)) errors.appointmentDate = "Valid date is required.";
  if (!isRequired(data.appointmentTime)) errors.appointmentTime = "Time is required.";
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate a billing form object.
 */
export function validateBilling(data) {
  const errors = {};
  if (!isRequired(data.patientId)) errors.patientId = "Patient is required.";
  if (!isPositiveNumber(data.totalAmount)) errors.totalAmount = "Total amount must be a positive number.";
  return { valid: Object.keys(errors).length === 0, errors };
}
