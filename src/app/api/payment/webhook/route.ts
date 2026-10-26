import { NextRequest, NextResponse } from "next/server";
import { handleWebhook } from "@/server/services/payment/HandleWebhook";
import { query } from "@/server/database/Connection";

// Temporary diagnostics: records what PayMongo actually sends so we can see
// exactly why a delivery was rejected. Best-effort, never blocks the response.
const logDelivery = async (data: {
  signature: string;
  headers: Record<string, string | null>;
  body: string;
  result: unknown;
}) => {
  try {
    await query(
      `INSERT INTO webhook_debug (signature, headers, body_length, body, result)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        data.signature,
        JSON.stringify(data.headers),
        data.body.length,
        data.body.slice(0, 8000),
        JSON.stringify(data.result),
      ],
    );
  } catch (error) {
    console.error("webhook debug log failed:", error);
  }
};

export async function POST(req: NextRequest) {
  console.log("=== WEBHOOK RECEIVED ===");
  const rawBody = await req.text();
  const signature = req.headers.get("paymongo-signature") || "";
  const headers = {
    contentType: req.headers.get("content-type"),
    contentEncoding: req.headers.get("content-encoding"),
    contentLength: req.headers.get("content-length"),
    transferEncoding: req.headers.get("transfer-encoding"),
    userAgent: req.headers.get("user-agent"),
  };

  try {
    // Signature must be verified against the exact raw bytes PayMongo sent.
    // Parsing and re-stringifying changes the body and breaks the HMAC.
    const payload = JSON.parse(rawBody);
    const result = await handleWebhook(payload, rawBody, signature);

    await logDelivery({ signature, headers, body: rawBody, result });

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    await logDelivery({
      signature,
      headers,
      body: rawBody,
      result: { success: false, message: "Webhook failed (exception)" },
    });
    return NextResponse.json(
      { success: false, message: "Webhook failed" },
      { status: 500 },
    );
  }
}
