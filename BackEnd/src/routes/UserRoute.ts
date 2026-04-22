import { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import {
  registerUserCon,
  loginController,
  retrieveUserCon,
} from "../controllers/UserController";
import rateLimit from "express-rate-limit";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many attempts, try again later" },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many accounts created, try again later",
  },
});

router.post("/register", registerLimiter, registerUserCon);
router.post("/login", loginLimiter, loginController);
router.get("/retrieve", authMiddleware, retrieveUserCon);

export default router;
