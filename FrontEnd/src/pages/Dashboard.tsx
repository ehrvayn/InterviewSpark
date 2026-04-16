import type { Page } from "../types";
import { useInterview } from "../context/InterviewContext";
import { IoArrowUp } from "react-icons/io5";
import { MdShowChart } from "react-icons/md";
import { useState } from "react";
import { FaSort } from "react-icons/fa6";

const typeStyle: Record<string, string> = {
  technical: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  behavioral: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  "case-study": "bg-amber-500/15 text-amber-400 border border-amber-500/20",
};

const scoreStyle = (s: number) =>
  s >= 8.5
    ? "bg-green-500/15 text-green-400 border border-green-500/20"
    : s >= 7.0
      ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
      : "bg-red-500/15 text-red-400 border border-red-500/20";

const getScoreColor = (s: number) => {
  if (s >= 8.5) return "text-green-400";
  if (s >= 7.0) return "text-amber-400";
  return "text-red-400";
};

const getBarColor = (s: number) => {
  if (s >= 8.5) return "bg-green-500";
  if (s >= 7.0) return "bg-amber-500";
  return "bg-red-500";
};

const Skeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-32 bg-white/5 border border-white/10 rounded-sm"
        ></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-80 bg-white/5 border border-white/10 rounded-sm"></div>
      <div className="h-80 bg-white/5 border border-white/10 rounded-sm"></div>
    </div>
  </div>
);

