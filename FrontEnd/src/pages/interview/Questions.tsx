import { FaMicrophone } from "react-icons/fa";
import { useInterview } from "../../context/InterviewContext";
import { useState } from "react";

const typeStyle: Record<string, string> = {
  technical: "bg-purple-500/15 text-purple-400 border-purple-500/40",
  behavioral: "bg-blue-500/15 text-blue-400 border-blue-500/40",
  "case-study": "bg-amber-500/15 text-amber-400 border-amber-500/40",
};

function Questions({
  setStage,
}: {
  setStage: (stage: "setup" | "active" | "feedback") => void;
}) {
  const {
    selectedType,
    selectedRole,
    selectedDiff,
    questionNum,
    question,
    answer,
    setSelectedDiff,
    setSelectedRole,
    setSelectedType,
    setAnswer,
    submitAnswer,
    score,
    setScore,
    questionLimit,
    endInterview,
    setCompany,
    currentQuestion,
    isLoading,
  } = useInterview();

  const [isFinished, setIsFinished] = useState(false);
  const [progressNum, setProgressNum] = useState(0);
  const [showComplete] = useState(false);

  if (showComplete) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-[#141c28]/90 border border-blue-500/50 rounded-xl p-8 sm:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-3">
            Interview Complete!
          </h2>
          <p className="text-[#8a9ab8] text-sm mb-8">
            You've completed all {questionLimit} questions. Review your
            performance and detailed feedback.
          </p>
          <div className="space-y-3">
            <button
              onClick={async () => {
                await endInterview();
                setStage("feedback");
              }}
              className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all"
            >
              View Feedback
            </button>
            <button
              onClick={() => {
                setStage("setup");
                setScore(null);
                setSelectedDiff("junior");
                setSelectedRole("Software Engineer");
                setSelectedType("behavioral");
                setCompany("");
              }}
              className="w-full px-6 py-3.5 border border-[#263548] rounded-xl text-sm font-semibold text-[#8a9ab8] hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-8">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          <span
            className={`shrink-0 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border ${typeStyle[selectedType]}`}
          >
            {selectedType}
          </span>
          <span className="shrink-0 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#1a2436] text-[#8a9ab8] border border-[#263548]">
            {selectedRole}
          </span>
          <span className="shrink-0 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#1a2436] text-[#8a9ab8] border border-[#263548]">
            {selectedDiff}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] sm:text-xs text-[#536480] uppercase tracking-wider">
            Progress
          </span>
          <span className="text-lg sm:text-2xl font-black text-blue-400">
            {progressNum}/{questionLimit}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {!score && (
          <div className="flex flex-col gap-4 sm:gap-5 min-w-0">
            <div className="w-full bg-[#141c28]/80 border border-[#1f2d42] rounded-md p-4 sm:p-6 md:p-8">
              <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  AI
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Question {questionNum}
                  </p>
                  <p className="text-xs text-[#536480] mt-0.5">
                    Listen carefully and provide a thoughtful response
                  </p>
                </div>
              </div>
              <div className="relative pl-4 border-l-2 border-blue-500/60">
                <p className="text-sm sm:text-base leading-relaxed text-[#e8edf5] font-light">
                  {question}
                </p>
              </div>
            </div>

            <div className="w-full bg-[#141c28]/80 border border-[#1f2d42] rounded-md p-4 sm:p-6 md:p-8 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-widest uppercase text-white border border-blue-500/30 bg-blue-600/10 px-3 py-1.5 rounded-lg">
                  Your Response
                </span>
                <span className="text-xs text-blue-300 font-bold bg-blue-500/15 border border-blue-500/40 px-3 py-1.5 rounded-lg">
                  {answer.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Think deeply about your answer. Share specific examples, metrics, and insights..."
                className="w-full min-h-40 sm:min-h-50 p-3 sm:p-4 bg-[#080c12]/60 border border-[#263548] rounded-xl text-sm leading-relaxed text-[#e8edf5] placeholder-[#536480]/60 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y transition-all mb-4 font-light"
              />
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#263548] rounded-xl text-sm text-[#8a9ab8] hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all font-semibold">
                  <FaMicrophone size={13} />
                  <span>Record Audio</span>
                </button>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setStage("setup")}
                    className="flex-1 xs:flex-none px-4 sm:px-6 py-2.5 border border-[#263548] rounded-xl text-sm font-semibold text-[#8a9ab8] hover:border-blue-500 hover:bg-blue-500/5 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={async () => {
                      const currentNum = questionNum;
                      await submitAnswer();
                      setProgressNum(currentNum);
                      if (currentNum === questionLimit) setIsFinished(true);
                    }}
                    disabled={answer.trim().length < 10 || isLoading}
                    className={`flex-1 xs:flex-none px-5 sm:px-8 py-2.5 text-white text-sm font-bold rounded-xl transition-all ${
                      isLoading
                        ? "bg-[#536480]/60 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 cursor-pointer"
                    } disabled:opacity-60`}
                  >
                    {isLoading ? "Scoring..." : "Submit →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {score && (
          <ScorePanel
            score={score}
            currentQuestion={currentQuestion}
            questionNum={questionNum}
            isFinished={isFinished}
            isLoading={isLoading}
            onNext={() => setScore(null)}
            onFinish={async () => {
              await endInterview();
              setStage("feedback");
            }}
          />
        )}
      </div>
    </div>
  );
}

function ScorePanel({
  score,
  currentQuestion,
  questionNum,
  isFinished,
  isLoading,
  onNext,
  onFinish,
}: {
  score: { score: number; clarity: number; confidence: number; relevance: number };
  currentQuestion: string;
  questionNum: number;
  isFinished: boolean;
  isLoading: boolean;
  onNext: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 min-w-0">
      <div className="w-full bg-[#141c28]/80 border border-[#1f2d42] rounded-md p-4 sm:p-6">
        <p className="text-sm font-bold text-white mb-4">
          Question {questionNum - 1}
        </p>
        <div className="relative pl-4 border-l-2 border-blue-500/60">
          <p className="text-sm leading-relaxed text-[#e8edf5] font-light">
            {currentQuestion}
          </p>
        </div>
      </div>

      <div className="w-full bg-[#141c28]/90 border border-blue-500/50 rounded-md p-4 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">
          Performance Score
        </p>
        <div className="bg-blue-600/20 border border-blue-500/40 rounded-md p-4 sm:p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[#8a9ab8] font-semibold uppercase tracking-wider mb-1">
                Overall Rating
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl sm:text-6xl font-black text-blue-400">
                  {score.score}
                </span>
                <span className="text-sm text-[#536480] font-bold">/ 10</span>
              </div>
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {[
            { label: "Clarity", value: score.clarity, color: "bg-blue-500" },
            { label: "Confidence", value: score.confidence, color: "bg-purple-500" },
            { label: "Relevance", value: score.relevance, color: "bg-amber-500" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#8a9ab8] uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-xs font-bold text-white bg-blue-600 px-2.5 py-1 rounded-lg">
                  {item.value}/10
                </span>
              </div>
              <div className="h-2 bg-[#0d1219] rounded-full overflow-hidden border border-[#1f2d42]">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-700`}
                  style={{ width: `${item.value * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {isFinished ? (
          <button
            onClick={onFinish}
            disabled={isLoading}
            className={`w-full py-3 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 cursor-pointer"
            }`}
          >
            {isLoading ? "Generating Feedback..." : "Finish Interview →"}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Next Question →
          </button>
        )}

        <p className="text-xs text-[#536480] text-center mt-3">
          Great effort! Keep improving.
        </p>
      </div>
    </div>
  );
}

export default Questions;