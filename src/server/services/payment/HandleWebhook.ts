import { processTransaction } from "./HandleTransaction";
import crypto from "crypto";

const verifySignature = (
  rawBody: string,
  signatureHeader: string,
  secret: string,
): boolean => {
  try {
    // Header format: t=<timestamp>,te=<test sig>,li=<live sig>
    const parts = signatureHeader
      .split(",")
      .reduce<Record<string, string>>((acc, part) => {
        const separator = part.indexOf("=");
        if (separator === -1) return acc;
        const key = part.slice(0, separator).trim();
        const value = part.slice(separator + 1).trim();
        if (key) acc[key] = value;
        return acc;
      }, {});

    const timestamp = parts.t;
    if (!timestamp) return false;

    const computed = crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");

    const computedBuffer = Buffer.from(computed, "utf8");
    const candidates = [parts.li, parts.te].filter(
      (value): value is string => Boolean(value),
    );

    return candidates.some((candidate) => {
      const candidateBuffer = Buffer.from(candidate, "utf8");
      return (
        candidateBuffer.length === computedBuffer.length &&
        crypto.timingSafeEqual(candidateBuffer, computedBuffer)
      );
    });
  } catch {
    return false;
  }
};

export const handleWebhook = async (
  payload: any,
  rawBody: string,
  signature: string,
) => {
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("PAYMONGO_WEBHOOK_SECRET not set");
    return { success: false, message: "Webhook secret not configured" };
  }

  if (!signature) {
    console.error("No signature provided");
    return { success: false, message: "No signature" };
  }

  const isValid = verifySignature(rawBody, signature, webhookSecret);
  if (!isValid) {
    console.error("Invalid signature");
    return { success: false, message: "Invalid signature" };
  }

  try {
    const eventType = payload.data?.attributes?.type;

    if (eventType !== "checkout_session.payment.paid") {
      return { success: true };
    }

    const referenceId =
      payload.data?.attributes?.data?.attributes?.reference_number;
    console.log("Reference ID:", referenceId);

    if (!referenceId) return { success: false, message: "No reference ID" };

    const result = await processTransaction(referenceId, "paid");

    return result;
  } catch (error) {
    console.error("Webhook Error:", error);
    return { success: false, message: "Webhook handling failed" };
  }
};
