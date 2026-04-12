import { useState } from "react";
import type { Page, NavItem } from "../types";
import { MdDashboard, MdOutlineLogout, MdClose, MdMenu } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";
import { FaMicrophoneLines } from "react-icons/fa6";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useLogin } from "../context/LoginContext";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: NavItem[] = [
  { id: "interview", label: "Interview", icon: <FaMicrophoneLines /> },
  { id: "dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { id: "progress", label: "Progress", icon: <GiProgression /> },
  { id: "questions", label: "Questions", icon: <FaQuestion /> },
  { id: "logout", label: "Logout", icon: <MdOutlineLogout /> },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { currentUser } = useCurrentUser();
  const { setShowLogout } = useLogin();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (id: string) => {
    if (id === "logout") {
      setShowLogout(true);
    } else {
      onNavigate(id as Page);
    }
    setIsOpen(false);
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#080c12]/95 border-b border-[#1f2d42] backdrop-blur-md flex items-center justify-between px-4">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md bg-[#141c28] border border-[#1f2d42] text-[#8a9ab8] hover:text-white transition-all"
        >
          <MdMenu size={20} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="text-xl text-blue-500">⬡</span>
          <span className="font-black tracking-[0.18em] text-sm">
            InterviewSpark
          </span>
        </div>

        <div className="w-9" />
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky lg:top-0 left-0 top-0 h-screen w-64 bg-[#080c12]/95 border-r border-[#1f2d42] backdrop-blur-md flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1f2d42]">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              onNavigate("landing");
              setIsOpen(false);
            }}
          >
            <span className="text-2xl text-blue-500">⬡</span>
            <span className="font-black tracking-[0.18em] text-sm">
              InterviewSpark
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-[#8a9ab8] hover:text-white transition-all"
          >
            <MdClose size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                currentPage === item.id
                  ? "bg-blue-500/20 text-blue-400 border-b-2 border-t-2 border-blue-400"
                  : item.id === "logout"
                    ? "text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                    : "text-[#8a9ab8] hover:bg-[#141c28] hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mb-3 p-3 rounded-md mx-3 flex flex-col items-center bg-[#0f1419] border border-[#1f2d42]">
          <span className="text-[11px] text-[#8a9ab8]">Credits Available</span>
          <div className="text-lg font-bold text-blue-400 mt-0.5">
            {currentUser?.credit || 0}
          </div>
        </div>
        <div className="px-4 py-4 border-t border-[#1f2d42]">
          <div className="flex items-center gap-3 p-3 rounded-md bg-[#141c28] cursor-pointer hover:bg-[#1a2332] transition-all">
            <div className="w-9 h-9 rounded-md bg-blue-500 flex items-center justify-center text-xs font-bold shrink-0">
              {currentUser?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col leading-tight min-w-0 flex-1">
              <span className="text-xs font-semibold truncate">
                {currentUser?.name}
              </span>
              <span className="text-[10px] text-blue-400">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
