import type { PreflightDiagnostic, PreflightStatus } from "./types";
import type { ConfigurationSnapshot } from "@/lib/commerce/types";

export interface PreflightEvaluationParams {
  pixelWidth?: number | null;
  pixelHeight?: number | null;
  colorSpace?: string | null;
  pageCount?: number | null;
  mimeType: string;
  fileSizeBytes: number;
  configSnapshot?: ConfigurationSnapshot | null;
}

export interface PreflightResult {
  status: PreflightStatus;
  effectiveDpi: number | null;
  aspectRatio: number | null;
  diagnostics: PreflightDiagnostic[];
}

/**
 * Product-Aware Preflight Inspection Engine
 * Evaluates submitted artwork against canonical print specifications.
 */
export function evaluateArtworkPreflight(params: PreflightEvaluationParams): PreflightResult {
  const diagnostics: PreflightDiagnostic[] = [];
  let effectiveDpi: number | null = null;
  let measuredAspectRatio: number | null = null;

  // 1. Resolve configured physical dimensions in inches
  let targetWidthInches = 3.5; // Default business card width
  let targetHeightInches = 2.0; // Default business card height
  let requiresBleed = true;

  if (params.configSnapshot?.productionSpecification) {
    const spec = params.configSnapshot.productionSpecification;
    requiresBleed = Boolean((spec as any).bleedRequired ?? true);

    if (spec.dimensions) {
      const { width, height, unit } = spec.dimensions;
      if (unit === "inch") {
        targetWidthInches = width;
        targetHeightInches = height;
      } else if (unit === "mm") {
        targetWidthInches = width / 25.4;
        targetHeightInches = height / 25.4;
      } else if (unit === "cm") {
        targetWidthInches = width / 2.54;
        targetHeightInches = height / 2.54;
      } else if (unit === "ft") {
        targetWidthInches = width * 12;
        targetHeightInches = height * 12;
      }
    }
  }

  const targetAspectRatio = targetWidthInches / targetHeightInches;

  // 2. DPI & Resolution Checks (if pixel dimensions are available)
  if (params.pixelWidth && params.pixelHeight) {
    measuredAspectRatio = params.pixelWidth / params.pixelHeight;

    const dpiX = params.pixelWidth / Math.max(0.1, targetWidthInches);
    const dpiY = params.pixelHeight / Math.max(0.1, targetHeightInches);
    effectiveDpi = Math.round(Math.min(dpiX, dpiY));

    if (effectiveDpi >= 300) {
      diagnostics.push({
        code: "DPI_OPTIMAL",
        severity: "info",
        message: `High-definition resolution (${effectiveDpi} DPI). Meets offset print standards.`,
        measured: `${effectiveDpi} DPI`,
        expected: "≥ 300 DPI",
      });
    } else if (effectiveDpi >= 180) {
      diagnostics.push({
        code: "DPI_ACCEPTABLE_WARNING",
        severity: "warning",
        message: `Moderate resolution (${effectiveDpi} DPI). Minor softening may be visible on fine text.`,
        measured: `${effectiveDpi} DPI`,
        expected: "≥ 300 DPI",
      });
    } else {
      diagnostics.push({
        code: "DPI_LOW_ERROR",
        severity: "error",
        message: `Low print resolution (${effectiveDpi} DPI). Text and graphics may appear pixelated or blurry.`,
        measured: `${effectiveDpi} DPI`,
        expected: "≥ 300 DPI",
      });
    }

    // 3. Aspect Ratio Deviation
    const ratioDelta = Math.abs(measuredAspectRatio - targetAspectRatio) / targetAspectRatio;
    if (ratioDelta > 0.1) {
      diagnostics.push({
        code: "ASPECT_RATIO_MISMATCH",
        severity: "warning",
        message: "Artwork aspect ratio does not match product dimensions. Bleed margins may crop edges.",
        measured: measuredAspectRatio.toFixed(2),
        expected: targetAspectRatio.toFixed(2),
      });
    }
  } else if (params.mimeType === "application/pdf") {
    // Vector PDFs have scalable resolution
    effectiveDpi = 300;
    diagnostics.push({
      code: "VECTOR_PDF_OPTIMAL",
      severity: "info",
      message: "Vector PDF file format. Resolution will scale cleanly without pixelation.",
      measured: "Vector",
      expected: "Vector or ≥ 300 DPI",
    });
  }

  // 4. Color Gamut Check
  if (params.colorSpace === "RGB") {
    diagnostics.push({
      code: "COLOR_SPACE_RGB",
      severity: "warning",
      message: "Artwork is in RGB. Colors will be converted to CMYK for press run; minor color shift may occur.",
      measured: "RGB",
      expected: "CMYK",
    });
  } else if (params.colorSpace === "CMYK") {
    diagnostics.push({
      code: "COLOR_SPACE_CMYK",
      severity: "info",
      message: "Native CMYK color space. Excellent press color fidelity expected.",
      measured: "CMYK",
      expected: "CMYK",
    });
  }

  // 5. Page Count Check for Multi-Page requirements
  if (params.mimeType === "application/pdf" && params.pageCount) {
    const isDoubleSided = params.configSnapshot?.productionSpecification?.sides === "both";
    if (isDoubleSided && params.pageCount < 2) {
      diagnostics.push({
        code: "PAGE_COUNT_WARNING",
        severity: "warning",
        message: "Product is configured as Double-Sided, but the uploaded PDF only has 1 page.",
        measured: `${params.pageCount} page`,
        expected: "2 pages",
      });
    }
  }

  // 6. Calculate overall preflight status
  let status: PreflightStatus = "passed";
  if (diagnostics.some((d) => d.severity === "error" || d.severity === "critical")) {
    status = "failed";
  } else if (diagnostics.some((d) => d.severity === "warning")) {
    status = "warning";
  }

  return {
    status,
    effectiveDpi,
    aspectRatio: measuredAspectRatio,
    diagnostics,
  };
}
