/**
 * Formats any raw phone string into a valid E.164 tel: URI scheme (RFC 3966).
 * Strips spaces, hyphens, brackets, and non-numeric/non-plus characters.
 * Ensures country code +91 is added if missing for 10-digit Indian numbers.
 *
 * Example:
 * formatTelUri("+91 73066 33171") -> "tel:+917306633171"
 * formatTelUri("9655125480") -> "tel:+919655125480"
 */
export function formatTelUri(phone?: string | null): string {
  if (!phone) return "tel:+917306633171";

  // Clean all characters except digits and leading plus
  let cleaned = phone.replace(/[^\d+]/g, "");

  // If number starts with 00, replace with +
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }

  // If 10 digits without country code, prepend +91
  if (/^\d{10}$/.test(cleaned)) {
    cleaned = "+91" + cleaned;
  }

  // If 12 digits starting with 91 without +, prepend +
  if (/^91\d{10}$/.test(cleaned)) {
    cleaned = "+" + cleaned;
  }

  // Fallback if empty or invalid
  if (!cleaned || cleaned === "+") {
    return "tel:+917306633171";
  }

  return `tel:${cleaned}`;
}

/**
 * Formats a phone number for user display (e.g. "+91 73066 33171").
 */
export function formatDisplayPhone(phone?: string | null): string {
  if (!phone) return "+91 73066 33171";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone;
}
