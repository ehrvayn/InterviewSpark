import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { retrieveUser } from "@/server/services/user/RetriveUser";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const result = await retrieveUser(user.userId);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}