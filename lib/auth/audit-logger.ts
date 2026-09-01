import { createClient } from "@/lib/supabase/server";

type AuditEventType =
  | "login_success"
  | "login_failure"
  | "signup"
  | "logout"
  | "password_reset_requested"
  | "password_changed"
  | "email_changed"
  | "verification_email_sent"
  | "account_suspended"
  | "account_restored";

export async function logSecurityEvent(payload: {
  eventType: AuditEventType;
  userId?: string | null;
  customerId?: string | null;
  summary: string;
  metadata?: Record<string, any>;
}) {
  const supabase = await createClient();

  // Fire and forget (don't block the auth flow)
  try {
    const { error } = await supabase.from("customer_activity_events").insert({
      event_type: payload.eventType,
      customer_id: payload.customerId || null,
      actor_id: payload.userId || null,
      summary: payload.summary,
      metadata: payload.metadata || {},
    });
    
    if (error) {
      console.error("[Security Logger] Failed to insert event:", error);
    }
  } catch (err) {
    console.error("[Security Logger] Unexpected error logging event:", err);
  }
}
