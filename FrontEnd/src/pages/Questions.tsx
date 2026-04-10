import { useState } from "react";
import type { Role, InterviewType, DifficultyLevel, Page } from "../types";

const questions = [
  {
    id: "1",
    text: "Tell me about a time you handled a conflict within your team.",
    role: "Software Engineer",
    type: "behavioral",
    difficulty: "mid",
    company: "Google",
  },
  {
    id: "2",
    text: "Design a URL shortener system. Walk me through your architecture.",
    role: "Software Engineer",
    type: "technical",
    difficulty: "senior",
    company: "Meta",
  },
  {
    id: "3",
    text: "How would you prioritize features for a product with limited engineering resources?",
    role: "Product Manager",
    type: "case-study",
    difficulty: "mid",
    company: "Stripe",
  },
  {
    id: "4",
    text: "Describe a situation where you had to make a decision with incomplete data.",
    role: "Data Scientist",
    type: "behavioral",
    difficulty: "mid",
    company: "",
  },
  {
    id: "5",
    text: "What is the difference between L1 and L2 regularization?",
    role: "Data Scientist",
    type: "technical",
    difficulty: "entry",
    company: "Amazon",
  },
  {
    id: "6",
    text: "Walk me through how you'd close a deal with a skeptical enterprise client.",
    role: "Sales",
    type: "case-study",
    difficulty: "senior",
    company: "",
  },
  {
    id: "7",
    text: "Tell me about a product you love and how you would improve it.",
    role: "Product Manager",
    type: "behavioral",
    difficulty: "entry",
    company: "Apple",
  },
  {
    id: "8",
    text: "Implement a function to find the longest common subsequence.",
    role: "Software Engineer",
    type: "technical",
    difficulty: "senior",
    company: "Microsoft",
  },
];

const typeStyle: Record<string, string> = {
  technical: "bg-purple-500/15 text-purple-400",
  behavioral: "bg-blue-500/15 text-blue-400",
  "case-study": "bg-amber-500/15 text-amber-400",
};
const diffStyle: Record<string, string> = {
  entry: "bg-green-500/15 text-green-400",
  mid: "bg-amber-500/15 text-amber-400",
  senior: "bg-red-500/15 text-red-400",
  staff: "bg-purple-500/15 text-purple-400",
};

const roles: (Role | "All")[] = [
  "All",
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "Sales",
  "UX Designer",
  "Marketing",
];
const types: (InterviewType | "All")[] = [
  "All",
  "behavioral",
  "technical",
  "case-study",
];
const difficulties: (DifficultyLevel | "All")[] = [
  "All",
  "entry",
  "mid",
  "senior",
  "staff",
];

export default function Questions({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const [roleFilter, setRoleFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = questions.filter(
    (q) =>
      (roleFilter === "All" || q.role === roleFilter) &&
      (typeFilter === "All" || q.type === typeFilter) &&
      (diffFilter === "All" || q.difficulty === diffFilter) &&
      q.text.toLowerCase().includes(search.toLowerCase()),
  );

  const ChipGroup = ({
    items,
    active,
    setActive,
  }: {
    items: string[];
    active: string;
    setActive: (v: string) => void;
  }) => (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => setActive(item)}
          className={`px-3 cursor-pointer py-1 rounded-full border text-xs font-medium capitalize transition-all ${active === item ? "border-blue-500 bg-blue-500/15 text-blue-400" : "border-[#1f2d42] text-[#8a9ab8] hover:border-blue-500 hover:text-white"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className="pt-4">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Question Bank</h1>
          <p className="text-[#8a9ab8] text-sm mt-1">
            {filtered.length} questions across all roles and types.
          </p>
        </div>
        <button
          onClick={() => onNavigate("interview")}
          className="px-5 cursor-pointer py-2.5 rounded-md bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-all"
        >
          Practice Now →
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#141c28] border border-[#1f2d42] rounded-md text-sm text-[#e8edf5] placeholder-[#536480] outline-none focus:border-blue-500 transition-colors"
        />
        <ChipGroup
          items={roles}
          active={roleFilter}
          setActive={setRoleFilter}
        />
        <ChipGroup
          items={types}
          active={typeFilter}
          setActive={setTypeFilter}
        />
        <ChipGroup
          items={difficulties}
          active={diffFilter}
          setActive={setDiffFilter}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center gap-4 py-16 text-[#536480]">
            <span className="text-4xl">◈</span>
            <p>No questions match your filters.</p>
          </div>
        ) : (
          filtered.map((q) => (
            <div
              key={q.id}
              className="bg-[#141c28] border border-[#1f2d42] rounded-md p-6 flex flex-col gap-3 hover:-translate-y-0.5 hover:border-[#263548] transition-all"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono-custom ${typeStyle[q.type]}`}
                >
                  {q.type}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono-custom ${diffStyle[q.difficulty]}`}
                >
                  {q.difficulty}
                </span>
                {q.company && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1a2436] text-[#8a9ab8] font-mono-custom">
                    @ {q.company}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#e8edf5] leading-relaxed flex-1">
                {q.text}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#536480]">{q.role}</span>
                <button
                  onClick={() => onNavigate("interview")}
                  className="text-sm cursor-pointer text-blue-400 hover:text-white transition-colors"
                >
                  Practice →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
