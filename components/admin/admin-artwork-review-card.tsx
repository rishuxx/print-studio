"use client";

import * as React from "react";
import type { ArtworkAssetRecord } from "@/lib/artwork/types";
import { createArtworkSignedUrl } from "@/lib/supabase/actions";
import {
  Layers,
  FileCheck,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ProofViewerModal } from "@/components/artwork/proof-viewer-modal";
import { adminApproveArtworkAssetAction } from "@/lib/artwork/actions";

interface AdminArtworkReviewCardProps {
  orderId: string;
  assets: ArtworkAssetRecord[];
  onRefresh?: () => void;
}

export function AdminArtworkReviewCard({
  orderId,
  assets,
  onRefresh,
}: AdminArtworkReviewCardProps) {
  const [selectedAsset, setSelectedAsset] = React.useState<ArtworkAssetRecord | null>(null);
  const [proofUrl, setProofUrl] = React.useState<string | null>(null);
  const [loadingAction, setLoadingAction] = React.useState<string | null>(null);

  const handleAdminApprove = async (asset: ArtworkAssetRecord) => {
    setLoadingAction(`approve-${asset.id}`);
    try {
      const res = await adminApproveArtworkAssetAction({
        orderId,
        assetId: asset.id,
        proofId: asset.currentProof?.id || null,
      });

      if (res.success) {
        toast.success("Artwork approved! Production lock unlocked.");
        onRefresh?.();
      } else {
        toast.error(res.error || "Failed to approve artwork.");
      }
    } catch {
      toast.error("Network error during artwork approval.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDownloadMaster = async (asset: ArtworkAssetRecord) => {
    if (!asset.currentVersion?.storagePath) {
      toast.error("No artwork file on record.");
      return;
    }

    setLoadingAction(`download-${asset.id}`);
    const res = await createArtworkSignedUrl(orderId, asset.currentVersion.storagePath);
    setLoadingAction(null);

    if (res.success && res.signedUrl) {
      window.open(res.signedUrl, "_blank");
    } else {
      toast.error(res.error || "Failed to generate signed download URL.");
    }
  };

  const handleInspectProof = async (asset: ArtworkAssetRecord) => {
    if (!asset.currentVersion?.storagePath) return;

    setLoadingAction(`proof-${asset.id}`);
    const res = await createArtworkSignedUrl(orderId, asset.currentVersion.storagePath);
    setLoadingAction(null);

    if (res.success && res.signedUrl) {
      setProofUrl(res.signedUrl);
      setSelectedAsset(asset);
    } else {
      toast.error(res.error || "Failed to load proof preview.");
    }
  };

  if (!assets || assets.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-violet" />
            <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
              Pre-Press Master Assets & Quality Control
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-paper border border-border px-2.5 py-1 text-xs font-mono text-muted-foreground">
            No Custom Artwork Required
          </span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          This order was placed without an attached customer print file, or uses standard studio catalog template artwork.
        </p>
      </div>
    );
  }

  const allApproved = assets.every((a) => a.status === "approved");

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-violet" />
          <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
            Pre-Press Master Assets & Quality Control
          </h2>
        </div>
        {allApproved ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="size-3.5" /> Production Unlocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
            <AlertTriangle className="size-3.5" /> Production Locked (Sign-Off Pending)
          </span>
        )}
      </div>

      <div className="divide-y divide-border/60">
        {assets.map((asset) => {
          const version = asset.currentVersion;
          const proof = asset.currentProof;

          return (
            <div key={asset.id} className="py-4 space-y-2.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-bold text-ink text-sm">
                    <span className="capitalize">{asset.slot} Print Slot</span>
                    <span className="font-mono text-xs text-muted-foreground font-normal">
                      · Rev v{version?.versionNumber || 1}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                        asset.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : asset.status === "changes_requested"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-paper border border-border text-muted-foreground"
                      }`}
                    >
                      {asset.status}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
                    File: {version?.originalFilename} ({version ? (version.fileSizeBytes / (1024 * 1024)).toFixed(2) : 0} MB)
                    {version?.checksumSha256 && ` · SHA256: ${version.checksumSha256.slice(0, 12)}...`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {asset.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => handleAdminApprove(asset)}
                      disabled={Boolean(loadingAction)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-lift hover:bg-emerald-700 disabled:opacity-50 transition-all"
                    >
                      {loadingAction === `approve-${asset.id}` ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="size-3.5" />
                      )}
                      <span>Approve Artwork</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleInspectProof(asset)}
                    disabled={Boolean(loadingAction)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-paper transition-all"
                  >
                    <Eye className="size-3.5 text-violet" />
                    <span>Inspect Proof</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadMaster(asset)}
                    disabled={Boolean(loadingAction)}
                    className="inline-flex items-center gap-1 rounded-lg bg-violet px-3 py-1.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
                  >
                    <Download className="size-3.5" />
                    <span>Download Master</span>
                  </button>
                </div>
              </div>

              {/* Preflight Diagnostics Summary */}
              {version?.preflightResults && version.preflightResults.length > 0 && (
                <div className="rounded-xl bg-paper/60 border border-border p-3 space-y-1 text-[11px]">
                  <div className="font-bold text-ink uppercase font-mono text-[10px]">
                    Automated Preflight Checks:
                  </div>
                  {version.preflightResults.map((diag, i) => (
                    <div key={i} className="flex items-center justify-between text-muted-foreground">
                      <span>• {diag.message}</span>
                      {diag.measured && (
                        <span className="font-mono font-semibold text-ink">{diag.measured}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Customer Approval Consent Audit */}
              {proof?.approvalRecord && (
                <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/80 p-2.5 text-[11px] text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    <span>
                      Approved at {new Date(proof.approvalRecord.approvedAt).toLocaleString()}
                      {proof.approvalRecord.ipAddress && ` (IP: ${proof.approvalRecord.ipAddress})`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedAsset && proofUrl && (
        <ProofViewerModal
          isOpen={Boolean(selectedAsset)}
          onClose={() => {
            setSelectedAsset(null);
            setProofUrl(null);
          }}
          asset={selectedAsset}
          previewUrl={proofUrl}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}
