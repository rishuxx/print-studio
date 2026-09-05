import { NextRequest, NextResponse } from "next/server";
import { getAuthoritativeBusinessSettings } from "@/lib/settings/queries";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const settings = await getAuthoritativeBusinessSettings();
    const faviconUrl = settings?.favicon_url;

    if (faviconUrl && faviconUrl.trim() !== "") {
      // Redirect to custom CDN favicon URL
      return NextResponse.redirect(faviconUrl, {
        status: 307,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    // Serve local favicon.png directly
    const filePath = path.join(process.cwd(), "public", "favicon.png");
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      });
    }

    const defaultIconUrl = new URL("/favicon.ico", request.url);
    return NextResponse.redirect(defaultIconUrl, { status: 307 });
  } catch (error) {
    console.error("Error serving dynamic favicon:", error);
    const defaultIconUrl = new URL("/favicon.ico", request.url);
    return NextResponse.redirect(defaultIconUrl, { status: 307 });
  }
}
