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
    communication: number,
    conciseness: number,
    technical_depth: number,
    questionId: number,
  ) => ({
    query: `UPDATE questions SET score = $1, clarity = $2, confidence = $3, relevance = $4, communication = $5, conciseness = $6, technical_depth = $7 WHERE id = $8`,
    values: [
      score,
      clarity,
      confidence,
      relevance,
      communication,
      conciseness,
      technical_depth,
      questionId,
    ],
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
    SELECT q.id, q.question_text, q.user_answer, q.score, q.clarity, q.confidence, q.relevance, q.communication, q.conciseness, q.technical_depth,
           i.role, i.company
    FROM questions q
    JOIN interviews i ON i.id = q.interview_id
    WHERE q.interview_id = $1 AND q.user_answer IS NOT NULL 
    ORDER BY q.question_number
  `,
    values: [interviewId],
  }),

  retrieveInterviews: (userId: number) => ({
    query: `
    SELECT 
      i.id, i.interview_type, i.role, i.difficulty, i.company, i.overall_score, i.created_at,
      f.clarity, f.confidence, f.relevance, f.communication, f.conciseness, f.technical_depth, f.feedback
    FROM interviews i
    LEFT JOIN interview_feedback f ON i.id = f.interview_id
    WHERE i.user_id = $1
    ORDER BY i.created_at DESC
  `,
    values: [userId],
  }),

  feedback: (interviewId: any, averages: any, feedbackText: any) => ({
    query: `
    INSERT INTO interview_feedback (
      interview_id, clarity, confidence, relevance, 
      communication, conciseness, technical_depth, 
      feedback
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `,
    values: [
      interviewId,
      Math.round(averages.clarity),
      Math.round(averages.confidence),
      Math.round(averages.relevance),
      Math.round(averages.communication),
      Math.round(averages.conciseness),
      Math.round(averages.technical_depth),
      feedbackText,
    ],
  }),
};

export default InterviewQuery;
