import { NextRequest, NextResponse } from "next/server";
import xss from "xss";
import Login from "@/server/services/user/Login";
import { AUTH_COOKIE, authCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  let { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ success: false, message: "Missing Credential!" }, { status: 400 });
  }

  email = xss(email.trim().toLowerCase(), { whiteList: {}, stripIgnoreTag: true });
  password = xss(password, { whiteList: {}, stripIgnoreTag: true });

  const result = await Login(email, password);
  const response = NextResponse.json(result, { status: 200 });
  if (result.success && result.token) {
    response.cookies.set(AUTH_COOKIE, result.token, authCookieOptions());
  }
  return response;
}