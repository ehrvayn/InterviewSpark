import { Request, Response } from "express";
import { createPayment } from "../services/payment/CreatePayment";
import { handleWebhook } from "../services/payment/HandleWebhook";
import { processTransaction } from "../services/payment/HandleTransaction";
import { AuthRequest } from "../middlewares/AuthMiddleware";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const initiatePayment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { packId } = req.body;
    const result = await createPayment(req.userId!, packId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const paymentWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("=== WEBHOOK RECEIVED ===");

  try {
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers["paymongo-signature"] as string;

    const result = await handleWebhook(req.body, rawBody, signature);

    res.status(200).json(result);
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, message: "Webhook failed" });
  }
};

export const paymentSuccess = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { ref } = req.query;
    if (!ref) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-success?ref=${ref}`,
    );
  } catch (error) {
    console.error("Payment success error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

export const paymentFailed = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { ref } = req.query;
    if (ref) {
      await processTransaction(ref as string, "failed");
    }
    res.status(200).json({ success: false, message: "Payment cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
