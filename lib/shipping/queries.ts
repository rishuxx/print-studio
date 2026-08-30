import { createClient } from "@/lib/supabase/server";
import type { ShippingShipment, ShippingCarrier } from "./types";

/**
 * Fetches single shipment with package items and full chronological tracking events.
 */
export async function fetchShipmentById(shipmentId: string): Promise<ShippingShipment | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shipping_shipments")
    .select(`
      *,
      carrier:shipping_carriers(*),
      packages:shipping_packages(*),
      tracking_events:shipping_tracking_events(*)
    `)
    .eq("id", shipmentId)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    packages: data.packages || [],
    tracking_events: (data.tracking_events || []).sort(
      (a: { event_timestamp: string }, b: { event_timestamp: string }) =>
        new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime()
    ),
  } as ShippingShipment;
}

/**
 * Fetches all shipments belonging to a specific order ID (supports multi-shipment orders).
 */
export async function fetchOrderShipments(orderId: string): Promise<ShippingShipment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shipping_shipments")
    .select(`
      *,
      carrier:shipping_carriers(*),
      packages:shipping_packages(*),
      tracking_events:shipping_tracking_events(*)
    `)
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((s) => ({
    ...s,
    packages: s.packages || [],
    tracking_events: (s.tracking_events || []).sort(
      (a: { event_timestamp: string }, b: { event_timestamp: string }) =>
        new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime()
    ),
  })) as ShippingShipment[];
}

/**
 * Fetches public shipment details by non-enumerable tracking token (privacy masked).
 */
export async function fetchShipmentByToken(token: string): Promise<ShippingShipment | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shipping_shipments")
    .select(`
      *,
      carrier:shipping_carriers(*),
      tracking_events:shipping_tracking_events(*)
    `)
    .eq("tracking_token", token)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    tracking_events: (data.tracking_events || [])
      .filter((e: { is_customer_visible: boolean }) => e.is_customer_visible)
      .sort(
        (a: { event_timestamp: string }, b: { event_timestamp: string }) =>
          new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime()
      ),
  } as ShippingShipment;
}

/**
 * Fetches admin shipping console records with filtering and counts.
 */
export async function fetchAdminShipments(params?: {
  status?: string;
  carrier?: string;
  search?: string;
}): Promise<{
  shipments: ShippingShipment[];
  carriers: ShippingCarrier[];
  kpi: {
    totalActive: number;
    inTransit: number;
    outForDelivery: number;
    deliveredToday: number;
    ndrExceptions: number;
    rtoCount: number;
  };
}> {
  const supabase = await createClient();

  // 1. Fetch carriers
  const { data: carriers } = await supabase
    .from("shipping_carriers")
    .select("*")
    .order("name", { ascending: true });

  // 2. Fetch shipments
  let query = supabase
    .from("shipping_shipments")
    .select(`
      *,
      carrier:shipping_carriers(*),
      order:orders(order_number, total, shipping_address),
      packages:shipping_packages(*)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (params?.status && params.status !== "all") {
    query = query.eq("shipment_status", params.status);
  }
  if (params?.carrier && params.carrier !== "all") {
    query = query.eq("carrier_id", params.carrier);
  }

  const { data: shipments } = await query;
  const list = (shipments || []) as unknown as ShippingShipment[];

  // 3. Compute live KPIs
  const totalActive = list.filter((s) => !["delivered", "cancelled", "rto_delivered"].includes(s.shipment_status)).length;
  const inTransit = list.filter((s) => ["in_transit", "arrived_at_hub"].includes(s.shipment_status)).length;
  const outForDelivery = list.filter((s) => s.shipment_status === "out_for_delivery").length;
  const deliveredToday = list.filter((s) => s.shipment_status === "delivered").length;
  const ndrExceptions = list.filter((s) => s.shipment_status === "ndr" || s.shipment_status === "exception").length;
  const rtoCount = list.filter((s) => s.shipment_status.startsWith("rto_")).length;

  return {
    shipments: list,
    carriers: (carriers || []) as ShippingCarrier[],
    kpi: {
      totalActive,
      inTransit,
      outForDelivery,
      deliveredToday,
      ndrExceptions,
      rtoCount,
    },
  };
}
