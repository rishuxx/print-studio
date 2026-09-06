import { NextResponse } from "next/server";
import { getStorefrontFlashCards } from "@/lib/flash-cards/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const flashCards = await getStorefrontFlashCards();
    return NextResponse.json({ success: true, flashCards });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
