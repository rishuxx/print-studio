import crypto from "crypto";

export interface FileInspectionResult {
  valid: boolean;
  detectedMime: string;
  detectedExtension: string;
  checksumSha256: string;
  pixelWidth?: number;
  pixelHeight?: number;
  pageCount?: number;
  colorSpace?: string;
  hasTransparency?: boolean;
  error?: string;
}

/**
 * Inspects a binary buffer to detect magic bytes, calculate SHA-256,
 * and extract fundamental dimensions/color properties safely.
 */
export function inspectArtworkBuffer(
  buffer: Buffer,
  expectedFilename: string
): FileInspectionResult {
  if (!buffer || buffer.length === 0) {
    return {
      valid: false,
      detectedMime: "application/octet-stream",
      detectedExtension: "",
      checksumSha256: "",
      error: "Empty file buffer received.",
    };
  }

  // 1. Calculate cryptographic SHA-256 Checksum
  const checksumSha256 = crypto.createHash("sha256").update(buffer).digest("hex");

  // 2. Binary Magic Bytes Identification
  // PDF: %PDF- (0x25 0x50 0x44 0x46)
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    // Basic safe PDF page counting via /Type /Page scan
    const str = buffer.toString("latin1", 0, Math.min(buffer.length, 500000));
    const pageMatches = str.match(/\/Type\s*\/Page[^s]/g);
    const pageCount = pageMatches ? Math.max(1, pageMatches.length) : 1;

    // Detect color spaces in PDF
    let colorSpace = "CMYK";
    if (str.includes("/DeviceRGB") || str.includes("/sRGB")) {
      colorSpace = "RGB";
    }

    return {
      valid: true,
      detectedMime: "application/pdf",
      detectedExtension: ".pdf",
      checksumSha256,
      pageCount,
      colorSpace,
    };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    // Extract PNG width & height from IHDR chunk (bytes 16..23)
    let pixelWidth: number | undefined;
    let pixelHeight: number | undefined;
    let hasTransparency = false;

    if (buffer.length >= 24) {
      pixelWidth = buffer.readUInt32BE(16);
      pixelHeight = buffer.readUInt32BE(20);
      const colorType = buffer[25];
      // Color type 4 (Greyscale + alpha) or 6 (RGBA)
      if (colorType === 4 || colorType === 6) {
        hasTransparency = true;
      }
    }

    return {
      valid: true,
      detectedMime: "image/png",
      detectedExtension: ".png",
      checksumSha256,
      pixelWidth,
      pixelHeight,
      hasTransparency,
      colorSpace: "RGB",
      pageCount: 1,
    };
  }

  // JPEG / JPG: FF D8 FF
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    // Parse SOF0 (0xFFC0) or SOF2 (0xFFC2) to find dimensions
    let pixelWidth: number | undefined;
    let pixelHeight: number | undefined;
    let colorSpace = "RGB";

    let offset = 2;
    while (offset < buffer.length - 8) {
      if (buffer[offset] === 0xff) {
        const marker = buffer[offset + 1];
        if (marker === 0xc0 || marker === 0xc2) {
          pixelHeight = buffer.readUInt16BE(offset + 5);
          pixelWidth = buffer.readUInt16BE(offset + 7);
          const components = buffer[offset + 9];
          if (components === 4) colorSpace = "CMYK";
          break;
        }
        const len = buffer.readUInt16BE(offset + 2);
        offset += 2 + len;
      } else {
        offset++;
      }
    }

    return {
      valid: true,
      detectedMime: "image/jpeg",
      detectedExtension: ".jpg",
      checksumSha256,
      pixelWidth,
      pixelHeight,
      colorSpace,
      hasTransparency: false,
      pageCount: 1,
    };
  }

  // WebP: RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("latin1", 0, 4) === "RIFF" &&
    buffer.toString("latin1", 8, 12) === "WEBP"
  ) {
    return {
      valid: true,
      detectedMime: "image/webp",
      detectedExtension: ".webp",
      checksumSha256,
      colorSpace: "RGB",
      pageCount: 1,
    };
  }

  // TIFF: II*\0 (little endian) or MM\0* (big endian)
  if (
    buffer.length >= 4 &&
    ((buffer[0] === 0x49 && buffer[1] === 0x49 && buffer[2] === 0x2a && buffer[3] === 0x00) ||
      (buffer[0] === 0x4d && buffer[1] === 0x4d && buffer[2] === 0x00 && buffer[3] === 0x2a))
  ) {
    return {
      valid: true,
      detectedMime: "image/tiff",
      detectedExtension: ".tif",
      checksumSha256,
      colorSpace: "CMYK",
      pageCount: 1,
    };
  }

  return {
    valid: false,
    detectedMime: "application/octet-stream",
    detectedExtension: "",
    checksumSha256,
    error: "File signature (magic bytes) does not match any accepted print format (PDF, PNG, JPEG, WEBP, TIFF).",
  };
}
