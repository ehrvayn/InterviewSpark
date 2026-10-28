"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import Loading from "@/components/Loading";
import EndInterview from "../../../../components/interview/EndInterview";

type ResultData = {
  success: boolean;
  message?: string;
  role: string;
  company: string | null;
  interviewType: string;
  difficulty: string;
  overallScore: number;
  averages: {
    clarity: number;
    confidence: number;
    relevance: number;
    communication: number;
    conciseness: number;
    technical_depth: number;
  };
  feedback: string;
  questions: {
    question_number: number;
    question_text: string;
    user_answer: string;
    score: number;
  }[];
};

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/interview/result/${id}`)
      .then((res) => {
        if (!res.data.success) setError(res.data.message);
        else setData(res.data);
      })
      .catch(() => setError("Could not load this result."));
  }, [id]);

  if (error)
    return (
      <div className="p-10 text-neutral-400">
        <p className="mb-4">{error}</p>
        <button onClick={() => router.push("/interview")} className="underline">
          Back to interview
        </button>
      </div>
    );

  if (!data) return <Loading />;

  return (
    <EndInterview
      overallScore={data.overallScore}
      averages={data.averages}
      feedback={data.feedback}
      role={data.role}
      company={data.company ?? ""}
      interviewType={data.interviewType}
      difficulty={data.difficulty}
      questions={data.questions}
      onStartNew={() => router.push("/interview")}
    />
  );
}
