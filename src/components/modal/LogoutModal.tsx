"use client";
import { MdOutlineLogout } from "react-icons/md";
import { useLogin } from "../../context/LoginContext";

export default function LogoutModal() {
  const { logout, showLogout, setShowLogout, loggingOut } = useLogin();

  if (!showLogout) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/90 backdrop-blur-md">
      <div className="border border-neutral-700/50 rounded-xl p-8 shadow-2xl w-full max-w-sm mx-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 " />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">Sign out?</h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            You will be logged out of your account. Any ongoing session will be
            lost.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowLogout(false)}
            className="flex-1 py-3 rounded-lg border border-neutral-700/50 text-neutral-300 hover:text-white hover:border-neutral-600/50 hover:bg-neutral-800/40 transition-all text-sm font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={logout}
            className="flex-1 py-3 text-black bg-white hover:bg-white/80 rounded-lg flex items-center justify-center gap-2 hover: font-bold transition-all active:scale-95 shadow-lg shadow-neutral-600/20 text-sm cursor-pointer"
          >
            <MdOutlineLogout size={18} />
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}





