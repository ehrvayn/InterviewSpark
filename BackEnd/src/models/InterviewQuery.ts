const InterviewQuery = {
  checkCredit: (userId: number) => ({
    query: `SELECT credit FROM users WHERE id = $1`,
    values: [userId],
  }),
  deductCredit: (userId: number) => ({
    query: `UPDATE users SET credit = credit - 1 WHERE id = $1 RETURNING credit`,
    values: [userId],
  }),
  refundCredit: (userId: number) => ({
    query: `UPDATE users SET credit = credit + 1 WHERE id = $1`,
    values: [userId],
  }),
  start: (interviewData: any) => ({
    query: `INSERT INTO interviews (user_id, interview_type, role, difficulty, company) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, interview_type, role, difficulty, company, created_at`,
    values: [
      interviewData.userId,
      interviewData.interviewType,
      interviewData.role,
      interviewData.difficulty,
      interviewData.company,
    ],
  }),
  addQuestion: (
    interviewId: number,
    questionNumber: number,
    questionText: string,
  ) => ({
    query: `INSERT INTO questions (interview_id, question_number, question_text) VALUES ($1, $2, $3) RETURNING id, question_text, question_number`,
    values: [interviewId, questionNumber, questionText],
  }),
  answerQuestion: (questionId: number, userAnswer: string) => ({
    query: `UPDATE questions SET user_answer = $1 WHERE id = $2 RETURNING id, user_answer, question_text`,
    values: [userAnswer, questionId],
  }),
  scoreAnswer: (
    score: number,
    clarity: number,
    confidence: number,
    relevance: number,
    questionId: number,
  ) => ({
    query: `UPDATE questions SET score = $1, clarity = $2, confidence = $3, relevance = $4 WHERE id = $5`,
    values: [score, clarity, confidence, relevance, questionId],
  }),
  nextQuestion: (
    interviewId: number,
    questionNumber: number,
    questionText: string,
  ) => ({
    query: `INSERT INTO questions (interview_id, question_number, question_text) VALUES ($1, $2, $3) RETURNING id, question_text, question_number`,
    values: [interviewId, questionNumber, questionText],
  }),
  endInterview: (interviewId: number) => ({
    query: `
      SELECT q.id, q.question_text, q.user_answer, q.score, q.clarity, q.confidence, q.relevance,
             i.role, i.company
      FROM questions q
      JOIN interviews i ON i.id = q.interview_id
      WHERE q.interview_id = $1 AND q.user_answer IS NOT NULL 
      ORDER BY q.question_number
    `,
    values: [interviewId],
  }),
};

export default InterviewQuery;
