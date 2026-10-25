import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyGoogleToken, findOrCreateGoogleUser } from "@/server/services/user/GoogleAuth";
import { AUTH_COOKIE, authCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const googleData = await verifyGoogleToken(token);
    const user = await findOrCreateGoogleUser(googleData);

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, credit: user.credit },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json({ success: true, message: "Logged in with Google", token: jwtToken });
    response.cookies.set(AUTH_COOKIE, jwtToken, authCookieOptions());
    return response;
  } catch (error: any) {
    console.error("Google auth error:", error);
    return NextResponse.json({ success: false, message: error.message || "Google authentication failed" }, { status: 400 });
  }
}



