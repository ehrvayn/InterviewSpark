import { query } from "../../database/Connection";
import InterviewQuery from "../../models/InterviewQuery";
import { generateFirstQuestion } from "../ai/GrokService";

export const startInterview = async (interviewData: any) => {
  try {
    const { query: creditSql, values: creditValues } =
      InterviewQuery.checkCredit(interviewData.userId);
    const creditResult = await query(creditSql, creditValues);

    if (creditResult.rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    if (creditResult.rows[0].credit <= 0) {
      return { success: false, message: "Not enough credits" };
    }

    const { query: deductSql, values: deductValues } =
      InterviewQuery.deductCredit(interviewData.userId);
    const deducted = await query(deductSql, deductValues);
    const remainingCredits = deducted.rows[0].credit;

    const { query: sql, values } = InterviewQuery.start(interviewData);
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      const { query: refundSql, values: refundValues } =
        InterviewQuery.refundCredit(interviewData.userId);
      await query(refundSql, refundValues);
      return { success: false, message: "Failed to create interview" };
    }

    const interviewId = result.rows[0].id;

    const questionText = await generateFirstQuestion(
      interviewData.interviewType,
      interviewData.role,
      interviewData.difficulty,
      interviewData.company,
    );

    const { query: questionSql, values: questionValues } =
      InterviewQuery.addQuestion(interviewId, 1, questionText);
    const questionResult = await query(questionSql, questionValues);

    if (questionResult.rows.length === 0) {
      const { query: refundSql, values: refundValues } =
        InterviewQuery.refundCredit(interviewData.userId);
      await query(refundSql, refundValues);
      return { success: false, message: "Failed to generate question" };
    }

    return {
      success: true,
      message: "Interview Started!",
      interviewId,
      question: questionResult.rows[0],
      remainingCredits,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
