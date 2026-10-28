"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/api";
import Loading from "@/components/Loading";
import { useInterview } from "@/context/InterviewContext";
import {
  clearActiveInterviewId,
  setActiveInterviewId,
} from "@/lib/activeInterview";
import type { DifficultyLevel, InterviewType, Role } from "@/types";
import Questions from "./Questions";

type InterviewQuestion = {
  id: number;
  question_text: string;
  question_number: number;
};

type InterviewStateResponse = {
  success: boolean;
  message?: string;
  interviewId: number;
  role: Role;
  company: string | null;
  interviewType: InterviewType;
  difficulty: DifficultyLevel;
  question: InterviewQuestion | null;
  answeredCount: number;
  questionLimit: number;
  finished: boolean;
  needsQuestion: boolean;
};

type GeneratedQuestionResponse = {
  success: boolean;
  message?: string;
  question?: InterviewQuestion;
  finished?: boolean;
};

function InterviewSession() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const interviewId = Number(id);
  const isValidId = Number.isInteger(interviewId) && interviewId > 0;

  const {
    setInterviewId,
    setSelectedRole,
    setSelectedType,
    setSelectedDiff,
    setCompany,
    setQuestion,
    setQuestionNum,
    setQuestionId,
    setQuestionLimit,
    setAnswer,
    setScore,
    setCurrentQuestion,
    setAnswerError,
    setShowAbortModal,
  } = useInterview();

  const [session, setSession] = useState<InterviewStateResponse | null>(null);
  const [error, setError] = useState<{ id: number; message: string } | null>(
    null,
  );

  const redirectToSetup = useCallback(
    (message: string) => {
      clearActiveInterviewId();
      router.replace(`/interview?message=${encodeURIComponent(message)}`);
    },
    [router],
  );

  useEffect(() => {
    if (!isValidId) {
      redirectToSetup("That interview link is invalid.");
      return;
    }

    let cancelled = false;

    const loadSession = async () => {
      try {
        const response = await api.get(`/interview/${interviewId}`);
        if (cancelled) return;

        const data = response.data as InterviewStateResponse;

        if (!data.success) {
          redirectToSetup(data.message || "Could not load this interview.");
          return;
        }

        if (data.finished) {
          redirectToSetup("This interview has already been completed.");
          return;
        }

        let question = data.question;

        if (!question) {
          if (!data.needsQuestion) {
            redirectToSetup("This interview has no active question.");
            return;
          }

          const generatedResponse = await api.post(
            `/interview/${interviewId}/question`,
          );
          if (cancelled) return;

          const generated = generatedResponse.data as GeneratedQuestionResponse;

          if (!generated.success || !generated.question) {
            setError({
              id: interviewId,
              message:
                generated.message ||
                "Could not generate the next interview question.",
            });
            return;
          }

          question = generated.question;
        }

        setAnswer("");
        setScore(null);
        setCurrentQuestion("");
        setAnswerError(null);
        setShowAbortModal(false);
        setInterviewId(data.interviewId);
        setSelectedRole(data.role);
        setSelectedType(data.interviewType);
        setSelectedDiff(data.difficulty);
        setCompany(data.company ?? "");
        setQuestionLimit(data.questionLimit);
        setQuestion(question.question_text);
        setQuestionNum(question.question_number);
        setQuestionId(question.id);
        setActiveInterviewId(data.interviewId);
        setSession({ ...data, question });
      } catch (requestError: unknown) {
        if (cancelled) return;

        if (axios.isAxiosError(requestError)) {
          const status = requestError.response?.status;
          const message = (
            requestError.response?.data as { message?: string } | undefined
          )?.message;

          if (status === 401 || status === 404) {
            redirectToSetup(
              message || "This interview could not be found or is unavailable.",
            );
            return;
          }

          if (
            status === 400 &&
            message === "This interview has already been completed."
          ) {
            redirectToSetup(message);
            return;
          }

          if (status === 400) {
            setError({
              id: interviewId,
              message: message || "Could not load this interview.",
            });
            return;
          }
        }

        setError({
          id: interviewId,
          message: "Could not load this interview.",
        });
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [
    interviewId,
    isValidId,
    redirectToSetup,
    setAnswer,
    setAnswerError,
    setCompany,
    setCurrentQuestion,
    setInterviewId,
    setQuestion,
    setQuestionId,
    setQuestionLimit,
    setQuestionNum,
    setScore,
    setSelectedDiff,
    setSelectedRole,
    setSelectedType,
    setShowAbortModal,
  ]);

  const activeSession =
    session?.interviewId === interviewId ? session : null;
  const activeError =
    error?.id === interviewId ? error.message : null;

  if (activeError) {
    return (
      <div className="min-h-screen text-neutral-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-5 text-center">
          <p className="text-sm text-neutral-300">{activeError}</p>
          <button
            onClick={() => router.push("/interview")}
            className="w-full py-3.5 rounded-lg bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-white/80 transition-all active:scale-95"
          >
            Back to Interview Setup
          </button>
        </div>
      </div>
    );
  }

  if (!activeSession?.question) return <Loading />;

  return (
    <Questions
      key={activeSession.interviewId}
      interviewId={activeSession.interviewId}
      answeredCount={activeSession.answeredCount}
    />
  );
}

export default function InterviewSessionPage() {
  return (
    <Suspense fallback={<Loading />}>
      <InterviewSession />
    </Suspense>
  );
}
