import { NextRequest, NextResponse } from "next/server";
import { processTransaction } from "@/server/services/payment/HandleTransaction";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");

  try {
    if (ref) {
      await processTransaction(ref, "failed");
    }
  } catch (error) {
    console.error("Payment failed handler error:", error);
  }

  return NextResponse.redirect(new URL("/payment/failed", req.url));
}
