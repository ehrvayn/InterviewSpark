import { googleAuthCallback, githubAuthCallback } from "../controllers/OAuthController";
import { Router } from "express";

const router = Router();

router.post("/google/callback", googleAuthCallback);
router.post("/github/callback", githubAuthCallback);

export default router;
