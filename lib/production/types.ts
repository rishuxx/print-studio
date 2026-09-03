// ==============================================================================
// PHASE 12G: PRODUCTION JOB MANAGEMENT & PRINT PRODUCTION WORKFLOW TYPES
// ==============================================================================

export type ProductionJobStatus =
  | "queued"
  | "scheduled"
  | "preflight"
  | "ready_to_print"
  | "printing"
  | "finishing"
  | "quality_check"
  | "completed"
  | "rework_required"
  | "paused"
  | "cancelled";

export type ProductionPriority = "low" | "normal" | "high" | "urgent";

export type QCStatus = "pending" | "in_progress" | "passed" | "failed" | "rework_required";

export interface ProductionSpecSnapshot {
  productTitle: string;
  sku?: string | null;
  quantity: number;
  unitPrice: number;
  linePrice: number;
  selectedOptions: Array<{
    optionId: string;
    optionName: string;
    choiceId: string;
    choiceName: string;
    priceDelta: number;
  }>;
  configHash?: string | null;
  productionSpecification?: {
    substrate?: string;
    finish?: string;
    sides?: string;
    dimensions?: {
      width: number;
      height: number;
      unit: string;
      formatted: string;
    };
    artworkRequired?: boolean;
    artworkAttached?: boolean;
    turnaroundDays?: number;
    sameDayReady?: boolean;
  };
}

export interface ArtworkManifest {
  assetId?: string;
  slot?: string;
  versionNumber?: number;
  storagePath?: string;
  originalFilename?: string;
  checksumSha256?: string;
  effectiveDpi?: number;
  colorSpace?: string;
  proofId?: string;
  proofStatus?: string;
  approvedAt?: string;
  summary?: string;
}

export interface ProductionJobRecord {
  id: string;
  orderId: string;
  orderItemId: string;
  jobNumber: string;
  status: ProductionJobStatus;
  priority: ProductionPriority;
  assignedOperatorId?: string | null;
  assignedOperatorName?: string | null;
  productionSpecSnapshot: ProductionSpecSnapshot;
  artworkManifest: ArtworkManifest;
  scheduledAt?: string | null;
  startedAt?: string | null;
  printingCompletedAt?: string | null;
  finishingCompletedAt?: string | null;
  qcCompletedAt?: string | null;
  completedAt?: string | null;
  pausedAt?: string | null;
  pauseReason?: string | null;
  reworkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QCChecklistItem {
  id: string;
  label: string;
  passed: boolean;
  required: boolean;
}

export interface QCRecord {
  id: string;
  productionJobId: string;
  status: QCStatus;
  inspectorId?: string | null;
  checklist: QCChecklistItem[];
  defectCategory?: string | null;
  notes?: string | null;
  inspectedAt?: string | null;
  createdAt: string;
}

export interface ProductionJobEvent {
  id: string;
  productionJobId: string;
  orderId: string;
  eventType: string;
  actorId?: string | null;
  actorType: "operator" | "admin" | "system";
  summary: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ProductionQueueMetrics {
  totalJobs: number;
  queued: number;
  printing: number;
  finishing: number;
  qualityCheck: number;
  reworkRequired: number;
  completedToday: number;
}
