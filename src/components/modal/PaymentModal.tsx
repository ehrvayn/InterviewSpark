import { useEffect } from "react";
import { MdClose, MdCheckCircle, MdSecurity } from "react-icons/md";
import { FaMicrophone, FaRocket, FaStar } from "react-icons/fa6";
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300"
      onClick={() => setShowPayment(false)}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <button
          onClick={() => setShowPayment(false)}
          className="absolute top-6 cursor-pointer right-6 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all z-20"
        >
          <MdClose size={20} />
        </button>

        <div className="relative z-10 px-6 py-12 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Get more{" "}
              <span className="bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Credits
              </span>
            </h2>
            <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest">
                1 credit = 1 full interview session • Credits never expire
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {packs.map((pack) => {
              const isFeatured = pack.color === "featured";
              return (
                <div
                  key={pack.id}
                  className={`group relative flex flex-col rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                    isFeatured
                      ? "bg-linear-to-br from-blue-600/40 to-blue-700/40 border-blue-500/50 shadow-2xl shadow-blue-600/20 lg:scale-105 z-10"
                      : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/60"
                  }`}
                >
                  {pack.tag && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg ${
                          isFeatured
                            ? "bg-white text-blue-600"
                            : "bg-slate-700 text-white border border-slate-600/50"
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
                            ? "bg-white/20 text-white"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {pack.icon}
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                            isFeatured ? "text-blue-100" : "text-slate-400"
                          }`}
                        >
                          {pack.label}
                        </p>
                        <h3
                          className={`text-4xl font-black ${isFeatured ? "text-white" : "text-white"}`}
                        >
                          ₱{pack.price}
                        </h3>
                      </div>
                    </div>

                    <div className="mb-8">
                      <p
                        className={`text-sm font-medium leading-relaxed ${
                          isFeatured ? "text-blue-50" : "text-slate-400"
                        }`}
                      >
                        {pack.description}
                      </p>
                    </div>

                    <div
                      className={`h-px w-full mb-8 ${isFeatured ? "bg-white/20" : "bg-slate-700/30"}`}
                    />

                    <ul className="space-y-4 mb-10">
                      {pack.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-3">
                          <MdCheckCircle
                            className={`text-lg shrink-0 ${
                              isFeatured ? "text-white" : "text-blue-400"
                            }`}
                          />
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-tight ${
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
                      className={`mt-auto w-full py-4 rounded-lg flex justify-center items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${
                        isFeatured
                          ? "bg-white text-blue-600 hover:bg-blue-50 shadow-xl shadow-white/20"
                          : "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-600/20"
                      }`}
                    >
                      Buy Now
                      <IoArrowForward size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col items-center border-t border-slate-700/50 pt-8">
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-slate-500">
                <MdSecurity size={16} />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  PayMongo Secured
                </span>
              </div>
              <div className="w-px h-4 bg-slate-700/30" />
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  Instant Delivery
                </span>
              </div>
            </div>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">
              © 2026 InterviewSpark • All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
