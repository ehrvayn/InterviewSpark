import React, { createContext, useState, useEffect } from "react";
import { Role, InterviewType, DifficultyLevel, Interview } from "../types";
import api from "../lib/api";
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
  startInterview: () => Promise<boolean>;
  submitAnswer: () => Promise<void>;
  endInterview: () => Promise<void>;
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
  interviewStart: boolean;
  setInterviewStart: React.Dispatch<React.SetStateAction<boolean>>;
  showAbortModal: boolean;
  setShowAbortModal: React.Dispatch<React.SetStateAction<boolean>>;
  startError: string | null;
  setStartError: React.Dispatch<React.SetStateAction<string | null>>;
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
  const [interviewStart, setInterviewStart] = useState(false);
  const [showAbortModal, setShowAbortModal] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [allInterviews, setAllInterviews] = useState<Interview[]>([]);
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

  const getQuestionLimit = (difficulty: DifficultyLevel): number => {
    if (difficulty === "junior") return 4;
    else if (difficulty === "intermediate") return 6;
    else if (difficulty === "senior") return 8;
    else return 10;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && currentUser) {
      retrieveInterviews();
    }
  }, [currentUser]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const saved = localStorage.getItem("session");
    if (!saved) return;

    const data = JSON.parse(saved);

    if (data.userId !== currentUser?.id) {
      return;
    }
    setInterviewId(data.interviewId);
    setQuestion(data.question);
    setQuestionNum(data.questionNum);
    setQuestionId(data.questionId);
    setSelectedRole(data.selectedRole);
    setSelectedType(data.selectedType);
    setSelectedDiff(data.selectedDiff);
    setCompany(data.company);
    setQuestionLimit(getQuestionLimit(data.selectedDiff));
    setInterviewStart(true);
  }, [currentUser]);

  const startInterview = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setStartError(null);
      const token = localStorage.getItem("token");
      if (!token) return false;

      const response = await api.post(`/interview/start`, {
        interviewType: selectedType,
        role: selectedRole,
        difficulty: selectedDiff,
        company,
      });

      const data = response.data;

      if (data.success) {
        const interviewState = {
          userId: currentUser?.id,
          interviewId: data.interviewId,
          question: data.question.question_text,
          questionNum: data.question.question_number,
          questionId: data.question.id,
          selectedRole,
          selectedType,
          selectedDiff,
          company,
        };

        localStorage.setItem("session", JSON.stringify(interviewState));

        const limit = getQuestionLimit(selectedDiff);
        setQuestionLimit(limit);

        setInterviewId(data.interviewId);
        setQuestion(data.question.question_text);
        setQuestionNum(data.question.question_number);
        setQuestionId(data.question.id);
        updateCredit(data.remainingCredits);
        return true;
      } else {
        setStartError(data.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      setStartError("Something went wrong!");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.post(`/interview/answer`, {
        interviewId,
        questionId,
        userAnswer: answer,
        questionText: question,
        questionNumber: questionNum,
      });

      const data = response.data;

      if (data.success) {
        setScore(data.score);
        setCurrentQuestion(data.currentQuestion);

        if (data.nextQuestion) {
          setQuestion(data.nextQuestion.question_text);
          setQuestionNum(data.nextQuestion.question_number);
          setQuestionId(data.nextQuestion.id);
        }

        localStorage.removeItem("session");
        const updatedState = {
          interviewId,
          question: data.nextQuestion?.question_text || question,
          questionNum: data.nextQuestion?.question_number || questionNum,
          questionId: data.nextQuestion?.id || questionId,
          selectedRole,
          selectedType,
          selectedDiff,
          company,
        };
        localStorage.setItem("session", JSON.stringify(updatedState));

        setAnswer("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const endInterview = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.post(`/interview/end`, { interviewId });
      const data = response.data;

      if (data.success) {
        const key = `interviewState_${token}`;
        localStorage.removeItem(key);
        setOverallScore(data.overallScore);
        setAverages(data.averages);
        setFeedback(data.feedback);
        localStorage.removeItem("session");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveInterviews = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Unauthorized!");
        return;
      }

      const response = await api.get(`/interview/retrieve`);
      const data = response.data;

      if (data.success) {
        setAllInterviews(data.interviewData);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        interviewStart,
        setInterviewStart,
        currentQuestion,
        setCurrentQuestion,
        questionLimit,
        setQuestionLimit,
        feedback,
        setFeedback,
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
        startError,
        setStartError,
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
