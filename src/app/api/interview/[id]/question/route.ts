import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { ensureQuestion } from "@/server/services/interview/EnsureQuestion";

export async function POST(
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

  const result = await ensureQuestion(interviewId, user.userId);
  const status = result.success
    ? 200
    : result.message === "Interview not found"
      ? 404
      : 400;

  return NextResponse.json(result, { status });
}
