"use client";

import * as React from "react";
import type { ArtworkAssetRecord } from "@/lib/artwork/types";
import { ProofViewerModal } from "@/components/artwork/proof-viewer-modal";
import { createArtworkSignedUrl } from "@/lib/supabase/actions";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Eye,
  ShieldCheck,
  RotateCcw,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { initializeArtworkUploadSessionAction, completeArtworkUploadAction } from "@/lib/artwork/actions";
import { createClient } from "@/lib/supabase/client";
import { ARTWORK_BUCKET, validateArtworkFile } from "@/lib/storage/artwork";

interface OrderArtworkCardProps {
  orderId: string;
  orderNumber: string;
  assets: ArtworkAssetRecord[];
  items?: any[];
  onRefresh?: () => void;
}

export function OrderArtworkCard({
  orderId,
  orderNumber,
  assets,
  items = [],
  onRefresh,
}: OrderArtworkCardProps) {
  const [activeAsset, setActiveAsset] = React.useState<ArtworkAssetRecord | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = React.useState<string | null>(null);
  const [isLoadingProof, setIsLoadingProof] = React.useState(false);
  const [isUploadingSlot, setIsUploadingSlot] = React.useState<string | null>(null);

  const handleOpenProof = async (asset: ArtworkAssetRecord) => {
    if (!asset.currentVersion?.storagePath) {
      toast.error("No artwork file has been uploaded for this slot.");
      return;
    }

    setIsLoadingProof(true);
    const res = await createArtworkSignedUrl(orderId, asset.currentVersion.storagePath);
    setIsLoadingProof(false);

    if (res.success && res.signedUrl) {
      setProofPreviewUrl(res.signedUrl);
      setActiveAsset(asset);
    } else {
      toast.error(res.error || "Failed to load secure proof preview.");
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    asset: ArtworkAssetRecord
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateArtworkFile(file.name, file.type, file.size);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid file format.");
      return;
    }

    setIsUploadingSlot(asset.slot);
    const toastId = toast.loading(`Uploading revision for ${asset.slot}...`);

    try {
      // 1. Initialize upload session
      const initRes = await initializeArtworkUploadSessionAction({
        orderId: asset.orderId,
        orderItemId: asset.orderItemId,
        slot: asset.slot,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      if (!initRes.success || !initRes.storagePath || !initRes.sessionId) {
        throw new Error(initRes.error || "Failed to initialize upload session.");
      }

      // 2. Direct upload to private bucket
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(ARTWORK_BUCKET)
        .upload(initRes.storagePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // 3. Complete upload, verify magic bytes, run preflight & generate proof
      const completeRes = await completeArtworkUploadAction({
        sessionId: initRes.sessionId,
        storagePath: initRes.storagePath,
        originalFileName: file.name,
        mimeType: file.type,
        fileSizeBytes: file.size,
      });

      if (!completeRes.success) {
        throw new Error(completeRes.error || "Server validation failed.");
      }

      toast.dismiss(toastId);
      toast.success(`Revision v${completeRes.versionNumber} uploaded! Preflight: ${completeRes.preflightStatus}`);
      onRefresh?.();
    } catch (err: unknown) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Artwork upload failed.");
    } finally {
      setIsUploadingSlot(null);
    }
  };

  // If no artwork assets yet exist in DB, synthesize upload slots for the order items
  const displayAssets: ArtworkAssetRecord[] =
    assets && assets.length > 0
      ? assets
      : items.map((item) => ({
          id: `item-${item.id}`,
          orderId,
          orderItemId: item.id,
          slot: "front",
          status: "awaiting_upload" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

  if (displayAssets.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-violet" />
          <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
            Artwork & Digital Proofing
          </h2>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {displayAssets.filter((a) => a.status === "approved").length}/{displayAssets.length} Slots Approved
        </span>
      </div>

      <div className="divide-y divide-border/60">
        {displayAssets.map((asset) => {
          const version = asset.currentVersion;
          const proof = asset.currentProof;
          const isApproved = asset.status === "approved";
          const needsRevision = asset.status === "changes_requested" || asset.status === "preflight_failed";

          return (
            <div key={asset.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink text-sm capitalize">{asset.slot} Artwork</span>
                  <span className="rounded-full bg-paper border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    v{version?.versionNumber || 1}
                  </span>
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="size-3" /> Approved
                    </span>
                  ) : needsRevision ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                      <RotateCcw className="size-3" /> Revision Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-wash px-2 py-0.5 text-[10px] font-bold text-violet">
                      <Clock className="size-3" /> Proof Ready for Review
                    </span>
                  )}
                </div>

                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>File: {version?.originalFilename || "No file uploaded"}</span>
                  {version?.effectiveDpi && (
                    <span>· {version.effectiveDpi} DPI</span>
                  )}
                  {version?.colorSpace && (
                    <span>· {version.colorSpace}</span>
                  )}
                </div>

                {proof?.revisionRequest?.comments && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-xs text-amber-900 mt-2">
                    <span className="font-bold">Requested Change:</span> {proof.revisionRequest.comments}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {version?.storagePath && (
                  <button
                    type="button"
                    onClick={() => handleOpenProof(asset)}
                    disabled={isLoadingProof}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-xs hover:bg-paper hover:text-violet transition-all"
                  >
                    {isLoadingProof ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Eye className="size-3.5 text-violet" />
                    )}
                    <span>{isApproved ? "View Approved Proof" : "Review Proof"}</span>
                  </button>
                )}

                {(!isApproved || needsRevision) && (
                  <label className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all cursor-pointer">
                    {isUploadingSlot === asset.slot ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Upload className="size-3.5" />
                    )}
                    <span>{version ? "Upload Revision" : "Upload Artwork"}</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp,.tif,.tiff"
                      disabled={Boolean(isUploadingSlot)}
                      onChange={(e) => handleFileUpload(e, asset)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proof Modal Viewer */}
      {activeAsset && proofPreviewUrl && (
        <ProofViewerModal
          isOpen={Boolean(activeAsset)}
          onClose={() => {
            setActiveAsset(null);
            setProofPreviewUrl(null);
          }}
          asset={activeAsset}
          previewUrl={proofPreviewUrl}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}
