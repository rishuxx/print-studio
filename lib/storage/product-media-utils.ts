export const PRODUCT_MEDIA_BUCKET = "product-media";
export const MAX_PRODUCT_MEDIA_MB = 15;
export const MAX_PRODUCT_MEDIA_BYTES = MAX_PRODUCT_MEDIA_MB * 1024 * 1024;

export const ALLOWED_MEDIA_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".svg",
] as const;

export const ALLOWED_MEDIA_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
] as const;

export interface MediaValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
  extension?: string;
}

/**
 * Validate product media file before upload
 */
export function validateProductMediaFile(
  fileName: string,
  mimeType: string,
  fileSizeBytes: number
): MediaValidationResult {
  if (!fileName || !mimeType) {
    return { valid: false, error: "Missing file name or MIME type." };
  }

  // Size limit
  if (fileSizeBytes > MAX_PRODUCT_MEDIA_BYTES) {
    return {
      valid: false,
      error: `File size (${(fileSizeBytes / 1024 / 1024).toFixed(1)}MB) exceeds maximum limit of ${MAX_PRODUCT_MEDIA_MB}MB.`,
    };
  }

  if (fileSizeBytes === 0) {
    return { valid: false, error: "File is empty." };
  }

  // MIME check
  if (!ALLOWED_MEDIA_MIME_TYPES.includes(mimeType as any)) {
    return {
      valid: false,
      error: `File format '${mimeType}' is not supported. Allowed formats: JPG, PNG, WEBP, AVIF, SVG.`,
    };
  }

  // Extension check
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) {
    return { valid: false, error: "File must have an extension." };
  }

  const ext = fileName.slice(lastDot).toLowerCase();
  if (!ALLOWED_MEDIA_EXTENSIONS.includes(ext as any)) {
    return {
      valid: false,
      error: `Extension '${ext}' is not permitted. Allowed: ${ALLOWED_MEDIA_EXTENSIONS.join(", ")}`,
    };
  }

  const sanitized = fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_");

  return {
    valid: true,
    sanitizedName: sanitized,
    extension: ext,
  };
}

/**
 * Generate canonical storage key for product media
 */
export function generateProductMediaStoragePath(
  productId: string,
  extension: string
): string {
  const cleanId = productId.replace(/[^a-zA-Z0-9_-]/g, "");
  const randomSuffix = crypto.randomUUID();
  const cleanExt = extension.startsWith(".") ? extension : `.${extension}`;
  return `products/${cleanId}/${randomSuffix}${cleanExt}`;
}
