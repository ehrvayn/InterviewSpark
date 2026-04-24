import type { Page } from "../types";
import { useInterview } from "../context/InterviewContext";
import { useState, useEffect } from "react";
import { FaArrowRight, FaFilter } from "react-icons/fa6";

const typeStyle: Record<string, string> = {
  technical: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  behavioral: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  "case-study": "bg-amber-500/20 text-amber-300 border-amber-500/40",
};

const getScoreVariant = (s: number) => {
  if (s >= 8.5)
    return {
      bg: "bg-green-500/15",
      text: "text-green-300",
      border: "border-green-500/30",
    };
  if (s >= 7.0)
    return {
      bg: "bg-amber-500/15",
      text: "text-amber-300",
      border: "border-amber-500/30",
    };
  return {
    bg: "bg-red-500/15",
    text: "text-red-300",
    border: "border-red-500/30",
  };
};

const getBarColor = (s: number) => {
  if (s >= 8.5) return "bg-green-500";
  if (s >= 7.0) return "bg-amber-500";
  return "bg-red-500";
};

export default function Dashboard({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const { allInterviews, isLoading } = useInterview();
  const [sortBy, setSortBy] = useState<
    "Newest" | "Highest Score" | "Lowest Score" | "Role"
  >("Newest");
  const [openSort, setOpenSort] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateAverage = (key: string) => {
    if (!allInterviews?.length) return 0;
    const valid = allInterviews.filter((h: any) => h[key] !== null);
    if (!valid.length) return 0;
    return (
      valid.reduce((acc, curr: any) => acc + Number(curr[key] || 0), 0) /
      valid.length
    );
  };

  const skills = [
    { skill: "Clarity", score: calculateAverage("clarity") },
    { skill: "Confidence", score: calculateAverage("confidence") },
    { skill: "Relevance", score: calculateAverage("relevance") },
    { skill: "Communication", score: calculateAverage("communication") },
    { skill: "Conciseness", score: calculateAverage("conciseness") },
    { skill: "Technical Depth", score: calculateAverage("technical_depth") },
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
  const avgOverallScore =
    allInterviews.length > 0
      ? (
          allInterviews.reduce(
            (acc, h: any) => acc + Number(h.overall_score || 0),
            0,
          ) / allInterviews.length
        ).toFixed(1)
      : "0.0";

  const weeklyData = [...allInterviews]
    .slice(0, 7)
    .reverse()
    .map((h: any) => Number(h.overall_score || 0));

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
    return sorted.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  };

  const sortedInterviews = getSortedInterviews();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            Loading your interview insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full mx-auto px-4 md:px-8 py-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-blue-500 to-purple-600">
              Your Journey
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Track your interview mastery
            </p>
          </div>
          <button
            onClick={() => onNavigate("interview")}
            className="group relative px-8 py-3 cursor-pointer bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 active:scale-95"
          >
            <span>New Session</span>
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </header>

        {allInterviews.length > 0 ? (
          <div className="space-y-16">
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
              {[
                {
                  label: "Total Sessions",
                  val: allInterviews.length,
                  icon: "📊",
                },
                {
                  label: "Best Score",
                  val: bestScore.toFixed(1),
                  icon: "🎯",
                  accent: true,
                },
                { label: "Average Score", val: avgOverallScore, icon: "📈" },
                {
                  label: "Primary Role",
                  val: mostCommonRole,
                  icon: "💼",
                  small: true,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`group relative p-6 border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${stat.accent ? "border-green-500/30 bg-green-500/10 hover:border-green-500/50 hover:shadow-green-500/20" : "border-slate-700/50 bg-slate-800/40 hover:border-slate-600/50 hover:shadow-slate-700/20"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        {stat.label}
                      </p>
                      <p
                        className={`text-3xl md:text-4xl font-bold font-mono ${stat.accent ? "text-green-300" : "text-white"}`}
                      >
                        {stat.val}
                      </p>
                    </div>
                    <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                      {stat.icon}
                    </span>
                  </div>
                </div>
              ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                      Recent Performance
                    </h2>
                    <span className="text-xs text-slate-500">
                      Last 7 sessions
                    </span>
                  </div>
                  {weeklyData.length > 0 ? (
                    <div className="flex items-end justify-between gap-2 h-80 px-2">
                      {weeklyData.map((val, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-4 h-full"
                        >
                          <div className="flex-1 w-full bg-white/5 relative group rounded-t">
                            <div
                              className={`absolute bottom-0 w-full transition-all duration-700 ${getBarColor(val)}`}
                              style={{ height: `${(val / 10) * 100}%` }}
                            />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white bg-slate-800 px-2 py-1 rounded group-hover:opacity-100 transition-opacity">
                              {val.toFixed(1)}
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 font-mono">
                            {7 - i}d
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-500">
                      No data yet
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-3 p-6 rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
                <h2 className="text-sm font-bold text-white uppercase tracking-wide mb-6">
                  Core Competencies
                </h2>
                <div className="space-y-5">
                  {skills.map((s) => {
                    const variant = getScoreVariant(s.score);
                    return (
                      <div key={s.skill} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-slate-300 group-hover:text-blue-300 transition-colors">
                            {s.skill}
                          </span>
                          <span
                            className={`text-sm font-bold font-mono ${variant.text}`}
                          >
                            {s.score.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
                          <div
                            className={`h-full transition-all duration-1000 ${getBarColor(s.score)}`}
                            style={{ width: `${s.score * 10}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-bold text-white">
                  Session History
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setOpenSort(!openSort)}
                    className="flex items-center gap-2 cursor-pointer px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-700/50 rounded-lg hover:border-slate-600/50 transition-all bg-slate-800/20 hover:bg-slate-800/60"
                  >
                    <FaFilter className="w-4 h-4" />
                    {sortBy}
                  </button>
                  {openSort && (
                    <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                      {["Newest", "Highest Score", "Lowest Score", "Role"].map(
                        (o) => (
                          <button
                            key={o}
                            onClick={() => {
                              setSortBy(o as any);
                              setOpenSort(false);
                            }}
                            className="w-full text-left cursor-pointer px-4 py-2.5 text-sm text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
                          >
                            {o}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {sortedInterviews.map((h: any, i) => {
                  const scoreVariant = getScoreVariant(h.overall_score);
                  return (
                    <div
                      key={i}
                      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg border backdrop-blur-sm transition-all cursor-pointer hover:shadow-lg ${scoreVariant.border} ${scoreVariant.bg}`}
                    >
                      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                        <div
                          className={`text-2xl font-bold font-mono shrink-0 ${scoreVariant.text}`}
                        >
                          {Number(h.overall_score).toFixed(1)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                            {h.role || "General"}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            {h.company || "General"} •{" "}
                            {new Date(h.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap border ${typeStyle[h.interview_type?.toLowerCase()] || "bg-slate-700/30 text-slate-300 border-slate-600/30"}`}
                      >
                        {h.interview_type}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to level up?
            </h3>
            <p className="text-slate-400 text-sm max-w-sm mb-8">
              Start your first interview session and begin tracking your
              performance across technical, behavioral, and case study
              interviews.
            </p>
            <button
              onClick={() => onNavigate("interview")}
              className="group relative px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 active:scale-95"
            >
              <span>Launch First Session</span>
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
