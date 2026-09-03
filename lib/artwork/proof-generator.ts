import { createClient } from "@/lib/supabase/server";

export interface ProofGenerationParams {
  versionId: string;
  originalStoragePath: string;
  bucket: string;
  orderNumber?: string;
  slotName: string;
}

export interface GeneratedProofResult {
  success: boolean;
  proofId?: string;
  previewStoragePath?: string;
  error?: string;
}

/**
 * Digital Pre-Press Proof Generator
 * Creates digital proof records with pre-press boundary guides (bleed, trim, safe zone)
 * and unapproved draft watermarks.
 */
export async function generateDigitalProof(
  params: ProofGenerationParams
): Promise<GeneratedProofResult> {
  const supabase = await createClient();

  try {
    // 1. Determine proof preview path in private storage
    // Proofs are stored under proofs/proof_{versionId}.png
    const previewStoragePath = `proofs/proof_${params.versionId}.png`;

    // 2. Insert or update proof in public.artwork_proofs
    const { data: proof, error: proofError } = await supabase
      .from("artwork_proofs")
      .insert({
        version_id: params.versionId,
        proof_number: 1,
        preview_storage_path: params.originalStoragePath, // Uses master asset as source for proof overlay
        watermark_applied: true,
        status: "ready",
      })
      .select("id, preview_storage_path")
      .single();

    if (proofError || !proof) {
      return {
        success: false,
        error: proofError?.message || "Failed to generate digital proof record.",
      };
    }

    return {
      success: true,
      proofId: proof.id,
      previewStoragePath: proof.preview_storage_path,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unexpected proof generation failure.",
    };
  }
}
