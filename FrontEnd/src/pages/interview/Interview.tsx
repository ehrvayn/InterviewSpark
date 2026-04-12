import { useState } from "react";
import type { Role, InterviewType, DifficultyLevel } from "../../types";
import { FaGear } from "react-icons/fa6";
import { FaBrain } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import Questions from "./Questions";
import { useInterview } from "../../context/InterviewContext";
import EndInterview from "./EndInterview";

type Stage = "setup" | "active" | "feedback";

const roles: Role[] = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "Sales",
  "UX Designer",
  "Marketing",
];

export default function Interview() {
  const [stage, setStage] = useState<Stage>("setup");
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
  } = useInterview();

  if (stage === "feedback") return <EndInterview setStage={setStage} />;
  if (stage === "active") return <Questions setStage={setStage} />;

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 px-0 md:px-4">
      <div className="w-full max-w-2xl px-4 sm:px-6 md:px-8 mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
          New Interview Session
        </h1>
        <p className="text-[#8a9ab8] text-xs sm:text-sm md:text-base mt-2 sm:mt-3">
          Configure your mock interview below.
        </p>
      </div>

      <div className="w-full max-w-2xl px-4 sm:px-6 md:px-8 bg-linear-to-br from-[#141c28]/80 to-[#0d1219]/80 backdrop-blur-xl border border-[#1f2d42] rounded-md p-6 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-7 md:gap-8">
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold tracking-widest uppercase text-[#8a9ab8] shrink-0">
              Target Role
            </label>
            <div className="flex-1 h-px bg-[#1f2d42]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5 md:gap-3">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-md md:rounded-lg border text-xs sm:text-xs md:text-sm font-medium transition-all whitespace-nowrap ${selectedRole === r ? "border-blue-500 bg-blue-500/15 text-blue-400" : "border-[#1f2d42] bg-[#0d1219] text-[#8a9ab8] hover:border-blue-500 hover:text-white"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold tracking-widest uppercase text-[#8a9ab8] shrink-0">
              Interview Type
            </label>
            <div className="flex-1 h-px bg-[#1f2d42]" />
          </div>
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
            {(["behavioral", "technical", "case-study"] as InterviewType[]).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`flex flex-col cursor-pointer items-center gap-1.5 sm:gap-2 md:gap-2 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-md md:rounded-lg border text-xs sm:text-xs md:text-sm font-medium transition-all ${selectedType === t ? "border-blue-500 bg-blue-500/15 text-blue-400" : "border-[#1f2d42] bg-[#0d1219] text-[#8a9ab8] hover:border-blue-500 hover:text-white"}`}
                >
                  <span className="text-base sm:text-lg md:text-xl">
                    {t === "behavioral" ? (
                      <FaBrain
                        size={16}
                        className="sm:w-5 sm:h-5 md:w-5 md:h-5"
                      />
                    ) : t === "technical" ? (
                      <FaGear
                        size={16}
                        className="sm:w-5 sm:h-5 md:w-5 md:h-5"
                      />
                    ) : (
                      <FaFileAlt
                        size={16}
                        className="sm:w-5 sm:h-5 md:w-5 md:h-5"
                      />
                    )}
                  </span>
                  <span className="capitalize text-xs sm:text-xs md:text-xs">
                    {t === "case-study" ? "Case" : t}
                  </span>
                </button>
              ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold tracking-widest uppercase text-[#8a9ab8] shrink-0">
              Difficulty
            </label>
            <div className="flex-1 h-px bg-[#1f2d42]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3">
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
                className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 cursor-pointer rounded-lg sm:rounded-md md:rounded-lg border text-xs sm:text-xs md:text-sm font-medium capitalize transition-all whitespace-nowrap ${selectedDiff === d ? "border-blue-500 bg-blue-500/15 text-blue-400" : "border-[#1f2d42] bg-[#0d1219] text-[#8a9ab8] hover:border-blue-500 hover:text-white"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold tracking-widest uppercase text-[#8a9ab8] shrink-0">
              Target Company
            </label>
            <div className="flex-1 h-px bg-[#1f2d42]" />
          </div>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            type="text"
            placeholder="e.g. Google, Meta, Stripe..."
            className="w-full px-3 sm:px-4 md:px-4 py-2 sm:py-2.5 md:py-3 bg-[#0d1219] border border-[#1f2d42] rounded-lg sm:rounded-md md:rounded-lg text-xs sm:text-xs md:text-sm text-[#e8edf5] placeholder-[#536480] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        {/* Begin Button */}
        <button
          onClick={async () => {
            await startInterview();
            setStage("active");
          }}
          disabled={isLoading}
          className={`w-full px-6 sm:px-8 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-md md:rounded-lg text-white font-semibold text-sm sm:text-base md:text-base transition-all ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 cursor-pointer hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"}`}
        >
          {isLoading ? "Preparing Interview..." : "Begin Interview →"}
        </button>
      </div>
    </div>
  );
}
