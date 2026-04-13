import type { Request, Response } from "express";
import RegisterUser from "../services/user/RegisterUser";
import Login from "../services/user/Login";
import { retrieveUser } from "../services/user/RetriveUser";
import { AuthRequest } from "../middlewares/AuthMiddleware";

export const registerUserCon = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password || !name) {
    res.status(400).json({
      success: false,
      message: "All fields (email, password, name) are required.",
    });
    return;
  }

  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
    return;
  }

  const result = await RegisterUser(req.body);

  if (!result.success) {
    res.status(400).json(result);
    return;
  }
  res.status(201).json(result);
};

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: "Missing Credential!",
    });
    return;
  }

  const result = await Login(email, password);

  if (!result.success) {
    res.status(200).json({
      success: false,
      message: result.message,
    });
    return;
  }

  res.status(200).json(result);
};

export const retrieveUserCon = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const result = await retrieveUser(userId);
  res.status(result.success ? 200 : 400).json(result);
};
