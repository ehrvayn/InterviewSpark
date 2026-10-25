"use client";
import {
  FaMicrophone,
  FaRobot,
  FaUserTie,
  FaChartLine,
  FaLightbulb,
  FaArrowRight,
} from "react-icons/fa6";
import { useInterview } from "@/context/InterviewContext";
import { useState, useEffect } from "react";
import AbortSessionModal from "@/components/modal/AbortSessionModal";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Logo from "@/assets/img/InterviewSparkLogo.png";

const typeStyle: Record<string, string> = {
  technical: "bg-neutral-500/20 text-neutral-300 border-neutral-500/40",
  behavioral: "bg-neutral-500/20 text-neutral-300 border-neutral-500/40",
  "case-study": "bg-neutral-500/20 text-neutral-300 border-neutral-500/40",
};

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-neutral-700/30 rounded-lg w-1/4" />
    <div className="space-y-2">
      <div className="h-4 bg-neutral-700/30 rounded-lg w-full" />
      <div className="h-4 bg-neutral-700/30 rounded-lg w-5/6" />
      <div className="h-4 bg-neutral-700/30 rounded-lg w-4/5" />
    </div>
    <div className="h-32 bg-neutral-700/30 rounded-lg w-full" />
    <div className="h-10 bg-neutral-700/30 rounded-lg w-full" />
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
    answerError,
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
  const [progressNum, setProgressNum] = useState(
    questionNum && questionNum - 1,
  );
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (listening) {
      setAnswer(transcript);
    }
  }, [transcript, listening, setAnswer]);

  return (
    <div className="min-h-screen text-neutral-100 pl-80 overflow-hidden">
      <div className="relative z-10 w-full mt-12 lg:mt-0 max-w-5xl mx-auto px-4 md:px-8 pt-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-neutral-700/50 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${typeStyle[selectedType]}`}
              >
                {selectedType}
              </span>
              <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-neutral-800/40 text-neutral-300 border border-neutral-700/50">
                {selectedRole}
              </span>
              <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-neutral-800/40 text-neutral-300 border border-neutral-700/50">
                {selectedDiff}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Active Interview
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                Progress
              </span>
              <span className="text-3xl font-bold text-white">
                {questionNum ? progressNum : "0"}
                <span className="text-neutral-700 mx-2">/</span>
                {questionLimit}
              </span>
            </div>
            <div className="w-56 h-2 bg-neutral-700/30 border border-neutral-700/50 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${(progressNum / questionLimit) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {!score ? (
            <div className="space-y-4">
              {!question ? (
                <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-8 backdrop-blur-sm">
                  <Skeleton />
                </div>
              ) : (
                <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-8 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <FaRobot size={80} />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img
                        src={Logo.src}
                        alt="InterviewSpark"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                      Question {questionNum}
                    </span>
                  </div>
                  <h2 className="text-base text-white font-medium text-justify leading-relaxed">
                    {question}
                  </h2>
                </div>
              )}

              <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-700/30 border border-neutral-700/50 flex items-center justify-center text-neutral-400">
                      <FaUserTie size={14} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                      Your Response
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-tighter">
                      {answer.split(/\s+/).filter(Boolean).length} Words
                    </span>
                  </div>
                </div>

                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Formulate your response here..."
                  className="w-full min-h-64 bg-transparent border-none text-lg leading-relaxed text-neutral-100 placeholder-neutral-600 outline-none resize-none font-light"
                />

                {listening && (
                  <div className="flex items-center gap-1 h-8 mb-6">
                    {[...Array(32)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-neutral-500/40 rounded-full"
                        style={{
                          height: "100%",
                          animation: `waveform 0.${(i % 5) + 3}s ease-in-out infinite alternate`,
                          animationDelay: `${i * 0.02}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {answerError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-semibold uppercase tracking-widest text-center rounded-lg">
                    {answerError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-neutral-700/50 gap-4">
                  <div className="flex flex-col w-full sm:w-auto gap-3">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-500/10 border border-neutral-500/30">
                      <FaLightbulb className="text-neutral-400 text-xs" />
                      <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-tight">
                        You can use your mic to practice your communication
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (listening) {
                          SpeechRecognition.stopListening();
                        } else {
                          resetTranscript();
                          SpeechRecognition.startListening({
                            continuous: true,
                          });
                        }
                      }}
                      className={`flex items-center justify-center gap-3 px-6 cursor-pointer py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all w-full sm:w-auto border ${
                        listening
                          ? "bg-neutral-500/10 border-neutral-500/40 text-neutral-400 animate-pulse"
                          : "bg-neutral-800/40 border-neutral-700/50 text-neutral-300 hover:border-neutral-500/50 hover:text-white hover:bg-neutral-800/60"
                      }`}
                    >
                      <FaMicrophone
                        size={14}
                        className={listening ? "animate-pulse" : ""}
                      />
                      {listening ? "End Recording" : "Voice Input"}
                    </button>
                  </div>

                  <div className="flex gap-4 w-full sm:w-auto self-end">
                    <button
                      onClick={() => {
                        setShowAbortModal(true);
                      }}
                      className="flex-1 sm:flex-none border border-neutral-700/50 px-8 cursor-pointer py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-600/50 transition-all bg-neutral-800/20 hover:bg-neutral-800/40"
                    >
                      Abort
                    </button>
                    <button
                      onClick={async () => {
                        const currentNum = questionNum;
                        const ok = await submitAnswer();
                        if (!ok) return;

                        setProgressNum(currentNum);
                        SpeechRecognition.stopListening();
                        if (currentNum === questionLimit) setIsFinished(true);
                      }}
                      disabled={answer.trim().length < 10 || isLoading}
                      className="flex-1 sm:flex-none bg-white hover:bg-white/80 text-black px-10 py-3 cursor-pointer hover: disabled: disabled: disabled:text-neutral-600 text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-neutral-600/20 disabled:shadow-none active:scale-95"
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
  const getScoreColor = (s: number) => {
    if (s >= 8) return "text-neutral-300";
    if (s >= 6) return "text-neutral-300";
    return "text-neutral-300";
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in- duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-8 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine className="text-neutral-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                Evaluation
              </span>
            </div>
            <p className="text-neutral-400 text-xs font-semibold uppercase mb-3">
              Question {questionNum - 1}
            </p>
            <p className="text-lg text-white font-light leading-relaxed">
              {currentQuestion}
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-700/50 flex flex-wrap gap-8">
            {[
              { label: "Clarity", val: score.clarity },
              { label: "Technical", val: score.technical_depth },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                  {m.label}
                </p>
                <p className={`text-2xl font-bold ${getScoreColor(m.val)}`}>
                  {m.val}
                  <span className="text-neutral-700 text-sm ml-1">/10</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-8 text-black bg-white flex flex-col items-center justify-center text-center shadow-2xl shadow-neutral-600/30">
          <p className="text-[20px] font-bold uppercase tracking-widest mb-4 opacity-80">
            Score
          </p>
          <div className="text-8xl font-black mb-2 tracking-tighter">
            {score.score}
          </div>
          <p className="text-sm font-semibold opacity-70">PERFORMANCE RATING</p>
          <div className="mt-8 w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-1000"
              style={{ width: `${score.score * 10}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-8 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
          {[
            {
              label: "Communication",
              value: score.communication,
              color: "bg-neutral-500",
            },
            {
              label: "Confidence",
              value: score.confidence,
              color: "bg-neutral-500",
            },
            {
              label: "Relevance",
              value: score.relevance,
              color: "bg-neutral-500",
            },
            {
              label: "Conciseness",
              value: score.conciseness,
              color: "bg-neutral-500",
            },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-neutral-400">{item.label}</span>
                <span className="text-white">{item.value}/10</span>
              </div>
              <div className="h-2 bg-neutral-700/30 rounded-full overflow-hidden border border-neutral-700/50">
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
            className="w-full py-4 cursor-pointer text-black bg-white hover:bg-white/80  text-xs font-bold uppercase tracking-widest rounded-lg hover: shadow-xl shadow-neutral-600/20 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            {isLoading ? (
              "Compiling Final Report..."
            ) : (
              <>
                Finish session & View Feedback
                <FaArrowRight size={14} />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full py-4 cursor-pointer text-black bg-white hover:bg-white/80 text-xs font-bold uppercase tracking-widest rounded-lg hover: transition-all shadow-lg shadow-neutral-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            Next Question
            <FaArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Questions;
