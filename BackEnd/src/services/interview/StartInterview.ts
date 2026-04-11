import { query } from "../../database/Connection";
import InterviewQuery from "../../models/InterviewQuery";
import { generateFirstQuestion } from "../ai/GrokService";

export const startInterview = async (interviewData: any) => {
  try {
    const { query: sql, values } = InterviewQuery.start(interviewData);
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "Failed to create interview" };
    }

    const interview = result.rows[0];
    const interviewId = interview.id;

    const questionText = await generateFirstQuestion(
      interviewData.interviewType,
      interviewData.role,
      interviewData.difficulty,
      interviewData.company
    );

    const { query: questionSql, values: questionValues } =
      InterviewQuery.addQuestion(interviewId, 1, questionText);
    const questionResult = await query(questionSql, questionValues);

    if (questionResult.rows.length === 0) {
      return { success: false, message: "Failed to generate question" };
    }

    return {
      success: true,
      message: "Interview Started!",
      interviewId,
      question: questionResult.rows[0],
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
