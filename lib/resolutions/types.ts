// ==============================================================================
// PHASE 12I: RETURNS, REFUNDS, REPLACEMENTS & POST-DELIVERY RESOLUTION TYPES
// ==============================================================================

export type ResolutionType =
  | "refund"
  | "replacement"
  | "return_and_refund"
  | "store_credit"
  | "partial_refund";

export type ResolutionStatus =
  | "submitted"
  | "under_review"
  | "evidence_required"
  | "approved"
  | "rejected"
  | "return_required"
  | "return_received"
  | "replacement_in_progress"
  | "refund_pending"
  | "resolved"
  | "closed"
  | "cancelled";

export type ResolutionReasonCode =
  | "damaged"
  | "defective"
  | "printing_error"
  | "color_quality_issue"
  | "wrong_product"
  | "wrong_quantity"
  | "missing_item"
  | "shipping_damage"
  | "customer_changed_mind"
  | "late_delivery"
  | "other";

export interface ResolutionRequestRecord {
  id: string;
  requestNumber: string;
  orderId: string;
  orderNumber?: string;
  customerId: string;
  customerName?: string | null;
  customerEmail?: string | null;
  type: ResolutionType;
  status: ResolutionStatus;
  reasonCode: ResolutionReasonCode;
  customerDescription: string;
  priority: "normal" | "high" | "urgent";
  adminNotes?: string | null;
  customerDecisionNotes?: string | null;
  decisionAction?: string | null;
  refundAmountPaise?: number;
  replacementJobId?: string | null;
  requestedAt: string;
  reviewedAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  reviewedBy?: string | null;
  resolvedBy?: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  items?: ResolutionItemRecord[];
  evidence?: ResolutionEvidenceRecord[];
}

export interface ResolutionItemRecord {
  id: string;
  resolutionRequestId: string;
  orderItemId: string;
  productTitle?: string;
  requestedQuantity: number;
  approvedQuantity: number;
  reasonCode: string;
  decision: "pending" | "approved" | "rejected" | "partial";
  createdAt: string;
}

export interface ResolutionEvidenceRecord {
  id: string;
  resolutionRequestId: string;
  storagePath: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  checksumSha256?: string | null;
  uploadedBy: string;
  createdAt: string;
  signedUrl?: string;
}

export interface EligibilityResult {
  isEligible: boolean;
  requiresReview: boolean;
  reasonCode: string;
  message: string;
  allowedResolutionTypes: ResolutionType[];
  isCustomProduct: boolean;
  daysSinceDelivery: number;
  deliveryDate?: string | null;
}
