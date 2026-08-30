/**
 * ═════════════════════════════════════════════════════════════════════════════
 * PHASE 10H: CONSTANTS & CACHE TAGS
 * ═════════════════════════════════════════════════════════════════════════════
 */

export const SETTINGS_CACHE_TAG = "business-settings";
export const PUBLIC_CONFIG_CACHE_TAG = "public-store-config";
export const CACHE_REVALIDATE_SECONDS = 3600; // 1 hour stale-while-revalidate

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi (NCT)",
  "Jammu & Kashmir",
  "Ladakh",
  "Chandigarh",
  "Puducherry",
  "Other",
] as const;

export const GST_RATE_PRESETS = [
  { label: "0% (Nil / Exempt)", bps: 0 },
  { label: "5% (Printed Books & Basic Paper)", bps: 500 },
  { label: "12% (Apparel & Fabric Substrates)", bps: 1200 },
  { label: "18% (Standard Print, Banners & Packaging)", bps: 1800 },
  { label: "28% (Luxury Corporate Merchandising)", bps: 2800 },
];
