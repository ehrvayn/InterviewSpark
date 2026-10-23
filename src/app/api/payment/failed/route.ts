import { NextRequest, NextResponse } from "next/server";
import { processTransaction } from "@/server/services/payment/HandleTransaction";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  try {
    if (ref) {
      await processTransaction(ref, "failed");
    }
    return NextResponse.json({ success: false, message: "Payment cancelled" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}