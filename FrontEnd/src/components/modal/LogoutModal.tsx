import { useLogin } from "../../context/LoginContext";
import { MdOutlineLogout } from "react-icons/md";

export default function LogoutModal() {
  const { logout, setShowLogout } = useLogin();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#141c28] border border-[#1f2d42] rounded-md p-8 shadow-2xl w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-white mb-2">Logging out?</h2>
          <p className="text-sm text-[#8a9ab8]">
            Are you sure you want to log out?
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowLogout(false)}
            className="flex-1 py-3 rounded-md border border-[#263548] text-[#8a9ab8] hover:border-blue-500 hover:text-blue-400 transition-all text-sm font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={logout}
            className="flex-1 py-3 rounded-md flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/20 text-sm cursor-pointer"
          >
            Logout
            <MdOutlineLogout  size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
}
