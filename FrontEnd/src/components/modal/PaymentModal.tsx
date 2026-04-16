import { useEffect } from "react";
import { MdClose, MdCheckCircle, MdSecurity } from "react-icons/md";
import { FaMicrophone, FaRocket, FaStar } from "react-icons/fa";
import { usePayment } from "../../context/PaymentContext";
import { IoArrowForward } from "react-icons/io5";

const packs = [
  {
    id: "starter",
    label: "Starter",
    credits: 5,
    price: 149,
    tag: null,
    description: "Perfect for trying it out",
    icon: <FaMicrophone />,
    perks: [
      "5 full interviews",
      "Any difficulty level",
      "AI scoring & feedback",
    ],
    color: "standard",
  },
  {
    id: "popular",
    label: "Popular",
    credits: 15,
    price: 449,
    tag: "Best Value",
    description: "Most chosen by job seekers",
    icon: <FaStar />,
    perks: [
      "15 full interviews",
      "Any difficulty level",
      "AI scoring & feedback",
    ],
    color: "featured",
  },
  {
    id: "pro",
    label: "Pro",
    credits: 35,
    price: 999,
    tag: "Power User",
    description: "For serious interview prep",
    icon: <FaRocket />,
    perks: [
      "35 full interviews",
      "Any difficulty level",
      "AI scoring & feedback",
    ],
    color: "standard",
  },
];

export default function PaymentModal() {
  const { setShowPayment, handleBuy } = usePayment();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-0 sm:p-4 bg-[#05080f]/90 backdrop-blur-md animate-in fade-in duration-300"
      onClick={() => setShowPayment(false)}
    >
      <div
        className="relative w-full max-w-5xl h-full sm:h-auto max-h-[95vh] bg-[#0a0f18] sm:border border-white/5 sm:rounded-xl shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

        <button
          onClick={() => setShowPayment(false)}
          className="absolute top-6 cursor-pointer right-6 p-2 rounded-full bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all z-20"
        >
          <MdClose size={20} />
        </button>

        <div className="px-6 py-12 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase italic mb-4">
              Get more <span className="text-blue-500">Credit</span>
            </h2>
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-400 text-[10px] sm:text-xs font-black uppercase tracking-widest">
                1 credit = 1 full interview session • Credits never expire
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {packs.map((pack) => {
              const isFeatured = pack.color === "featured";
              return (
                <div
                  key={pack.id}
                  className={`group relative flex flex-col rounded-sm border transition-all duration-300 ${
                    isFeatured
                      ? "bg-blue-600 border-blue-400 shadow-[0_20px_50px_rgba(59,130,246,0.15)] lg:scale-105 z-10"
                      : "bg-white/2 border-white/5 hover:border-white/10"
                  }`}
                >
                  {pack.tag && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <span
                        className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl ${
                          isFeatured
                            ? "bg-white text-blue-600"
                            : "bg-slate-800 text-white border border-white/10"
                        }`}
                      >
                        {pack.tag}
                      </span>
                    </div>
                  )}

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                      <div
                        className={`p-3 rounded-lg text-2xl ${
                          isFeatured
                            ? "bg-white/10 text-white"
                            : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        {pack.icon}
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                            isFeatured ? "text-blue-100" : "text-slate-500"
                          }`}
                        >
                          {pack.label}
                        </p>
                        <h3
                          className={`text-3xl font-black ${isFeatured ? "text-white" : "text-white"}`}
                        >
                          ₱{pack.price}
                        </h3>
                      </div>
                    </div>

                    <div className="mb-8">
                      <p
                        className={`text-xs font-bold leading-relaxed ${
                          isFeatured ? "text-blue-50" : "text-slate-400"
                        }`}
                      >
                        {pack.description}
                      </p>
                    </div>

                    <div
                      className={`h-px w-full mb-8 ${isFeatured ? "bg-white/10" : "bg-white/5"}`}
                    />

                    <ul className="space-y-4 mb-10">
                      {pack.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-3">
                          <MdCheckCircle
                            className={`text-lg shrink-0 ${
                              isFeatured ? "text-white" : "text-blue-500"
                            }`}
                          />
                          <span
                            className={`text-[11px] font-bold uppercase tracking-tight ${
                              isFeatured ? "text-blue-50" : "text-slate-300"
                            }`}
                          >
                            {perk}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleBuy(pack.id)}
                      className={`mt-auto w-full py-4 rounded-sm flex justify-center items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] cursor-pointer ${
                        isFeatured
                          ? "bg-white text-blue-600 hover:bg-blue-50 shadow-xl"
                          : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/10"
                      }`}
                    >
                      Buy
                      <IoArrowForward size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 flex flex-col items-center border-t border-white/5 pt-8">
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-slate-600">
                <MdSecurity size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  PayMongo Secured
                </span>
              </div>
              <div className="w-px h-4 bg-white/5" />
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Instant Delivery
                </span>
              </div>
            </div>
            <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">
               &copy; All rights reserved • 2026 InterviewSpark
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
