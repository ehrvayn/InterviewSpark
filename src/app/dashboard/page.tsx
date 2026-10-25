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

const getScoreVariant = (s: number) => ({
  bg: "bg-neutral-500/15",
  text: "text-neutral-300",
  border: "border-neutral-500/30",
});

const getBarColor = (_s: number) => "bg-neutral-500";

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

  const statCards = [
    { label: "Total Sessions", val: allInterviews.length, accent: false },
    { label: "Best Score", val: bestScore.toFixed(1), accent: true },
    { label: "Average Score", val: avgOverallScore, accent: false },
    { label: "Primary Role", val: mostCommonRole, accent: false },
  ];

  return (
    <div className="min-h-dvh w-full text-neutral-100 px-4 pt-20 pb-10 sm:px-6 lg:pl-80 lg:pr-10 lg:pt-12 ">
      <div className="mx-auto w-full max-w-7xl min-w-0">
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between lg:mb-12">
          <h1 className="min-w-0 wrap-break-word font-mono text-4xl font-bold uppercase text-white sm:text-5xl">
            Your Journey
          </h1>
          <button
            onClick={() => router.push("/interview")}
            className="group inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-black transition-all duration-300 hover:bg-white/80 hover:shadow-lg hover:shadow-neutral-500/30 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            <span>New Session</span>
            <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </header>

        {allInterviews.length > 0 ? (
          <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="flex min-w-0 flex-col gap-6 xl:col-span-3">
              <div className="grid grid-cols-2">
                {statCards.map((stat) => (
                  <div
                    key={stat.label}
                    className={`group min-w-0 border p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg sm:p-6 ${
                      stat.accent
                        ? "border-neutral-500/30 bg-neutral-500/10 hover:border-neutral-500/50 hover:shadow-neutral-500/20"
                        : "border-neutral-700/50 bg-neutral-800/40 hover:border-neutral-600/50 hover:shadow-neutral-700/20"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 sm:text-xs">
                      {stat.label}
                    </p>
                    <p
                      className={`mt-2 truncate font-mono text-2xl font-bold sm:mt-3 sm:text-3xl ${
                        stat.accent ? "text-neutral-300" : "text-white"
                      }`}
                    >
                      {stat.val}
                    </p>
                  </div>
                ))}
              </div>

              <div className="min-w-0 rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-4 backdrop-blur-sm sm:p-6">
                <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-white">
                  Core Competencies
                </h2>
                <div className="space-y-5">
                  {skills.map((s) => {
                    const variant = getScoreVariant(s.score);
                    return (
                      <div key={s.skill} className="group min-w-0">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="min-w-0 truncate text-xs font-semibold text-neutral-300 transition-colors group-hover:text-white">
                            {s.skill}
                          </span>
                          <span
                            className={`shrink-0 font-mono text-sm font-bold ${variant.text}`}
                          >
                            {s.score.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
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

            <section className="flex min-w-0 flex-col gap-4 xl:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-white">
                  Session History
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setOpenSort(!openSort)}
                    className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-700/50 bg-neutral-800/20 px-4 py-2 text-sm font-medium text-neutral-300 transition-all hover:border-neutral-600/50 hover:bg-neutral-800/60 hover:text-white sm:w-auto"
                  >
                    <FaFilter className="h-4 w-4" />
                    {sortBy}
                  </button>
                  {openSort && (
                    <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800 shadow-xl">
                      {["Newest", "Highest Score", "Lowest Score", "Role"].map(
                        (o) => (
                          <button
                            key={o}
                            onClick={() => {
                              setSortBy(o as typeof sortBy);
                              setOpenSort(false);
                            }}
                            className="min-h-11 w-full cursor-pointer px-4 py-2.5 text-left text-sm text-neutral-300 transition-all hover:bg-neutral-600 hover:text-white"
                          >
                            {o}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex max-h-[60dvh] min-h-0 flex-col gap-3 overflow-y-auto pr-1 xl:max-h-[calc(100dvh-16rem)]">
                {sortedInterviews.map((h: any, i) => {
                  const scoreVariant = getScoreVariant(h.overall_score);
                  return (
                    <div
                      key={i}
                      className={`group flex min-w-0 flex-col gap-3 rounded-lg border p-4 backdrop-blur-sm transition-all hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-5 ${scoreVariant.border} ${scoreVariant.bg}`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div
                          className={`shrink-0 font-mono text-2xl font-bold ${scoreVariant.text}`}
                        >
                          {Number(h.overall_score).toFixed(1)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-neutral-300">
                            {h.role || "General"}
                          </h3>
                          <p className="mt-1 truncate text-xs text-neutral-400">
                            {h.company || "General"} •{" "}
                            {new Date(h.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-fit shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-semibold ${typeStyle[h.interview_type?.toLowerCase()] || "border-neutral-600/30 bg-neutral-700/30 text-neutral-300"}`}
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
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              Ready to level up?
            </h3>
            <p className="mb-8 max-w-sm text-sm text-neutral-400">
              Start your first interview session and begin tracking your
              performance across technical, behavioral, and case study
              interviews.
            </p>
            <button
              onClick={() => router.push("/interview")}
              className="group inline-flex min-h-11 items-center gap-2 rounded-lg px-8 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-neutral-500/30 active:scale-95"
            >
              <span>Launch First Session</span>
              <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
