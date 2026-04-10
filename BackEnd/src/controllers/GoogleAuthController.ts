import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyGoogleToken, findOrCreateGoogleUser } from "../services/GoogleAuthService";

export const googleAuthCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    // Verify token with Google
    const googleData = await verifyGoogleToken(token);

    // Find or create user
    const user = await findOrCreateGoogleUser(googleData);

    // Generate JWT
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in with Google",
      token: jwtToken,
    });
  } catch (error: any) {
    console.error("Google auth error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Google authentication failed",
    });
  }
};