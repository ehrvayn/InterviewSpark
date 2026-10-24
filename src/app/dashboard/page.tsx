"use client";
import { useRouter } from "next/navigation";
import { useInterview } from "@/context/InterviewContext";
import { useState, useEffect } from "react";
import { FaArrowRight, FaFilter } from "react-icons/fa6";
import Loading from "@/components/Loading";

const typeStyle: Record<string, string> = {
  technical: "bg-neutral-500/20 text-neutral-300 border-neutral-500/40",
  behavioral: "bg-neutral-500/20 text-neutral-300 border-neutral-500/40",
  "case-study": "bg-neutral-500/20 text-neutral-300 border-neutral-500/40",
};

const getScoreVariant = (s: number) => {
  if (s >= 8.5)
    return {
      bg: "bg-neutral-500/15",
      text: "text-neutral-300",
      border: "border-neutral-500/30",
    };
  if (s >= 7.0)
    return {
      bg: "bg-neutral-500/15",
      text: "text-neutral-300",
      border: "border-neutral-500/30",
    };
  return {
    bg: "bg-neutral-500/15",
    text: "text-neutral-300",
    border: "border-neutral-500/30",
  };
};

const getBarColor = (s: number) => {
  if (s >= 8.5) return "bg-neutral-500";
  if (s >= 7.0) return "bg-neutral-500";
  return "bg-neutral-500";
};

export default function Dashboard() {
  const router = useRouter();
  const { allInterviews, isLoading, interviewsLoading } = useInterview();
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

  if (isLoading || interviewsLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen pl-80  text-neutral-100 overflow-hidden">
      <div className="relative z-10 w-full mx-auto px-4 md:px-60 py-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-15">
          <div className="space-y-2">
            <h1 className="text-6xl uppercase  font-mono md:text-5xl font-bold text-white ">
              Your Journey
            </h1>
          </div>
          <button
            onClick={() => router.push("/interview")}
            className="group relative px-8 py-3 cursor-pointer text-black bg-white hover:bg-white/80 font-semibold rounded-lg hover:shadow-lg hover:shadow-neutral-500/30 transition-all duration-300 flex items-center gap-2 active:scale-95"
          >
            <span>New Session</span>
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </header>

        {allInterviews.length > 0 ? (
          <div className="flex gap-6 h-170 ">
            <div className="flex flex-2 flex-col w-full justify-between gap-8">
              <div className="flex gap-2">
                <div className="flex rounded-xl flex-col flex-1 gap-0">
                  {[
                    {
                      label: "Total Sessions",
                      val: allInterviews.length,
                    },
                    {
                      label: "Best Score",
                      val: bestScore.toFixed(1),
                      accent: true,
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`group relative p-6 border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${stat.accent ? "border-neutral-500/30 bg-neutral-500/10 hover:border-neutral-500/50 hover:shadow-neutral-500/20" : "border-neutral-700/50 bg-neutral-800/40 hover:border-neutral-600/50 hover:shadow-neutral-700/20"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                            {stat.label}
                          </p>
                          <p
                            className={`text-3xl md:text-4xl font-bold font-mono ${stat.accent ? "text-neutral-300" : "text-white"}`}
                          >
                            {stat.val}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex rounded-xl flex-col flex-1 gap-0">
                  {[
                    {
                      label: "Average Score",
                      val: avgOverallScore,
                      icon: "📈",
                    },
                    {
                      label: "Primary Role",
                      val: mostCommonRole,
                      small: true,
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`group relative p-6 border backdrop-blur-sm transition-all duration-300 hover:shadow-lg border-neutral-700/50 bg-neutral-800/40 hover:border-neutral-600/50 hover:shadow-neutral-700/20}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                            {stat.label}
                          </p>
                          <p
                            className={`text-3xl md:text-4xl font-bold font-mono text-white`}
                          >
                            {stat.val}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3 flex-1 p-6 rounded-xl border border-neutral-700/50 bg-neutral-800/40 backdrop-blur-sm">
                <h2 className="text-sm font-bold text-white uppercase tracking-wide mb-6">
                  Core Competencies
                </h2>
                <div className="space-y-5">
                  {skills.map((s) => {
                    const variant = getScoreVariant(s.score);
                    return (
                      <div key={s.skill} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-neutral-300 group-hover:text-neutral-300 transition-colors">
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

            <section className="flex-1 h-full flex flex-col gap-6">
              <div className="flex flex-col  sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-bold text-white">
                  Session History
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setOpenSort(!openSort)}
                    className="flex items-center gap-2 cursor-pointer px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white border border-neutral-700/50 rounded-lg hover:border-neutral-600/50 transition-all bg-neutral-800/20 hover:bg-neutral-800/60"
                  >
                    <FaFilter className="w-4 h-4" />
                    {sortBy}
                  </button>
                  {openSort && (
                    <div className="absolute right-0 mt-2 w-40 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50 overflow-hidden">
                      {["Newest", "Highest Score", "Lowest Score", "Role"].map(
                        (o) => (
                          <button
                            key={o}
                            onClick={() => {
                              setSortBy(o as any);
                              setOpenSort(false);
                            }}
                            className="w-full text-left cursor-pointer px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-600 hover:text-white transition-all"
                          >
                            {o}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 min-h-0 overflow-y-auto">
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
                          <h3 className="text-sm font-bold text-white truncate group-hover:text-neutral-300 transition-colors">
                            {h.role || "General"}
                          </h3>
                          <p className="text-xs text-neutral-400 mt-1">
                            {h.company || "General"} •{" "}
                            {new Date(h.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap border ${typeStyle[h.interview_type?.toLowerCase()] || "bg-neutral-700/30 text-neutral-300 border-neutral-600/30"}`}
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
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to level up?
            </h3>
            <p className="text-neutral-400 text-sm max-w-sm mb-8">
              Start your first interview session and begin tracking your
              performance across technical, behavioral, and case study
              interviews.
            </p>
            <button
              onClick={() => router.push("/interview")}
              className="group relative px-8 py-3 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-neutral-500/30 transition-all duration-300 flex items-center gap-2 active:scale-95"
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
