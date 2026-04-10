import type { Request, Response } from "express";
import RegisterUser from "../services/RegisterUser";
import Login from "../services/Login";

export const registerUserCon = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({
      success: false,
      message: "Credentials missing!",
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
