/**
 * Production Artwork Workflow Types & Domain Models
 * Phase 12F: PreetyPrints / Print Studio
 */

export type ArtworkAssetStatus =
  | "awaiting_upload"
  | "processing"
  | "preflight_failed"
  | "preflight_warning"
  | "proof_pending"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "archived";

export type PreflightSeverity = "info" | "warning" | "error" | "critical";

export type PreflightStatus = "passed" | "warning" | "failed";

export interface PreflightDiagnostic {
  code: string;
  severity: PreflightSeverity;
  message: string;
  measured?: string | number | null;
  expected?: string | number | null;
}

export interface ArtworkVersionRecord {
  id: string;
  assetId: string;
  versionNumber: number;
  storagePath: string;
  bucket: string;
  originalFilename: string;
  fileSizeBytes: number;
  mimeType: string;
  fileExtension: string;
  checksumSha256: string;
  dimensions: {
    width: number;
    height: number;
    unit: "inch" | "mm" | "cm" | "ft";
  };
  pixelWidth?: number | null;
  pixelHeight?: number | null;
  effectiveDpi?: number | null;
  colorSpace?: string | null;
  pageCount?: number;
  hasTransparency?: boolean;
  hasBleed?: boolean;
  preflightStatus: PreflightStatus;
  preflightResults: PreflightDiagnostic[];
  uploadedBy?: string | null;
  createdAt: string;
}

export type ProofStatus =
  | "draft"
  | "ready"
  | "approved"
  | "changes_requested"
  | "superseded";

export interface ProofApprovalRecord {
  approvedBy: string;
  approvedAt: string;
  consentText: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface RevisionRequestRecord {
  requestedBy: string;
  requestedAt: string;
  reason?: string;
  category: "text" | "image" | "color" | "alignment" | "sizing" | "other";
  comments: string;
}

export interface ArtworkProofRecord {
  id: string;
  versionId: string;
  proofNumber: number;
  previewStoragePath: string;
  watermarkApplied: boolean;
  status: ProofStatus;
  customerNotes?: string | null;
  approvalRecord?: ProofApprovalRecord | null;
  revisionRequest?: RevisionRequestRecord | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArtworkAssetRecord {
  id: string;
  orderId: string;
  orderItemId: string;
  customerId?: string | null;
  slot: string; // "front" | "back" | "inside"
  status: ArtworkAssetStatus;
  currentVersionId?: string | null;
  currentVersion?: ArtworkVersionRecord | null;
  currentProof?: ArtworkProofRecord | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArtworkEventRecord {
  id: string;
  assetId: string;
  orderId: string;
  eventType: string;
  actorType: "customer" | "admin" | "system";
  actorId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ArtworkUploadSessionInitRequest {
  orderId: string;
  orderItemId: string;
  slot?: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface ArtworkUploadSessionResponse {
  sessionId: string;
  storagePath: string;
  bucket: string;
  uploadUrl?: string;
  expiresAt: string;
}
