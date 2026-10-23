import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyGoogleToken, findOrCreateGoogleUser } from "@/server/services/user/GoogleAuth";

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

    return NextResponse.json({ success: true, message: "Logged in with Google", token: jwtToken });
  } catch (error: any) {
    console.error("Google auth error:", error);
    return NextResponse.json({ success: false, message: error.message || "Google authentication failed" }, { status: 400 });
  }
}