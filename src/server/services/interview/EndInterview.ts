import { query } from "../../database/Connection";
import InterviewQuery from "../../models/InterviewQuery";
import { generateFinalFeedback } from "../ai/GroqService";

export const endInterview = async (interviewId: number) => {
  try {
    const { query: sql, values } = InterviewQuery.endInterview(interviewId);
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "No interview found!" };
    }

    const allQuestions = result.rows
      .filter((q) => q.score !== null)
      .map((q) => ({
        ...q,
        score: parseFloat(q.score),
      }));

    if (allQuestions.length === 0) {
      return { success: false, message: "No answered questions found." };
    }

    const averages = {
      clarity:
        allQuestions.reduce((sum, q) => sum + (q.clarity || 0), 0) /
        allQuestions.length,
      confidence:
        allQuestions.reduce((sum, q) => sum + (q.confidence || 0), 0) /
        allQuestions.length,
      relevance:
        allQuestions.reduce((sum, q) => sum + (q.relevance || 0), 0) /
        allQuestions.length,
      communication:
        allQuestions.reduce((sum, q) => sum + (q.communication || 0), 0) /
        allQuestions.length,
      conciseness:
        allQuestions.reduce((sum, q) => sum + (q.conciseness || 0), 0) /
        allQuestions.length,
      technical_depth:
        allQuestions.reduce((sum, q) => sum + (q.technical_depth || 0), 0) /
        allQuestions.length,
    };

    const avgScore =
      allQuestions.reduce((sum, q) => sum + (q.score || 0), 0) /
      allQuestions.length;

    const { role, company } = result.rows[0];
    const feedback = await generateFinalFeedback(allQuestions, role, company);

    await query(`UPDATE interviews SET overall_score = $1 WHERE id = $2`, [
      avgScore,
      interviewId,
    ]);

    const { query: feedbackSql, values: feedbackValues } =
      InterviewQuery.feedback(interviewId, averages, feedback);

    await query(feedbackSql, feedbackValues);

    await query(
      `DELETE FROM questions WHERE interview_id = $1 AND user_answer IS NULL`,
      [interviewId],
    );

    return {
      success: true,
      message: "Interview complete!",
      overallScore: Math.round(avgScore * 10) / 10,
      averages: Object.fromEntries(
        Object.entries(averages).map(([k, v]) => [k, Math.round(v * 10) / 10]),
      ),
      feedback,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const getInterviewResult = async (interviewId: number) => {
  try {
    const { query: sql, values } =
      InterviewQuery.getInterviewResult(interviewId);
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "No interview found!" };
    }

    const first = result.rows[0];

    if (first.overall_score === null || !first.feedback) {
      return {
        success: false,
        message: "This interview has not been finished yet.",
      };
    }

    const questions = result.rows
      .filter((q) => q.question_number !== null)
      .map((q) => ({
        question_number: q.question_number,
        question_text: q.question_text,
        user_answer: q.user_answer,
        score: Number(q.score),
        clarity: Number(q.clarity),
        confidence: Number(q.confidence),
        relevance: Number(q.relevance),
        communication: Number(q.communication),
        conciseness: Number(q.conciseness),
        technical_depth: Number(q.technical_depth),
      }));

    const averages = {
      clarity: Math.round(Number(first.avg_clarity) * 10) / 10,
      confidence: Math.round(Number(first.avg_confidence) * 10) / 10,
      relevance: Math.round(Number(first.avg_relevance) * 10) / 10,
      communication: Math.round(Number(first.avg_communication) * 10) / 10,
      conciseness: Math.round(Number(first.avg_conciseness) * 10) / 10,
      technical_depth: Math.round(Number(first.avg_technical_depth) * 10) / 10,
    };

    return {
      success: true,
      message: "Interview found!",
      role: first.role,
      company: first.company,
      interviewType: first.interview_type,
      difficulty: first.difficulty,
      overallScore: Math.round(Number(first.overall_score) * 10) / 10,
      averages,
      feedback: first.feedback,
      questions,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
