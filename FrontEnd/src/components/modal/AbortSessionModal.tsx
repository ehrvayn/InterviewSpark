import { MdWarningAmber } from "react-icons/md";
import { useInterview } from "../../context/InterviewContext";

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
    setCompany,
  } = useInterview();

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#0a0f18]/80 backdrop-blur-md transition-all">
      <div className="bg-[#0d121b] border border-white/5 rounded-sm p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-100 mx-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-rose-500/50 to-transparent" />

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-6 animate-pulse">
            <MdWarningAmber size={30} />
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">
            Terminate Session?
          </h2>

          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-8">
            Warning: Aborting the current session is permanent. <br />
            <span className="text-rose-500/80 underline decoration-rose-500/20 underline-offset-4">
              Allocated credits will not be refunded.
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setStage("setup");
              setSelectedDiff("junior");
              setSelectedType("behavioral");
              setSelectedRole("Software Engineer");
              setCompany("");
              localStorage.removeItem("session");
            }}
            className="w-full py-4 bg-rose-600 cursor-pointer hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 group active:scale-[0.98]"
          >
            Confirm
          </button>

          <button
            onClick={() => setShowAbortModal(false)}
            className="w-full py-4 cursor-pointer bg-transparent border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98]"
          >
            Return to Session
          </button>
        </div>
      </div>
    </div>
  );
}
