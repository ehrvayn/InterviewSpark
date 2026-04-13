import { useState } from "react";
import type { Page, NavItem } from "../types";
import { MdDashboard, MdOutlineLogout, MdClose, MdMenu } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";
import { FaMicrophoneLines } from "react-icons/fa6";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useLogin } from "../context/LoginContext";
import { SiBasicattentiontoken } from "react-icons/si";
import { usePayment } from "../context/PaymentContext";
import { IoIosArrowForward } from "react-icons/io";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: NavItem[] = [
  { id: "interview", label: "Interview", icon: <FaMicrophoneLines /> },
  { id: "dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { id: "progress", label: "Progress", icon: <GiProgression /> },
  { id: "questions", label: "Questions", icon: <FaQuestion /> },
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-[#0a0f18]/80 border-b border-white/5 backdrop-blur-xl flex items-center justify-between px-6">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all active:scale-95"
        >
          <MdMenu size={22} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white text-lg">⬡</span>
          </div>
          <span className="font-bold tracking-tight text-sm text-slate-200">
            InterviewSpark
          </span>
        </div>

        <div className="w-10" />
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky mr-10 lg:top-0 left-0 top-0 h-dvh w-72 bg-[#0a0f18] border-r border-white/5 flex flex-col z-50 transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-8 py-7">
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => {
              onNavigate("landing" as Page);
              setIsOpen(false);
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white text-xl">⬡</span>
            </div>
            <span className="font-bold tracking-tight text-lg text-white">
              InterviewSpark
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 cursor-pointer rounded-md text-[14px] font-semibold transition-all duration-200 group border-y-3 ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border-blue-500/20 ring-blue-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent ring-transparent"
                }`}
              >
                <span
                  className={`text-xl transition-transform group-hover:scale-110 ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`}
                >
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mx-4 mb-4 pl-5 rounded-md bg-linear-to-b from-white/3 to-transparent border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-600/10 blur-3xl rounded-full" />

          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                Available Credits{" "}
                <SiBasicattentiontoken className="text-blue-500" />
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {currentUser?.credit || 0}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="h-20 pl-2 rounded-0 cursor-pointer flex items-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Top Up
              <IoIosArrowForward size={20} />
            </button>
          </div>
        </div>

        <div className="px-4 pb-6 space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-md bg-white/2 border border-white/5 transition-all group">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
              {currentUser?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-bold text-slate-200 truncate">
              {currentUser?.name}
            </span>
          </div>

          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 cursor-pointer px-4 py-3.5 rounded-md text-sm font-bold text-slate-500 hover:bg-red-500/5 hover:text-red-400 transition-all border border-transparent"
          >
            <MdOutlineLogout size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
