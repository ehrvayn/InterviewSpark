"use client";
import { useState } from "react";
import type { Page, NavItem } from "../types";
import { MdDashboard, MdOutlineLogout, MdClose, MdMenu } from "react-icons/md";
import { FaMicrophoneLines } from "react-icons/fa6";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useLogin } from "../context/LoginContext";
import { SiBasicattentiontoken } from "react-icons/si";
import { usePayment } from "../context/PaymentContext";
import { IoIosArrowForward } from "react-icons/io";
import Logo from "../assets/img/InterviewSparkLogo.png";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: NavItem[] = [
  { id: "interview", label: "Interview", icon: <FaMicrophoneLines /> },
  { id: "dashboard", label: "Dashboard", icon: <MdDashboard /> },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { currentUser } = useCurrentUser();
  const { setShowLogout } = useLogin();
  const [isOpen, setIsOpen] = useState(false);
  const { setShowPayment } = usePayment();

  const handleNavigate = (id: string) => {
    onNavigate(id as Page);
    setIsOpen(false);
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-neutral-800/40 border-b border-neutral-700/50 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-neutral-800/40 border border-neutral-700/50 text-neutral-400 hover:text-white transition-colors"
        >
          <MdMenu size={22} />
        </button>
        <div className="flex items-center gap-2.5">
          <img
            src={Logo.src}
            alt="InterviewSpark"
            className="w-10 object-cover rounded-lg"
          />
          <span className="font-bold tracking-tight text-sm text-white">
            InterviewSpark
          </span>
        </div>
        <div className="w-10" />
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-4 left-4 bottom-4 w-62 rounded-4xl border bg-neutral-800/40 border-neutral-700/50 shadow-2xl shadow-black/40 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-none px-8 py-5 flex items-center justify-between border-b border-neutral-700/50">
          <div
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigate("landing")}
          >
            <div className="w-10 h-10 flex items-center justify-center shadow-lg">
              <img
                src={Logo.src}
                alt="InterviewSpark"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <span className="font-bold tracking-tight text-lg text-white">
              InterviewSpark
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-neutral-500 hover:text-white transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-none">
          <nav className="px-4 space-y-1 mt-6">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Menu
              </span>
            </div>
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center cursor-pointer gap-3 px-4 py-3.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200 group relative ${
                    isActive
                      ? "bg-white text-black border border-neutral-500/30"
                      : "text-neutral-400  hover:bg-neutral-800/50 hover:text-neutral-200 border border-transparent"
                  }`}
                >
                  <span
                    className={`text-lg ${isActive ? "text-black" : "text-neutral-600 group-hover:text-neutral-400"}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-3 rounded-full bg-black shadow-lg shadow-neutral-400/50" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto">
            {!currentUser ? (
              <div className="mx-4 mb-6 rounded-lg border border-neutral-500/30 p-5 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-full animate-pulse py-2.5 cursor-pointer bg-white/30 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-neutral-600/20" />
                    <span className="w-full animate-pulse py-2.5 cursor-pointer bg-white/30 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-neutral-600/20" />
                  </div>
                  <div className="w-full py-2.5 cursor-pointer bg-white/30 text-[10px] font-bold uppercase tracking-widest transition-all animate-pulse active:scale-95 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-neutral-600/20" />
                </div>
              </div>
            ) : (
              <div className="mx-4 mb-6 rounded-lg border border-neutral-500/30 p-5 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-neutral-600/10 blur-3xl rounded-full" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                      <SiBasicattentiontoken className="text-neutral-400" />
                      Credits
                    </span>
                    <span className="text-2xl font-black text-white">
                      {currentUser?.credit || 0}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full py-2.5 cursor-pointer hover: text-black bg-white hover:bg-white/80 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-neutral-600/20"
                  >
                    Top Up <IoIosArrowForward size={12} />
                  </button>
                </div>
              </div>
            )}

            <div className="px-4 pb-8 space-y-2 border-t border-neutral-700/50 pt-6">
              {!currentUser ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700/50 bg-neutral-800/40 hover:bg-neutral-800/60 transition-colors">
                  <div className="w-10 animate-pulse h-10 rounded-lg flex items-center justify-center text-xs font-bold bg-white/30 border border-neutral-700/50" />
                  <div className="w-full py-2.5 cursor-pointer hover: bg-white/30 text-[10px] font-bold uppercase tracking-widest transition-all animate-pulse active:scale-95 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-neutral-600/20" />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-neutral-700/50 bg-neutral-800/40 hover:bg-neutral-800/60 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-black bg-white border border-neutral-700/50">
                    {currentUser?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight truncate">
                      {currentUser?.name}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowLogout(true)}
                className="w-full flex items-center gap-3 cursor-pointer px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:bg-neutral-500/10 hover:text-neutral-400 transition-all border border-transparent"
              >
                <MdOutlineLogout size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
