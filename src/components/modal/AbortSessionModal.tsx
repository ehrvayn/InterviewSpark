"use client";
import { MdWarningAmber } from "react-icons/md";
import { useInterview } from "../../context/InterviewContext";
import SpeechRecognition from "react-speech-recognition";

export default function AbortSessionModal({
  setStage,
}: {
  setStage: (stage: "setup" | "active" | "feedback") => void;
}) {
  const {
    setShowAbortModal,
    setSelectedDiff,
    setSelectedType,
    setSelectedRole,
    setInterviewStart,
    setCompany,
    setQuestion,
  } = useInterview();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/90 backdrop-blur-md transition-all">
      <div className="border border-neutral-700/50 rounded-xl p-8 shadow-2xl w-full max-w-sm mx-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 " />

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-500/20 border border-neutral-500/40 flex items-center justify-center text-neutral-400 mb-6">
            <MdWarningAmber className="animate-pulse" size={32} />
          </div>

          <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">
            Abort Session?
          </h2>

          <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-widest leading-relaxed mb-10">
            This action cannot be undone.
            <br />
            <span className="text-neutral-400 font-bold">
              Credits will not be refunded.
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={async () => {
              localStorage.removeItem("session");
              await setQuestion("");
              setInterviewStart(false);
              setStage("setup");
              setSelectedDiff("junior");
              setSelectedType("behavioral");
              setSelectedRole("Software Engineer");
              setCompany("");
              setShowAbortModal(false);
              SpeechRecognition.stopListening();
            }}
            className="w-full py-3.5 cursor-pointer hover: text-black bg-white hover:bg-white/80 text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-neutral-600/20 active:scale-95 rounded-lg"
          >
            Confirm & Abort
          </button>

          <button
            onClick={() => setShowAbortModal(false)}
            className="w-full py-3.5 cursor-pointer bg-neutral-800/40 border border-neutral-700/50 text-neutral-300 hover:text-white hover:bg-neutral-800/60 hover:border-neutral-600/50 text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}





