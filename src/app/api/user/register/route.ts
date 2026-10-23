import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import xss from "xss";
import RegisterUser from "@/server/services/user/RegisterUser";
import { AUTH_COOKIE, authCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  let { name, email, password } = body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password || !name) {
    return NextResponse.json({ success: false, message: "All fields (email, password, name) are required." }, { status: 400 });
  }

  email = xss(email.trim().toLowerCase(), { whiteList: {}, stripIgnoreTag: true });
  name = xss(name.trim(), { whiteList: {}, stripIgnoreTag: true });
  password = xss(password, { whiteList: {}, stripIgnoreTag: true });

  if (!emailRegex.test(email)) {
    return NextResponse.json({ success: false, message: "Please provide a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ success: false, message: "Password must be at least 8 characters long." }, { status: 400 });
  }

  const result = await RegisterUser({ name, email, password });

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  const user = result.data;
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      credit: user.credit,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  const response = NextResponse.json(
    { ...result, token },
    { status: 201 },
  );
  response.cookies.set(AUTH_COOKIE, token, authCookieOptions());
  return response;
}