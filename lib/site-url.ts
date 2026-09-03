/**
 * Centralized Application URL Resolution Strategy
 * 
 * Determines the authoritative public base URL of the application across:
 * 1. Explicit production/site URL (NEXT_PUBLIC_SITE_URL)
 * 2. Vercel deployment URL (NEXT_PUBLIC_VERCEL_URL or VERCEL_URL)
 * 3. Incoming HTTP request headers (x-forwarded-host / host)
 * 4. Local development fallback (http://localhost:3000)
 * 
 * Avoids any hardcoded production or localhost domains inside components or actions.
 */

export interface UrlResolutionOptions {
  headers?: {
    get(name: string): string | null | undefined;
  };
}

/**
 * Resolves the application base URL dynamically and safely.
 */
export function getSiteUrl(options?: UrlResolutionOptions): string {
  // 1. Explicit user-configured site URL (e.g. https://preetyprints.com or custom domain)
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicitSiteUrl && !explicitSiteUrl.includes("localhost") && !explicitSiteUrl.includes("0.0.0.0")) {
    return normalizeUrl(explicitSiteUrl);
  }

  // 2. Derive dynamically from incoming request headers if provided (SSR / Server Actions / Route Handlers)
  if (options?.headers) {
    const origin = options.headers.get("origin")?.trim();
    if (origin && isValidHttpUrl(origin)) {
      return normalizeUrl(origin);
    }

    const host = options.headers.get("x-forwarded-host") || options.headers.get("host");
    const proto = options.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
    if (host) {
      return normalizeUrl(`${proto}://${host}`);
    }
  }

  // 3. Vercel deployment environment variables (automatically injected by Vercel)
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  if (vercelUrl) {
    return normalizeUrl(`https://${vercelUrl}`);
  }

  // 4. Fallback to explicit site URL if it was localhost, or default local port
  if (explicitSiteUrl) {
    return normalizeUrl(explicitSiteUrl);
  }

  return "http://localhost:3000";
}

/**
 * Returns an absolute URL string for a given application path.
 */
export function getAbsoluteUrl(path: string, options?: UrlResolutionOptions): string {
  const baseUrl = getSiteUrl(options);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Cleans up trailing slashes, fixes 0.0.0.0 bindings, and ensures valid protocol.
 */
function normalizeUrl(url: string): string {
  let clean = url.trim().replace(/\/+$/, "");

  // Correct 0.0.0.0 host binding which causes browser ERR_ADDRESS_INVALID
  if (clean.includes("0.0.0.0")) {
    clean = clean.replace("0.0.0.0", "localhost");
  }

  // Ensure protocol is attached
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    clean = `https://${clean}`;
  }

  return clean;
}

function isValidHttpUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
