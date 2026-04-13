import React from "react";
import { useInterview } from "../../context/InterviewContext";
import { GiProgression } from "react-icons/gi";
import { MdOutlineLightbulb } from "react-icons/md";
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
  } = useInterview();

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getBarColor = (score: number) => {
    if (score >= 8) return "bg-green-400";
    if (score >= 6) return "bg-yellow-400";
    return "bg-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8)
      return {
        label: "Strong",
        style: "border-green-500/30 bg-green-500/10 text-green-400",
      };
    if (score >= 6)
      return {
        label: "Average",
        style: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
      };
    return {
      label: "Needs Work",
      style: "border-red-500/30 bg-red-500/10 text-red-400",
    };
  };

  const scoreLabel = getScoreLabel(overallScore);

  return (
    <div className="pt-4 pl-3 mx-auto flex my-auto mt-15 lg:mt-0 flex-col gap-3 pr-1 max-w-5xl  pb-12">
      <div className="px-2">
        <h1 className="text-3xl font-black tracking-tight">
          Interview Complete
        </h1>
        <p className="text-[#8a9ab8] text-sm mt-1 capitalize">
          {selectedRole} · {selectedType} · {selectedDiff}{" "}
          {company && `· ${company}`}
        </p>
      </div>

      <div className="flex sm:flex-row flex-col gap-3 w-full">
        <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-8 flex flex-col items-center gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-blue-300 to-cyan-300">
              {overallScore}
            </span>
            <span className="text-sm text-[#536480] font-mono-custom font-bold">
              / 10
            </span>
          </div>
          <span
            className={`mt-2 px-4 py-1 rounded-full border text-xs font-bold ${scoreLabel.style}`}
          >
            {scoreLabel.label}
          </span>
        </div>

        {averages && (
          <div className="bg-[#141c28] flex-1 border border-[#1f2d42] rounded-md p-6">
            <div className="flex items-center gap-2 mb-5">
              <GiProgression className="text-blue-400" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#8a9ab8]">
                Score Breakdown
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              {[
                { label: "Clarity", value: averages.clarity },
                { label: "Confidence", value: averages.confidence },
                { label: "Relevance", value: averages.relevance },
              ].map((metric) => (
                <div key={metric.label} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8a9ab8] font-medium">
                      {metric.label}
                    </span>
                    <span
                      className={`text-sm font-bold ${getScoreColor(metric.value)}`}
                    >
                      {metric.value}/10
                    </span>
                  </div>
                  <div className="w-full bg-[#0d1219] rounded-full h-2 border border-[#1f2d42]">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${getBarColor(metric.value)}`}
                      style={{ width: `${metric.value * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-6">
          <div className="flex items-center gap-2 mb-5">
            <MdOutlineLightbulb className="text-blue-400 text-lg" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#8a9ab8]">
              AI Feedback
            </h2>
          </div>
          <div className="text-sm text-[#8a9ab8] leading-relaxed [&_strong]:text-white [&_strong]:font-bold [&_ol]:mt-2 [&_ol]:space-y-2 [&_li]:ml-4">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setStage("setup");
          setScore(null);
          setSelectedDiff("junior");
          setSelectedRole("Software Engineer");
          setSelectedType("behavioral");
          setCompany("");
        }}
        className="w-full py-4 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-400 text-white font-bold text-base transition-all shadow-lg shadow-blue-500/20"
      >
        Try again?
      </button>
    </div>
  );
}
