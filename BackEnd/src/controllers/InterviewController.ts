import type { Request, Response } from "express";
import { startInterview } from "../services/interview/StartInterview";
import type { AuthRequest } from "../middlewares/AuthMiddleware";
import { answerQuestion } from "../services/interview/AnswerQuestion";
import { endInterview } from "../services/interview/EndInterview";
import { retrieveInterviews } from "../services/interview/RetrieveInterviews";
import xss from "xss";

export const startInterviewCon = async (req: AuthRequest, res: Response) => {
  let { interviewType, role, difficulty, company } = req.body;
  const userId = req.userId;

  if (!interviewType || !role || !difficulty) {
    res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
    return;
  }

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  interviewType = xss(interviewType.trim(), {
    whiteList: {},
    stripIgnoreTag: true,
  });

  role = xss(role.trim(), {
    whiteList: {},
    stripIgnoreTag: true,
  });

  difficulty = xss(difficulty.trim(), {
    whiteList: {},
    stripIgnoreTag: true,
  });

  company = xss(company.trim(), {
    whiteList: {},
    stripIgnoreTag: true,
  });

  const result = await startInterview({
    userId,
    interviewType,
    role,
    difficulty,
    company,
  });

  res.status(result.success ? 200 : 400).json(result);
};

export const answerQuestionCon = async (req: AuthRequest, res: Response) => {
  let { interviewId, questionId, userAnswer, questionText, questionNumber } =
    req.body;
  const userId = req.userId;

  if (
    !interviewId ||
    !questionId ||
    !userAnswer ||
    !questionText ||
    !questionNumber
  ) {
    res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
    return;
  }

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  userAnswer = xss(userAnswer.trim(), {
    whiteList: {},
    stripIgnoreTag: true,
  });

  questionText = xss(questionText.trim(), {
    whiteList: {},
    stripIgnoreTag: true,
  });

  const result = await answerQuestion(
    interviewId,
    questionId,
    userAnswer,
    questionText,
    questionNumber,
  );
  res.status(result.success ? 200 : 400).json(result);
};

export const endInterviewCon = async (req: Request, res: Response) => {
  const { interviewId } = req.body;

  if (!interviewId) {
    res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
    return;
  }

  const result = await endInterview(interviewId);
  res.status(result.success ? 200 : 400).json(result);
};

export const retrieveInterviewsCon = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const result = await retrieveInterviews(userId);
  res.status(result.success ? 200 : 400).json(result);
};
