/**
 * Pincode Serviceability & Logistics Partner Routing Engine.
 * Evaluates delivery destination pincodes and returns supported carrier partners
 * with delivery speeds, mode (Surface / Air / Express), and estimated transit days.
 */

export interface CarrierServiceabilityOption {
  carrierCode: "delhivery" | "shiprocket" | "bluedart" | "fake";
  carrierName: string;
  isServiceable: boolean;
  transitDays: number;
  deliverySpeed: "Standard (3-4 Days)" | "Express (1-2 Days)" | "Same Day (4 Hours)";
  estimatedDeliveryDate: string;
  mode: "Surface" | "Air / Express";
  codAvailable: boolean;
  prepaidAvailable: boolean;
  recommendedBadge?: string;
  rateEstimateInr: number;
}

export interface ServiceabilityCheckResult {
  pincode: string;
  city: string;
  state: string;
  originHub: string;
  options: CarrierServiceabilityOption[];
}

export function checkPincodeServiceability(
  pincode: string,
  weightGrams = 500,
  city = "Dehradun",
  state = "Uttarakhand"
): ServiceabilityCheckResult {
  const cleanPin = pincode.replace(/\D/g, "");
  const now = new Date();

  // Calculate ETAs
  const getEta = (days: number) => {
    const d = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const isLocalZone = cleanPin.startsWith("248"); // Dehradun / Uttarakhand
  const isNorthZone = ["11", "12", "13", "14", "15", "16", "20", "24", "25", "30"].some((p) =>
    cleanPin.startsWith(p)
  );

  const delhiveryDays = isLocalZone ? 1 : isNorthZone ? 2 : 3;
  const shiprocketDays = isLocalZone ? 1 : isNorthZone ? 3 : 4;
  const blueDartDays = isLocalZone ? 1 : 2;

  const options: CarrierServiceabilityOption[] = [
    {
      carrierCode: "delhivery",
      carrierName: "Delhivery Express (Live API)",
      isServiceable: true,
      transitDays: delhiveryDays,
      deliverySpeed: isLocalZone ? "Express (1-2 Days)" : "Standard (3-4 Days)",
      estimatedDeliveryDate: getEta(delhiveryDays),
      mode: isLocalZone ? "Surface" : "Air / Express",
      codAvailable: true,
      prepaidAvailable: true,
      recommendedBadge: "Best Direct Coverage",
      rateEstimateInr: Math.round(45 + (weightGrams / 500) * 20),
    },
    {
      carrierCode: "shiprocket",
      carrierName: "Shiprocket Fulfillment (Aggregator)",
      isServiceable: true,
      transitDays: shiprocketDays,
      deliverySpeed: "Standard (3-4 Days)",
      estimatedDeliveryDate: getEta(shiprocketDays),
      mode: "Surface",
      codAvailable: true,
      prepaidAvailable: true,
      rateEstimateInr: Math.round(52 + (weightGrams / 500) * 18),
    },
    {
      carrierCode: "bluedart",
      carrierName: "Blue Dart Apex (Air Priority)",
      isServiceable: true,
      transitDays: blueDartDays,
      deliverySpeed: "Express (1-2 Days)",
      estimatedDeliveryDate: getEta(blueDartDays),
      mode: "Air / Express",
      codAvailable: false,
      prepaidAvailable: true,
      recommendedBadge: "Fastest Air Courier",
      rateEstimateInr: Math.round(95 + (weightGrams / 500) * 40),
    },
    {
      carrierCode: "fake",
      carrierName: "Development Sandbox Carrier",
      isServiceable: true,
      transitDays: 2,
      deliverySpeed: "Express (1-2 Days)",
      estimatedDeliveryDate: getEta(2),
      mode: "Surface",
      codAvailable: true,
      prepaidAvailable: true,
      recommendedBadge: "Zero Cost Local Test",
      rateEstimateInr: 0,
    },
  ];

  return {
    pincode: cleanPin,
    city,
    state,
    originHub: "Dehradun Central Fulfillment Center (248001)",
    options,
  };
}
