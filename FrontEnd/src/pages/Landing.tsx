import { FaUserTie } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { MdFeedback, MdSecurity } from "react-icons/md";
import { FaRobot, FaMicrochip } from "react-icons/fa6";
import LoginContainer from "../components/LoginContainer";
import { useRegister } from "../context/RegisterContext";
import RegisterContainer from "../components/registerContainer";
import Logo from "../assets/img/InterviewSpark_Logo.png";

export default function Landing() {
  const { showRegister } = useRegister();

  return (
    <div className="overflow-x-hidden bg-[#0a0f18] text-white font-sans selection:bg-blue-500/30">
      <section className="relative flex flex-col lg:grid lg:grid-cols-12 items-center min-h-screen px-4 md:px-10 xl:px-20 py-12 lg:py-0 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 w-full lg:col-span-7 xl:col-span-8 pr-0 lg:pr-12 py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8">
            <img
              src={Logo}
              alt="InterviewSpark"
              className="lg:w-30 md:w-25 sm:w-20 w-15  object-cover rounded-lg"
            />
            <p className="text-blue-400 text-[15px] sm:text-xl font-black tracking-[0.2em]">InterviewSpark</p>
          </div>

          <h1 className="text-3xl sm:text-5xl xl:text-8xl font-black leading-[0.85] tracking-tighter mb-8 uppercase">
            Master the <span className="text-blue-500">Technical</span>
            <br />
            Interview <span className="outline-text">Stack.</span>
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-500">
                <FaMicrochip size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Logic Synthesis
                </span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase leading-relaxed">
                Fine-tuned models trained on real-world hiring data to simulate
                actual engineering and systems roles.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-500">
                <MdSecurity size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Feedback Loop
                </span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase leading-relaxed">
                Objective assessment of your technical accuracy, behavioral
                alignment, and communication clarity.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
          <div className="w-full">
            {showRegister ? <RegisterContainer /> : <LoginContainer />}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 xl:px-20 py-20 lg:py-32 bg-[#0a0f18]">
        <div className="w-full">
          <div className="mb-16 lg:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-0.5 w-8 bg-blue-500" />
                <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
                  Engine Architecture
                </span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-none">
                Predictive <br /> Assessment
              </h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xs font-black uppercase tracking-tight leading-relaxed border-l-2 border-white/5 pl-6">
              Skip the generic practice. Our platform benchmarks your responses
              against industry-standard requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {[
              {
                icon: <FaRobot size={20} />,
                title: "Adaptive Logic",
                desc: "AI that adjusts its follow-up questions based on the technical depth of your previous answer.",
              },
              {
                icon: <MdFeedback size={20} />,
                title: "Semantic Analysis",
                desc: "Direct evaluation of your reasoning structure and how effectively you solve complex problems.",
              },
              {
                icon: <FaUserTie size={20} />,
                title: "Industry Alignment",
                desc: "Scenario-based modules built for Developers, IT Auditors, and Systems Architects.",
              },
              {
                icon: <GiProgression size={20} />,
                title: "Delta Reporting",
                desc: "Automated tracking of your response quality improvement over multiple mock sessions.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-[#0a0f18] p-10 hover:bg-blue-600/3 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-4xl font-black italic">
                    0
                    {[
                      "Adaptive Logic",
                      "Semantic Analysis",
                      "Industry Alignment",
                      "Delta Reporting",
                    ].indexOf(f.title) + 1}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-8 group-hover:border-blue-500/50 group-hover:text-blue-500 transition-all">
                  {f.icon}
                </div>
                <h3 className="font-black text-[11px] uppercase tracking-[0.2em] mb-4 text-white">
                  {f.title}
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-wide">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 md:px-10 xl:px-20 py-12 border-t border-white/5 bg-[#080c14]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex md:items-start items-center flex-col gap-2">
            <div className="text-[11px] font-black text-white uppercase tracking-[0.5em]">
              InterviewSpark
            </div>
            <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
              Engineering & Systems Interview Simulation
            </div>
          </div>

          <div className="text-[9px] font-black text-slate-800 uppercase tracking-widest">
            &copy; 2026 | ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      <style>{`
        .outline-text {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
