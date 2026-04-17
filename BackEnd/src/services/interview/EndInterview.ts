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
      message: "Interview completed!",
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
