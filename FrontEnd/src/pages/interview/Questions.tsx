import { FaMicrophone, FaRobot, FaUserTie, FaChartLine } from "react-icons/fa";
import { useInterview } from "../../context/InterviewContext";
import { useState, useEffect } from "react";
import AbortSessionModal from "../../components/modal/AbortSessionModal";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const typeStyle: Record<string, string> = {
  technical: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  behavioral: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "case-study": "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-[#1f2d42] rounded-sm w-1/4" />
    <div className="h-32 bg-[#1f2d42] rounded-sm w-full" />
    <div className="h-10 bg-[#1f2d42] rounded-sm w-full" />
  </div>
);

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
    setAnswer,
    submitAnswer,
    score,
    setScore,
    questionLimit,
    endInterview,
    currentQuestion,
    isLoading,
    showAbortModal,
    setShowAbortModal,
  } = useInterview();

  const [isFinished, setIsFinished] = useState(false);
  const [progressNum, setProgressNum] = useState(questionNum - 1);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      setAnswer(transcript);
    }
  }, [transcript, listening, setAnswer]);

  return (
    <div className="w-full mt-12 lg:mt-0 max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-12 min-h-screen overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#1f2d42] pb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.15em] border ${typeStyle[selectedType]}`}
            >
              {selectedType}
            </span>
            <span className="px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.15em] bg-[#141c28] text-[#536480] border border-[#1f2d42]">
              {selectedRole}
            </span>
            <span className="px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.15em] bg-[#141c28] text-[#536480] border border-[#1f2d42]">
              {selectedDiff}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Active Interview Session
            </h1>
            <p className="text-[#8a9ab8] text-sm mt-1">
              Professional assessment in progress. Maintain clarity and
              structure.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[10px] font-bold text-[#536480] uppercase tracking-widest">
              Session Progress
            </span>
            <span className="text-2xl font-black text-white">
              {questionNum ? progressNum : "0"}
              <span className="text-[#1f2d42] mx-1">/</span>
              {questionLimit}
            </span>
          </div>
          <div className="w-48 h-1.5 bg-[#141c28] border border-[#1f2d42] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(progressNum / questionLimit) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {!score ? (
          <div className="space-y-6">
            {!question ? (
              <Skeleton />
            ) : (
              <div className="bg-[#141c28] border border-[#1f2d42] rounded-sm p-6 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <FaRobot size={80} />
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-sm bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <FaRobot size={14} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">
                    Question {questionNum}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl text-white font-medium text-justify leading-relaxed max-w-full">
                  {question}
                </h2>
              </div>
            )}

            <div className="bg-[#0d1219] border border-[#1f2d42] rounded-sm p-6 sm:p-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#141c28] border border-[#1f2d42] flex items-center justify-center text-[#8a9ab8]">
                    <FaUserTie size={14} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#8a9ab8]">
                    Your Response
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-[#536480] uppercase tracking-tighter">
                    {answer.split(/\s+/).filter(Boolean).length} Words
                  </span>
                </div>
              </div>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Formulate your response here..."
                className="w-full min-h-62.5 bg-transparent border-none text-lg leading-relaxed text-[#e8edf5] placeholder-[#1f2d42] outline-none resize-none font-light"
              />

              {listening && (
                <div className="flex items-center gap-1 h-8 mb-6">
                  {[...Array(32)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-blue-500/40 rounded-full"
                      style={{
                        height: "100%",
                        animation: `waveform 0.${(i % 5) + 3}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.02}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[#1f2d42] gap-4">
                <button
                  onClick={() => {
                    if (listening) {
                      SpeechRecognition.stopListening();
                    } else {
                      resetTranscript();
                      SpeechRecognition.startListening({ continuous: true });
                    }
                  }}
                  className={`flex items-center gap-3 px-6 cursor-pointer py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-all w-full sm:w-auto border
                    ${
                      listening
                        ? "bg-red-500/10 border-red-500/50 text-red-400 animate-pulse"
                        : "bg-[#141c28] border-[#1f2d42] text-[#8a9ab8] hover:border-blue-500/50 hover:text-white"
                    }`}
                >
                  <FaMicrophone
                    size={14}
                    className={listening ? "animate-bounce" : ""}
                  />
                  {listening ? "End Recording" : "Voice Input"}
                </button>

                <div className="flex gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setShowAbortModal(true)}
                    className="flex-1 sm:flex-none px-8 cursor-pointer py-3 rounded-sm text-xs font-black uppercase tracking-widest text-[#536480] hover:text-white transition-colors"
                  >
                    Abort
                  </button>
                  <button
                    onClick={async () => {
                      const currentNum = questionNum;
                      await submitAnswer();
                      setProgressNum(currentNum);
                      if (currentNum === questionLimit) setIsFinished(true);
                    }}
                    disabled={answer.trim().length < 10 || isLoading}
                    className="flex-1 sm:flex-none px-10 py-3 cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:bg-[#141c28] disabled:text-[#1f2d42] text-white text-xs font-black uppercase tracking-widest rounded-sm transition-all shadow-sm shadow-blue-600/50"
                  >
                    {isLoading ? "Analyzing..." : "Submit Response"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
        {showAbortModal && <AbortSessionModal setStage={setStage} />}
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
}: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#141c28] border border-[#1f2d42] rounded-sm p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine className="text-blue-500" />
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-500">
                Evaluation
              </span>
            </div>
            <p className="text-[#536480] text-xs font-bold uppercase mb-2">
              Reference Question {questionNum - 1}
            </p>
            <p className="text-lg text-white font-light leading-relaxed">
              {currentQuestion}
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-[#1f2d42] flex flex-wrap gap-8">
            {[
              { label: "Clarity", val: score.clarity },
              { label: "Technical", val: score.technical_depth },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-[10px] font-black text-[#536480] uppercase tracking-widest mb-1">
                  {m.label}
                </p>
                <p className="text-xl font-black text-white">
                  {m.val}
                  <span className="text-[#1f2d42] text-sm ml-1">/10</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-600 rounded-sm p-8 text-white flex flex-col items-center justify-center text-center shadow-2xl shadow-blue-600/20">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 opacity-80">
            Score
          </p>
          <div className="text-8xl font-black mb-2 tracking-tighter">
            {score.score}
          </div>
          <p className="text-sm font-bold opacity-70">PERFORMANCE RATING</p>
          <div className="mt-8 w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-1000"
              style={{ width: `${score.score * 10}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0d1219] border border-[#1f2d42] rounded-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
          {[
            {
              label: "Communication",
              value: score.communication,
              color: "bg-blue-500",
            },
            {
              label: "Confidence",
              value: score.confidence,
              color: "bg-purple-500",
            },
            {
              label: "Relevance",
              value: score.relevance,
              color: "bg-amber-500",
            },
            {
              label: "Conciseness",
              value: score.conciseness,
              color: "bg-emerald-500",
            },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-[#8a9ab8]">{item.label}</span>
                <span className="text-white">{item.value}/10</span>
              </div>
              <div className="h-1 bg-[#141c28] rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-1000`}
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
            className="w-full py-4 bg-white cursor-pointer text-black text-xs font-black uppercase tracking-widest rounded-sm hover:bg-blue-50 shadow-xl transition-all duration-200 hover:ring-3 hover:ring-inset hover:ring-blue-800"
          >
            {isLoading
              ? "Compiling Final Report..."
              : "Finish session & View Feedback"}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full py-4 bg-blue-600 cursor-pointer text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-blue-500 transition-all"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}

export default Questions;
