import { useState } from "react";
import type { Role, InterviewType, DifficultyLevel } from "../types";
import { FaGear } from "react-icons/fa6";
import { FaBrain } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";

type Stage = "setup" | "active" | "feedback";

const roles: Role[] = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "Sales",
  "UX Designer",
  "Marketing",
];
const typeStyle: Record<string, string> = {
  technical: "bg-purple-500/15 text-purple-400",
  behavioral: "bg-blue-500/15 text-blue-400",
  "case-study": "bg-amber-500/15 text-amber-400",
};

export default function Interview() {
  const [stage, setStage] = useState<Stage>("setup");
  const [selectedRole, setSelectedRole] = useState<Role>("Software Engineer");
  const [selectedType, setSelectedType] = useState<InterviewType>("behavioral");
  const [selectedDiff, setSelectedDiff] = useState<DifficultyLevel>("mid");
  const [answer, setAnswer] = useState("");

  if (stage === "setup")
    return (
      <div className="pt-4 flex flex-col items-center">
        <div className="mb-8 self-start">
          <h1 className="text-3xl font-black tracking-tight">
            New Interview Session
          </h1>
          <p className="text-[#8a9ab8] text-sm mt-1">
            Configure your mock interview below.
          </p>
        </div>
        <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-10 w-full flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold tracking-widest uppercase text-[#8a9ab8]">
              Target Role
            </label>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-4 cursor-pointer py-2 rounded-md border text-sm font-medium transition-all ${selectedRole === r ? "border-blue-500 bg-blue-500/15 text-blue-400" : "border-[#1f2d42] bg-[#0d1219] text-[#8a9ab8] hover:border-blue-500 hover:text-white"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold tracking-widest uppercase text-[#8a9ab8]">
              Interview Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(
                ["behavioral", "technical", "case-study"] as InterviewType[]
              ).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`flex flex-col cursor-pointer items-center gap-2 py-5 rounded-md border text-sm font-medium transition-all ${selectedType === t ? "border-blue-500 bg-blue-500/15 text-blue-400" : "border-[#1f2d42] bg-[#0d1219] text-[#8a9ab8] hover:border-blue-500 hover:text-white"}`}
                >
                  <span className="text-xl">
                    {t === "behavioral" ? (
                      <FaBrain size={20} />
                    ) : t === "technical" ? (
                      <FaGear size={20} />
                    ) : (
                      <FaFileAlt size={20} />
                    )}
                  </span>
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold tracking-widest uppercase text-[#8a9ab8]">
              Difficulty
            </label>
            <div className="flex gap-2">
              {(
                [
                  "junior",
                  "intermediate",
                  "senior",
                  "staff",
                ] as DifficultyLevel[]
              ).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDiff(d)}
                  className={`px-6 py-2 cursor-pointer rounded-md border text-sm font-medium capitalize transition-all ${selectedDiff === d ? "border-blue-500 bg-blue-500/15 text-blue-400" : "border-[#1f2d42] bg-[#0d1219] text-[#8a9ab8] hover:border-blue-500 hover:text-white"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold tracking-widest uppercase text-[#8a9ab8]">
              Target Company{" "}
              <span className="normal-case font-normal text-[#536480]">
                (optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Google, Meta, Stripe..."
              className="w-full px-4 py-2.5 bg-[#0d1219] border border-[#1f2d42] rounded-md text-sm text-[#e8edf5] placeholder-[#536480] outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setStage("active")}
            className="px-8 py-4 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-400 text-white font-semibold text-base transition-all hover:-translate-y-0.5"
          >
            Begin Interview →
          </button>
        </div>
      </div>
    );

  if (stage === "active")
    return (
      <div className="pt-4">
        <div className="flex items-center justify-between px-4 py-3 bg-[#141c28] border border-[#1f2d42] rounded-md mb-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-red-400 font-mono-custom">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />{" "}
              LIVE SESSION
            </span>
            <div className="flex gap-1.5">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono-custom ${typeStyle[selectedType]}`}
              >
                {selectedType}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1a2436] text-[#8a9ab8] font-mono-custom">
                {selectedRole}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1a2436] text-[#8a9ab8] font-mono-custom">
                {selectedDiff}
              </span>
            </div>
          </div>
          <span className="font-mono-custom text-[#8a9ab8]">04:12</span>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-linier-to-br from-blue-500 to-indigo-400 flex items-center justify-center text-xs font-black">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold">InterviewSpark Interviewer</p>
                <p className="text-xs text-[#536480]">Question 2 of 5</p>
              </div>
            </div>
            <div className="p-5 bg-[#0d1219] border border-[#1f2d42] rounded-md text-sm leading-relaxed mb-4">
              Tell me about a time when you had to make a technical decision
              under significant time pressure. What was the situation, what did
              you decide, and what was the outcome?
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "💡 Use STAR method",
                "⏱ Aim for 2–3 min",
                "🎯 Be specific",
              ].map((h) => (
                <span
                  key={h}
                  className="px-3 py-1 bg-[#111822] border border-[#1f2d42] rounded-full text-xs text-[#8a9ab8]"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-wider uppercase text-[#8a9ab8]">
                Your Answer
              </span>
              <span className="font-mono-custom text-xs text-[#536480]">
                {answer.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here, or use the microphone to speak..."
              className="w-full min-h-50 p-4 bg-[#0d1219] border border-[#1f2d42] rounded-md text-sm leading-relaxed text-[#e8edf5] placeholder-[#536480] outline-none focus:border-blue-500 resize-y transition-colors mb-4"
            />
            <div className="flex items-center justify-between">
              <button className="px-4 py-2 flex items-center gap-1 border cursor-pointer border-[#263548] rounded-md text-sm text-[#8a9ab8] hover:border-blue-500 hover:text-blue-400 transition-all">
                <FaMicrophone /> Record
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setStage("setup")}
                  className="px-4 py-2 border cursor-pointer border-[#263548] rounded-md text-sm font-medium hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStage("feedback")}
                  disabled={answer.trim().length < 10}
                  className="px-5 py-2 bg-blue-500 cursor-pointer hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-md text-sm font-semibold text-white transition-all"
                >
                  Submit →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="pt-4">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Answer Feedback
          </h1>
          <p className="text-[#8a9ab8] text-sm mt-1">
            Here's how your response scored.
          </p>
        </div>
        <button
          onClick={() => {
            setAnswer("");
            setStage("active");
          }}
          className="px-5 py-2.5 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-all"
        >
          Next Question →
        </button>
      </div>
      <div className="grid grid-cols-[340px_1fr] gap-5">
        <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-6 text-center">
          <div className="flex items-baseline justify-center gap-1 mb-1">
            <span className="text-8xl font-black text-blue-400 leading-none">
              78
            </span>
            <span className="text-2xl text-[#536480] font-mono-custom">
              / 100
            </span>
          </div>
          <p className="text-green-400 font-semibold mb-8">Good Answer</p>
          <div className="flex flex-col gap-3 text-left">
            {[
              { label: "Clarity", score: 82 },
              { label: "Structure (STAR)", score: 70 },
              { label: "Relevance", score: 85 },
              { label: "Confidence", score: 75 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-[#8a9ab8] w-28">
                  {item.label}
                </span>
                <div className="flex-1 h-1.5 bg-[#111822] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="font-mono-custom text-xs text-[#8a9ab8] w-7 text-right">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-6 flex flex-col gap-3">
          <h3 className="font-bold mb-2">AI Feedback</h3>
          {[
            {
              type: "positive",
              text: "Strong opening — you immediately set context for the situation.",
            },
            {
              type: "positive",
              text: "Good use of specific metrics to quantify the impact.",
            },
            {
              type: "improve",
              text: 'The "Result" portion was brief. Expand on long-term outcomes or lessons learned.',
            },
            {
              type: "improve",
              text: 'Try to avoid filler phrases like "um" or "basically" for higher confidence scores.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex gap-3 p-3.5 rounded-md text-sm leading-relaxed ${item.type === "positive" ? "bg-green-500/10 text-green-300 border-green-500" : "bg-amber-500/10 text-amber-300 border-amber-500"}`}
            >
              <span className="font-bold shrink-0">
                {item.type === "positive" ? "✓" : "↑"}
              </span>
              <p>{item.text}</p>
            </div>
          ))}
          <div className="mt-2 p-5 bg-[#0d1219] border border-[#1f2d42] rounded-md">
            <h4 className="text-xs font-bold text-blue-400 tracking-wider mb-2">
              SUGGESTED IMPROVEMENT
            </h4>
            <p className="text-sm text-[#8a9ab8] leading-relaxed italic">
              "...The result was that we shipped on time and the system handled
              3x the expected load. Looking back, I would have involved the team
              earlier in the tradeoff discussion to build shared ownership of
              the decision."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
