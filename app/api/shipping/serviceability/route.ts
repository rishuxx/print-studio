import { NextRequest, NextResponse } from "next/server";
import { checkPincodeServiceabilityLive } from "@/lib/shipping/serviceability";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pincode, weightGrams = 500, city = "Dehradun", state = "Uttarakhand" } = body;

    if (!pincode || typeof pincode !== "string") {
      return NextResponse.json({ success: false, error: "Invalid pincode" }, { status: 400 });
    }

    const result = await checkPincodeServiceabilityLive(pincode, Number(weightGrams) || 500, city, state);
    return NextResponse.json({ success: true, result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Serviceability error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
