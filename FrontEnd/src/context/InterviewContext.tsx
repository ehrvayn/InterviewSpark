import React, { createContext, useState } from "react";
import { Role, InterviewType, DifficultyLevel } from "../types";
import api from "../lib/api";

interface InterviewContextType {
  selectedRole: string;
  setSelectedRole: React.Dispatch<React.SetStateAction<Role>>;
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<InterviewType>>;
  selectedDiff: string;
  setSelectedDiff: React.Dispatch<React.SetStateAction<DifficultyLevel>>;
  answer: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  startInterview: () => Promise<void>;
  submitAnswer: () => Promise<void>;
  endInterview: () => Promise<void>;
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
  questionLimit: number;
  setQuestionLimit: React.Dispatch<React.SetStateAction<number>>;
  interviewId: number;
  setInterviewId: React.Dispatch<React.SetStateAction<number>>;
  overallScore: number;
  setOverallScore: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  score: {
    clarity: number;
    confidence: number;
    relevance: number;
    score: number;
  } | null;
  setScore: React.Dispatch<
    React.SetStateAction<{
      clarity: number;
      confidence: number;
      relevance: number;
      score: number;
    } | null>
  >;
  averages: {
    clarity: number;
    confidence: number;
    relevance: number;
  } | null;
  setAverages: React.Dispatch<
    React.SetStateAction<{
      clarity: number;
      confidence: number;
      relevance: number;
    } | null>
  >;
}

const InterviewContext = createContext<InterviewContextType | null>(null);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
  const [feedback, setFeedback] = useState("");
  const [questionLimit, setQuestionLimit] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [averages, setAverages] = useState<{
    clarity: number;
    confidence: number;
    relevance: number;
  } | null>(null);
  const [score, setScore] = useState<{
    clarity: number;
    confidence: number;
    relevance: number;
    score: number;
  } | null>(null);

  const startInterview = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const interviewData = {
        interviewType: selectedType,
        role: selectedRole,
        difficulty: selectedDiff,
        company: company,
      };

      const response = await api.post(`/interview/start`, interviewData);
      const data = response.data;

      if (data.success) {
        if (selectedDiff === "junior") setQuestionLimit(4);
        else if (selectedDiff === "intermediate") setQuestionLimit(6);
        else if (selectedDiff === "senior") setQuestionLimit(8);
        else setQuestionLimit(10);

        setInterviewId(data.interviewId);
        setQuestion(data.question.question_text);
        setQuestionNum(data.question.question_number);
        setQuestionId(data.question.id);
      } else {
        console.log(data.message || "Interview failed to start!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const answerData = {
        interviewId: interviewId,
        questionId: questionId,
        userAnswer: answer,
        questionText: question,
        questionNumber: questionNum,
      };

      const response = await api.post(`/interview/answer`, answerData);
      const data = response.data;

      if (data.success) {
        setScore(data.score);
        setCurrentQuestion(data.currentQuestion);
        if (data.nextQuestion) {
          setQuestion(data.nextQuestion.question_text);
          setQuestionNum(data.nextQuestion.question_number);
          setQuestionId(data.nextQuestion.id);
        }
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
        setOverallScore(data.overallScore);
        setAverages(data.averages);
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InterviewContext.Provider
      value={{
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
