import { query } from "../../database/Connection";
import PaymentQuery from "../../models/PaymentQuery";

export const processTransaction = async (
  referenceId: string,
  status: "paid" | "failed",
) => {
  try {
    const checkResult = await query(
      `SELECT status, user_id, credits FROM transactions WHERE reference_id = $1`,
      [referenceId],
    );

    if (checkResult.rows.length === 0) {
      return { success: false, message: "Transaction not found" };
    }

    const transaction = checkResult.rows[0];

    if (transaction.status === "paid") {
      return {
        success: true,
        message: "Already processed",
        credits: transaction.credits,
      };
    }

    const { query: updateSql, values: updateValues } =
      PaymentQuery.updateTransactionStatus(referenceId, status);
    const result = await query(updateSql, updateValues);

    if (status === "paid") {
      const { user_id, credits } = result.rows[0];
      const { query: creditSql, values: creditValues } =
        PaymentQuery.addCredits(user_id, credits);
      await query(creditSql, creditValues);
      return { success: true, message: "Payment successful", credits };
    }

    return { success: false, message: "Payment cancelled" };
  } catch (error) {
    console.error("Transaction Processing Error:", error);
    return { success: false, message: "Failed to process transaction" };
  }
};
