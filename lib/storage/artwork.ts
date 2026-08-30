/**
 * Authoritative Artwork & Supabase Storage Configuration & Validation Utilities
 */

export const ARTWORK_BUCKET = "artwork";

export const MAX_ARTWORK_SIZE_MB = 25;
export const MAX_ARTWORK_SIZE_BYTES = MAX_ARTWORK_SIZE_MB * 1024 * 1024; // 25 MB

export const ALLOWED_ARTWORK_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
] as const;

export const ALLOWED_ARTWORK_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".tif",
  ".tiff",
] as const;

export interface ArtworkFileMetadata {
  bucket: string;
  storagePath: string;
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
  fileExtension: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
  extension?: string;
}

/**
 * Validates a file's name, extension, MIME type, and size
 */
export function validateArtworkFile(
  fileName: string,
  mimeType: string,
  fileSizeBytes: number
): ValidationResult {
  // 1. Size check
  if (fileSizeBytes <= 0) {
    return { valid: false, error: "The selected file is empty." };
  }

  if (fileSizeBytes > MAX_ARTWORK_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${MAX_ARTWORK_SIZE_MB}MB. Please compress your file or select a smaller artwork.`,
    };
  }

  // 2. Filename normalization & security
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
  if (cleanName.includes("..") || cleanName.startsWith("/") || cleanName.startsWith("\\")) {
    return { valid: false, error: "Invalid or unsafe file name." };
  }

  const dotIndex = cleanName.lastIndexOf(".");
  if (dotIndex === -1) {
    return { valid: false, error: "File must have a valid extension (e.g. .pdf, .png, .jpg)." };
  }

  const ext = cleanName.slice(dotIndex);
  if (!ALLOWED_ARTWORK_EXTENSIONS.includes(ext as (typeof ALLOWED_ARTWORK_EXTENSIONS)[number])) {
    return {
      valid: false,
      error: `Unsupported file extension (${ext}). Please upload a PDF, PNG, JPG, WEBP, or TIFF file.`,
    };
  }

  // 3. MIME type check
  const normalizedMime = mimeType.toLowerCase();
  if (
    normalizedMime &&
    !ALLOWED_ARTWORK_MIME_TYPES.includes(normalizedMime as (typeof ALLOWED_ARTWORK_MIME_TYPES)[number])
  ) {
    return {
      valid: false,
      error: `Unsupported file format (${mimeType}). Please upload a print-ready PDF, PNG, JPG, WEBP, or TIFF.`,
    };
  }

  return {
    valid: true,
    sanitizedName: cleanName,
    extension: ext,
  };
}

/**
 * Generates an ownership-aware secure storage path:
 * uploads/{userId}/{cartSessionId}/{uniqueFileId}.{ext}
 */
export function generateArtworkStoragePath(
  userId: string | null,
  sessionId: string,
  extension: string
): string {
  const userSegment = userId ? `u_${userId}` : "guest";
  const uniqueId = crypto.randomUUID();
  const cleanExt = extension.startsWith(".") ? extension : `.${extension}`;
  return `${userSegment}/${sessionId}/${uniqueId}${cleanExt}`;
}