export default function Dashboard({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const { allInterviews, isLoading } = useInterview();
  const [sortBy] = useState<
    "Newest" | "Highest Score" | "Lowest Score" | "Role"
  >("Newest");
  const [openSort, setOpenSort] = useState(false);

  const calculateAverage = (key: string) => {
    if (!allInterviews || allInterviews.length === 0) return 0;
    const valid = allInterviews.filter((h: any) => h[key] !== null);
    if (valid.length === 0) return 0;
    const sum = valid.reduce(
      (acc: number, curr: any) => acc + Number(curr[key] || 0),
      0,
    );
    return sum / valid.length;
  };

  const skills = [
    { skill: "Clarity", score: calculateAverage("clarity"), icon: "C" },
    { skill: "Confidence", score: calculateAverage("confidence"), icon: "F" },
    { skill: "Relevance", score: calculateAverage("relevance"), icon: "R" },
    {
      skill: "Communication",
      score: calculateAverage("communication"),
      icon: "M",
    },
    { skill: "Conciseness", score: calculateAverage("conciseness"), icon: "S" },
    {
      skill: "Technical Depth",
      score: calculateAverage("technical_depth"),
      icon: "T",
    },
  ];

  const topRole = (allInterviews || []).reduce(
    (acc, { role }) => {
      if (role) acc[role] = (acc[role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const roleEntries = Object.entries(topRole).sort((a, b) => b[1] - a[1]);
  const mostCommonRole = roleEntries.length > 0 ? roleEntries[0][0] : "None";

  const bestScore =
    allInterviews.length > 0
      ? Math.max(...allInterviews.map((h: any) => Number(h.overall_score || 0)))
      : 0;

  const weeklyData = allInterviews
    .slice(0, 7)
    .reverse()
    .map((h: any) => Number(h.overall_score || 0));
  const maxWeekly = Math.max(...weeklyData, 1);

  const formatProfessionalDate = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(isoString));
    } catch {
      return "Invalid Date";
    }
  };

  const avgOverallScore =
    allInterviews.length > 0
      ? (
          allInterviews.reduce(
            (acc: number, h: any) => acc + Number(h.overall_score || 0),
            0,
          ) / allInterviews.length
        ).toFixed(1)
      : "0.0";

  const getSortedInterviews = () => {
    const sorted = [...allInterviews];
    if (sortBy === "Highest Score")
      return sorted.sort(
        (a, b) => Number(b.overall_score) - Number(a.overall_score),
      );
    if (sortBy === "Lowest Score")
      return sorted.sort(
        (a, b) => Number(a.overall_score) - Number(b.overall_score),
      );
    if (sortBy === "Role")
      return sorted.sort((a, b) => (a.role || "").localeCompare(b.role || ""));
    return sorted;
  };

  const sortedInterviews = getSortedInterviews();

  return (
    <div className="pt-4 lg:mt-0 mt-15 max-w-full overflow-x-hidden">
      <div className="px-2 md:px-6 lg:px-8 sm:space-y-6 space-y-4 pb-12">
        <div className="flex flex-col md:flex-row xl:items-end justify-between gap-8 mb-12 border-b border-white/20 pb-10">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
              Your Progress
            </h1>
            <p className="text-slate-500 text-sm max-w-2xl font-medium leading-relaxed uppercase tracking-tight">
              Track your interview performance and skill development over time.
            </p>
          </div>
          <button
            onClick={() => onNavigate("interview")}
            className="flex items-center justify-center cursor-pointer gap-8 bg-white/5 border border-white/20 hover:border-blue-500/50 hover:bg-blue-500/10 p-6 rounded-sm active:scale-[0.98] transition-all duration-300 group"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white group-hover:text-blue-400">
              Practice Now
            </span>
          </button>
        </div>

        {isLoading ? (
          <Skeleton />
        ) : allInterviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-linear-to-br from-[#0f1419] to-[#141c28] border border-blue-500/20 rounded-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total Sessions
                  </span>
                  <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center">
                    <MdShowChart className="text-blue-400 text-lg" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white">
                  {allInterviews.length}
                </div>
              </div>

              <div className="bg-linear-to-br from-[#0f1419] to-[#141c28] border border-emerald-500/20 rounded-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Best Score
                  </span>
                  <div className="w-8 h-8 rounded-md bg-emerald-500/20 flex items-center justify-center">
                    <IoArrowUp className="text-emerald-400 text-lg" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-emerald-400">
                  {bestScore.toFixed(1)}
                </div>
              </div>

              <div className="bg-linear-to-br from-[#0f1419] to-[#141c28] border border-amber-500/20 rounded-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Average Score
                  </span>
                  <div className="w-8 h-8 rounded-md bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-400 text-lg font-bold">⌀</span>
                  </div>
                </div>
                <div className="text-4xl font-bold text-amber-400">
                  {avgOverallScore}
                </div>
              </div>

              <div className="bg-linear-to-br from-[#0f1419] to-[#141c28] border border-purple-500/20 rounded-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Top Role
                  </span>
                  <div className="w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400 text-lg font-bold">◆</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-400 line-clamp-2">
                  {mostCommonRole}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 items-center lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 flex flex-col lg:h-full sm:h-70 h-60 bg-[#0a0f18] border border-slate-700/50 rounded-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">
                    Recent Performance
                  </h2>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    Last 7 sessions
                  </span>
                </div>
                <div className="flex items-end justify-between gap-3 h-88 px-2">
                  {weeklyData.map((val, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center flex-1 h-full justify-between"
                    >
                      <span className="text-xs font-mono text-slate-500">
                        {val.toFixed(1)}
                      </span>
                      <div className="w-full h-full flex items-end justify-center">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 ${getBarColor((val / 10) * 100)}`}
                          style={{
                            height: `${(val / maxWeekly) * 100}%`,
                            minHeight: "4px",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0a0f18] border border-slate-700/50 rounded-sm p-6">
                <h2 className="text-lg font-semibold text-white mb-6">
                  Skill Breakdown
                </h2>
                <div className="space-y-5">
                  {skills.map((item) => (
                    <div key={item.skill} className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                            {item.icon}
                          </div>
                          <span className="text-xs font-semibold text-slate-300 uppercase">
                            {item.skill}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-bold font-mono ${getScoreColor(item.score)}`}
                        >
                          {(item.score || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
                        <div
                          className={`h-full transition-all duration-500 ${getBarColor(item.score)}`}
                          style={{
                            width: `${Math.min(item.score * 10, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#0a0f18] border border-slate-700/50 rounded-sm overflow-hidden flex flex-col h-130">
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/30">
                <h2 className="text-lg font-semibold text-white">
                  Session History
                </h2>
                <button
                  onClick={() => setOpenSort(!openSort)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700/50"
                >
                  <FaSort size={12} /> {sortBy}
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="sticky top-0 bg-[#0a0f18] z-10 border-b border-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-xs uppercase text-slate-400">
                        Date
                      </th>
                      <th className="px-6 py-3 text-xs uppercase text-slate-400">
                        Role
                      </th>
                      <th className="px-6 py-3 text-xs uppercase text-slate-400">
                        Type
                      </th>
                      <th className="px-6 py-3 text-xs uppercase text-slate-400 text-right">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {sortedInterviews.map((h: any, i: number) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-900/40 transition-colors group"
                      >
                        <td className="px-6 py-4 text-xs font-mono text-slate-400">
                          {formatProfessionalDate(h.created_at)}
                        </td>
                        <td className="px-6 py-4 font-medium text-white group-hover:text-blue-400">
                          {h.role}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase ${typeStyle[h.interview_type?.toLowerCase()] || typeStyle["behavioral"]}`}
                          >
                            {h.interview_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`px-3 py-1.5 rounded-md text-sm font-bold font-mono ${scoreStyle(Number(h.overall_score))}`}
                          >
                            {Number(h.overall_score).toFixed(1)}/10
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Sessions Yet
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Start your first interview to see your progress and analytics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
