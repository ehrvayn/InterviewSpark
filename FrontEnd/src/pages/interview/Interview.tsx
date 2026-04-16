import { useState, useEffect } from "react";
import type { Role, InterviewType, DifficultyLevel } from "../../types";
import { FaGear, FaBrain, FaFill } from "react-icons/fa6";
import Questions from "./Questions";
import { useInterview } from "../../context/InterviewContext";
import EndInterview from "./EndInterview";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { usePayment } from "../../context/PaymentContext";
import { IoIosArrowForward } from "react-icons/io";
import { SiBasicattentiontoken } from "react-icons/si";

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

const SkeletonLoader = () => (
  <div className="w-full space-y-12 animate-pulse p-8">
    <div className="h-4 bg-white/5 w-48 mb-8" />
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="h-12 bg-white/5 rounded-sm" />
      ))}
    </div>
  </div>
);

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
    <div className="w-full min-h-screen lg:mt-0 mt-13 px-2 md:px-10 py-6 md:py-10 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12 border-b border-white/20 pb-10">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
            Configure Session
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl font-medium leading-relaxed uppercase tracking-tight">
          Tailor your experience. Our AI will adapt its persona and questions
          based on your selections.
          </p>
        </div>

        <div className="flex items-center gap-8 bg-white/2 border border-white/50 p-6 rounded-sm">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
              Available Credits
            </p>
            <p className="text-3xl font-black text-white leading-none">
              {currentUser?.credit ?? 0}
            </p>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <SiBasicattentiontoken className="text-blue-600 text-3xl animate-pulse" />
        </div>
      </div>

      <div className="bg-[#0a0f18] border border-white/5 rounded-sm">
        {!isMounted ? (
          <SkeletonLoader />
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            <section className="p-6 md:p-10 space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-blue-500 font-mono text-xs">01//</span>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Target Role
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`px-6 py-4 rounded-sm cursor-pointer border text-[11px] font-black uppercase tracking-widest transition-all duration-200 text-left relative overflow-hidden group ${
                      selectedRole === r
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-white/5 bg-white/1 text-slate-500 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">{r}</span>
                    {selectedRole === r && (
                      <div className="absolute top-0 right-0 p-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
              <section className="p-6 md:p-10 space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-blue-500 font-mono text-xs">02//</span>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Target Focus
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(
                    ["behavioral", "technical", "case-study"] as InterviewType[]
                  ).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`flex flex-col cursor-pointer items-center justify-center gap-5 py-10 rounded-sm border transition-all duration-300 group ${
                        selectedType === t
                          ? "border-blue-500 bg-blue-500/5 text-blue-400"
                          : "border-white/5 bg-white/1 text-slate-600 hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`p-4 rounded-sm transition-all duration-300 ${
                          selectedType === t
                            ? "bg-blue-600 text-white scale-110 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                            : "bg-white/5 group-hover:bg-white/10"
                        }`}
                      >
                        {t === "behavioral" ? (
                          <FaBrain size={20} />
                        ) : t === "technical" ? (
                          <FaGear size={20} />
                        ) : (
                          <FaFill size={20} />
                        )}
                      </div>
                      <span className="uppercase text-[10px] font-black tracking-[0.2em]">
                        {t === "case-study" ? "Case Study" : t}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="p-6 md:p-10 space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-blue-500 font-mono text-xs">03//</span>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Difficulty
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                      className={`py-5 cursor-pointer sm:text-[11px] text-[8px] rounded-sm border  font-black uppercase tracking-[0.4em] transition-all relative ${
                        selectedDiff === d
                          ? "border-white bg-white text-black"
                          : "border-white/5 bg-white/1 text-slate-600 hover:text-slate-200 hover:border-white/10"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <section className="p-6 md:p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-blue-500 font-mono text-xs">04//</span>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Dream company
                  </label>
                </div>
              </div>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                type="text"
                placeholder="ex. google | meta | nvidia | etc."
                className="w-full px-8 py-6 bg-white/1 border border-white/5 rounded-sm text-sm font-black text-white placeholder-slate-800 outline-none focus:border-blue-500/50 transition-all uppercase tracking-[0.3em]"
              />
            </section>

            <div className="p-6 md:p-10 bg-white/1">
              {noCredits ? (
                <div className="p-8 rounded-sm bg-rose-500/5 border border-rose-500/10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-2">
                    <p className="text-rose-500 text-xs font-black uppercase tracking-[0.2em]">
                      Deployment Error: Insufficient Assets
                    </p>
                    <p className="text-rose-500/40 text-[10px] uppercase font-bold tracking-widest">
                      Recharge account balance to initialize the interview
                      protocol
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full md:w-auto px-12 py-5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500 transition-all cursor-pointer rounded-sm shadow-xl shadow-rose-600/20"
                  >
                    Acquire Credits
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {startError && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                      Fatal: {startError}
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
                    className={`w-full py-8 rounded-sm sm:text-[13px] text-[10px] font-black uppercase tracking-[0.5em] transition-all relative overflow-hidden shadow-2xl ${
                      isLoading
                        ? "bg-slate-900 text-slate-700 cursor-wait"
                        : "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer hover:ring-4 hover:ring-inset hover:ring-blue-900"
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {isLoading
                        ? "Starting please wait..."
                        : "Start Interview"}
                      {!isLoading && <IoIosArrowForward size={20} />}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
