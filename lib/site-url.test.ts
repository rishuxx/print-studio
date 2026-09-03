import { getSiteUrl, getAbsoluteUrl } from "@/lib/site-url";

export function runSiteUrlTests() {
  const originalEnv = { ...process.env };
  const results: { test: string; passed: boolean; error?: string }[] = [];

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      results.push({ test: testName, passed: true });
    } else {
      results.push({ test: testName, passed: false, error: detail });
    }
  }

  // 1. Explicit production site URL
  process.env.NEXT_PUBLIC_SITE_URL = "https://preetyprints.vercel.app/";
  assert(
    getSiteUrl() === "https://preetyprints.vercel.app",
    "1. Explicit site URL trailing slash normalization",
    `Got: ${getSiteUrl()}`
  );
  assert(
    getAbsoluteUrl("/auth/callback") === "https://preetyprints.vercel.app/auth/callback",
    "2. Absolute URL generation for auth callback",
    `Got: ${getAbsoluteUrl("/auth/callback")}`
  );

  // 2. Vercel deployment URL
  delete process.env.NEXT_PUBLIC_SITE_URL;
  process.env.VERCEL_URL = "print-studio-preview-abc123.vercel.app";
  assert(
    getSiteUrl() === "https://print-studio-preview-abc123.vercel.app",
    "3. Vercel dynamic deployment URL resolution",
    `Got: ${getSiteUrl()}`
  );

  // 3. Dynamic header resolution
  delete process.env.VERCEL_URL;
  const mockHeaders = new Map<string, string>([
    ["host", "custom-domain.com"],
    ["x-forwarded-proto", "https"],
  ]);
  const headerUrl = getSiteUrl({ headers: { get: (k: string) => mockHeaders.get(k) || null } });
  assert(
    headerUrl === "https://custom-domain.com",
    "4. Dynamic header host resolution",
    `Got: ${headerUrl}`
  );

  // 4. 0.0.0.0 sanitization
  process.env.NEXT_PUBLIC_SITE_URL = "http://0.0.0.0:3000";
  assert(
    getSiteUrl() === "http://localhost:3000",
    "5. 0.0.0.0 binding sanitization",
    `Got: ${getSiteUrl()}`
  );

  // 5. Default fallback
  delete process.env.NEXT_PUBLIC_SITE_URL;
  assert(
    getSiteUrl() === "http://localhost:3000",
    "6. Fallback to localhost:3000",
    `Got: ${getSiteUrl()}`
  );

  process.env = originalEnv;

  const passed = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed,
    failed: results.length - passed,
    results,
  };
}
