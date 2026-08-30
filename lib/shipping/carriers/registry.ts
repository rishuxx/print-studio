import type { CarrierAdapter } from "./types";
import { FakeSandboxCarrierAdapter } from "./fake";
import { ShiprocketCarrierAdapter } from "./shiprocket";
import { DelhiveryCarrierAdapter } from "./delhivery";

const carrierRegistry: Record<string, CarrierAdapter> = {
  fake: new FakeSandboxCarrierAdapter(),
  shiprocket: new ShiprocketCarrierAdapter(),
  delhivery: new DelhiveryCarrierAdapter(),
};

/**
 * Returns the appropriate CarrierAdapter based on provider code.
 * Defaults gracefully to FakeSandboxCarrierAdapter in development/testing.
 */
export function getCarrierAdapter(carrierCode: string): CarrierAdapter {
  const adapter = carrierRegistry[carrierCode.toLowerCase()];
  if (adapter) return adapter;
  return carrierRegistry.fake;
}
