import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { query } from "../database/Connection";

export interface AuthRequest extends Request {
  userId?: number;
  userData?: {
    id: number;
    email: string;
    name: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    res.status(401).json({
      success: false,
      message: "No token provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
    req.userId = decoded.userId;
    const user = await query(
      "SELECT id, email, name, credit FROM users WHERE id = $1",
      [decoded.userId],
    );
    req.userData = user.rows[0];
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
