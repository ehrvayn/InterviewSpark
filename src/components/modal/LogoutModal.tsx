import { MdOutlineLogout } from "react-icons/md";
import { useLogin } from "../../context/LoginContext";

export default function LogoutModal() {
  const { logout, setShowLogout } = useLogin();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md">
      <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-8 shadow-2xl w-full max-w-sm mx-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500/50 to-transparent" />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">Sign out?</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            You will be logged out of your account. Any ongoing session will be
            lost.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowLogout(false)}
            className="flex-1 py-3 rounded-lg border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600/50 hover:bg-slate-800/40 transition-all text-sm font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={logout}
            className="flex-1 py-3 rounded-lg flex items-center justify-center gap-2 bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold transition-all active:scale-95 shadow-lg shadow-red-600/20 text-sm cursor-pointer"
          >
            <MdOutlineLogout size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
