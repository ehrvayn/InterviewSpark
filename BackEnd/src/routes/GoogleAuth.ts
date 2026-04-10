import { googleAuthCallback } from "../controllers/GoogleAuthController";
import { Router } from "express";

const router = Router();

router.post("/google/callback", googleAuthCallback);

export default router;
