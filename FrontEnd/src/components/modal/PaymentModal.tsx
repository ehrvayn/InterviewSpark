import { MdClose } from "react-icons/md";
import { FaMicrophone, FaRocket, FaStar } from "react-icons/fa";
import { usePayment } from "../../context/PaymentContext";
import { useEffect } from "react";
import { IoArrowForward } from "react-icons/io5";

const packs = [
  {
    id: "starter",
    label: "Starter",
    credits: 5,
    price: 149,
    tag: null,
    description: "Perfect for trying it out",
    icon: <FaMicrophone className="sm:text-[30px] text-[20px]" />,
    perks: ["5 full interviews", "Any difficulty level", "AI scoring & feedback"],
    color: "blue",
  },
  {
    id: "popular",
    label: "Popular",
    credits: 15,
    price: 449,
    tag: "Best Value",
    description: "Most chosen by job seekers",
    icon: <FaStar className="sm:text-[30px] text-[20px]" />,
    perks: ["15 full interviews", "Any difficulty level", "AI scoring & feedback"],
    color: "featured",
  },
  {
    id: "pro",
    label: "Pro",
    credits: 35,
    price: 999,
    tag: null,
    description: "For serious interview prep",
    icon: <FaRocket className="sm:text-[30px] text-[20px]" />,
    perks: ["35 full interviews", "Any difficulty level", "AI scoring & feedback"],
    color: "blue",
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={() => setShowPayment(false)}
    >
      <div
        className="sm:max-w-3xl sm:h-[70vh] flex flex-col w-screen h-screen overflow-y-auto bg-[#080c12] border border-[#1f2d42] rounded-0 sm:rounded-md py-5 px-2 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowPayment(false)}
          className="absolute top-4 right-4 text-[#536480] hover:text-white transition-all cursor-pointer z-10"
        >
          <MdClose size={20} />
        </button>

        <div className="text-center mb-6 sm:mb-8 pr-6">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Get more Credit
          </h2>
          <p className="text-[#8a9ab8] text-xs sm:text-sm mt-2">
            1 credit = 1 full interview session, any difficulty. Credits never expire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {packs.map((pack) => {
            const isFeatured = pack.color === "featured";
            return (
              <div
                key={pack.id}
                className={`relative flex gap-3 flex-col rounded-md border p-4 sm:p-5 transition-all ${
                  isFeatured
                    ? "border-blue-500 bg-blue-600 text-white sm:scale-[1.03]"
                    : "border-[#1f2d42] bg-[#0d1219] text-[#e8edf5]"
                }`}
              >
                {pack.tag && (
                  <div className="absolute -top-3 left-4 sm:left-1/2 sm:-translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-blue-600 whitespace-nowrap">
                      {pack.tag}
                    </span>
                  </div>
                )}

                <div className="flex sm:flex-col flex-1 sm:items-center items-start gap-3 sm:gap-0">
                  <div className={`sm:mb-3 sm:mt-0 mt-1 shrink-0 ${isFeatured ? "text-white" : "text-blue-400"}`}>
                    {pack.icon}
                  </div>

                  <div className="flex-1 sm:text-center text-left">
                    <h3 className="text-sm sm:text-base font-black sm:mb-1">{pack.label}</h3>
                    <p className={`text-[11px] md:text-[15px] sm:mb-4 ${isFeatured ? "text-blue-100" : "text-[#536480]"}`}>
                      {pack.description}
                    </p>

                    <div className="sm:hidden mt-1">
                      <span className="text-xl font-black">₱{pack.price}</span>
                      <span className={`text-xs ml-1 ${isFeatured ? "text-blue-100" : "text-[#536480]"}`}>
                        / {pack.credits} credits
                      </span>
                    </div>

                    <ul className="flex flex-col gap-1.5 mt-2 sm:hidden">
                      {pack.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2 text-xs">
                          <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${isFeatured ? "bg-white/20 text-white" : "bg-blue-500/20 text-blue-400"}`}>
                            ✓
                          </span>
                          <span className={isFeatured ? "text-blue-50" : "text-[#8a9ab8]"}>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="sm:hidden flex flex-col justify-between ml-4 shrink-0">
                  <button
                    onClick={() => handleBuy(pack.id)}
                    className={`mt-auto px-4 py-2 rounded-sm flex justify-center items-center text-xs font-bold transition-all cursor-pointer ${
                      isFeatured ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                    }`}
                  >
                    Buy <IoArrowForward size={15} className="ml-1" />
                  </button>
                </div>

                <div className="hidden sm:block text-center mb-5">
                  <span className="text-3xl font-black">₱{pack.price}</span>
                  <span className={`text-xs ml-1 ${isFeatured ? "text-blue-100" : "text-[#536480]"}`}>
                    / {pack.credits} credits
                  </span>
                </div>

                <ul className="hidden sm:flex flex-col gap-2 mb-6 flex-1">
                  {pack.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-xs">
                      <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${isFeatured ? "bg-white/20 text-white" : "bg-blue-500/20 text-blue-400"}`}>
                        ✓
                      </span>
                      <span className={isFeatured ? "text-blue-50" : "text-[#8a9ab8]"}>{perk}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuy(pack.id)}
                  className={`hidden w-full py-2.5 sm:flex justify-center items-center rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    isFeatured ? "bg-white text-blue-600 hover:bg-blue-50" : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  Buy <IoArrowForward size={15} className="ml-1" />
                </button>
              </div>
            );
          })}
        </div>

        <footer className="mt-auto pt-4 flex flex-col items-center gap-1">
          <p className="text-[10px] text-[#536480]">
            Secure payment via PayMongo · No hidden fees · Credits never expire
          </p>
          <p className="text-[10px] font-bold text-[#536480] uppercase tracking-widest">
            InterviewSpark | 2026
          </p>
        </footer>
      </div>
    </div>
  );
}