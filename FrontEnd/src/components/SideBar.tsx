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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-[#0a0f18]/90 border-b border-white/5 backdrop-blur-xl flex items-center justify-between px-2 sm:px-6">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md bg-white/5 border border-white/10 text-slate-400"
        >
          <MdMenu size={22} />
        </button>
        <div className="flex items-center gap-2.5">
            <img
              src={Logo}
              alt="InterviewSpark"
              className="w-10  object-cover rounded-lg"
            />
          <span className="font-black tracking-tighter text-sm text-white">
            InterviewSpark
          </span>
        </div>
        <div className="w-10" />
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-[#0d121b] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-none px-8 py-8 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigate("landing")}
          >
            <div className="w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-300">
              <img
                src={Logo}
                alt="InterviewSpark"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <span className="font-black tracking-tighter text-lg text-white">
              InterviewSpark
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-500 hover:text-white"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-none">
          <nav className="px-4 space-y-1 mt-4">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                Menu
              </span>
            </div>
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center cursor-pointer gap-3.5 px-4 py-3 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all duration-200 group relative ${
                    isActive
                      ? "bg-blue-600/5 text-blue-500 border border-blue-500/10"
                      : "text-slate-500 hover:bg-white/2 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <span
                    className={`text-lg ${isActive ? "text-blue-500" : "text-slate-600 group-hover:text-slate-300"}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="px-4 mb-6">
              <div className="rounded-sm bg-white/2 border border-white/5 p-5 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-blue-600/5 blur-3xl rounded-full" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                      <SiBasicattentiontoken className="text-blue-600" />{" "}
                      Credits:
                    </span>
                    <span className="text-xl font-black text-white italic">
                      {currentUser?.credit || 0}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full py-2.5 bg-blue-600 cursor-pointer hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Top Up <IoIosArrowForward />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 pb-8 space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-sm border border-white/5 bg-white/1">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-white border border-white/5">
                  {currentUser?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[11px] font-black text-white uppercase tracking-tight truncate">
                    {currentUser?.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLogout(true)}
                className="w-full flex items-center gap-3 cursor-pointer px-4 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-rose-500/5 hover:text-rose-500 transition-all border border-transparent"
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
