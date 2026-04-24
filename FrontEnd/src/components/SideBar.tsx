import { useState } from "react";
import type { Page, NavItem } from "../types";
import { MdDashboard, MdOutlineLogout, MdClose, MdMenu } from "react-icons/md";
import { FaMicrophoneLines } from "react-icons/fa6";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useLogin } from "../context/LoginContext";
import { SiBasicattentiontoken } from "react-icons/si";
import { usePayment } from "../context/PaymentContext";
import { IoIosArrowForward } from "react-icons/io";
import Logo from "../assets/img/InterviewSpark_Logo.png";

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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-slate-900/90 border-b border-slate-700/50 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-white transition-colors"
        >
          <MdMenu size={22} />
        </button>
        <div className="flex items-center gap-2.5">
          <img
            src={Logo}
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
        className={`fixed top-0 left-0 h-screen w-72 bg-linear-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-none px-8 py-8 flex items-center justify-between border-b border-slate-700/50">
          <div
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigate("landing")}
          >
            <div className="w-10 h-10 flex items-center justify-center shadow-lg">
              <img
                src={Logo}
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
            className="lg:hidden text-slate-500 hover:text-white transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-none">
          <nav className="px-4 space-y-1 mt-6">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
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
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <span
                    className={`text-lg ${isActive ? "text-blue-400" : "text-slate-600 group-hover:text-slate-400"}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="px-4 mb-6">
              <div className="rounded-lg bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-5 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-blue-600/10 blur-3xl rounded-full" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <SiBasicattentiontoken className="text-blue-400" />
                      Credits
                    </span>
                    <span className="text-2xl font-black text-white">
                      {currentUser?.credit || 0}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full py-2.5 bg-linear-to-r from-blue-600 to-blue-500 cursor-pointer hover:from-blue-500 hover:to-blue-400 text-white text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    Top Up <IoIosArrowForward size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 pb-8 space-y-2 border-t border-slate-700/50 pt-6">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white border border-slate-700/50">
                  {currentUser?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[11px] font-bold text-white uppercase tracking-tight truncate">
                    {currentUser?.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLogout(true)}
                className="w-full flex items-center gap-3 cursor-pointer px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent"
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
