import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  verifyGoogleToken,
  findOrCreateGoogleUser,
} from "../services/user/GoogleAuth";
import {
  verifyGithubToken,
  findOrCreateGithubUser,
} from "../services/user/GithubAuth";

export const googleAuthCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.body;
    const googleData = await verifyGoogleToken(token);
    const user = await findOrCreateGoogleUser(googleData);

    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        credit: user.credit,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
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

export const githubAuthCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { code } = req.body;
    const githubData = await verifyGithubToken(code);
    const user = await findOrCreateGithubUser(githubData);

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      success: true,
      message: "Logged in with GitHub",
      token: jwtToken,
    });
  } catch (error: any) {
    console.error("GitHub auth error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "GitHub authentication failed",
    });
  }
};
