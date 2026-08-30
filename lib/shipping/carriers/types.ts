import type { CanonicalShipmentStatus } from "../types";

export interface CarrierTrackingResult {
  awbNumber: string;
  carrierCode: string;
  canonicalStatus: CanonicalShipmentStatus;
  providerStatus: string;
  estimatedDeliveryAt?: string | null;
  scans: Array<{
    providerStatus: string;
    canonicalStatus: CanonicalShipmentStatus;
    description: string;
    timestamp: string;
    locationText?: string;
    locationCity?: string;
    locationState?: string;
    locationPincode?: string;
  }>;
}

export interface CarrierCreateShipmentResult {
  success: boolean;
  awbNumber: string;
  providerShipmentId?: string;
  providerOrderId?: string;
  labelUrl?: string;
  trackingUrl?: string;
  estimatedDeliveryAt?: string;
  error?: string;
}

export interface CarrierAdapter {
  code: string;
  name: string;
  createShipment(params: {
    orderNumber: string;
    recipientName: string;
    recipientPhone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    weightGrams: number;
    dimensions?: { lengthMm: number; widthMm: number; heightMm: number };
    itemCount: number;
  }): Promise<CarrierCreateShipmentResult>;

  trackShipment(awbNumber: string): Promise<CarrierTrackingResult>;
  cancelShipment?(awbNumber: string): Promise<{ success: boolean; error?: string }>;
}
