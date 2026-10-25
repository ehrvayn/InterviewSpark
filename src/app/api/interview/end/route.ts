import { NextRequest, NextResponse } from "next/server";
import { endInterview } from "@/server/services/interview/EndInterview";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { interviewId } = body;
  if (!interviewId) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
  }
  const result = await endInterview(interviewId);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}



