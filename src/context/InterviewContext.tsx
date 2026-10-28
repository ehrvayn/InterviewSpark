"use client";
import React, { createContext, useCallback, useState, useEffect } from "react";
import { Role, InterviewType, DifficultyLevel, Interview } from "../types";
import api from "../lib/api";
import { getQuestionLimit } from "../lib/interview";
import { setActiveInterviewId } from "../lib/activeInterview";
import { useCurrentUser } from "./CurrentUserContext";

interface InterviewContextType {
  selectedRole: string;
  setSelectedRole: React.Dispatch<React.SetStateAction<Role>>;
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<InterviewType>>;
  selectedDiff: string;
  setSelectedDiff: React.Dispatch<React.SetStateAction<DifficultyLevel>>;
  answer: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  startInterview: () => Promise<number | null>;
  submitAnswer: () => Promise<boolean>;
  endInterview: (interviewId: number) => Promise<boolean>;
  retrieveInterviews: () => Promise<void>;
  company: string;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
  questionId: number;
  setQuestionId: React.Dispatch<React.SetStateAction<number>>;
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  currentQuestion: string;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<string>>;
  feedback: string;
  setFeedback: React.Dispatch<React.SetStateAction<string>>;
  questionNum: number;
  setQuestionNum: React.Dispatch<React.SetStateAction<number>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  questionLimit: number;
  setQuestionLimit: React.Dispatch<React.SetStateAction<number>>;
  interviewId: number;
  setInterviewId: React.Dispatch<React.SetStateAction<number>>;
  overallScore: number;
  setOverallScore: React.Dispatch<React.SetStateAction<number>>;
  allInterviews: Interview[];
  setAllInterviews: React.Dispatch<React.SetStateAction<Interview[]>>;
  isLoading: boolean;
  interviewsLoading: boolean;
  showAbortModal: boolean;
  setShowAbortModal: React.Dispatch<React.SetStateAction<boolean>>;
  startError: string | null;
  setStartError: React.Dispatch<React.SetStateAction<string | null>>;
  answerError: string | null;
  setAnswerError: React.Dispatch<React.SetStateAction<string | null>>;
  score: {
    clarity: number;
    confidence: number;
    relevance: number;
    communication: number;
    conciseness: number;
    technical_depth: number;
    score: number;
  } | null;
  setScore: React.Dispatch<
    React.SetStateAction<{
      clarity: number;
      confidence: number;
      relevance: number;
      communication: number;
      conciseness: number;
      technical_depth: number;
      score: number;
    } | null>
  >;
  averages: {
    clarity: number;
    confidence: number;
    relevance: number;
    communication: number;
    conciseness: number;
    technical_depth: number;
  } | null;
  setAverages: React.Dispatch<
    React.SetStateAction<{
      clarity: number;
      confidence: number;
      relevance: number;
      communication: number;
      conciseness: number;
      technical_depth: number;
    } | null>
  >;
}

const InterviewContext = createContext<InterviewContextType | null>(null);

const fetchInterviews = async () => {
  const response = await api.get(`/interview/retrieve`);
  return response.data;
};

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { updateCredit, currentUser } = useCurrentUser();

  const [selectedRole, setSelectedRole] = useState<Role>("Software Engineer");
  const [selectedType, setSelectedType] = useState<InterviewType>("behavioral");
  const [selectedDiff, setSelectedDiff] = useState<DifficultyLevel>("junior");
  const [company, setCompany] = useState("");
  const [answer, setAnswer] = useState("");
  const [interviewId, setInterviewId] = useState(0);
  const [questionId, setQuestionId] = useState(0);
  const [question, setQuestion] = useState("");
  const [questionNum, setQuestionNum] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [questionLimit, setQuestionLimit] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewsLoading, setInterviewsLoading] = useState(true);
  const [showAbortModal, setShowAbortModal] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [allInterviews, setAllInterviews] = useState<Interview[]>([]);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [averages, setAverages] = useState<{
    clarity: number;
    confidence: number;
    relevance: number;
    communication: number;
    conciseness: number;
    technical_depth: number;
  } | null>(null);
  const [score, setScore] = useState<{
    clarity: number;
    confidence: number;
    relevance: number;
    communication: number;
    conciseness: number;
    technical_depth: number;
    score: number;
  } | null>(null);

  const startInterview = async (): Promise<number | null> => {
    try {
      setIsLoading(true);
      setStartError(null);

      const response = await api.post(`/interview/start`, {
        interviewType: selectedType,
        role: selectedRole,
        difficulty: selectedDiff,
        company,
      });

      const data = response.data;

      if (data.success && data.interviewId && data.question) {
        const limit = getQuestionLimit(selectedDiff);
        setQuestionLimit(limit);

        setInterviewId(data.interviewId);
        setQuestion(data.question.question_text);
        setQuestionNum(data.question.question_number);
        setQuestionId(data.question.id);
        updateCredit(data.remainingCredits);
        setActiveInterviewId(data.interviewId);
        return data.interviewId;
      } else {
        setStartError(data.message || "Could not start the interview.");
        return null;
      }
    } catch (error) {
      console.log(error);
      setStartError("Something went wrong!");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (): Promise<boolean> => {
    setAnswerError(null);
    try {
      setIsLoading(true);

      const response = await api.post(`/interview/answer`, {
        interviewId,
        questionId,
        userAnswer: answer,
        questionText: question,
        questionNumber: questionNum,
      });

      const data = response.data;

      if (!data.success || !data.score) {
        setAnswerError(
          data.message || "Could not submit your answer. Try again.",
        );
        return false;
      }

      setScore(data.score);
      setCurrentQuestion(data.currentQuestion);

      if (data.nextQuestion) {
        setQuestion(data.nextQuestion.question_text);
        setQuestionNum(data.nextQuestion.question_number);
        setQuestionId(data.nextQuestion.id);
      }

      setAnswer("");
      return true;
    } catch (error) {
      console.log(error);
      setAnswerError("Network error. Check your connection and submit again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const endInterview = async (interviewId: number): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await api.post(`/interview/end`, { interviewId });
      const data = response.data;

      if (data.success) {
        setOverallScore(data.overallScore);
        setAverages(data.averages);
        setFeedback(data.feedback);
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveInterviews = useCallback(async (): Promise<void> => {
    try {
      const data = await fetchInterviews();

      if (data.success) {
        setAllInterviews(data.interviewData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setInterviewsLoading(false);
    }
  }, []);

  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    fetchInterviews()
      .then((data) => {
        if (!cancelled && data.success) {
          setAllInterviews(data.interviewData);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.log(error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setInterviewsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <InterviewContext.Provider
      value={{
        showAbortModal,
        setShowAbortModal,
        allInterviews,
        setAllInterviews,
        retrieveInterviews,
        progress,
        setProgress,
        currentQuestion,
        setCurrentQuestion,
        questionLimit,
        setQuestionLimit,
        feedback,
        setFeedback,
        answerError,
        startError,
        setStartError,
        setAnswerError,
        overallScore,
        setOverallScore,
        averages,
        setAverages,
        endInterview,
        score,
        setScore,
        submitAnswer,
        selectedRole,
        setSelectedRole,
        selectedType,
        setSelectedType,
        selectedDiff,
        setSelectedDiff,
        answer,
        setAnswer,
        startInterview,
        company,
        setCompany,
        question,
        setQuestion,
        questionNum,
        setQuestionNum,
        interviewId,
        setInterviewId,
        questionId,
        setQuestionId,
        isLoading,
        interviewsLoading,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = React.useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used inside InterviewProvider");
  }
  return context;
};
