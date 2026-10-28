"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/context/InterviewContext";
import { clearActiveInterviewId } from "@/lib/activeInterview";
import { buildResultFileName, exportResultPdf } from "@/lib/exportResultPdf";
import { GiProgression } from "react-icons/gi";
import { MdOutlineLightbulb, MdCheckCircle } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { FaArrowRight } from "react-icons/fa6";

interface EndInterviewProps {
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
  role: string;
  company: string;
  interviewType: string;
  difficulty: string;
  questions?: {
    question_number: number;
    question_text: string;
    user_answer: string;
    score: number;
  }[];
  onStartNew?: () => void;
}

export default function EndInterview({
  overallScore,
  averages,
  feedback,
  role,
  company,
  interviewType,
  difficulty,
  onStartNew,
}: EndInterviewProps) {
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const {
    setScore,
    setSelectedDiff,
    setSelectedRole,
    setSelectedType,
    setCompany,
  } = useInterview();

  const handleExport = async () => {
    if (!resultRef.current || isExporting) return;

    setIsExporting(true);
    setExportError(null);

    try {
      await exportResultPdf(resultRef.current, {
        fileName: buildResultFileName(role),
      });
    } catch (error) {
      console.error(error);
      setExportError("Could not export the result. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-neutral-300";
    if (score >= 6) return "text-neutral-300";
    return "text-neutral-300";
  };

  const getBarColor = (score: number) => {
    if (score >= 8) return "bg-neutral-500";
    if (score >= 6) return "bg-neutral-500";
    return "bg-neutral-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8)
      return {
        label: "Exceptional",
        style: "border-neutral-500/30 bg-neutral-500/10 text-neutral-400",
      };
    if (score >= 6)
      return {
        label: "Proficient",
        style: "border-neutral-500/30 bg-neutral-500/10 text-neutral-400",
      };
    return {
      label: "Needs Work",
      style: "border-neutral-500/30 bg-neutral-500/10 text-neutral-400",
    };
  };

  const scoreLabel = getScoreLabel(overallScore);

  return (
    <div className="min-h-screen lg:pl-80 text-neutral-100 overflow-hidden">
      <div
        ref={resultRef}
        className="relative z-10 w-full max-w-7xl mx-auto lg:mt-0 md:mt-10 mt-16 px-4 lg:px-8 py-6 md:py-8 animate-in fade-in slide-in- duration-700"
      >
        <header className="mb-12 border-b border-neutral-700/50 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-neutral-500/20 rounded-lg">
              <MdCheckCircle className="text-neutral-500 text-2xl" />
            </div>
            <h1 className="text-3xl md:text-2xl font-bold text-white tracking-tight">
              Interview Complete
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 items-center text-neutral-400 text-xs font-semibold uppercase tracking-widest">
            <span>{role}</span>
            <span className="text-neutral-700">•</span>
            <span>{interviewType}</span>
            <span className="text-neutral-700">•</span>
            <span>{difficulty}</span>
            {company && (
              <>
                <span className="text-neutral-700">•</span>
                <span className="text-neutral-400">{company}</span>
              </>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-4 bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-10 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden group">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">
              Final Score
            </p>
            <div className="relative">
              <span className="text-8xl font-black text-white tracking-tighter">
                {overallScore}
              </span>
              <span className="absolute -right-8 bottom-4 text-sm font-bold text-neutral-700 font-mono">
                /10
              </span>
            </div>
            <div
              className={`mt-8 px-6 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${scoreLabel.style}`}
            >
              {scoreLabel.label}
            </div>
          </div>

          <div className="lg:col-span-8 bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <GiProgression className="text-neutral-400 text-xl" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                Performance Matrix
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { label: "Clarity", value: averages?.clarity },
                { label: "Confidence", value: averages?.confidence },
                { label: "Relevance", value: averages?.relevance },
                { label: "Communication", value: averages?.communication },
                { label: "Conciseness", value: averages?.conciseness },
                { label: "Technical Depth", value: averages?.technical_depth },
              ].map((metric) => (
                <div key={metric.label} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-neutral-300 transition-colors">
                      {metric.label}
                    </span>
                    <span
                      className={`text-xs font-bold font-mono ${getScoreColor(metric.value || 0)}`}
                    >
                      {metric.value || 0}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-neutral-700/30 rounded-full overflow-hidden border border-neutral-700/50">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${getBarColor(metric.value || 0)}`}
                      style={{ width: `${(metric.value || 0) * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {feedback && (
          <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 md:p-6 mb-8 backdrop-blur-sm relative">
            <div className="flex items-center gap-3 mb-8">
              <MdOutlineLightbulb className="text-neutral-400 text-xl" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                Key Insights
              </h2>
            </div>
            <div
              className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-neutral-300 
              [&_strong]:text-white [&_strong]:font-bold 
              [&_ul]:list-none [&_ul]:pl-0 [&_li]:relative [&_li]:pl-6 [&_li]:mb-4
              [&_li::before]:content-['→'] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:text-neutral-400 [&_li::before]:font-bold
              [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-tight [&_h3]:mb-4 [&_h3]:mt-8"
            >
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
          </div>
        )}

        <div data-pdf-hide className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => {
              clearActiveInterviewId();
              if (onStartNew) {
                onStartNew();
                return;
              }
              setScore(null);
              setSelectedDiff("junior");
              setSelectedRole("Software Engineer");
              setSelectedType("behavioral");
              setCompany("");
              router.push("/interview");
            }}
            className="flex-1 py-4 rounded-lg cursor-pointer text-black bg-white hover:bg-white/80 text-[11px] font-bold uppercase tracking-widest hover: transition-all shadow-lg shadow-neutral-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            Start New Session
            <FaArrowRight size={14} />
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-10 py-4 rounded-lg cursor-pointer bg-neutral-800/40 border border-neutral-700/50 text-neutral-300 text-[11px] font-bold uppercase tracking-widest hover:text-white hover:border-neutral-600/50 hover:bg-neutral-800/60 transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExporting ? "Exporting..." : "Export as PDF"}
          </button>
        </div>
        {exportError && (
          <p data-pdf-hide className="mt-3 text-xs text-neutral-400">
            {exportError}
          </p>
        )}
      </div>
    </div>
  );
}
