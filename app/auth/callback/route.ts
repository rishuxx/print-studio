import { createClient } from "@/lib/supabase/server";
import { resolveUserRole } from "@/lib/auth/resolve-user-role";
import { logSecurityEvent } from "@/lib/auth/audit-logger";
import { NextResponse, type NextRequest } from "next/server";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Route handler for Supabase Auth OAuth (Google) and email verification callbacks.
 * Exchanges the PKCE code returned by Supabase Auth for an authenticated session.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  const origin = getSiteUrl({ headers: request.headers });

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // Log successful authentication callback
      await logSecurityEvent({
        eventType: "login_success",
        userId: data.user.id,
        summary: `Successful OAuth / verification callback via ${data.user.app_metadata?.provider || "email/oauth"}`,
        metadata: { provider: data.user.app_metadata?.provider },
      });

      // Check user role authoritatively
      const auth = await resolveUserRole();
      if (auth.authenticated && auth.role === "admin") {
        return NextResponse.redirect(`${origin}/admin`);
      }

      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Return the user to login with appropriate error
  return NextResponse.redirect(`${origin}/login?error=Authentication%20failed%20or%20expired.%20Please%20try%20again.`);
}
