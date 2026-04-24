import { FaUserTie } from "react-icons/fa6";
import { GiProgression } from "react-icons/gi";
import { MdFeedback, MdSecurity } from "react-icons/md";
import { FaRobot, FaMicrochip } from "react-icons/fa6";
import LoginContainer from "../components/LoginContainer";
import { useRegister } from "../context/RegisterContext";
import RegisterContainer from "../components/registerContainer";
import Logo from "../assets/img/InterviewSpark_Logo.png";
import { useEffect } from "react";

export default function Landing() {
  const { showRegister } = useRegister();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="overflow-x-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans selection:bg-blue-500/30">
      <section className="relative flex flex-col lg:grid lg:grid-cols-12 items-center min-h-screen px-4 md:px-10 xl:px-20 py-12 lg:py-0 overflow-hidden border-b border-slate-700/50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full lg:col-span-7 xl:col-span-8 pr-0 lg:pr-12 py-10">
          <div className="inline-flex items-center gap-3 px-4 py-2.5 mb-8 bg-slate-800/40 border border-slate-700/50 rounded-xl">
            <img
              src={Logo}
              alt="InterviewSpark"
              className="w-8 h-8 object-cover rounded-lg"
            />
            <p className="text-blue-400 text-lg font-bold tracking-wider">
              InterviewSpark
            </p>
          </div>

          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black  tracking-tight mb-8 uppercase">
            Master the{" "}
            <span className="bg-linear-to-rrom-blue-400 to-blue-600 bg-clip-text text-transparent">
              Technical
            </span>
            <br />
            Interview <span className="outline-text">Stack.</span>
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mb-12">
            <div className="space-y-3 p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-2 text-blue-400">
                <FaMicrochip size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Logic Synthesis
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Fine-tuned models trained on real-world hiring data to simulate
                actual engineering and systems roles.
              </p>
            </div>
            <div className="space-y-3 p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-2 text-blue-400">
                <MdSecurity size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Feedback Loop
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
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

      <section className="px-4 md:px-10 xl:px-20 py-20 lg:py-32 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2"></div>
        </div>

        <div className="w-full relative z-10">
          <div className="mb-16 lg:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-1 w-8 bg-linear-to-r from-blue-500 to-blue-600" />
                <span className="text-blue-400 font-bold text-[10px] uppercase tracking-widest">
                  Engine Architecture
                </span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-tight">
                Predictive <br /> Assessment
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xs font-medium leading-relaxed border-l-2 border-slate-700/50 pl-6">
              Skip the generic practice. Our platform benchmarks your responses
              against industry-standard requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            ].map((f, idx) => (
              <div
                key={f.title}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all group relative overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-4xl font-black">0{idx + 1}</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/30 group-hover:border-blue-500/50 transition-all">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[11px] uppercase tracking-wider mb-3 text-white">
                  {f.title}
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <footer className="px-4 md:px-10 xl:px-20 py-12 border-t border-slate-700/50 bg-slate-900/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex md:items-start items-center flex-col gap-2">
            <div className="text-[12px] font-bold text-white uppercase tracking-wider">
              InterviewSpark
            </div>
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Engineering & Systems Interview Simulation
            </div>
          </div>

          <div className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">
            © 2026 InterviewSpark • All rights reserved
          </div>
        </div>
      </footer>

      <style>{`
        .outline-text {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(96, 165, 250, 0.3);
        }
      `}</style>
    </div>
  );
}
