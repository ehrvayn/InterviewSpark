import { NextRequest, NextResponse } from "next/server";
import { handleWebhook } from "@/server/services/payment/HandleWebhook";

export async function POST(req: NextRequest) {
  console.log("=== WEBHOOK RECEIVED ===");
  try {
    // Signature must be verified against the exact raw bytes PayMongo sent.
    // Parsing and re-stringifying changes the body and breaks the HMAC.
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    const signature = req.headers.get("paymongo-signature") || "";

    const result = await handleWebhook(payload, rawBody, signature);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, message: "Webhook failed" },
      { status: 500 },
    );
  }
}
