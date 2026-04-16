import { processTransaction } from "./HandleTransaction";
import crypto from "crypto";

const verifySignature = (
  rawBody: string,
  signatureHeader: string,
  secret: string,
): boolean => {
  try {
    const parts = signatureHeader.split(",");
    const timestamp = parts[0].split("=")[1];
    const signature = parts[1].split("=")[1];

    const computedSig = crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");

    return computedSig === signature;
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
