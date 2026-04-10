import type { Page, NavItem } from "../types";
import { MdDashboard } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { FaMicrophoneLines } from "react-icons/fa6";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useLogin } from "../context/LoginContext";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: NavItem[] = [
  { id: "interview", label: "Interview", icon: <FaMicrophoneLines /> },
  { id: "dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { id: "progress", label: "Progress", icon: <GiProgression /> },
  { id: "questions", label: "Questions", icon: <FaQuestion /> },
  { id: "logout", label: "Logout", icon: <MdOutlineLogout /> }
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { currentUser } = useCurrentUser();
  const { setShowLogout } = useLogin();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#080c12]/95 border-r border-[#1f2d42] backdrop-blur-md flex flex-col">
      <div
        className="flex items-center gap-3 cursor-pointer px-6 py-6 border-b border-[#1f2d42]"
        onClick={() => onNavigate("landing")}
      >
        <span className="text-2xl text-blue-500">⬡</span>
        <span className="font-black tracking-[0.18em] text-sm">
          InterviewSpark
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              item.id === "logout" ? setShowLogout(true) : onNavigate(item.id)
            }
            className={`w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-md text-sm font-medium ${
              currentPage === item.id
                ? "bg-blue-500/20 text-blue-400 border-b-2 border-t-2 border-blue-400"
                : "text-[#8a9ab8] hover:bg-[#141c28] hover:text-white"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-[#1f2d42]">
        <div className="flex items-center gap-3 p-3 rounded-md bg-[#141c28] cursor-pointer hover:bg-[#1a2332]">
          <div className="w-10 h-10 rounded-md bg-blue-500 flex items-center justify-center text-xs font-bold shrink-0">
            {currentUser?.name[0]}
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-xs font-semibold truncate">
              {currentUser?.name}
            </span>
            <span className="text-[10px] text-blue-400">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
