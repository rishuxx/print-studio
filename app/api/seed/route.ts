import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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
