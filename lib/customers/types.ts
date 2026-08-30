/**
 * Phase 10G: Customers Domain & CRM Type Definitions
 * Strict typing for customer entities, lifecycle states, B2B models, addresses, notes, segments, and privacy.
 */

export type CustomerType =
  | "individual"
  | "business"
  | "guest"
  | "registered"
  | "wholesale"
  | "corporate";

export type CustomerAccountStatus =
  | "guest"
  | "pending"
  | "active"
  | "restricted"
  | "suspended"
  | "deactivated"
  | "anonymization_pending"
  | "anonymized";

export type MarketingStatus =
  | "subscribed"
  | "unsubscribed"
  | "pending_opt_in"
  | "restricted";

export type RiskStatus = "normal" | "review" | "elevated" | "blocked";

export type AddressType = "shipping" | "billing" | "both";

export type NoteType =
  | "general"
  | "follow_up"
  | "billing"
  | "artwork"
  | "complaint"
  | "vip_instruction";

export type NoteVisibility = "internal" | "restricted";

export type PrivacyRequestType =
  | "access"
  | "correction"
  | "withdrawal"
  | "deletion"
  | "anonymization"
  | "restriction";

export type PrivacyRequestStatus =
  | "submitted"
  | "identity_verification_required"
  | "verified"
  | "in_review"
  | "approved"
  | "rejected"
  | "processing"
  | "completed"
  | "cancelled";

export type DuplicateStatus =
  | "pending"
  | "confirmed_duplicate"
  | "not_duplicate"
  | "merged"
  | "ignored";

export interface CustomerTaxProfile {
  taxExempt: boolean;
  stateCode?: string | null;
  gstinVerified?: boolean;
}

export interface CustomerAddress {
  id: string;
  customer_id: string;
  address_type: AddressType;
  recipient_name: string;
  company_name?: string | null;
  address_line_1: string;
  address_line_2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country_code: string;
  phone: string;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  is_verified: boolean;
  verification_source?: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerBusinessProfile {
  customer_id: string;
  legal_name: string;
  trade_name?: string | null;
  gstin?: string | null;
  pan_last4?: string | null;
  business_type: string;
  industry?: string | null;
  website?: string | null;
  billing_email: string;
  billing_phone?: string | null;
  credit_terms: string;
  credit_limit_minor: number;
  outstanding_balance_minor: number;
  payment_terms?: string | null;
  purchase_order_required: boolean;
  account_manager_id?: string | null;
  approval_status: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  segment_type: string;
  rule_definition?: Record<string, unknown>;
  status: string;
  priority: number;
  created_at: string;
}

export interface CustomerTag {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface CustomerNote {
  id: string;
  customer_id: string;
  author_id?: string | null;
  author_name: string;
  note_type: NoteType;
  content: string;
  visibility: NoteVisibility;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerActivityEvent {
  id: string;
  customer_id: string;
  event_type: string;
  event_source: string;
  actor_type: "customer" | "admin" | "system" | "gateway_webhook";
  actor_id?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface CustomerAccountControl {
  customer_id: string;
  login_enabled: boolean;
  checkout_enabled: boolean;
  ordering_enabled: boolean;
  marketing_enabled: boolean;
  reason_code?: string | null;
  reason?: string | null;
  expires_at?: string | null;
  set_by?: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerPrivacyRequest {
  id: string;
  customer_id: string;
  request_type: PrivacyRequestType;
  status: PrivacyRequestStatus;
  requested_at: string;
  verified_at?: string | null;
  due_at: string;
  completed_at?: string | null;
  reason?: string | null;
  resolution_notes?: string | null;
  created_at: string;
}

export interface DatabaseCustomer {
  id: string;
  auth_user_id?: string | null;
  customer_number: string;
  customer_type: CustomerType;
  account_status: CustomerAccountStatus;
  first_name?: string | null;
  last_name?: string | null;
  display_name: string;
  email: string;
  normalized_email: string;
  phone?: string | null;
  normalized_phone?: string | null;
  company_name?: string | null;
  gstin?: string | null;
  tax_profile?: CustomerTaxProfile;
  email_verified_at?: string | null;
  phone_verified_at?: string | null;
  last_login_at?: string | null;
  first_order_at?: string | null;
  last_order_at?: string | null;
  order_count: number;
  completed_order_count: number;
  cancelled_order_count: number;
  lifetime_value_minor: number;
  paid_value_minor: number;
  refunded_value_minor: number;
  average_order_value_minor: number;
  currency: string;
  marketing_status: MarketingStatus;
  risk_status: RiskStatus;
  customer_score: number;
  notes_count: number;
  version: number;
  anonymized_at?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;

  // Joined relations
  addresses?: CustomerAddress[];
  business_profile?: CustomerBusinessProfile | null;
  segments?: CustomerSegment[];
  tags?: CustomerTag[];
  notes?: CustomerNote[];
  activity_events?: CustomerActivityEvent[];
  account_controls?: CustomerAccountControl | null;
  privacy_requests?: CustomerPrivacyRequest[];
}

export interface CustomerFilterParams {
  search?: string;
  status?: string;
  type?: string;
  risk?: string;
  segment?: string;
  tag?: string;
  minLtv?: number;
  maxLtv?: number;
  cursor?: string | null;
  pageSize?: number;
}

export interface CustomerListResponse {
  customers: DatabaseCustomer[];
  totalCount: number;
  nextCursor?: string | null;
  hasMore: boolean;
  kpi: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers30d: number;
    b2bCustomers: number;
    restrictedCount: number;
    highValueCount: number;
    totalLtvRupees: number;
  };
}
