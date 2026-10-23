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
    <div className="h-4 bg-slate-700/30 w-48 mb-8 rounded-lg" />
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="h-12 bg-slate-700/30 rounded-lg" />
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { setShowPayment } = usePayment();
  const { currentUser } = useCurrentUser();

  if (stage === "feedback") return <EndInterview setStage={setStage} />;
  if (stage === "active") return <Questions setStage={setStage} />;

  const noCredits = (currentUser?.credit ?? 0) <= 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen lg:mt-0 mt-16 px-4 md:px-10 py-6 md:py-10 animate-in fade-in duration-500">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12 border-b border-slate-700/50 pb-10">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Configure Session
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl font-medium leading-relaxed">
              Tailor your experience. Our AI will adapt its persona and questions
              based on your selections.
            </p>
          </div>

          <div className="flex items-center gap-8 bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl backdrop-blur-sm">
            <SiBasicattentiontoken className="text-blue-400 text-3xl animate-pulse" />
            <div className="w-px h-12 bg-slate-700/30" />
            <div className="text-center">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                Available Credits
              </p>
              <p className="text-3xl font-bold text-white leading-none">
                {currentUser?.credit ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl backdrop-blur-sm overflow-hidden">
          {!isMounted ? (
            <SkeletonLoader />
          ) : (
            <div className="flex flex-col divide-y divide-slate-700/30">
              <section className="p-8 md:p-12 space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-blue-400 font-mono text-xs font-semibold">01//</span>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Target Role
                  </label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`px-4 py-3 rounded-lg cursor-pointer border text-[10px] font-bold uppercase tracking-widest transition-all duration-200 text-left relative overflow-hidden group ${
                        selectedRole === r
                          ? "border-blue-500/50 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "border-slate-700/50 bg-slate-800/20 text-slate-400 hover:border-slate-600/50 hover:text-white hover:bg-slate-800/40"
                      }`}
                    >
                      <span className="relative z-10">{r}</span>
                      {selectedRole === r && (
                        <div className="absolute top-2 right-2">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 divide-y lg:divide-y-0 lg:divide-x divide-slate-700/30">
                <section className="p-8 md:p-12 space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="text-blue-400 font-mono text-xs font-semibold">02//</span>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
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
                        className={`flex flex-col cursor-pointer items-center justify-center gap-5 py-10 rounded-lg border transition-all duration-300 group ${
                          selectedType === t
                            ? "border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/20"
                            : "border-slate-700/50 bg-slate-800/20 text-slate-500 hover:border-slate-600/50 hover:bg-slate-800/40"
                        }`}
                      >
                        <div
                          className={`p-4 rounded-lg transition-all duration-300 ${
                            selectedType === t
                              ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/30"
                              : "bg-slate-700/30 group-hover:bg-slate-700/50"
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
                        <span className="uppercase text-[10px] font-bold tracking-widest">
                          {t === "case-study" ? "Case Study" : t}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="p-8 md:p-12 space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="text-blue-400 font-mono text-xs font-semibold">03//</span>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
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
                        className={`py-5 cursor-pointer sm:text-[11px] text-[8px] rounded-lg border font-bold uppercase tracking-wider transition-all relative ${
                          selectedDiff === d
                            ? "border-white bg-white text-black shadow-lg shadow-white/20"
                            : "border-slate-700/50 bg-slate-800/20 text-slate-400 hover:text-slate-200 hover:border-slate-600/50 hover:bg-slate-800/40"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <section className="p-8 md:p-12 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-blue-400 font-mono text-xs font-semibold">04//</span>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Dream company
                    </label>
                  </div>
                </div>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  type="text"
                  placeholder="ex. google | meta | nvidia | etc."
                  className="w-full px-6 py-4 bg-slate-800/20 border border-slate-700/50 rounded-lg text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-slate-800/30 transition-all uppercase tracking-wide"
                />
              </section>

              <div className="p-8 md:p-12 bg-slate-800/20">
                {noCredits ? (
                  <div className="p-8 rounded-lg bg-red-500/10 border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                      <p className="text-red-400 text-xs font-bold uppercase tracking-widest">
                        Insufficient Credits
                      </p>
                      <p className="text-red-400/60 text-[10px] uppercase font-semibold tracking-wider">
                        Recharge your account balance to start an interview session
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPayment(true)}
                      className="w-full md:w-auto px-12 py-3 bg-linear-to-r from-red-600 to-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:from-red-500 hover:to-red-400 transition-all cursor-pointer rounded-lg shadow-lg shadow-red-600/20 active:scale-95"
                    >
                      Top Up Credits
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {startError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest text-center rounded-lg animate-shake">
                        Error: {startError}
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
                      className={`w-full py-6 rounded-lg sm:text-sm text-[10px] font-bold uppercase tracking-wider transition-all relative overflow-hidden shadow-xl ${
                        isLoading
                          ? "bg-slate-700 text-slate-600 cursor-wait"
                          : "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 cursor-pointer hover:shadow-2xl hover:shadow-blue-600/30 active:scale-95"
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isLoading
                          ? "Initializing..."
                          : "Start Interview"}
                        {!isLoading && <IoIosArrowForward size={18} />}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}