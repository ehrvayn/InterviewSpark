import type { Page } from "../types";
import { useInterview } from "../context/InterviewContext";
import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa6";

const typeStyle: Record<string, string> = {
  technical: "text-purple-400 before:bg-purple-400",
  behavioral: "text-blue-400 before:bg-blue-400",
  "case-study": "text-amber-400 before:bg-amber-400",
};

const scoreColor = (s: number) =>
  s >= 8.5 ? "text-green-400" : s >= 7.0 ? "text-amber-400" : "text-red-400";

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

  if (isLoading)
    return (
      <div className="p-20 text-white font-mono uppercase tracking-widest animate-pulse">
        Loading Analytics...
      </div>
    );

  return (
    <div className="min-h-screen text-slate-300 w-full overflow-hidden">
      <div className="w-full mx-auto px-4 md:px-8 py-12 lg:py-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-24">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
              Performance<span className="text-blue-600">.</span>
            </h1>
          </div>
          <button
            onClick={() => onNavigate("interview")}
            className="w-full md:w-auto cursor-pointer border border-white/20 px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-transparent hover:text-white transition-all active:scale-95"
          >
            Start Session
          </button>
        </header>

        {allInterviews.length > 0 ? (
          <div className="space-y-32">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-0 lg:divide-x divide-white/10">
              {[
                { label: "Sessions", val: allInterviews.length, sub: "Total" },
                {
                  label: "Peak",
                  val: bestScore.toFixed(1),
                  sub: "Score",
                  color: "text-green-400",
                },
                { label: "Average", val: avgOverallScore, sub: "Overall" },
                {
                  label: "Top Role",
                  val: mostCommonRole,
                  sub: "Primary",
                  small: true,
                },
              ].map((stat, i) => (
                <div key={i} className="lg:px-10 first:pl-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2 overflow-hidden">
                    <span
                      className={`font-black tracking-tighter leading-none ${stat.color || "text-white"} ${stat.small ? "text-2xl md:text-3xl truncate" : "text-5xl"}`}
                    >
                      {stat.val}
                    </span>
                    <span className="text-[9px] font-mono text-slate-600 uppercase shrink-0">
                      {stat.sub}
                    </span>
                  </div>
                </div>
              ))}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              <div className="lg:col-span-7 space-y-12">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">
                    Recent Performance
                  </h2>
                  <span className="text-[10px] font-mono text-slate-500">
                    Last 7 sessions
                  </span>
                </div>
                <div className="flex items-end justify-between gap-2 h-64 px-2">
                  {weeklyData.map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-4 h-full"
                    >
                      <div className="flex-1 w-full bg-white/3 relative group">
                        <div
                          className={`absolute bottom-0 w-full transition-all duration-700 ${getBarColor(val)}`}
                          style={{ height: `${(val / 10) * 100}%` }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white bg-slate-800 px-2 py-1 rounded">
                          {val.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-12">
                <h2 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-4">
                  Skill Matrix
                </h2>
                <div className="space-y-8">
                  {skills.map((s) => (
                    <div key={s.skill} className="group">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-400 transition-colors">
                          {s.skill}
                        </span>
                        <span
                          className={`text-sm font-mono font-bold ${scoreColor(s.score)}`}
                        >
                          {s.score.toFixed(1)}
                        </span>
                      </div>
                      <div className="h-px w-full bg-white/10">
                        <div
                          className="h-full bg-white transition-all duration-1000"
                          style={{ width: `${s.score * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-12 pb-20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                <h2 className="text-sm font-black text-white uppercase tracking-widest">
                  Session Log
                </h2>
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setOpenSort(!openSort)}
                    className="flex items-center gap-3 cursor-pointer text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                  >
                    <FaSort /> {sortBy}
                  </button>
                  {openSort && (
                    <div className="absolute right-0 mt-4 w-48 bg-black border border-white/10 z-50 p-1">
                      {["Newest", "Highest Score", "Lowest Score", "Role"].map(
                        (o) => (
                          <button
                            key={o}
                            onClick={() => {
                              setSortBy(o as any);
                              setOpenSort(false);
                            }}
                            className="w-full cursor-pointer text-left px-4 py-3 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                          >
                            {o}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {sortedInterviews.map((h: any, i) => (
                  <div
                    key={i}
                    className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:px-4 transition-all"
                  >
                    <div className="flex items-center gap-8">
                      <div
                        className={`text-4xl font-black font-mono w-16 ${scoreColor(h.overall_score)}`}
                      >
                        {Number(h.overall_score).toFixed(1)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white uppercase group-hover:text-blue-400 transition-colors">
                          {h.role}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                          {h.company || "General"} •{" "}
                          {new Date(h.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-block self-start md:self-center px-4 py-1 text-[9px] font-black uppercase tracking-widest border border-white/10 ${typeStyle[h.interview_type?.toLowerCase()] || "text-slate-400"}`}
                    >
                      {h.interview_type}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="py-40 border-t border-white/10 text-center">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic">
              No sessions found
            </h3>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-10">
              Waiting for first user input...
            </p>
            <button
              onClick={() => onNavigate("interview")}
              className="border border-white px-12 py-5 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Initialize
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
