import { FaUserTie } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { MdFeedback } from "react-icons/md";
import { FaRobot } from "react-icons/fa6";
import LoginContainer from "../components/LoginContainer";
import { useRegister } from "../context/RegisterContext";
import RegisterContainer from "../components/registerContainer";

export default function Landing() {
  const { showRegister } = useRegister();
  return (
    <div className="overflow-x-hidden">
      <section className="relative flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-16 px-5 sm:px-10 lg:px-20 min-h-screen py-16 lg:py-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-size-[48px_48px]" />
        <div className="absolute -top-48 -left-48 w-125 h-125 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_65%)]" />

        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] sm:text-xs font-medium tracking-wider mb-5 sm:mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            AI-Powered Interview Coach
          </div>

          <h1 className="text-[32px] sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-4 sm:mb-5">
            Land Your <span className="text-blue-400">Dream Role</span>
            <br />
            With Confidence
          </h1>

          <p className="text-[#8a9ab8] text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mb-7 sm:mb-10">
            Train smarter, not harder. Our AI coach puts you through real
            interview scenarios, breaks down every answer, and helps you show up
            ready for anything.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8 sm:mb-12">
            <button className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm sm:text-base transition-all hover:-translate-y-0.5">
              Start Free Interview <span>→</span>
            </button>
            <button className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-md border cursor-pointer border-[#263548] text-[#8a9ab8] hover:border-blue-500 hover:text-blue-400 font-medium text-sm sm:text-base transition-all">
              View Dashboard
            </button>
          </div>

          <div className="flex items-center gap-6 sm:gap-10 pt-6 sm:pt-8 border-t border-[#1f2d42]">
            {[
              { val: "50K+", label: "Interviews Practiced" },
              { val: "94%", label: "Confidence Boost" },
              { val: "300+", label: "Companies Covered" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black">{s.val}</span>
                <span className="text-[10px] sm:text-xs text-[#536480] mt-0.5">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full">
          {showRegister ? <RegisterContainer /> : <LoginContainer />}
        </div>
      </section>

      <section className="px-5 sm:px-10 lg:px-20 py-16 sm:py-24 bg-[#0d1219]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3">
              Everything You Need to Ace It
            </h2>
            <p className="text-[#8a9ab8] text-sm sm:text-base max-w-xl mx-auto">
              From preparation to performance — we've got every stage of your
              interview journey covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <FaRobot size={26} />,
                title: "Realistic AI Interviewer",
                desc: "Our AI adapts its tone, difficulty, and follow-ups based on your responses just like a real interviewer.",
              },
              {
                icon: <MdFeedback size={26} />,
                title: "Instant Score & Feedback",
                desc: "Get rated on clarity, structure, relevance, and confidence immediately after each answer.",
              },
              {
                icon: <FaUserTie size={26} />,
                title: "Role-Specific Questions",
                desc: "Curated question banks for Engineers, PMs, Designers, Sales reps, and more filtered by company.",
              },
              {
                icon: <GiProgression size={26} />,
                title: "Progress Tracking",
                desc: "See your improvement over time with detailed charts and session history across all interview types.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-[#141c28] border border-[#1f2d42] rounded-md p-5 sm:p-7 hover:border-blue-500 hover:-translate-y-1 transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/20 transition-all">
                  {f.icon}
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-2">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8a9ab8] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center text-[11px] sm:text-xs text-[#536480] py-6 sm:py-8 border-t border-[#1f2d42]">
        © All rights reserved | InterviewSpark 2026
      </footer>
    </div>
  );
}
