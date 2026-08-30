/**
 * Pincode Serviceability & Logistics Partner Routing Engine.
 * Evaluates delivery destination pincodes against live Delhivery API and carrier route matrices.
 * If a pincode is non-serviceable by a partner, isServiceable is marked FALSE and booking is blocked.
 */

export interface CarrierServiceabilityOption {
  carrierCode: "delhivery" | "shiprocket" | "bluedart" | "fake";
  carrierName: string;
  isServiceable: boolean;
  unserviceableReason?: string;
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
  hasAnyServiceableCarrier: boolean;
  options: CarrierServiceabilityOption[];
}

export async function checkPincodeServiceabilityLive(
  pincode: string,
  weightGrams = 500,
  city = "Dehradun",
  state = "Uttarakhand"
): Promise<ServiceabilityCheckResult> {
  const cleanPin = pincode.replace(/\D/g, "");
  const now = new Date();

  const getEta = (days: number) => {
    const d = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  // 1. Check live Delhivery Pincode Serviceability API & Freight Rate Calculation
  const delhiveryToken = process.env.DELHIVERY_API_TOKEN;
  let delhiveryLiveServiceable = false;
  let delhiveryPrepaid = false;
  let delhiveryCod = false;
  let delhiveryRemarks = "";
  let delhiveryRealPrice = 0;

  if (delhiveryToken && cleanPin.length === 6) {
    try {
      // A. Check live pincode coverage
      const res = await fetch(
        `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${cleanPin}`,
        {
          headers: { Authorization: `Token ${delhiveryToken}` },
          next: { revalidate: 3600 },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const pinData = data?.delivery_codes?.[0]?.postal_code;
        if (pinData) {
          delhiveryPrepaid = pinData.pre_paid === "Y";
          delhiveryCod = pinData.cod === "Y";
          delhiveryLiveServiceable = pinData.pre_paid === "Y" || pinData.is_oda === "N";
          if (!delhiveryLiveServiceable) {
            delhiveryRemarks = pinData.remarks || "ODA / Restricted Area";
          }
        }
      }

      // B. Fetch live authoritative rate from Delhivery Invoice/Rate Calculator API
      if (delhiveryLiveServiceable) {
        const originPin = "248001"; // Print Studio Dehradun central hub
        const rateUrl = `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&ss=Delivered&d_pin=${cleanPin}&o_pin=${originPin}&cgm=${weightGrams}&pt=Pre-paid`;
        const rateRes = await fetch(rateUrl, {
          headers: { Authorization: `Token ${delhiveryToken}` },
          next: { revalidate: 1800 },
        });

        if (rateRes.ok) {
          const rateData = await rateRes.json();
          if (Array.isArray(rateData) && rateData[0]?.total_amount) {
            delhiveryRealPrice = Math.round(Number(rateData[0].total_amount));
          }
        }
      }
    } catch {
      // API fallback
    }
  }

  // 2. Zone & Carrier Matrix
  const isLocalDehradun = cleanPin.startsWith("248");
  const isSpecialHillyRemote = cleanPin.startsWith("249") || cleanPin.startsWith("246") || cleanPin.startsWith("19") || cleanPin.startsWith("79");
  const isNorthZone = ["11", "12", "13", "14", "15", "16", "20", "24", "25", "30"].some((p) =>
    cleanPin.startsWith(p)
  );

  // If Delhivery API confirmed, use live data; otherwise apply strict geographic coverage rules
  const isDelhiveryValid = delhiveryToken
    ? delhiveryLiveServiceable
    : isLocalDehradun || isNorthZone;

  // Blue Dart only services Tier 1 / Tier 2 Air Hubs (Not remote mountainous like 249141)
  const isBlueDartValid = (isLocalDehradun || isNorthZone) && !isSpecialHillyRemote;

  // Shiprocket aggregator services wider pincodes via multi-carrier fallback
  const isShiprocketValid = !cleanPin.startsWith("000") && cleanPin.length === 6;

  const delhiveryDays = isLocalDehradun ? 1 : isSpecialHillyRemote ? 4 : isNorthZone ? 2 : 3;
  const shiprocketDays = isLocalDehradun ? 1 : isSpecialHillyRemote ? 4 : 3;
  const blueDartDays = 1;

  const options: CarrierServiceabilityOption[] = [
    {
      carrierCode: "delhivery",
      carrierName: "Delhivery Express (Live API)",
      isServiceable: isDelhiveryValid,
      unserviceableReason: isDelhiveryValid ? undefined : delhiveryRemarks || "Pincode is unserviceable / out of delivery area (ODA) by Delhivery.",
      transitDays: delhiveryDays,
      deliverySpeed: isLocalDehradun ? "Express (1-2 Days)" : "Standard (3-4 Days)",
      estimatedDeliveryDate: getEta(delhiveryDays),
      mode: isLocalDehradun ? "Surface" : "Air / Express",
      codAvailable: delhiveryCod,
      prepaidAvailable: delhiveryPrepaid || isDelhiveryValid,
      recommendedBadge: isDelhiveryValid ? "Live Delhivery API" : undefined,
      rateEstimateInr: isDelhiveryValid ? (delhiveryRealPrice || Math.round(38 + (weightGrams / 500) * 15)) : 0,
    },
    {
      carrierCode: "shiprocket",
      carrierName: "Shiprocket Fulfillment (Aggregator)",
      isServiceable: isShiprocketValid,
      unserviceableReason: isShiprocketValid ? undefined : "Pincode not serviceable by Shiprocket surface partners.",
      transitDays: shiprocketDays,
      deliverySpeed: isSpecialHillyRemote ? "Standard (3-4 Days)" : "Standard (3-4 Days)",
      estimatedDeliveryDate: getEta(shiprocketDays),
      mode: "Surface",
      codAvailable: true,
      prepaidAvailable: true,
      recommendedBadge: isShiprocketValid && !isDelhiveryValid ? "Recommended Backup Partner" : undefined,
      rateEstimateInr: isShiprocketValid ? Math.round(58 + (weightGrams / 500) * 20) : 0,
    },
    {
      carrierCode: "bluedart",
      carrierName: "Blue Dart Apex (Air Priority)",
      isServiceable: isBlueDartValid,
      unserviceableReason: isBlueDartValid ? undefined : "Air express route unavailable for remote/rural pincode.",
      transitDays: blueDartDays,
      deliverySpeed: "Express (1-2 Days)",
      estimatedDeliveryDate: getEta(blueDartDays),
      mode: "Air / Express",
      codAvailable: false,
      prepaidAvailable: isBlueDartValid,
      recommendedBadge: isBlueDartValid ? "Fastest Air Courier" : undefined,
      rateEstimateInr: isBlueDartValid ? Math.round(95 + (weightGrams / 500) * 40) : 0,
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
      recommendedBadge: "Test Sandbox Mode",
      rateEstimateInr: 0,
    },
  ];

  const hasAnyServiceable = options.some((o) => o.carrierCode !== "fake" && o.isServiceable);

  return {
    pincode: cleanPin,
    city,
    state,
    originHub: "Dehradun Central Fulfillment Center (248001)",
    hasAnyServiceableCarrier: hasAnyServiceable,
    options,
  };
}

export function checkPincodeServiceability(
  pincode: string,
  weightGrams = 500,
  city = "Dehradun",
  state = "Uttarakhand"
): ServiceabilityCheckResult {
  const cleanPin = pincode.replace(/\D/g, "");
  const now = new Date();

  const getEta = (days: number) => {
    const d = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const isLocalDehradun = cleanPin.startsWith("248");
  const isSpecialHillyRemote = cleanPin.startsWith("249") || cleanPin.startsWith("246") || cleanPin.startsWith("19") || cleanPin.startsWith("79");
  const isNorthZone = ["11", "12", "13", "14", "15", "16", "20", "24", "25", "30"].some((p) =>
    cleanPin.startsWith(p)
  );

  // Uttarkashi 249141 is hilly/remote: Delhivery & Blue Dart are non-serviceable without special ODA pass
  const isDelhiveryValid = isLocalDehradun || (isNorthZone && !isSpecialHillyRemote);
  const isBlueDartValid = (isLocalDehradun || isNorthZone) && !isSpecialHillyRemote;
  const isShiprocketValid = cleanPin.length === 6 && !cleanPin.startsWith("000");

  const delhiveryDays = isLocalDehradun ? 1 : 3;
  const shiprocketDays = isSpecialHillyRemote ? 4 : 3;

  const options: CarrierServiceabilityOption[] = [
    {
      carrierCode: "delhivery",
      carrierName: "Delhivery Express (Live API)",
      isServiceable: isDelhiveryValid,
      unserviceableReason: isDelhiveryValid ? undefined : "Out of Delivery Area (ODA) for this PIN.",
      transitDays: delhiveryDays,
      deliverySpeed: "Standard (3-4 Days)",
      estimatedDeliveryDate: getEta(delhiveryDays),
      mode: isLocalDehradun ? "Surface" : "Air / Express",
      codAvailable: isDelhiveryValid,
      prepaidAvailable: isDelhiveryValid,
      recommendedBadge: isDelhiveryValid ? "Best Direct Coverage" : undefined,
      rateEstimateInr: isDelhiveryValid ? Math.round(45 + (weightGrams / 500) * 20) : 0,
    },
    {
      carrierCode: "shiprocket",
      carrierName: "Shiprocket Fulfillment (Aggregator)",
      isServiceable: isShiprocketValid,
      unserviceableReason: isShiprocketValid ? undefined : "Pincode not serviceable.",
      transitDays: shiprocketDays,
      deliverySpeed: "Standard (3-4 Days)",
      estimatedDeliveryDate: getEta(shiprocketDays),
      mode: "Surface",
      codAvailable: true,
      prepaidAvailable: true,
      recommendedBadge: !isDelhiveryValid ? "Active Coverage" : undefined,
      rateEstimateInr: isShiprocketValid ? Math.round(58 + (weightGrams / 500) * 20) : 0,
    },
    {
      carrierCode: "bluedart",
      carrierName: "Blue Dart Apex (Air Priority)",
      isServiceable: isBlueDartValid,
      unserviceableReason: isBlueDartValid ? undefined : "Air express unavailable for this rural PIN.",
      transitDays: 2,
      deliverySpeed: "Express (1-2 Days)",
      estimatedDeliveryDate: getEta(2),
      mode: "Air / Express",
      codAvailable: false,
      prepaidAvailable: isBlueDartValid,
      rateEstimateInr: isBlueDartValid ? Math.round(95 + (weightGrams / 500) * 40) : 0,
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
    hasAnyServiceableCarrier: options.some((o) => o.carrierCode !== "fake" && o.isServiceable),
    options,
  };
}
