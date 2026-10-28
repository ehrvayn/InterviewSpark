import { query } from "../../database/Connection";
import InterviewQuery from "../../models/InterviewQuery";
import {
  generateFirstQuestion,
  generateNextQuestion,
} from "../ai/GroqService";

export const ensureQuestion = async (interviewId: number, userId: number) => {
  try {
    const { query: stateSql, values: stateValues } =
      InterviewQuery.getInterviewState(interviewId, userId);
    const stateResult = await query(stateSql, stateValues);

    if (stateResult.rows.length === 0) {
      return { success: false, message: "Interview not found" };
    }

    const state = stateResult.rows[0];

    if (state.overall_score !== null) {
      return {
        success: false,
        finished: true,
        message: "This interview has already been completed.",
      };
    }

    if (state.question_id) {
      return {
        success: true,
        message: "Question already exists",
        question: {
          id: state.question_id,
          question_text: state.question_text,
          question_number: state.question_number,
        },
      };
    }

    const { query: latestSql, values: latestValues } =
      InterviewQuery.latestAnsweredQuestion(interviewId);
    const latestResult = await query(latestSql, latestValues);
    const latest = latestResult.rows[0];

    let questionNumber = 1;
    let questionText: string;

    if (!latest) {
      questionText = await generateFirstQuestion(
        state.interview_type,
        state.role,
        state.difficulty,
        state.company,
      );
    } else {
      questionNumber = latest.question_number + 1;
      questionText = await generateNextQuestion(
        latest.question_text,
        latest.user_answer,
        state.role,
        state.company,
        state.difficulty,
      );
    }

    const { query: insertSql, values: insertValues } =
      InterviewQuery.addQuestion(interviewId, questionNumber, questionText);
    const inserted = await query(insertSql, insertValues);

    if (inserted.rows.length === 0) {
      return { success: false, message: "Failed to generate question" };
    }

    return {
      success: true,
      message: "Question generated!",
      question: inserted.rows[0],
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
