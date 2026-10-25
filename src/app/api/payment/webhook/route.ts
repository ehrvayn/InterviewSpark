import { NextRequest, NextResponse } from "next/server";
import { handleWebhook } from "@/server/services/payment/HandleWebhook";

export async function POST(req: NextRequest) {
  console.log("=== WEBHOOK RECEIVED ===");
  try {
    const body = await req.json();
    const rawBody = JSON.stringify(body);
    const signature = req.headers.get("paymongo-signature") as string;
    const result = await handleWebhook(body, rawBody, signature);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ success: false, message: "Webhook failed" }, { status: 500 });
  }
}



