"use client";
import { useState } from "react";
import type { Role, InterviewType, DifficultyLevel } from "@/types";
import { FaGear, FaBrain, FaFill } from "react-icons/fa6";
import Questions from "./Questions";
import { useInterview } from "@/context/InterviewContext";
import EndInterview from "./EndInterview";
import { useCurrentUser } from "@/context/CurrentUserContext";
import { usePayment } from "@/context/PaymentContext";
import { IoIosArrowForward } from "react-icons/io";
import Loading from "@/components/Loading";

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

const interviewTypes: { value: InterviewType; label: string; icon: React.ReactNode }[] = [
  { value: "behavioral", label: "Behavioral", icon: <FaBrain size={16} /> },
  { value: "technical", label: "Technical", icon: <FaGear size={16} /> },
  { value: "case-study", label: "Case Study", icon: <FaFill size={16} /> },
];

const difficulties: DifficultyLevel[] = ["junior", "intermediate", "senior", "expert"];

const Step = ({
  index,
  label,
  optional,
  children,
}: {
  index: string;
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) => (
  <section className="p-4 md:p-6 space-y-4">
    <div className="flex items-center gap-3">
      <span className="text-neutral-500 font-mono text-xs font-semibold">
        {index}
      </span>
      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
        {label}
        {optional && (
          <span className="ml-2 text-neutral-500">(Optional)</span>
        )}
      </label>
    </div>
    {children}
  </section>
);

const selectableBase =
  "border transition-all duration-200 cursor-pointer rounded-lg font-bold uppercase tracking-widest";
const selectedClass = "bg-white text-black border-white shadow-lg shadow-white/10";
const unselectedClass =
  "bg-neutral-800/40 border-neutral-700/60 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800/70 hover:text-white";

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
  } = useInterview();

  const [stage, setStage] = useState<Stage>("setup");
  const { currentUser } = useCurrentUser();
  const { setShowPayment } = usePayment();

  if (stage === "feedback") return <EndInterview setStage={setStage} />;
  if (stage === "active") return <Questions setStage={setStage} />;
  if (!currentUser) return <Loading />;

  const noCredits = (currentUser.credit ?? 0) <= 0;

  const handleStart = async () => {
    setStartError(null);
    setInterviewStart(true);
    const success = await startInterview();
    if (success) setStage("active");
  };

  return (
    <div className="h-screen lg:pl-75 text-neutral-100">
      <div className="h-full pt-20 lg:pt-4 pb-4 px-4 md:px-6 animate-in fade-in duration-500">
        <div className="h-full bg-neutral-900/60 border border-neutral-700/50 rounded-4xl backdrop-blur-sm overflow-hidden flex flex-col">
          <h1 className="shrink-0 p-4 md:p-6 text-2xl md:text-3xl font-mono font-bold uppercase tracking-tight text-white border-b border-neutral-700/30">
            Session Configuration
          </h1>

          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-neutral-700/30">
            <Step index="01//" label="Target Role">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {roles.map((r) => {
                  const active = selectedRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`relative px-4 py-3 text-left text-[10px] ${selectableBase} ${
                        active ? selectedClass : unselectedClass
                      }`}
                    >
                      {r}
                      {active && (
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step index="02//" label="Target Focus">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {interviewTypes.map((t) => {
                  const active = selectedType === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setSelectedType(t.value)}
                      className={`flex flex-col items-center justify-center gap-3 py-5 text-[11px] ${selectableBase} ${
                        active ? selectedClass : unselectedClass
                      }`}
                    >
                      <span
                        className={`p-3 rounded-lg ${
                          active ? "bg-black text-white" : "bg-neutral-700/40"
                        }`}
                      >
                        {t.icon}
                      </span>
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step index="03//" label="Difficulty">
              <div className="grid grid-cols-2 gap-4">
                {difficulties.map((d) => {
                  const active = selectedDiff === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDiff(d)}
                      className={`py-3 text-[11px] ${selectableBase} ${
                        active ? selectedClass : unselectedClass
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step index="04//" label="Dream Company" optional>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                type="text"
                placeholder="ex. google | meta | nvidia | etc."
                className="w-full px-5 py-3 bg-neutral-800/40 border border-neutral-700/60 rounded-lg text-sm font-semibold text-white placeholder-neutral-500 outline-none focus:border-neutral-400 focus:bg-neutral-800/70 transition-all uppercase tracking-wide"
              />
            </Step>
          </div>

          <div className="shrink-0 p-4 md:p-6 bg-neutral-800/20 border-t border-neutral-700/30">
            {noCredits ? (
              <div className="p-6 md:p-8 rounded-lg bg-neutral-800/40 border border-neutral-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <p className="text-white text-xs font-bold uppercase tracking-widest">
                    Insufficient Credits
                  </p>
                  <p className="text-neutral-400 text-[10px] uppercase font-semibold tracking-wider">
                    Recharge your account balance to start an interview session
                  </p>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full md:w-auto px-10 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer hover:bg-white/90 transition-all active:scale-95"
                >
                  Top Up Credits
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {startError && (
                  <div className="p-4 bg-neutral-800/60 border border-neutral-600 text-neutral-200 text-[10px] font-bold uppercase tracking-widest text-center rounded-lg animate-shake">
                    Error: {startError}
                  </div>
                )}
                <button
                  onClick={handleStart}
                  disabled={isLoading}
                  className={`w-full py-4 rounded-lg flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-wider transition-all shadow-xl ${
                    isLoading
                      ? "bg-neutral-700 text-neutral-400 cursor-wait"
                      : "bg-white text-black hover:bg-white/90 cursor-pointer hover:shadow-2xl hover:shadow-white/10 active:scale-95"
                  }`}
                >
                  {isLoading ? "Initializing..." : "Start Interview"}
                  {!isLoading && <IoIosArrowForward size={18} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}