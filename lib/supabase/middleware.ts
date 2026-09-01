import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes auth tokens stored in cookies and passes refreshed cookies
 * down to Server Components and back to the browser.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refresh the user session if an auth cookie exists
    const hasAuthCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
    let user = null;
    if (hasAuthCookie) {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }

    const currentPath = request.nextUrl.pathname;
    const protectedCustomerRoutes = ["/account", "/orders", "/checkout"];
    const adminRoutes = ["/admin"];

    const isProtectedCustomerRoute = protectedCustomerRoutes.some(
      (route) => currentPath.startsWith(route) && currentPath !== "/checkout/guest" 
    );
    
    const isAdminRoute = adminRoutes.some((route) => currentPath.startsWith(route));

    // If there's no user and they attempt to access protected routes
    if (!user && (isProtectedCustomerRoute || isAdminRoute)) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", currentPath);
      return NextResponse.redirect(redirectUrl);
    }

    // If user exists, enforce verification for protected routes
    if (user && isProtectedCustomerRoute) {
      const isEmailVerified = user.email_confirmed_at != null;
      if (!isEmailVerified) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("error", "Email verification is required to access this section. Please check your inbox.");
        return NextResponse.redirect(redirectUrl);
      }
    }
  } catch (err) {
    // Session refresh should not block public rendering
    console.error("Middleware auth refresh error:", err);
  }

  return supabaseResponse;
}

