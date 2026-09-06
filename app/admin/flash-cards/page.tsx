import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { getAllFlashCardsAdmin } from "@/lib/flash-cards/queries";
import { FlashCardManager } from "@/components/admin/flash-cards/flash-card-manager";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mega-Menu Flash Ad Cards · Admin Console",
  description: "Manage header mega-menu promotional flash ad cards, themes, gradients, and custom discount badges.",
};

export default async function AdminFlashCardsPage() {
  await requireAdminAuth("/admin/flash-cards");
  const flashCards = await getAllFlashCardsAdmin();

  return <FlashCardManager initialCards={flashCards} />;
}
