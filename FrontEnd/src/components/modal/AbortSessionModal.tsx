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
  } = useInterview();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md transition-all">
      <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-8 shadow-2xl w-full max-w-sm mx-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500/50 to-transparent" />

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-6 animate-pulse">
            <MdWarningAmber size={32} />
          </div>

          <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">
            Abort Session?
          </h2>

          <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest leading-relaxed mb-10">
            This action cannot be undone.
            <br />
            <span className="text-red-400 font-bold">
              Credits will not be refunded.
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              localStorage.removeItem("session");
              setInterviewStart(false);
              setStage("setup");
              setSelectedDiff("junior");
              setSelectedType("behavioral");
              setSelectedRole("Software Engineer");
              setCompany("");
              setShowAbortModal(false);
              SpeechRecognition.stopListening();
            }}
            className="w-full py-3.5 bg-linear-to-r from-red-600 to-red-500 cursor-pointer hover:from-red-500 hover:to-red-400 text-white text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 rounded-lg"
          >
            Confirm & Abort
          </button>

          <button
            onClick={() => setShowAbortModal(false)}
            className="w-full py-3.5 cursor-pointer bg-slate-800/40 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/60 hover:border-slate-600/50 text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 rounded-lg"
          >
            Stay in Session
          </button>
        </div>
      </div>
    </div>
  );
}
