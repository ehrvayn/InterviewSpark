import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getQuestionLimit } from "@/lib/interview";
import { query } from "@/server/database/Connection";
import InterviewQuery from "@/server/models/InterviewQuery";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = getAuthUser(req);
  if (!user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );

  const { id } = await params;
  const interviewId = Number(id);

  if (!Number.isInteger(interviewId) || interviewId <= 0)
    return NextResponse.json(
      { success: false, message: "Invalid interview id" },
      { status: 400 },
    );

  try {
    const { query: sql, values } = InterviewQuery.getInterviewState(
      interviewId,
      user.userId,
    );
    const result = await query(sql, values);

    if (result.rows.length === 0)
      return NextResponse.json(
        { success: false, message: "Interview not found" },
        { status: 404 },
      );

    const row = result.rows[0];
    const finished = row.overall_score !== null;

    return NextResponse.json({
      success: true,
      interviewId: row.id,
      role: row.role,
      company: row.company,
      interviewType: row.interview_type,
      difficulty: row.difficulty,
      question: row.question_id
        ? {
            id: row.question_id,
            question_text: row.question_text,
            question_number: row.question_number,
          }
        : null,
      answeredCount: row.answered_count,
      questionLimit: getQuestionLimit(row.difficulty),
      finished,
      needsQuestion: !finished && !row.question_id,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong!" },
      { status: 500 },
    );
  }
}
