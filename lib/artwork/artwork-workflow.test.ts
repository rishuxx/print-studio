import { inspectArtworkBuffer } from "./file-inspector";
import { evaluateArtworkPreflight } from "./preflight-engine";

/**
 * Automated Unit & Invariant Test Suite for Phase 12F Artwork Processing
 */
export function runArtworkWorkflowUnitTests(): {
  allPassed: boolean;
  passedCount: number;
  failedCount: number;
  results: Array<{ testName: string; passed: boolean; error?: string }>;
} {
  const results: Array<{ testName: string; passed: boolean; error?: string }> = [];

  // Test 1: PDF Magic Bytes & Checksum
  try {
    const fakePdf = Buffer.concat([
      Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Page >>\nendobj\n"),
      Buffer.from("stream\n/DeviceRGB\nendstream\n%%EOF"),
    ]);

    const res = inspectArtworkBuffer(fakePdf, "contract.pdf");
    if (!res.valid || res.detectedMime !== "application/pdf" || !res.checksumSha256) {
      throw new Error(`Expected valid PDF, got: ${JSON.stringify(res)}`);
    }
    results.push({ testName: "1. PDF Magic Bytes & SHA-256 Inspection", passed: true });
  } catch (err: any) {
    results.push({ testName: "1. PDF Magic Bytes & SHA-256 Inspection", passed: false, error: err.message });
  }

  // Test 2: PNG Magic Bytes & Dimension Extraction
  try {
    // 24-byte minimal PNG header: 8-byte magic + 4-byte chunk len + 'IHDR' + width(1050) + height(600) + bit/color
    const pngHeader = Buffer.alloc(30);
    pngHeader.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
    pngHeader.write("IHDR", 12);
    pngHeader.writeUInt32BE(1050, 16); // 1050 px width
    pngHeader.writeUInt32BE(600, 20);  // 600 px height
    pngHeader[24] = 8; // bit depth
    pngHeader[25] = 6; // RGBA with transparency

    const res = inspectArtworkBuffer(pngHeader, "card-front.png");
    if (!res.valid || res.pixelWidth !== 1050 || res.pixelHeight !== 600 || !res.hasTransparency) {
      throw new Error(`Expected 1050x600 RGBA PNG, got: ${JSON.stringify(res)}`);
    }
    results.push({ testName: "2. PNG Magic Bytes & Header Dimension Extraction", passed: true });
  } catch (err: any) {
    results.push({ testName: "2. PNG Magic Bytes & Header Dimension Extraction", passed: false, error: err.message });
  }

  // Test 3: Reject Executable Masked as PDF (Security Guard)
  try {
    const maliciousBuffer = Buffer.from("MZ\x90\x00\x03\x00\x00\x00ThisIsAnExeFileDisguisedAsAPdf");
    const res = inspectArtworkBuffer(maliciousBuffer, "invoice.pdf");
    if (res.valid) {
      throw new Error("Malicious non-PDF buffer was erroneously accepted!");
    }
    results.push({ testName: "3. Polyglot & Executable Signature Rejection", passed: true });
  } catch (err: any) {
    results.push({ testName: "3. Polyglot & Executable Signature Rejection", passed: false, error: err.message });
  }

  // Test 4: Product-Aware Preflight DPI Evaluation (High Definition 300 DPI)
  try {
    // Business card: 3.5 x 2.0 inches. At 300 DPI: 1050 x 600 px
    const preflight = evaluateArtworkPreflight({
      pixelWidth: 1050,
      pixelHeight: 600,
      colorSpace: "RGB",
      mimeType: "image/png",
      fileSizeBytes: 200000,
      configSnapshot: {
        schemaVersion: 1,
        configHash: "test_hash",
        productId: "prod_test",
        variantId: "var_test",
        selectedOptions: [],
        timestamp: new Date().toISOString(),
        productionSpecification: {
          substrate: "Cardstock",
          finish: "Matte",
          sides: "front",
          dimensions: { width: 3.5, height: 2.0, unit: "inch", formatted: "3.5×2.0 inch" },
          artworkRequired: true,
          artworkAttached: true,
          turnaroundDays: 2,
          sameDayReady: false,
        },
      },
    });

    if (preflight.effectiveDpi !== 300) {
      throw new Error(`Expected 300 DPI, got: ${preflight.effectiveDpi}`);
    }
    // Color space RGB triggers warning, so overall status is 'warning'
    if (preflight.status !== "warning") {
      throw new Error(`Expected warning status for RGB color gamut, got: ${preflight.status}`);
    }
    results.push({ testName: "4. Preflight 300 DPI & Color Gamut Evaluation", passed: true });
  } catch (err: any) {
    results.push({ testName: "4. Preflight 300 DPI & Color Gamut Evaluation", passed: false, error: err.message });
  }

  // Test 5: Low-Resolution Preflight Error Guard (< 150 DPI)
  try {
    // 350 x 200 px for 3.5 x 2.0 inches = 100 DPI (unacceptable for print)
    const preflight = evaluateArtworkPreflight({
      pixelWidth: 350,
      pixelHeight: 200,
      colorSpace: "CMYK",
      mimeType: "image/jpeg",
      fileSizeBytes: 50000,
      configSnapshot: {
        schemaVersion: 1,
        configHash: "test_hash",
        productId: "prod_test",
        variantId: "var_test",
        selectedOptions: [],
        timestamp: new Date().toISOString(),
        productionSpecification: {
          substrate: "Cardstock",
          finish: "Matte",
          sides: "front",
          dimensions: { width: 3.5, height: 2.0, unit: "inch", formatted: "3.5×2.0 inch" },
          artworkRequired: true,
          artworkAttached: true,
          turnaroundDays: 2,
          sameDayReady: false,
        },
      },
    });

    if (preflight.status !== "failed") {
      throw new Error(`Expected failed status for 100 DPI low resolution, got: ${preflight.status}`);
    }
    results.push({ testName: "5. Preflight Low Resolution (100 DPI) Error Detection", passed: true });
  } catch (err: any) {
    results.push({ testName: "5. Preflight Low Resolution (100 DPI) Error Detection", passed: false, error: err.message });
  }

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  return {
    allPassed: failedCount === 0,
    passedCount,
    failedCount,
    results,
  };
}
