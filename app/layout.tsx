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
  title: {
    default: `${siteConfig.businessName} — Custom Printing`,
    template: `%s · ${siteConfig.businessName}`,
  },
  description: siteConfig.description,
  keywords: [
    "custom printing",
    "visiting cards",
    "t-shirt printing",
    "photo gifts",
    "packaging printing",
    "bulk printing",
    "business stationery",
  ],
  authors: [{ name: siteConfig.businessName }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: `${siteConfig.businessName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.businessName,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4a1e9e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-paper">
        <Providers>
          <CustomerLayoutShell>{children}</CustomerLayoutShell>
        </Providers>
      </body>
    </html>
  );
}
