/**
 * Phase 11: Shipping & Tracking Domain Types
 */

export type CanonicalShipmentStatus =
  | "created"
  | "label_generated"
  | "manifested"
  | "ready_for_pickup"
  | "picked_up"
  | "in_transit"
  | "arrived_at_hub"
  | "out_for_delivery"
  | "delivery_attempted"
  | "delivered"
  | "ndr"
  | "rto_initiated"
  | "rto_in_transit"
  | "rto_delivered"
  | "cancelled"
  | "lost"
  | "damaged"
  | "exception"
  | "unknown";

export interface ShippingCarrier {
  id: string;
  code: string;
  name: string;
  provider_type: "aggregator" | "direct" | "sandbox";
  enabled: boolean;
  environment: "production" | "test" | "sandbox";
  capabilities: {
    pickup?: boolean;
    tracking?: boolean;
    labels?: boolean;
    webhooks?: boolean;
    rates?: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface ShippingPackage {
  id: string;
  shipment_id: string;
  package_number: number;
  provider_package_id?: string | null;
  weight_grams: number;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  item_count: number;
  tracking_number?: string | null;
}

export interface ShippingTrackingEvent {
  id: string;
  shipment_id: string;
  carrier_id: string;
  provider_event_id?: string | null;
  provider_status: string;
  canonical_status: CanonicalShipmentStatus;
  event_code?: string | null;
  event_description: string;
  event_timestamp: string;
  received_at: string;
  location_text?: string | null;
  location_city?: string | null;
  location_state?: string | null;
  location_pincode?: string | null;
  source: "webhook" | "poll" | "manual" | "system";
  raw_payload_hash: string;
  normalized_payload?: Record<string, unknown> | null;
  is_customer_visible: boolean;
  sequence_number: number;
  created_at: string;
}

export interface ShippingShipment {
  id: string;
  order_id: string;
  customer_id?: string | null;
  carrier_id: string;
  carrier_account_id?: string | null;
  carrier?: ShippingCarrier;

  provider_shipment_id?: string | null;
  provider_order_id?: string | null;
  awb_number: string;
  tracking_number?: string | null;
  reference_number?: string | null;

  shipment_status: CanonicalShipmentStatus;
  previous_status?: string | null;
  status_changed_at: string;

  label_url?: string | null;
  tracking_url?: string | null;
  tracking_token: string;

  estimated_delivery_at?: string | null;
  shipped_at?: string | null;
  picked_up_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  rto_at?: string | null;

  exception_code?: string | null;
  exception_message?: string | null;

  origin_snapshot: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  destination_snapshot: {
    recipient_name?: string;
    phone_masked?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  package_count: number;
  weight_grams: number;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;

  packages?: ShippingPackage[];
  tracking_events?: ShippingTrackingEvent[];

  last_polled_at?: string | null;
  next_poll_at?: string | null;
  poll_attempt_count: number;
  last_poll_error?: string | null;

  version: number;
  created_at: string;
  updated_at: string;
}

export interface CreateShipmentInput {
  order_id: string;
  carrier_code: "shiprocket" | "delhivery" | "bluedart" | "fake";
  weight_grams?: number;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  package_count?: number;
}
