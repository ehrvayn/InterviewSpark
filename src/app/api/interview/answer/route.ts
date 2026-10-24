import { NextRequest, NextResponse } from "next/server";
import xss from "xss";
import { getAuthUser } from "@/lib/auth";
import { answerQuestion } from "@/server/services/interview/AnswerQuestion";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  let { interviewId, questionId, userAnswer, questionText, questionNumber } = body;

  if (!interviewId || !questionId || !userAnswer || !questionText || !questionNumber) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
  }

  userAnswer = xss(userAnswer.trim(), { whiteList: {}, stripIgnoreTag: true });
  questionText = xss(questionText.trim(), { whiteList: {}, stripIgnoreTag: true });

  const result = await answerQuestion(interviewId, questionId, userAnswer, questionText, questionNumber);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}


