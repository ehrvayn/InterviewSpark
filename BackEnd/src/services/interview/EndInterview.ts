import { query } from "../../database/Connection";
import InterviewQuery from "../../models/InterviewQuery";
import { generateFinalFeedback } from "../ai/GrokService";

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

    const avgClarity =
      allQuestions.reduce((sum, q) => sum + (q.clarity || 0), 0) /
      allQuestions.length;
    const avgConfidence =
      allQuestions.reduce((sum, q) => sum + (q.confidence || 0), 0) /
      allQuestions.length;
    const avgRelevance =
      allQuestions.reduce((sum, q) => sum + (q.relevance || 0), 0) /
      allQuestions.length;
    const avgScore =
      allQuestions.reduce((sum, q) => sum + (q.score || 0), 0) /
      allQuestions.length;

    const { role, company } = result.rows[0];
    const feedback = await generateFinalFeedback(allQuestions, role, company);

    await query(`UPDATE interviews SET overall_score = $1 WHERE id = $2`, [
      avgScore,
      interviewId,
    ]);
    await query(
      `DELETE FROM questions WHERE interview_id = $1 AND user_answer IS NULL`,
      [interviewId],
    );

    return {
      success: true,
      message: "Interview completed!",
      overallScore: Math.round(avgScore * 10) / 10,
      averages: {
        clarity: Math.round(avgClarity * 10) / 10,
        confidence: Math.round(avgConfidence * 10) / 10,
        relevance: Math.round(avgRelevance * 10) / 10,
      },
      feedback,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
