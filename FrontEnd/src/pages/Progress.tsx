import type { Page } from "../types";
import { history } from "../mockData/mockHistory";

const weeklyData = [42, 58, 71, 65, 80, 78, 88];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
const maxScore = Math.max(...weeklyData);

export default function Progress({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  return (
    <div className="pt-4 overflow-hidden">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Your Progress</h1>
          <p className="text-[#8a9ab8] text-sm mt-1">
            Track your improvement across sessions.
          </p>
        </div>
        <button
          onClick={() => onNavigate("interview")}
          className="px-5 cursor-pointer py-2.5 rounded-md bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-all"
        >
          + Practice Now
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Sessions", value: "24" },
          { label: "Best Score", value: "94%" },
          { label: "Current Streak", value: "6 days 🔥" },
          { label: "Top Role", value: "SWE" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#141c28] border border-[#1f2d42] rounded-md p-5 flex flex-col gap-1"
          >
            <span className="text-3xl font-black">{s.value}</span>
            <span className="text-xs text-[#536480]">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-5 mb-6">
        <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold">This Week — Score Trend</h2>
            <span className="text-xs text-green-400 font-semibold">
              ↑ +12% avg
            </span>
          </div>
          <div className="flex items-end gap-3 h-40 px-1">
            {weeklyData.map((val, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1.5 h-full"
              >
                <span className="font-mono-custom text-[10px] text-[#536480]">
                  {val}
                </span>
                <div className="flex-1 w-full flex items-end">
                  <div
                    className="w-full rounded-t-md bg-linier-to-b from-blue-500 to-blue-500/40 min-h-1 transition-all"
                    style={{ height: `${(val / maxScore) * 100}%` }}
                  />
                </div>
                <span className="font-mono-custom text-[10px] text-[#536480]">
                  {days[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-6">
          <h2 className="font-bold mb-5">Skill Breakdown</h2>
          <div className="flex flex-col gap-3">
            {[
              { skill: "Communication", score: 84 },
              { skill: "Technical Depth", score: 76 },
              { skill: "Problem Solving", score: 88 },
              { skill: "STAR Structure", score: 71 },
              { skill: "Confidence", score: 79 },
              { skill: "Conciseness", score: 65 },
            ].map((item) => (
              <div key={item.skill} className="flex items-center gap-3">
                <span className="text-xs text-[#8a9ab8] w-32">
                  {item.skill}
                </span>
                <div className="flex-1 h-1.5 bg-[#111822] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.score >= 80 ? "bg-green-500" : item.score >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="font-mono-custom text-xs text-[#8a9ab8] w-6 text-right">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold">Session History</h2>
          <div className="flex gap-2">
            {["All Roles", "All Types"].map((label) => (
              <select
                key={label}
                className="px-3 py-1.5 bg-[#0d1219] border border-[#1f2d42] rounded-md text-xs text-[#8a9ab8] outline-none cursor-pointer"
              >
                <option>{label}</option>
              </select>
            ))}
          </div>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {["Date", "Role", "Type", "Questions", "Duration", "Score"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-3.5 py-2.5 text-xs font-bold tracking-widest uppercase text-[#536480] border-b border-[#1f2d42]"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="hover:bg-[#0d1219] transition-colors">
                <td className="px-3.5 py-3 font-mono-custom text-xs text-[#536480] border-b border-[#1f2d42]">
                  {h.date}
                </td>
                <td className="px-3.5 py-3 border-b border-[#1f2d42]">
                  {h.role}
                </td>
                <td className="px-3.5 py-3 border-b border-[#1f2d42]">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono-custom ${typeStyle[h.type]}`}
                  >
                    {h.type}
                  </span>
                </td>
                <td className="px-3.5 py-3 border-b border-[#1f2d42]">
                  {h.questions}
                </td>
                <td className="px-3.5 py-3 border-b border-[#1f2d42]">
                  {h.duration}
                </td>
                <td className="px-3.5 py-3 border-b border-[#1f2d42]">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-bold font-mono-custom ${scoreStyle(h.score)}`}
                  >
                    {h.score}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
