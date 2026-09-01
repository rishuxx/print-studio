/**
 * Production-grade Phone Number Normalization
 * Formats numbers into clean E.164 and Meta WhatsApp Cloud API format (without '+' prefix).
 */

export interface NormalizedPhoneResult {
  isValid: boolean;
  e164: string; // e.g. "+916388693472"
  metaFormat: string; // e.g. "916388693472"
  countryCode: string; // e.g. "91"
  nationalNumber: string; // e.g. "6388693472"
  error?: string;
}

export function normalizeWhatsAppPhone(
  rawPhone: string | null | undefined,
  defaultCountryCode = "91"
): NormalizedPhoneResult {
  if (!rawPhone || typeof rawPhone !== "string") {
    return {
      isValid: false,
      e164: "",
      metaFormat: "",
      countryCode: defaultCountryCode,
      nationalNumber: "",
      error: "Phone number is empty or missing.",
    };
  }

  // Remove all non-digits except a leading +
  const hasPlus = rawPhone.trim().startsWith("+");
  const digitsOnly = rawPhone.replace(/\D/g, "");

  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return {
      isValid: false,
      e164: "",
      metaFormat: "",
      countryCode: defaultCountryCode,
      nationalNumber: digitsOnly,
      error: `Invalid phone digit count (${digitsOnly.length}). Expected 7-15 digits.`,
    };
  }

  // 1. If customer entered with explicit + (e.g. +91 9876543210, +1 4155552671)
  if (hasPlus) {
    return {
      isValid: true,
      e164: `+${digitsOnly}`,
      metaFormat: digitsOnly,
      countryCode: digitsOnly.slice(0, digitsOnly.length - 10) || defaultCountryCode,
      nationalNumber: digitsOnly.slice(-10),
    };
  }

  // 2. If it's a 10-digit Indian standard number (e.g. 6388693472, 9876543210)
  if (digitsOnly.length === 10) {
    return {
      isValid: true,
      e164: `+${defaultCountryCode}${digitsOnly}`,
      metaFormat: `${defaultCountryCode}${digitsOnly}`,
      countryCode: defaultCountryCode,
      nationalNumber: digitsOnly,
    };
  }

  // 3. If standard Indian number starts with 0 (e.g. 09876543210 -> 11 digits)
  if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    const cleanNational = digitsOnly.slice(1);
    return {
      isValid: true,
      e164: `+${defaultCountryCode}${cleanNational}`,
      metaFormat: `${defaultCountryCode}${cleanNational}`,
      countryCode: defaultCountryCode,
      nationalNumber: cleanNational,
    };
  }

  // 4. If standard 12-digit Indian number with country prefix (e.g. 919876543210)
  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    return {
      isValid: true,
      e164: `+${digitsOnly}`,
      metaFormat: digitsOnly,
      countryCode: "91",
      nationalNumber: digitsOnly.slice(2),
    };
  }

  // 5. General international fallback (11-15 digits already containing country code)
  return {
    isValid: true,
    e164: `+${digitsOnly}`,
    metaFormat: digitsOnly,
    countryCode: defaultCountryCode,
    nationalNumber: digitsOnly,
  };
}

/**
 * Returns a masked phone number for safe display in message logs (e.g. +91 6388•••472)
 */
export function maskPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "—";
  const clean = phone.replace(/[^0-9+]/g, "");
  if (clean.length < 8) return clean;

  const prefix = clean.slice(0, 5);
  const suffix = clean.slice(-3);
  return `${prefix}••••${suffix}`;
}
