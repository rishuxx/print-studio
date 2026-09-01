import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Lightweight, Safe Operational Health Check Endpoint
 * 
 * Returns safe status indicator without leaking secrets, credentials, or internal topology.
 */
export async function GET() {
  const startTime = Date.now();
  let dbStatus = "unknown";

  try {
    const supabase = await createClient();
    // Lightweight ping to check database connectivity
    const { error } = await supabase.from("price_books").select("id").limit(1);
    dbStatus = error ? "degraded" : "healthy";
  } catch {
    dbStatus = "unavailable";
  }

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: dbStatus === "healthy" ? "ok" : "degraded",
      service: "print-studio-web",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      responseTimeMs,
    },
    {
      status: dbStatus === "healthy" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
