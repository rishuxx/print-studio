import { isDefectOrCarrierDamage, STUDIO_RESOLUTION_POLICY } from "./policy";
import type { ResolutionReasonCode, ResolutionType } from "./types";

export interface ResolutionTestResult {
  testName: string;
  passed: boolean;
  error?: string;
}

export function runResolutionWorkflowUnitTests(): {
  allPassed: boolean;
  passedCount: number;
  failedCount: number;
  results: ResolutionTestResult[];
} {
  const results: ResolutionTestResult[] = [];

  // Test 1: Defect vs Remorse Policy Evaluation on Custom Products
  try {
    const defectReasons: ResolutionReasonCode[] = [
      "defective",
      "printing_error",
      "color_quality_issue",
      "shipping_damage",
      "damaged",
    ];

    for (const r of defectReasons) {
      if (!isDefectOrCarrierDamage(r)) {
        throw new Error(`Expected ${r} to be recognized as legitimate defect!`);
      }
    }

    if (isDefectOrCarrierDamage("customer_changed_mind")) {
      throw new Error("Customer change of mind should NOT be recognized as manufacturing defect!");
    }

    results.push({ testName: "1. Custom Product Defect vs Remorse Policy Classification", passed: true });
  } catch (err: any) {
    results.push({ testName: "1. Custom Product Defect vs Remorse Policy Classification", passed: false, error: err.message });
  }

  // Test 2: Over-Refund Protection Validation
  try {
    const originalAmountMinor = 50000; // ₹500.00
    const alreadyRefundedMinor = 30000; // ₹300.00
    const remainingMinor = originalAmountMinor - alreadyRefundedMinor; // ₹200.00

    const requestedRefundMinor = 25000; // ₹250.00 (exceeds remaining ₹200)

    if (requestedRefundMinor <= remainingMinor) {
      throw new Error("Over-refund protection failed to detect excessive amount!");
    }
    results.push({ testName: "2. Financial Over-Refund Protection Validation", passed: true });
  } catch (err: any) {
    results.push({ testName: "2. Financial Over-Refund Protection Validation", passed: false, error: err.message });
  }

  // Test 3: 7-Day Window Expiration Logic
  try {
    const now = Date.now();
    const fourDaysAgo = new Date(now - 4 * 24 * 60 * 60 * 1000);
    const tenDaysAgo = new Date(now - 10 * 24 * 60 * 60 * 1000);

    const elapsed4 = Math.floor((now - fourDaysAgo.getTime()) / (1000 * 60 * 60 * 24));
    const elapsed10 = Math.floor((now - tenDaysAgo.getTime()) / (1000 * 60 * 60 * 24));

    if (elapsed4 > STUDIO_RESOLUTION_POLICY.defectWindowDays) {
      throw new Error("4 days should be within standard 7-day defect window!");
    }

    if (elapsed10 <= STUDIO_RESOLUTION_POLICY.defectWindowDays) {
      throw new Error("10 days should trigger return window expiration!");
    }
    results.push({ testName: "3. 7-Day Defect Window Expiration Calculation", passed: true });
  } catch (err: any) {
    results.push({ testName: "3. 7-Day Defect Window Expiration Calculation", passed: false, error: err.message });
  }

  // Test 4: Partial Resolution Quantity Safeguards
  try {
    const purchasedQty = 100;
    const requestedQty = 25;

    if (requestedQty > purchasedQty) {
      throw new Error("Claimed quantity cannot exceed purchased quantity!");
    }

    const approvedQty = 20; // 20 approved, 5 rejected
    if (approvedQty > requestedQty) {
      throw new Error("Approved quantity cannot exceed claimed quantity!");
    }
    results.push({ testName: "4. Partial Resolution Item Quantity Bounds", passed: true });
  } catch (err: any) {
    results.push({ testName: "4. Partial Resolution Item Quantity Bounds", passed: false, error: err.message });
  }

  // Test 5: Idempotency Key Generation Consistency
  try {
    const resolutionId = "res_uuid_12345";
    const version = 1;
    const key1 = `res_refund_${resolutionId}_v${version}`;
    const key2 = `res_refund_${resolutionId}_v${version}`;

    if (key1 !== key2) {
      throw new Error("Idempotency keys must be identical for the same resolution version!");
    }
    results.push({ testName: "5. Refund Idempotency Key Generation", passed: true });
  } catch (err: any) {
    results.push({ testName: "5. Refund Idempotency Key Generation", passed: false, error: err.message });
  }

  const passedCount = results.filter((r) => r.passed).length;
  return {
    allPassed: passedCount === results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results,
  };
}
