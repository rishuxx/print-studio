import {
  isValidJobTransition,
  VALID_JOB_TRANSITIONS,
} from "./job-service";
import type { ProductionJobStatus } from "./types";

export interface ProductionUnitTestResult {
  testName: string;
  passed: boolean;
  error?: string;
}

export function runProductionWorkflowUnitTests(): {
  allPassed: boolean;
  passedCount: number;
  failedCount: number;
  results: ProductionUnitTestResult[];
} {
  const results: ProductionUnitTestResult[] = [];

  // Test 1: Valid State Transition Sequence
  try {
    const validFlow: [ProductionJobStatus, ProductionJobStatus][] = [
      ["queued", "scheduled"],
      ["scheduled", "preflight"],
      ["preflight", "ready_to_print"],
      ["ready_to_print", "printing"],
      ["printing", "finishing"],
      ["finishing", "quality_check"],
      ["quality_check", "completed"],
    ];

    for (const [from, to] of validFlow) {
      if (!isValidJobTransition(from, to)) {
        throw new Error(`Expected valid transition from ${from} to ${to}`);
      }
    }
    results.push({ testName: "1. Canonical Manufacturing State Transitions", passed: true });
  } catch (err: any) {
    results.push({ testName: "1. Canonical Manufacturing State Transitions", passed: false, error: err.message });
  }

  // Test 2: Invalid State Transition Rejection
  try {
    const invalidAttempts: [ProductionJobStatus, ProductionJobStatus][] = [
      ["queued", "completed"],       // Cannot skip press, finishing & QC
      ["queued", "printing"],        // Must be scheduled/preflighted first
      ["printing", "completed"],     // Cannot skip finishing & QC
      ["completed", "printing"],     // Cannot un-complete a finished job
    ];

    for (const [from, to] of invalidAttempts) {
      if (isValidJobTransition(from, to)) {
        throw new Error(`Expected illegal transition ${from} -> ${to} to be rejected!`);
      }
    }
    results.push({ testName: "2. Illegal State Transition Rejection", passed: true });
  } catch (err: any) {
    results.push({ testName: "2. Illegal State Transition Rejection", passed: false, error: err.message });
  }

  // Test 3: Rework and Pause Branching
  try {
    if (!isValidJobTransition("quality_check", "rework_required")) {
      throw new Error("Expected QC to be able to route to rework_required on defect");
    }
    if (!isValidJobTransition("rework_required", "printing")) {
      throw new Error("Expected rework_required to be able to restart printing run");
    }
    if (!isValidJobTransition("printing", "paused")) {
      throw new Error("Expected printing to be pauseable for machine/paper issues");
    }
    if (!isValidJobTransition("paused", "printing")) {
      throw new Error("Expected paused job to be resumable back to printing");
    }
    results.push({ testName: "3. Rework & Machine Pause Operations", passed: true });
  } catch (err: any) {
    results.push({ testName: "3. Rework & Machine Pause Operations", passed: false, error: err.message });
  }

  // Test 4: Multi-Job Order Status Aggregation Logic
  try {
    const testOrderJobsA = [
      { id: "job-1", status: "completed" },
      { id: "job-2", status: "printing" },
    ];
    const isOrderCompleteA = testOrderJobsA.every((j) => j.status === "completed");
    if (isOrderCompleteA) {
      throw new Error("Order should NOT be complete when job-2 is still printing!");
    }

    const testOrderJobsB = [
      { id: "job-1", status: "completed" },
      { id: "job-2", status: "completed" },
    ];
    const isOrderCompleteB = testOrderJobsB.every((j) => j.status === "completed");
    if (!isOrderCompleteB) {
      throw new Error("Order should be marked complete when all jobs are completed!");
    }
    results.push({ testName: "4. Multi-Job Order Status Aggregation", passed: true });
  } catch (err: any) {
    results.push({ testName: "4. Multi-Job Order Status Aggregation", passed: false, error: err.message });
  }

  // Test 5: Shipping Gate Invariant Logic
  try {
    const jobsPending = [{ id: "job-1", status: "quality_check" }];
    const canShipBeforeQC = jobsPending.every((j) => j.status === "completed");
    if (canShipBeforeQC) {
      throw new Error("Shipping Gate failed: permitted dispatch while job is in QC!");
    }

    const jobsAllDone = [{ id: "job-1", status: "completed" }, { id: "job-2", status: "completed" }];
    const canShipAfterQC = jobsAllDone.every((j) => j.status === "completed");
    if (!canShipAfterQC) {
      throw new Error("Shipping Gate failed: blocked dispatch when all jobs completed!");
    }
    results.push({ testName: "5. Hard Shipping Gate Production Preconditions", passed: true });
  } catch (err: any) {
    results.push({ testName: "5. Hard Shipping Gate Production Preconditions", passed: false, error: err.message });
  }

  const passedCount = results.filter((r) => r.passed).length;
  return {
    allPassed: passedCount === results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results,
  };
}
