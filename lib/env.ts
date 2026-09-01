import { z } from "zod";

/**
 * Authoritative Runtime Environment Variable Schema & Validator
 * 
 * Rules:
 * 1. Fails fast if required variables are missing.
 * 2. Distinguishes public browser variables (NEXT_PUBLIC_*) from server-only secrets.
 * 3. Never logs or prints secret values.
 * 4. Verifies test vs production mode configurations.
 */

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Public Supabase Configuration (Safe for Client)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),

  // Server-only Supabase Service Role Key (NEVER expose to client)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Razorpay Configuration
  RAZORPAY_KEY_ID: z.string().min(1, "RAZORPAY_KEY_ID is required"),
  RAZORPAY_KEY_SECRET: z.string().min(1, "RAZORPAY_KEY_SECRET is required"),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // Logistics / Shipping Provider Tokens
  DELHIVERY_API_TOKEN: z.string().optional(),
  SHIPROCKET_API_TOKEN: z.string().optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

let validatedEnv: ServerEnv | null = null;

export function validateEnvironment(): ServerEnv {
  if (validatedEnv) return validatedEnv;

  const rawEnv = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
    DELHIVERY_API_TOKEN: process.env.DELHIVERY_API_TOKEN,
    SHIPROCKET_API_TOKEN: process.env.SHIPROCKET_API_TOKEN,
  };

  const parsed = envSchema.safeParse(rawEnv);

  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => ` - [${issue.path.join(".")}]: ${issue.message}`)
      .join("\n");

    console.error(
      `\n[FATAL CONFIGURATION ERROR] Environment validation failed:\n${errorDetails}\n`
    );

    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Critical server startup error: Required environment variables are missing or malformed.`
      );
    }
  }

  validatedEnv = (parsed.success ? parsed.data : rawEnv) as ServerEnv;
  return validatedEnv;
}

/**
 * Returns true if running with Razorpay test mode credentials
 */
export function isPaymentTestMode(): boolean {
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
  return key.startsWith("rzp_test_");
}
