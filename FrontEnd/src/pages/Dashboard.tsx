import type { Page } from "../types";
import { useInterview } from "../context/InterviewContext";

// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

export default function History({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const { allInterviews } = useInterview();

  const calculateAverage = (key: string) => {
    if (allInterviews.length === 0) return 0;
    const valid = allInterviews.filter((h: any) => h[key] !== null);
    if (valid.length === 0) return 0;
    const sum = valid.reduce(
      (acc: number, curr: any) => acc + Number(curr[key] || 0),
      0,
    );
    return sum / valid.length;
  };

  const skills = [
    { skill: "Clarity", score: calculateAverage("clarity") },
    { skill: "Confidence", score: calculateAverage("confidence") },
    { skill: "Relevance", score: calculateAverage("relevance") },
    { skill: "Communication", score: calculateAverage("communication") },
    { skill: "Conciseness", score: calculateAverage("conciseness") },
    { skill: "Technical Depth", score: calculateAverage("technical_depth") },
  ];

  const bestScore =
    allInterviews.length > 0
      ? Math.max(...allInterviews.map((h: any) => Number(h.overall_score || 0)))
      : 0;

  const weeklyData = allInterviews
    .slice(0, 7)
    .reverse()
    .map((h: any) => Number(h.overall_score || 0) * 10);
  const maxWeekly = Math.max(...weeklyData, 10);

  const formatProfessionalDate = (isoString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(isoString));
  };

  return (
    <div className="pt-4 space-y-6 py-5 lg:mt-0 mt-15 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:gap-2 sm:items-center items-start flex sm:flex-row flex-col pb-6 sm:pt-2 pt-6 text-center md:text-left px-4">
          <h1 className="text-2xl flex items-center flex-col md:text-3xl font-black tracking-tight text-white">
            Your Progress
          </h1>
          <span className="text-5xl sm:block hidden md:text-6xl font-black tracking-tight text-white">
            |
          </span>
          <p className="text-slate-400 text-sm text-left md:text-base mt-3 max-w-lg">
            Track your improvement across sessions.
          </p>
        </div>

        <button
          onClick={() => onNavigate("interview")}
          className="w-full sm:w-auto px-5 py-2.5 cursor-pointer rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors shadow-lg shadow-blue-500/10"
        >
          + Practice Now
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Sessions", value: allInterviews.length.toString() },
          { label: "Best Score", value: `${bestScore.toFixed(1)}/10` },
          { label: "Current Streak", value: "6 days 🔥" },
          {
            label: "Top Role",
            value:
              allInterviews[0]?.role
                ?.split(" ")
                .map((w: any) => w[0])
                .join("")
                .toUpperCase() || "N/A",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#141c28] border border-[#1f2d42] rounded-md p-4 sm:p-5 flex flex-col gap-1"
          >
            <span className="text-2xl sm:text-3xl font-black text-white">
              {s.value}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#536480]">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-white">Recent Performance</h2>
            <span className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded">
              Last 7 Sessions
            </span>
          </div>
          <div className="flex items-end gap-2 sm:gap-3 h-40 px-1">
            {weeklyData.map((val, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 h-full"
              >
                <span className="font-mono text-[9px] sm:text-[10px] text-[#536480]">
                  {(val / 10).toFixed(1)}
                </span>
                <div className="flex-1 w-full flex items-end">
                  <div
                    className="w-full rounded-t-sm bg-linear-to-t from-blue-600 to-blue-400 min-h-1 transition-all hover:brightness-110"
                    style={{ height: `${(val / maxWeekly) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-[9px] sm:text-[10px] text-[#536480] font-bold">
                  S{allInterviews.length - weeklyData.length + i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-5 sm:p-6">
          <h2 className="font-bold text-white mb-5">Skill Breakdown</h2>
          <div className="space-y-4">
            {skills.map((item) => (
              <div key={item.skill} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                  <span className="text-[#8a9ab8]">{item.skill}</span>
                  <span className="text-white font-mono">
                    {item.score.toFixed(1)}
                  </span>
                </div>
                <div className="h-1.5 bg-[#0d1219] rounded-full overflow-hidden border border-[#1f2d42]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.score >= 8.0 ? "bg-green-500" : item.score >= 6.0 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${item.score * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#141c28] border pb-3 border-[#1f2d42] rounded-md flex flex-col">
        <div className="p-5 sm:p-6 border-b border-[#1f2d42] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-bold text-white">Session History</h2>
        </div>

        <div className="h-90 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-[#1f2d42] scrollbar-track-transparent">
          <table className="w-full text-sm border-collapse min-w-175">
            <thead className="sticky top-0 bg-[#141c28] z-10 shadow-sm">
              <tr>
                {["Date", "Role", "Type", "Company", "Score"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-4 text-[10px] font-black tracking-widest uppercase text-[#536480] border-b border-[#1f2d42]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2d42]">
              {allInterviews.map((h: any, i: number) => (
                <tr
                  key={i}
                  className="hover:bg-[#0d1219]/50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-[#536480]">
                    {formatProfessionalDate(h.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-white group-hover:text-blue-400 transition-colors">
                    {h.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-tighter ${typeStyle[h.interview_type.toLowerCase()] || typeStyle["behavioral"]}`}
                    >
                      {h.interview_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#8a9ab8] font-medium">
                    {h.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-black font-mono inline-block min-w-13.75 text-center ${scoreStyle(Number(h.overall_score))}`}
                    >
                      {Number(h.overall_score).toFixed(1)}/10
                    </span>
                  </td>
                </tr>
              ))}
              {allInterviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">📁</span>
                      <span className="text-[#536480] text-xs font-bold uppercase tracking-[0.2em]">
                        No sessions recorded yet
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
