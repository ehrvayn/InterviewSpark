import { query } from "../../database/Connection";
import InterviewQuery from "../../models/InterviewQuery";
import { scoreAnswer, generateNextQuestion } from "../ai/GrokService";

export const answerQuestion = async (
  interviewId: number,
  questionId: number,
  userAnswer: string,
  questionText: string,
  questionNumber: number,
) => {
  try {
    const interviewResult = await query(
      `SELECT interview_type, role, difficulty, company FROM interviews WHERE id = $1`,
      [interviewId]
    );

    const { interview_type, role, difficulty, company } = interviewResult.rows[0];

    const { query: sql, values } = InterviewQuery.answerQuestion(questionId, userAnswer);
    await query(sql, values);

    const score = await scoreAnswer(questionText, userAnswer, role, company);

    const { query: scoreSql, values: scoreValues } = InterviewQuery.scoreAnswer(
      score.score, score.clarity, score.confidence, score.relevance, questionId
    );
    await query(scoreSql, scoreValues);

    const nextQuestionText = await generateNextQuestion(
      questionText,
      userAnswer,
      role,
      company,
      difficulty,
    );

    const { query: nextSql, values: nextValues } = InterviewQuery.nextQuestion(
      interviewId,
      questionNumber + 1,
      nextQuestionText,
    );
    const nextQuestionResult = await query(nextSql, nextValues);

    return {
      success: true,
      message: "Answer recorded!",
      score: {
        clarity: score.clarity,
        confidence: score.confidence,
        relevance: score.relevance,
        score: score.score,
      },
      currentQuestion: questionText,
      nextQuestion: nextQuestionResult.rows[0],
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};