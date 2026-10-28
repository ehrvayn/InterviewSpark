"use client";
import { useEffect, useState } from "react";
import { MdClose, MdCheckCircle, MdSecurity } from "react-icons/md";
import { usePayment } from "../../context/PaymentContext";
import { IoArrowForward } from "react-icons/io5";

const packs = [
  {
    id: "starter",
    label: "Starter",
    credits: 5,
    price: 49,
    tag: null,
    description: "Perfect for trying it out",
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
    price: 99,
    tag: "Best Value",
    description: "Most chosen by job seekers",
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
    price: 169,
    tag: "Power User",
    description: "For serious interview prep",
    perks: [
      "35 full interviews",
      "Any difficulty level",
      "AI scoring & feedback",
    ],
    color: "standard",
  },
];

export default function PaymentModal() {
  const { showPayment, setShowPayment, handleBuy, isBuying, setIsbuying } =
    usePayment();

  useEffect(() => {
    if (!showPayment) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showPayment]);

  if (!showPayment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/90 backdrop-blur-md animate-in fade-in duration-300"
      onClick={() => setShowPayment(false)}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] border bg-black border-neutral-700/50 rounded-2xl shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isBuying && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-neutral-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2.5 h-2.5 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2.5 h-2.5 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <p className="text-sm font-semibold text-white uppercase tracking-wide">
                Redirecting please wait...
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowPayment(false)}
          className="absolute top-6 cursor-pointer right-6 p-2 rounded-lg bg-neutral-800/40 border border-neutral-700/50 text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-all z-20"
        >
          <MdClose size={20} />
        </button>

        <div className="relative z-10 px-4 py-8 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl uppercase font-mono sm:text-5xl font-bold text-white tracking-tight mb-4">
              Get more <span className="text-white">Credits</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {packs.map((pack) => {
              const isFeatured = pack.color === "featured";
              return (
                <div
                  key={pack.id}
                  className={`group relative flex bg-neutral-800/70 flex-col rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                    isFeatured
                      ? "border-neutral-500/50  shadow-2xl shadow-neutral-600/20 lg:scale-105 z-10"
                      : " border-neutral-700/50 hover:border-neutral-600/50 hover:bg-neutral-800/60"
                  }`}
                >
                  {pack.tag && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg ${
                          isFeatured
                            ? "bg-white text-neutral-600"
                            : "bg-neutral-700 text-white border border-neutral-600/50"
                        }`}
                      >
                        {pack.tag}
                      </span>
                    </div>
                  )}

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center justify-between w-full text-right">
                        <p
                          className={`text-[15px] font-bold uppercase tracking-widest mb-2 ${
                            isFeatured ? "text-neutral-100" : "text-neutral-400"
                          }`}
                        >
                          {pack.label}
                        </p>
                        <h3
                          className={`text-2xl font-black ${isFeatured ? "text-white" : "text-white"}`}
                        >
                          ₱{pack.price}
                        </h3>
                      </div>
                    </div>

                    <div className="mb-8">
                      <p
                        className={`text-sm font-medium leading-relaxed ${
                          isFeatured ? "text-neutral-50" : "text-neutral-400"
                        }`}
                      >
                        {pack.description}
                      </p>
                    </div>

                    <div
                      className={`h-px w-full mb-8 ${isFeatured ? "bg-white/20" : "bg-neutral-700/30"}`}
                    />

                    <ul className="space-y-4 mb-10">
                      {pack.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-3">
                          <MdCheckCircle
                            className={`text-lg shrink-0 ${
                              isFeatured ? "text-white" : "text-neutral-400"
                            }`}
                          />
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-tight ${
                              isFeatured
                                ? "text-neutral-50"
                                : "text-neutral-300"
                            }`}
                          >
                            {perk}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        handleBuy(pack.id);
                        setIsbuying(true);
                      }}
                      className={`mt-auto w-full text-black bg-white hover:bg-white/80 py-4 rounded-lg flex justify-center items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${
                        isFeatured
                          ? "shadow-xl shadow-white/20"
                          : " shadow-lg shadow-neutral-600/20"
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

          <div className="mt-12 flex flex-col items-center border-t border-neutral-700/50 pt-8">
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-neutral-300">
                <MdSecurity size={16} />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  PayMongo Secured
                </span>
              </div>
              <div className="w-px h-4 bg-neutral-700/30" />
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  Instant Delivery
                </span>
              </div>
            </div>
            <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-wider">
              © 2026 InterviewSpark • All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
