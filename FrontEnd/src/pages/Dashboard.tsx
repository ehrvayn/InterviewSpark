import type { Page, StatCard, SessionResult } from "../types";

const stats: StatCard[] = [
  {
    label: "Sessions Completed",
    value: "24",
    change: "+4 this week",
    positive: true,
  },
  {
    label: "Avg. Score",
    value: "81%",
    change: "+6% vs last month",
    positive: true,
  },
  {
    label: "Time Practiced",
    value: "14.2h",
    change: "+2.1h this week",
    positive: true,
  },
  {
    label: "Questions Answered",
    value: "187",
    change: "+23 this week",
    positive: true,
  },
];

const recentSessions: SessionResult[] = [
  {
    date: "Apr 3",
    role: "Software Engineer",
    score: 88,
    duration: "42 min",
    type: "technical",
  },
  {
    date: "Apr 2",
    role: "Product Manager",
    score: 74,
    duration: "35 min",
    type: "behavioral",
  },
  {
    date: "Mar 31",
    role: "Software Engineer",
    score: 79,
    duration: "28 min",
    type: "behavioral",
  },
  {
    date: "Mar 29",
    role: "Data Scientist",
    score: 91,
    duration: "50 min",
    type: "case-study",
  },
];

const typeStyle: Record<string, string> = {
  technical: "bg-purple-500/15 text-purple-400",
  behavioral: "bg-blue-500/15 text-blue-400",
  "case-study": "bg-amber-500/15 text-amber-400",
};

const scoreStyle = (s: number) =>
  s >= 85
    ? "bg-green-500/15 text-green-400"
    : s >= 70
      ? "bg-amber-500/15 text-amber-400"
      : "bg-red-500/15 text-red-400";

export default function Dashboard({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  return (
    <div className="pt-4">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-[#8a9ab8] text-sm mt-1">
            Welcome back, Jane. Keep the momentum going.
          </p>
        </div>
        <button
          onClick={() => onNavigate("interview")}
          className="px-5 cursor-pointer py-2.5 rounded-md bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-all"
        >
          + New Session
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-[#141c28] border border-[#1f2d42] rounded-md p-5 flex flex-col"
          >
            <span className="text-xs text-[#536480] mb-1.5">{s.label}</span>
            <span className="text-4xl font-black tracking-tight">
              {s.value}
            </span>
            <span
              className={`text-xs mt-1.5 ${s.positive ? "text-green-400" : "text-red-400"}`}
            >
              {s.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1.2fr_1fr] gap-5">
        <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">Recent Sessions</h2>
            <button
              onClick={() => onNavigate("progress")}
              className="text-sm text-blue-400 cursor-pointer hover:text-white transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {recentSessions.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3.5 py-3 rounded-md bg-[#0d1219] hover:border hover:border-[#1f2d42] transition-all"
              >
                <div>
                  <p className="text-sm font-semibold">{s.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono-custom ${typeStyle[s.type]}`}
                    >
                      {s.type}
                    </span>
                    <span className="text-xs text-[#536480]">
                      {s.date} · {s.duration}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-md text-sm font-bold font-mono-custom ${scoreStyle(s.score)}`}
                >
                  {s.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-6">
          <h2 className="font-bold mb-5">Quick Start</h2>
          <div className="flex flex-col gap-2">
            {[
              {
                label: "Behavioral — Software Engineer",
                type: "behavioral",
                time: "~30 min",
              },
              {
                label: "Technical — Data Structures",
                type: "technical",
                time: "~45 min",
              },
              {
                label: "Case Study — PM Round",
                type: "case-study",
                time: "~40 min",
              },
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => onNavigate("interview")}
                className="flex items-center justify-between px-3.5 py-3 rounded-md bg-[#0d1219] border border-transparent hover:border-blue-500 hover:bg-blue-500/10 text-left transition-all"
              >
                <div>
                  <p className="text-sm font-semibold">{q.label}</p>
                  <p className="text-xs text-[#536480] mt-0.5">{q.time}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono-custom ${typeStyle[q.type]}`}
                >
                  {q.type}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#1f2d42]">
            <button
              onClick={() => onNavigate("questions")}
              className="w-full py-2.5 cursor-pointer rounded-md border border-[#263548] text-sm font-medium hover:border-blue-500 hover:bg-blue-500/10 transition-all"
            >
              Browse All Questions →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
