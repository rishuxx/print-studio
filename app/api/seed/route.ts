import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seed route disabled in production." }, { status: 403 });
  }

  try {
    await requireAdminAuth("/admin");
  } catch {
    return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("price_books")
    .select("*")
    .eq("code", "DEFAULT_RETAIL");

  if (error || data.length === 0) {
    const { data: insertData, error: insertError } = await supabase
      .from("price_books")
      .insert({ code: "DEFAULT_RETAIL", name: "Default Retail Price Book", currency: "INR" })
      .select();
    
    return NextResponse.json({ action: "inserted", insertData, insertError });
  }

  return NextResponse.json({ action: "exists", data });
}
