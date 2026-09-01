import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { Providers } from "@/components/providers";
import { CustomerLayoutShell } from "@/components/layout/customer-layout-shell";
import "./globals.css";

/** Display — geometric, set heavy and tight. */
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

/** Body — legibility for specs, prices and long copy. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** The press job-ticket voice. Every print spec on the site is set in this. */
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://preetyprints.com"),
  title: {
    default: `${siteConfig.businessName} — Custom Online Printing, Business Cards, Apparel & Packaging`,
    template: `%s · ${siteConfig.businessName}`,
  },
  description: "PreetyPrints is India's leading custom online printing platform. High-quality visiting cards, corporate gifts, custom t-shirts, packaging boxes, flyers, and marketing collateral with fast nationwide delivery.",
  keywords: [
    "PreetyPrints",
    "preety prints",
    "custom online printing India",
    "visiting cards online",
    "business card printing",
    "custom t-shirt printing",
    "corporate gifts online",
    "packaging boxes printing",
    "bulk printing services",
    "business stationery online",
    "flyers and brochures printing",
    "standees and banners",
    "custom mugs and bottles",
    "printo alternative",
    "vistaprint alternative India",
  ],
  authors: [{ name: siteConfig.businessName }],
  creator: siteConfig.businessName,
  publisher: siteConfig.businessName,
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: `${siteConfig.businessName} — High-Quality Custom Online Printing & Branding`,
    description: "Order premium custom business cards, t-shirts, personalized corporate gifts, packaging, and marketing materials with live price calculation and fast delivery.",
    siteName: siteConfig.businessName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.businessName} — Custom Online Printing Platform`,
    description: "High-quality custom business cards, corporate gifts, apparel & packaging online.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4a1e9e",
};

import { getAuthoritativeBusinessSettings } from "@/lib/settings/queries";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const initialSettings = await getAuthoritativeBusinessSettings();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-paper">
        <Providers initialSettings={initialSettings}>
          <CustomerLayoutShell>{children}</CustomerLayoutShell>
        </Providers>
      </body>
    </html>
  );
}
