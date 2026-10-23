import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyGithubToken, findOrCreateGithubUser } from "@/server/services/user/GithubAuth";
import { AUTH_COOKIE, authCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const githubData = await verifyGithubToken(code);
    const user = await findOrCreateGithubUser(githubData);

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, credit: user.credit },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json({ success: true, message: "Logged in with GitHub", token: jwtToken });
    response.cookies.set(AUTH_COOKIE, jwtToken, authCookieOptions());
    return response;
  } catch (error: any) {
    console.error("GitHub auth error:", error);
    return NextResponse.json({ success: false, message: error.message || "GitHub authentication failed" }, { status: 400 });
  }
}