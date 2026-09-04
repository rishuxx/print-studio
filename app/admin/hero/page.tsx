import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { getAllHeroBannersAdmin } from "@/lib/hero/queries";
import { HeroBannerManager } from "@/components/admin/hero/hero-banner-manager";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hero Banners & Landing Promotion · Admin Console",
  description: "Manage homepage promotional hero banners, desktop/mobile assets, CTAs and scheduling.",
};

export default async function AdminHeroPage() {
  await requireAdminAuth("/admin/hero");
  const banners = await getAllHeroBannersAdmin();

  return <HeroBannerManager initialBanners={banners} />;
}
