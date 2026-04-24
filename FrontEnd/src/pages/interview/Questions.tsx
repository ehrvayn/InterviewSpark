import {
  FaMicrophone,
  FaRobot,
  FaUserTie,
  FaChartLine,
  FaLightbulb,
  FaArrowRight,
} from "react-icons/fa6";
import { useInterview } from "../../context/InterviewContext";
import { useState, useEffect } from "react";
import AbortSessionModal from "../../components/modal/AbortSessionModal";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Logo from "../../assets/img/InterviewSpark_Logo.png";

const typeStyle: Record<string, string> = {
  technical: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  behavioral: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  "case-study": "bg-amber-500/20 text-amber-300 border-amber-500/40",
};

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-slate-700/30 rounded-lg w-1/4" />
    <div className="space-y-2">
      <div className="h-4 bg-slate-700/30 rounded-lg w-full" />
      <div className="h-4 bg-slate-700/30 rounded-lg w-5/6" />
      <div className="h-4 bg-slate-700/30 rounded-lg w-4/5" />
    </div>
    <div className="h-32 bg-slate-700/30 rounded-lg w-full" />
    <div className="h-10 bg-slate-700/30 rounded-lg w-full" />
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full mt-12 lg:mt-0 max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-700/50 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${typeStyle[selectedType]}`}
              >
                {selectedType}
              </span>
              <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-slate-800/40 text-slate-300 border border-slate-700/50">
                {selectedRole}
              </span>
              <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-slate-800/40 text-slate-300 border border-slate-700/50">
                {selectedDiff}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Active Interview
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                Professional assessment in progress. Maintain clarity and
                structure.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Progress
              </span>
              <span className="text-3xl font-bold text-white">
                {questionNum ? progressNum : "0"}
                <span className="text-slate-700 mx-2">/</span>
                {questionLimit}
              </span>
            </div>
            <div className="w-56 h-2 bg-slate-700/30 border border-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${(progressNum / questionLimit) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {!score ? (
            <div className="space-y-6">
              {!question ? (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm">
                  <Skeleton />
                </div>
              ) : (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <FaRobot size={80} />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img
                        src={Logo}
                        alt="InterviewSpark"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
                      Question {questionNum}
                    </span>
                  </div>
                  <h2 className="text-xl lg:text-2xl text-white font-medium text-justify leading-relaxed">
                    {question}
                  </h2>
                </div>
              )}

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700/30 border border-slate-700/50 flex items-center justify-center text-slate-400">
                      <FaUserTie size={14} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Your Response
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">
                      {answer.split(/\s+/).filter(Boolean).length} Words
                    </span>
                  </div>
                </div>

                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Formulate your response here..."
                  className="w-full min-h-64 bg-transparent border-none text-lg leading-relaxed text-slate-100 placeholder-slate-600 outline-none resize-none font-light"
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

                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-700/50 gap-4">
                  <div className="flex flex-col w-full sm:w-auto gap-3">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <FaLightbulb className="text-blue-400 text-xs" />
                      <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-tight">
                        Use voice input to simulate a real interview
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
                          ? "bg-red-500/10 border-red-500/40 text-red-400 animate-pulse"
                          : "bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-blue-500/50 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <FaMicrophone
                        size={14}
                        className={listening ? "animate-bounce" : ""}
                      />
                      {listening ? "End Recording" : "Voice Input"}
                    </button>
                  </div>

                  <div className="flex gap-4 w-full sm:w-auto self-end">
                    <button
                      onClick={() => {
                        setShowAbortModal(true);
                      }}
                      className="flex-1 sm:flex-none border border-slate-700/50 px-8 cursor-pointer py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-600/50 transition-all bg-slate-800/20 hover:bg-slate-800/40"
                    >
                      Abort
                    </button>
                    <button
                      onClick={async () => {
                        const currentNum = questionNum;
                        await submitAnswer();
                        setProgressNum(currentNum);
                        SpeechRecognition.stopListening();
                        if (currentNum === questionLimit) setIsFinished(true);
                      }}
                      disabled={answer.trim().length < 10 || isLoading}
                      className="flex-1 sm:flex-none px-10 py-3 cursor-pointer bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-600/20 disabled:shadow-none active:scale-95"
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
    if (s >= 8) return "text-green-300";
    if (s >= 6) return "text-amber-300";
    return "text-red-300";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine className="text-blue-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
                Evaluation
              </span>
            </div>
            <p className="text-slate-400 text-xs font-semibold uppercase mb-3">
              Question {questionNum - 1}
            </p>
            <p className="text-lg text-white font-light leading-relaxed">
              {currentQuestion}
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-wrap gap-8">
            {[
              { label: "Clarity", val: score.clarity },
              { label: "Technical", val: score.technical_depth },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {m.label}
                </p>
                <p className={`text-2xl font-bold ${getScoreColor(m.val)}`}>
                  {m.val}
                  <span className="text-slate-700 text-sm ml-1">/10</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white flex flex-col items-center justify-center text-center shadow-2xl shadow-blue-600/30">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-4 opacity-80">
            Score
          </p>
          <div className="text-8xl font-black mb-2 tracking-tighter">
            {score.score}
          </div>
          <p className="text-sm font-semibold opacity-70">PERFORMANCE RATING</p>
          <div className="mt-8 w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-1000"
              style={{ width: `${score.score * 10}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm">
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
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-slate-400">{item.label}</span>
                <span className="text-white">{item.value}/10</span>
              </div>
              <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden border border-slate-700/50">
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
            className="w-full py-4 bg-linear-to-r from-blue-600 to-blue-500 cursor-pointer text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:from-blue-500 hover:to-blue-400 shadow-xl shadow-blue-600/20 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
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
            className="w-full py-4 bg-linear-to-r from-blue-600 to-blue-500 cursor-pointer text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
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
