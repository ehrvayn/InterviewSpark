import { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import {
  endInterviewCon,
  startInterviewCon,
  answerQuestionCon,
} from "../controllers/InterviewController";

const router = Router();

router.post("/start", authMiddleware, startInterviewCon);
router.post("/answer", authMiddleware, answerQuestionCon);
router.post("/end", authMiddleware, endInterviewCon);

export default router;
