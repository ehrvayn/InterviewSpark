import { Router } from "express";
import {
  initiatePayment,
  paymentWebhook,
  paymentSuccess,
  paymentFailed,
} from "../controllers/PaymentController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import rateLimit from "express-rate-limit";

const router = Router();

const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many payment attempts, try again later",
  },
});

router.post("/create", authMiddleware, paymentLimiter, initiatePayment);
router.post("/webhook", paymentWebhook);
router.get("/success", paymentSuccess);
router.get("/failed", paymentFailed);

export default router;
