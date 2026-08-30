import { z } from "zod";

export const CustomerStatusSchema = z.enum([
  "guest",
  "pending",
  "active",
  "restricted",
  "suspended",
  "deactivated",
  "anonymization_pending",
  "anonymized",
]);

export const CustomerTypeSchema = z.enum([
  "individual",
  "business",
  "guest",
  "registered",
  "wholesale",
  "corporate",
]);

export const RiskStatusSchema = z.enum(["normal", "review", "elevated", "blocked"]);

export const MarketingStatusSchema = z.enum([
  "subscribed",
  "unsubscribed",
  "pending_opt_in",
  "restricted",
]);

export const SaveCustomerProfileSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1, "Display name is required").max(120),
  firstName: z.string().max(60).optional().nullable(),
  lastName: z.string().max(60).optional().nullable(),
  email: z.string().email("Valid email required"),
  phone: z.string().max(20).optional().nullable(),
  companyName: z.string().max(120).optional().nullable(),
  gstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format")
    .optional()
    .nullable()
    .or(z.literal("")),
  customerType: CustomerTypeSchema,
  accountStatus: CustomerStatusSchema,
  marketingStatus: MarketingStatusSchema,
  riskStatus: RiskStatusSchema,
  version: z.number().int().min(1),
});

export const SaveAddressSchema = z.object({
  id: z.string().uuid().optional(),
  customerId: z.string().uuid(),
  addressType: z.enum(["shipping", "billing", "both"]),
  recipientName: z.string().min(1, "Recipient name is required").max(100),
  companyName: z.string().max(100).optional().nullable(),
  addressLine1: z.string().min(3, "Address line 1 is required").max(200),
  addressLine2: z.string().max(200).optional().nullable(),
  landmark: z.string().max(100).optional().nullable(),
  city: z.string().min(2, "City is required").max(60),
  state: z.string().min(2, "State is required").max(60),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, "Valid 6-digit Indian PIN code required"),
  countryCode: z.string().default("IN"),
  phone: z.string().min(10, "10-digit phone number required").max(15),
  isDefaultShipping: z.boolean().default(false),
  isDefaultBilling: z.boolean().default(false),
});

export const SaveNoteSchema = z.object({
  customerId: z.string().uuid(),
  noteType: z.enum([
    "general",
    "follow_up",
    "billing",
    "artwork",
    "complaint",
    "vip_instruction",
  ]),
  content: z.string().min(2, "Note content cannot be empty").max(2000),
  visibility: z.enum(["internal", "restricted"]).default("internal"),
});

export const UpdateAccountControlsSchema = z.object({
  customerId: z.string().uuid(),
  loginEnabled: z.boolean(),
  checkoutEnabled: z.boolean(),
  orderingEnabled: z.boolean(),
  marketingEnabled: z.boolean(),
  reasonCode: z.string().max(64).optional().nullable(),
  reason: z.string().max(500).optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  version: z.number().int().min(1),
});

export const SaveB2BProfileSchema = z.object({
  customerId: z.string().uuid(),
  legalName: z.string().min(1, "Legal company name is required").max(150),
  tradeName: z.string().max(150).optional().nullable(),
  gstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format")
    .optional()
    .nullable()
    .or(z.literal("")),
  businessType: z.enum([
    "Proprietorship",
    "Partnership",
    "Private Limited",
    "Public Limited",
    "LLP",
    "Freelancer / Studio",
    "NGO / Trust",
  ]),
  industry: z.string().max(64).optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  billingEmail: z.string().email("Valid billing email required"),
  billingPhone: z.string().max(20).optional().nullable(),
  creditTerms: z.enum(["prepaid", "net_7", "net_15", "net_30", "net_45", "custom"]),
  creditLimitMinor: z.number().int().min(0),
  purchaseOrderRequired: z.boolean().default(false),
  approvalStatus: z.enum(["pending_verification", "approved", "rejected", "under_review"]),
  version: z.number().int().min(1),
});

export const CustomerMergeSchema = z.object({
  sourceCustomerId: z.string().uuid("Valid source customer UUID required"),
  targetCustomerId: z.string().uuid("Valid target customer UUID required"),
  reason: z.string().min(5, "Merge rationale required").max(500),
});

export const PrivacyRequestSchema = z.object({
  customerId: z.string().uuid(),
  requestType: z.enum([
    "access",
    "correction",
    "withdrawal",
    "deletion",
    "anonymization",
    "restriction",
  ]),
  reason: z.string().max(500).optional().nullable(),
});

export type SaveCustomerProfileInput = z.infer<typeof SaveCustomerProfileSchema>;
export type SaveAddressInput = z.infer<typeof SaveAddressSchema>;
export type SaveNoteInput = z.infer<typeof SaveNoteSchema>;
export type UpdateAccountControlsInput = z.infer<typeof UpdateAccountControlsSchema>;
export type SaveB2BProfileInput = z.infer<typeof SaveB2BProfileSchema>;
export type CustomerMergeInput = z.infer<typeof CustomerMergeSchema>;
export type PrivacyRequestInput = z.infer<typeof PrivacyRequestSchema>;
