import { createClient } from "@/lib/supabase/server";
import { resolveUserRole } from "@/lib/auth/resolve-user-role";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Route handler for Supabase Auth email verification and password recovery callbacks.
 * Exchanges the code returned by Supabase Auth for an authenticated session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check user role authoritatively
      const auth = await resolveUserRole();
      if (auth.authenticated && auth.role === "admin") {
        return NextResponse.redirect(`${origin}/admin`);
      }

      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Return the user to an error page or login with instructions
  return NextResponse.redirect(`${origin}/login?error=Invalid%20or%20expired%20verification%20link`);
}
