import type { ResolutionReasonCode, ResolutionType } from "./types";

export interface ReturnPolicyConfig {
  defectWindowDays: number;
  remorseWindowDays: number;
  customProductRemorseAllowed: boolean;
  evidenceRequiredForDefect: boolean;
  maxEvidenceFiles: number;
  maxEvidenceFileMb: number;
}

/**
 * Authoritative Print Studio Return & Resolution Policy
 */
export const STUDIO_RESOLUTION_POLICY: ReturnPolicyConfig = {
  defectWindowDays: 7,               // 7-day window from confirmed delivery for defects/damage
  remorseWindowDays: 0,              // 0-day window for customer change of mind on custom products
  customProductRemorseAllowed: false,// Made-to-order personalized print cannot be returned for remorse
  evidenceRequiredForDefect: true,   // Photos/scans required to verify defect/transit damage
  maxEvidenceFiles: 5,
  maxEvidenceFileMb: 15,
};

/**
 * Check if a reason code indicates a manufacturing/transit defect
 */
export function isDefectOrCarrierDamage(reason: ResolutionReasonCode): boolean {
  return [
    "damaged",
    "defective",
    "printing_error",
    "color_quality_issue",
    "wrong_product",
    "wrong_quantity",
    "missing_item",
    "shipping_damage",
    "late_delivery",
  ].includes(reason);
}

/**
 * Format user-friendly policy disclaimer
 */
export function getPolicyNoticeText(isCustomProduct: boolean): string {
  if (isCustomProduct) {
    return "Custom-printed and personalized merchandise is manufactured exclusively to your approved digital proof and specifications. Under our Studio Policy, custom items are protected against manufacturing flaws, color shifts, trim discrepancies, and carrier transit damage within 7 days of delivery. Change of mind or customer-supplied artwork errors are non-returnable.";
  }
  return "Standard catalog merchandise can be returned within 7 days of delivery in unused, original packaging.";
}
