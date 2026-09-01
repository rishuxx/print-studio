import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV recommended for GCM

/**
 * Derives a consistent 32-byte key from environment encryption secret
 * or a secure deterministic application key.
 */
function getEncryptionKey(): Buffer {
  const secret =
    process.env.WHATSAPP_SECRET_ENCRYPTION_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RAZORPAY_KEY_SECRET ||
    "preetyprints_production_whatsapp_secure_enc_key_fallback_2026";

  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a sensitive string (e.g. WhatsApp Access Token) using AES-256-GCM.
 * Output format: iv_hex:auth_tag_hex:ciphertext_hex
 */
export function encryptSecret(plainText: string): string {
  if (!plainText) return "";

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a previously encrypted secret string.
 * Returns null if decryption fails or format is invalid.
 */
export function decryptSecret(encryptedPayload: string | null | undefined): string | null {
  if (!encryptedPayload) return null;

  try {
    const parts = encryptedPayload.split(":");
    if (parts.length !== 3) {
      return null;
    }

    const [ivHex, authTagHex, ciphertextHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("[WhatsApp Encryption] Decryption failed or tampered payload:", err);
    return null;
  }
}

/**
 * Returns a masked representation of an access token for safe UI display (e.g. ••••••••••••abcd)
 */
export function maskToken(token: string | null | undefined): string {
  if (!token || token.trim().length === 0) {
    return "Not Configured";
  }

  const clean = token.trim();
  if (clean.length <= 8) {
    return "••••••••";
  }

  const suffix = clean.slice(-4);
  return `••••••••••••••••${suffix}`;
}
