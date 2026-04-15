import React from "react";
import { useInterview } from "../../context/InterviewContext";
import { GiProgression } from "react-icons/gi";
import { MdOutlineLightbulb, MdCheckCircle } from "react-icons/md";
import ReactMarkdown from "react-markdown";

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
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-amber-400";
    return "text-rose-400";
  };

  const getBarColor = (score: number) => {
    if (score >= 8) return "bg-emerald-500";
    if (score >= 6) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8)
      return {
        label: "Exceptional",
        style: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      };
    if (score >= 6)
      return {
        label: "Proficient",
        style: "border-amber-500/30 bg-amber-500/10 text-amber-400",
      };
    return {
      label: "Needs Work",
      style: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    };
  };

  const scoreLabel = getScoreLabel(overallScore);

  return (
    <div className="w-full max-w-6xl mx-auto lg:mt-0 md:mt-10 mt-13 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 border-b border-[#1f2d42] pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/20 rounded-sm">
            <MdCheckCircle className="text-emerald-500 text-xl" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Session Conclusion
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 items-center text-[#536480] text-xs font-bold uppercase tracking-widest">
          <span>{selectedRole}</span>
          <span className="text-[#1f2d42]">•</span>
          <span>{selectedType}</span>
          <span className="text-[#1f2d42]">•</span>
          <span>{selectedDiff}</span>
          {company && (
            <>
              <span className="text-[#1f2d42]">•</span>
              <span className="text-blue-400">{company}</span>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-4 bg-[#141c28] border border-[#1f2d42] rounded-sm p-10 flex flex-col items-center justify-center relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#536480] mb-6">
            Final Score
          </p>
          <div className="relative">
            <span className="text-8xl font-black text-white tracking-tighter">
              {overallScore}
            </span>
            <span className="absolute -right-8 bottom-4 text-sm font-bold text-[#1f2d42] font-mono">
              /10
            </span>
          </div>
          <div
            className={`mt-8 px-6 py-2 rounded-sm border text-[10px] font-black uppercase tracking-widest transition-all ${scoreLabel.style}`}
          >
            {scoreLabel.label}
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#141c28] border border-[#1f2d42] rounded-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <GiProgression className="text-blue-500" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8a9ab8]">
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
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#536480] group-hover:text-[#8a9ab8] transition-colors">
                    {metric.label}
                  </span>
                  <span
                    className={`text-xs font-black font-mono ${getScoreColor(metric.value || 0)}`}
                  >
                    {metric.value || 0}
                  </span>
                </div>
                <div className="h-1 w-full bg-[#0d1219] rounded-full overflow-hidden border border-[#1f2d42]">
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
        <div className="bg-[#0d1219] border border-[#1f2d42] rounded-sm p-8 md:p-12 mb-8 relative">
          <div className="flex items-center gap-3 mb-8">
            <MdOutlineLightbulb className="text-amber-400 text-xl" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8a9ab8]">
              Strategic Insights
            </h2>
          </div>
          <div
            className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-[#8a9ab8] 
            [&_strong]:text-white [&_strong]:font-bold 
            [&_ul]:list-none [&_ul]:pl-0 [&_li]:relative [&_li]:pl-6 [&_li]:mb-4
            [&_li::before]:content-['→'] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:text-blue-500 [&_li::before]:font-bold
            [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-black [&_h3]:uppercase [&_h3]:tracking-tight [&_h3]:mb-4 [&_h3]:mt-8"
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
          className="flex-1 py-5 rounded-sm cursor-pointer bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-2xl hover:ring-3 hover:ring-inset hover:ring-blue-800"
        >
          Start New Session
        </button>
        <button
          onClick={() => window.print()}
          className="px-10 py-5 rounded-sm cursor-pointer bg-[#141c28] border border-[#1f2d42] text-[#8a9ab8] text-[11px] font-black uppercase tracking-[0.2em] hover:text-white hover:border-white transition-all"
        >
          Export Result
        </button>
      </div>
    </div>
  );
}
