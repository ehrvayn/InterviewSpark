import { NextRequest, NextResponse } from "next/server";
import xss from "xss";
import { getAuthUser } from "@/lib/auth";
import { startInterview } from "@/server/services/interview/StartInterview";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  let { interviewType, role, difficulty, company } = body;

  if (!interviewType || !role || !difficulty) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
  }

  interviewType = xss(interviewType.trim(), { whiteList: {}, stripIgnoreTag: true });
  role = xss(role.trim(), { whiteList: {}, stripIgnoreTag: true });
  difficulty = xss(difficulty.trim(), { whiteList: {}, stripIgnoreTag: true });
  company = xss((company || "").trim(), { whiteList: {}, stripIgnoreTag: true });

  const result = await startInterview({ userId: user.userId, interviewType, role, difficulty, company });
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}



