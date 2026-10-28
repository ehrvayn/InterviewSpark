import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getInterviewResult } from "@/server/services/interview/EndInterview";

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

  const result = await getInterviewResult(interviewId);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}
