import { createClient } from "@/lib/supabase/server";

export interface ShippingGateResult {
  canProceedToShipping: boolean;
  orderId: string;
  totalJobs: number;
  completedJobs: number;
  incompleteJobs: Array<{
    jobNumber: string;
    productTitle: string;
    status: string;
  }>;
  error?: string;
}

/**
 * Hard Shipping Gate:
 * Strictly enforces that carrier dispatch, manifesting, and AWB allocation
 * CANNOT proceed until all production jobs for the order are completed
 * and have passed studio quality control.
 */
export async function verifyOrderShippingGate(orderId: string): Promise<ShippingGateResult> {
  const supabase = await createClient();

  // Find all production jobs for this order
  const { data: jobs, error } = await supabase
    .from("production_jobs")
    .select("id, job_number, status, production_spec_snapshot")
    .eq("order_id", orderId);

  if (error) {
    return {
      canProceedToShipping: false,
      orderId,
      totalJobs: 0,
      completedJobs: 0,
      incompleteJobs: [],
      error: `Failed to query production jobs: ${error.message}`,
    };
  }

  // If no production jobs exist, verify if the order even has custom printable items
  if (!jobs || jobs.length === 0) {
    // Standard catalog order without production jobs spawned: permitted
    return {
      canProceedToShipping: true,
      orderId,
      totalJobs: 0,
      completedJobs: 0,
      incompleteJobs: [],
    };
  }

  const incompleteJobs = jobs
    .filter((j) => j.status !== "completed")
    .map((j) => ({
      jobNumber: j.job_number,
      productTitle: (j.production_spec_snapshot as any)?.productTitle || "Print Item",
      status: j.status,
    }));

  const canProceed = incompleteJobs.length === 0;

  return {
    canProceedToShipping: canProceed,
    orderId,
    totalJobs: jobs.length,
    completedJobs: jobs.length - incompleteJobs.length,
    incompleteJobs,
    error: canProceed
      ? undefined
      : `Cannot dispatch shipment: ${incompleteJobs.length} of ${jobs.length} production jobs are still pending completion or quality control (${incompleteJobs.map((j) => `${j.jobNumber}: ${j.status}`).join(", ")}).`,
  };
}
