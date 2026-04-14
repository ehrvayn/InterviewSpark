import { useState, useEffect } from "react";
import type { Role, InterviewType, DifficultyLevel } from "../../types";
import { FaGear, FaBrain, FaFill } from "react-icons/fa6";
import Questions from "./Questions";
import { useInterview } from "../../context/InterviewContext";
import EndInterview from "./EndInterview";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { usePayment } from "../../context/PaymentContext";
import { IoIosArrowForward } from "react-icons/io";

type Stage = "setup" | "active" | "feedback";

const roles: Role[] = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Mobile Developer",
  "Data Scientist",
  "Data Engineer",
  "DevOps Engineer",
  "Product Manager",
  "Product Designer",
  "UX Designer",
  "QA Engineer",
  "Cybersecurity",
  "Marketing",
  "Sales",
];

export default function Interview() {
  const {
    startInterview,
    selectedDiff,
    setSelectedDiff,
    selectedType,
    setSelectedType,
    selectedRole,
    setSelectedRole,
    company,
    setCompany,
    isLoading,
    startError,
    setStartError,
    setInterviewStart,
    interviewStart,
  } = useInterview();
  
  const [stage, setStage] = useState<Stage>("setup");

  useEffect(() => {
    if (interviewStart) {
      setStage("active");
    }
  }, [interviewStart]);

  const { setShowPayment } = usePayment();
  const { currentUser } = useCurrentUser();

  if (stage === "feedback") return <EndInterview setStage={setStage} />;
  if (stage === "active") return <Questions setStage={setStage} />;

  const noCredits = (currentUser?.credit ?? 0) <= 0;

  return (
    <div className="w-full min-h-screen mt-15 lg:mt-0 flex flex-col items-center justify-start select-none">
      <div className="w-full sm:gap-2 sm:items-center items-start flex sm:flex-row flex-col pb-6 sm:pt-2 pt-6 text-center md:text-left px-4">
        <h1 className="text-2xl flex items-center flex-col md:text-3xl font-black tracking-tight text-white">
          Configure Session
        </h1>
        <span className="text-5xl sm:block hidden md:text-6xl font-black tracking-tight text-white">
          |
        </span>
        <p className="text-slate-400 text-sm text-left md:text-base mt-3 max-w-lg">
          Tailor your experience. Our AI will adapt its persona and questions
          based on your selections.
        </p>
      </div>

      <div className="w-full h-full bg-[#0a0f18] border border-white/5 rounded-0 py-6 md:py-10 px-4 md:px-8 shadow-2xl relative overflow-hidden group">
        <div className="flex flex-col gap-10 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Target Role
              </label>
              <span className="text-[10px] text-blue-500/50 font-medium italic">
                Step 1 of 4
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-4 py-3 rounded-md cursor-pointer border text-xs font-bold transition-all duration-300 text-left sm:text-center ${
                    selectedRole === r
                      ? "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                      : "border-white/5 bg-white/2 text-slate-400 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Interview Focus
              </label>
              <span className="text-[10px] text-blue-500/50 font-medium italic">
                Step 2 of 4
              </span>
            </div>
            <div className="grid sm:grid-cols-3 grid-cols-2 gap-3">
              {(
                ["behavioral", "technical", "case-study"] as InterviewType[]
              ).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`flex flex-col cursor-pointer items-center justify-center gap-3 py-6 rounded-md border transition-all duration-300 ${
                    selectedType === t
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-white/5 bg-white/2 text-slate-500 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  <div
                    className={`p-3 rounded-md ${selectedType === t ? "bg-blue-500/20" : "bg-white/5"}`}
                  >
                    {t === "behavioral" ? (
                      <FaBrain size={20} />
                    ) : t === "technical" ? (
                      <FaGear size={20} />
                    ) : (
                      <FaFill size={20} />
                    )}
                  </div>
                  <span className="capitalize text-[11px] font-bold tracking-wide">
                    {t === "case-study" ? "Case Study" : t}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Seniority Level
              </label>
              <span className="text-[10px] text-blue-500/50 font-medium italic">
                Step 3 of 4
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "junior",
                  "intermediate",
                  "senior",
                  "expert",
                ] as DifficultyLevel[]
              ).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDiff(d)}
                  className={`flex-1 min-w-25 py-2.5 cursor-pointer rounded-md border text-[11px] font-black uppercase tracking-tighter transition-all ${
                    selectedDiff === d
                      ? "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                      : "border-white/5 bg-white/2 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-1 items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Dream Company
                </label>
                <span className="text-[9px] font-medium text-white/40 px-2 py-0.5 rounded-full border border-blue-500/10 bg-blue-500/5">
                  RECOMMENDED
                </span>
              </div>
              <span className="text-[10px] text-blue-500/50 font-medium italic">
                Step 4 of 4
              </span>
            </div>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              type="text"
              placeholder="Ex: OpenAI, Google, NVIDIA"
              className="w-full px-5 py-4 bg-white/2 border border-white/5 rounded-md text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
          </div>

          <div className="pt-4 space-y-4">
            {noCredits ? (
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-red-400 text-xs font-bold uppercase tracking-tight">
                    CREDIT LIMIT REACHED
                  </span>
                  <span className="text-red-400/60 text-[11px]">
                    Insufficient credits to initiate AI session.
                  </span>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="px-4 py-2 flex items-center rounded-md bg-red-500 text-white text-[11px] font-black uppercase tracking-wide hover:bg-red-400 transition-colors active:scale-95"
                >
                  Get More Credits
                  <IoIosArrowForward size={20} />
                </button>
              </div>
            ) : (
              <>
                {startError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold text-center animate-shake">
                    {startError}
                  </div>
                )}
                <button
                  onClick={async () => {
                    setStartError(null);
                    setInterviewStart(true);
                    const success = await startInterview();
                    if (success) setStage("active");
                  }}
                  disabled={isLoading}
                  className={`w-full py-5 rounded-md text-white font-black uppercase tracking-[0.15em] text-sm transition-all relative overflow-hidden group/btn ${
                    isLoading
                      ? "bg-slate-800 text-slate-500 cursor-wait"
                      : "bg-blue-600 hover:bg-blue-500 cursor-pointer hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-[0.98]"
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? "Synchronizing AI..." : "Launch Interview"}
                    {!isLoading && <IoIosArrowForward size={18} />}
                  </span>
                  {!isLoading && (
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
