import React from "react";
import { useInterview } from "../../context/InterviewContext";
import { GiProgression } from "react-icons/gi";
import { MdOutlineLightbulb, MdCheckCircle } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { FaArrowRight } from "react-icons/fa6";

interface EndInterviewProps {
  setStage: React.Dispatch<
    React.SetStateAction<"setup" | "active" | "feedback">
  >;
}

export default function EndInterview({ setStage }: EndInterviewProps) {
  const {
    overallScore,
    averages,
    feedback,
    setScore,
    setSelectedDiff,
    setSelectedRole,
    setSelectedType,
    setCompany,
    selectedRole,
    company,
    selectedType,
    selectedDiff,
    setInterviewStart,
  } = useInterview();

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-300";
    if (score >= 6) return "text-amber-300";
    return "text-red-300";
  };

  const getBarColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-amber-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8)
      return {
        label: "Exceptional",
        style: "border-green-500/30 bg-green-500/10 text-green-400",
      };
    if (score >= 6)
      return {
        label: "Proficient",
        style: "border-amber-500/30 bg-amber-500/10 text-amber-400",
      };
    return {
      label: "Needs Work",
      style: "border-red-500/30 bg-red-500/10 text-red-400",
    };
  };

  const scoreLabel = getScoreLabel(overallScore);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto lg:mt-0 md:mt-10 mt-16 px-4 lg:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-12 border-b border-slate-700/50 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <MdCheckCircle className="text-green-500 text-2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Interview Complete
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 items-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
            <span>{selectedRole}</span>
            <span className="text-slate-700">•</span>
            <span>{selectedType}</span>
            <span className="text-slate-700">•</span>
            <span>{selectedDiff}</span>
            {company && (
              <>
                <span className="text-slate-700">•</span>
                <span className="text-blue-400">{company}</span>
              </>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-4 bg-slate-800/40 border border-slate-700/50 rounded-xl p-10 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden group">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
              Final Score
            </p>
            <div className="relative">
              <span className="text-8xl font-black text-white tracking-tighter">
                {overallScore}
              </span>
              <span className="absolute -right-8 bottom-4 text-sm font-bold text-slate-700 font-mono">
                /10
              </span>
            </div>
            <div
              className={`mt-8 px-6 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${scoreLabel.style}`}
            >
              {scoreLabel.label}
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <GiProgression className="text-blue-400 text-xl" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
                      {metric.label}
                    </span>
                    <span
                      className={`text-xs font-bold font-mono ${getScoreColor(metric.value || 0)}`}
                    >
                      {metric.value || 0}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-700/30 rounded-full overflow-hidden border border-slate-700/50">
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
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 md:p-12 mb-8 backdrop-blur-sm relative">
            <div className="flex items-center gap-3 mb-8">
              <MdOutlineLightbulb className="text-amber-400 text-xl" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Key Insights
              </h2>
            </div>
            <div
              className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-slate-300 
              [&_strong]:text-white [&_strong]:font-bold 
              [&_ul]:list-none [&_ul]:pl-0 [&_li]:relative [&_li]:pl-6 [&_li]:mb-4
              [&_li::before]:content-['→'] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:text-blue-400 [&_li::before]:font-bold
              [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-tight [&_h3]:mb-4 [&_h3]:mt-8"
            >
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => {
              setStage("setup");
              setScore(null);
              setSelectedDiff("junior");
              setSelectedRole("Software Engineer");
              setSelectedType("behavioral");
              setCompany("");
              setInterviewStart(false);
            }}
            className="flex-1 py-4 rounded-lg cursor-pointer bg-linear-to-r from-blue-600 to-blue-500 text-white text-[11px] font-bold uppercase tracking-widest hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            Start New Session
            <FaArrowRight size={14} />
          </button>
          <button
            onClick={() => window.print()}
            className="px-10 py-4 rounded-lg cursor-pointer bg-slate-800/40 border border-slate-700/50 text-slate-300 text-[11px] font-bold uppercase tracking-widest hover:text-white hover:border-slate-600/50 hover:bg-slate-800/60 transition-all"
          >
            Export Result
          </button>
        </div>
      </div>
    </div>
  );
}
