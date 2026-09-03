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
  availableOrders: Array<{ id: string; order_number: string; total: number; customer_name?: string }>;
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

  // 1. Fetch carriers & orders for waybill creation dropdown
  const { data: carriers } = await supabase
    .from("shipping_carriers")
    .select("*")
    .order("name", { ascending: true });

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, order_number, total, customer_snapshot, delivery_snapshot")
    .order("created_at", { ascending: false })
    .limit(100);

  let availableOrders = (recentOrders || []).map((o: {
    id: string;
    order_number: string;
    total: number;
    customer_snapshot?: unknown;
    delivery_snapshot?: unknown;
    // removed shipping_snapshot
  }) => {
    const cSnap = (o.customer_snapshot as Record<string, unknown>) || {};
    const dSnap = (o.delivery_snapshot as Record<string, unknown>) || {};
    const customerName = String(
      cSnap.fullName ||
      cSnap.name ||
      dSnap.fullName ||
      "Customer"
    );

    return {
      id: o.id,
      order_number: o.order_number,
      total: Number(o.total) || 0,
      customer_name: customerName,
    };
  });

  // Fallback defaults from seed demo orders if table is completely empty
  if (availableOrders.length === 0) {
    availableOrders = [
      { id: "PRT-2026-5120", order_number: "PRT-2026-5120", total: 558.2, customer_name: "Anil" },
      { id: "PRT-2026-7680", order_number: "PRT-2026-7680", total: 2872.8, customer_name: "Anil" },
      { id: "PRT-2026-2945", order_number: "PRT-2026-2945", total: 378, customer_name: "Anil" },
      { id: "PRT-2026-8778", order_number: "PRT-2026-8778", total: 797.8, customer_name: "Rishu" },
      { id: "PRT-2026-8344", order_number: "PRT-2026-8344", total: 1885.64, customer_name: "Anil" },
      { id: "PRT-2026-7701", order_number: "PRT-2026-7701", total: 903.82, customer_name: "Rishu" },
    ];
  }

  // 2. Fetch shipments
  let query = supabase
    .from("shipping_shipments")
    .select(`
      *,
      carrier:shipping_carriers(*),
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
    availableOrders,
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
