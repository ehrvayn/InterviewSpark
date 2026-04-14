import { query } from "../../database/Connection";
import InterviewQuery from "../../models/InterviewQuery";

export const retrieveInterviews = async (userId: any) => {
  try {
    const { query: sql, values } = InterviewQuery.retrieveInterviews(userId);
    const result = await query(sql, values);

    return {
      success: true,
      message:
        result.rows.length > 0
          ? "Interview feedbacks retrieved successfully!"
          : "No interviews found.",
      interviewData: result.rows,
    };
  } catch (error) {
    console.error("Retrieve Feedback Error:", error);
    return { success: false, message: "Internal server error" };
  }
};
