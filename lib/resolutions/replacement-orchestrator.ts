import { createClient } from "@/lib/supabase/server";

export interface SpawnReplacementParams {
  orderId: string;
  resolutionRequestId: string;
  orderItemId: string;
  replacementQuantity: number;
  actorId: string;
}

/**
 * Spawns a dedicated replacement manufacturing job using Phase 12G's production system.
 * Freezes original approved artwork manifests and configuration specifications.
 */
export async function spawnReplacementProductionJob(
  params: SpawnReplacementParams
): Promise<{ success: boolean; jobId?: string; jobNumber?: string; error?: string }> {
  const supabase = await createClient();

  // 1. Fetch original order item and previous artwork version
  const { data: item, error: itemErr } = await supabase
    .from("order_items")
    .select("*, order:orders(id, order_number)")
    .eq("id", params.orderItemId)
    .single();

  if (itemErr || !item) {
    return { success: false, error: "Original order item not found." };
  }

  // 2. Fetch approved artwork version
  const { data: asset } = await supabase
    .from("artwork_assets")
    .select(`
      id,
      slot,
      current_version_id,
      artwork_versions!current_version_id (
        id,
        version_number,
        storage_path,
        original_filename,
        checksum_sha256,
        effective_dpi,
        color_space
      )
    `)
    .eq("order_item_id", params.orderItemId)
    .maybeSingle();

  const manifest = asset?.artwork_versions
    ? {
        assetId: asset.id,
        slot: asset.slot,
        versionNumber: (asset.artwork_versions as any).version_number,
        storagePath: (asset.artwork_versions as any).storage_path,
        originalFilename: (asset.artwork_versions as any).original_filename,
        checksumSha256: (asset.artwork_versions as any).checksum_sha256,
        effectiveDpi: (asset.artwork_versions as any).effective_dpi,
        colorSpace: (asset.artwork_versions as any).color_space,
        replacementOriginRequestId: params.resolutionRequestId,
      }
    : (item.artwork_summary as any) || { summary: "Replacement Master Asset" };

  // 3. Clone spec with replacement quantity
  const spec = {
    productTitle: `[REPLACEMENT] ${item.product_title}`,
    sku: item.sku,
    quantity: params.replacementQuantity,
    unitPrice: 0,
    linePrice: 0,
    isReplacement: true,
    resolutionRequestId: params.resolutionRequestId,
    selectedOptions: (item.selected_options as any)?.options || [],
    configHash: (item.selected_options as any)?.configHash,
    productionSpecification: (item.selected_options as any)?.configurationSnapshot?.productionSpecification || {},
  };

  // 4. Generate Job Number
  const { data: jobNumData } = await supabase.rpc("generate_production_job_number");
  const jobNumber = jobNumData || `JOB-${Date.now().toString().slice(-6)}`;

  // 5. Insert replacement production job
  const { data: job, error: jobErr } = await supabase
    .from("production_jobs")
    .insert({
      order_id: params.orderId,
      order_item_id: params.orderItemId,
      job_number: jobNumber,
      status: "queued",
      priority: "urgent", // Replacements are automatically marked urgent in the press queue
      production_spec_snapshot: spec,
      artwork_manifest: manifest,
    })
    .select("id, job_number")
    .single();

  if (jobErr || !job) {
    return { success: false, error: jobErr?.message || "Failed to create replacement production job." };
  }

  // 6. Record audit event
  await supabase.from("production_job_events").insert({
    production_job_id: job.id,
    order_id: params.orderId,
    event_type: "REPLACEMENT_JOB_CREATED",
    actor_id: params.actorId,
    actor_type: "admin",
    summary: `Urgent replacement job created for Resolution Request ${params.resolutionRequestId}`,
    metadata: { resolutionRequestId: params.resolutionRequestId, quantity: params.replacementQuantity },
  });

  return {
    success: true,
    jobId: job.id,
    jobNumber: job.job_number,
  };
}
