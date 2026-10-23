const PaymentQuery = {
  createTransaction: (
    userId: number,
    packId: string,
    amount: number,
    credits: number,
    referenceId: string,
  ) => ({
    query: `INSERT INTO transactions (user_id, pack_id, amount, credits, reference_id, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING id`,
    values: [userId, packId, amount, credits, referenceId],
  }),

  updateTransactionStatus: (referenceId: string, status: string) => ({
    query: `UPDATE transactions SET status = $1 WHERE reference_id = $2 RETURNING user_id, credits`,
    values: [status, referenceId],
  }),

  addCredits: (userId: number, credits: number) => ({
    query: `UPDATE users SET credit = credit + $1 WHERE id = $2 RETURNING credit`,
    values: [credits, userId],
  }),
};

export default PaymentQuery;
