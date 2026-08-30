import type { CarrierAdapter, CarrierCreateShipmentResult, CarrierTrackingResult } from "./types";

/**
 * Local Deterministic Sandbox Carrier Adapter.
 * Enables end-to-end testing of waybill generation, scan timelines, NDR, and RTO
 * without needing live credentials or incurring real courier fees.
 */
export class FakeSandboxCarrierAdapter implements CarrierAdapter {
  code = "fake";
  name = "Development Sandbox Carrier";

  async createShipment(params: {
    orderNumber: string;
    recipientName: string;
    recipientPhone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    weightGrams: number;
    itemCount: number;
  }): Promise<CarrierCreateShipmentResult> {
    const timestamp = Date.now().toString().slice(-6);
    const mockAwb = `SBX-${params.pincode}-${timestamp}`;
    const eta = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    return {
      success: true,
      awbNumber: mockAwb,
      providerShipmentId: `SHP-SBX-${timestamp}`,
      providerOrderId: `ORD-SBX-${timestamp}`,
      labelUrl: `https://api.printstudio.local/labels/${mockAwb}.pdf`,
      trackingUrl: `https://track.printstudio.local/sbx/${mockAwb}`,
      estimatedDeliveryAt: eta,
    };
  }

  async trackShipment(awbNumber: string): Promise<CarrierTrackingResult> {
    const now = new Date();
    const eta = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();

    return {
      awbNumber,
      carrierCode: this.code,
      canonicalStatus: "in_transit",
      providerStatus: "IN_TRANSIT_HUB_SCAN",
      estimatedDeliveryAt: eta,
      scans: [
        {
          providerStatus: "MANIFESTED",
          canonicalStatus: "manifested",
          description: "Shipment data received electronically by sandbox facility.",
          timestamp: new Date(now.getTime() - 36 * 3600 * 1000).toISOString(),
          locationCity: "Dehradun",
          locationState: "Uttarakhand",
          locationPincode: "248007",
        },
        {
          providerStatus: "PICKED_UP",
          canonicalStatus: "picked_up",
          description: "Package received at Print Studio central hub.",
          timestamp: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
          locationCity: "Dehradun",
          locationState: "Uttarakhand",
          locationPincode: "248007",
        },
        {
          providerStatus: "TRANSIT_SORTING",
          canonicalStatus: "in_transit",
          description: "Processed through Northern Regional Sorting Facility.",
          timestamp: new Date(now.getTime() - 12 * 3600 * 1000).toISOString(),
          locationCity: "Delhi NCR Hub",
          locationState: "Delhi",
          locationPincode: "110037",
        },
        {
          providerStatus: "ARRIVED_LOCAL_HUB",
          canonicalStatus: "arrived_at_hub",
          description: "Consignment arrived at destination delivery center.",
          timestamp: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
          locationCity: "Destination Hub",
          locationState: "Local",
        },
      ],
    };
  }
}
