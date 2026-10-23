import axios from "axios";
import { query } from "../../database/Connection";
import PaymentQuery from "../../models/PaymentQuery";

const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY;
const BASE_URL = process.env.FRONTEND_URL;

const packs: Record<string, { credits: number; amount: number; name: string }> =
  {
    starter: { credits: 5, amount: 14900, name: "Starter Pack - 5 Credits" },
    popular: { credits: 15, amount: 44900, name: "Popular Pack - 15 Credits" },
    pro: { credits: 35, amount: 99900, name: "Pro Pack - 35 Credits" },
  };

export const createPayment = async (userId: number, packId: string) => {
  try {
    const pack = packs[packId];
    if (!pack) return { success: false, message: "Invalid pack" };

    if (!PAYMONGO_SECRET) {
      console.error("PAYMONGO_SECRET_KEY not set in .env");
      return { success: false, message: "Payment configuration error" };
    }

    if (!BASE_URL) {
      console.error("FRONTEND_URL not set in .env");
      return { success: false, message: "Payment configuration error" };
    }

    const referenceId = `${userId}-${packId}-${Date.now()}`;

    const response = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            billing: { name: "InterviewSpark User" },
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            line_items: [
              {
                currency: "PHP",
                amount: pack.amount,
                name: pack.name,
                quantity: 1,
              },
            ],
            payment_method_types: ["card", "gcash"],
            success_url: `${BASE_URL}/?payment=success&ref=${referenceId}`,
            cancel_url: `${BASE_URL}/?payment=failed&ref=${referenceId}`,
            reference_number: referenceId,
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
      },
    );

    const checkoutUrl = response.data.data.attributes.checkout_url;

    const { query: sql, values } = PaymentQuery.createTransaction(
      userId,
      packId,
      pack.amount,
      pack.credits,
      referenceId,
    );
    await query(sql, values);

    return { success: true, checkoutUrl };
  } catch (error: any) {
    console.error("PayMongo Error:", error.response?.data || error.message);
    return { success: false, message: "Failed to create payment" };
  }
};
