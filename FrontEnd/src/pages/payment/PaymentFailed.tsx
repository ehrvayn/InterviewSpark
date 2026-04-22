import { useEffect } from "react";
import { usePage } from "../../context/PageContext";

export default function PaymentFailed() {
  const { setActivePage } = usePage();

  useEffect(() => {
    setTimeout(() => {
      window.history.replaceState({}, document.title, "/");
      setActivePage("interview");
    }, 2000);
  }, []);

  return (
    <div className="w-full max-w-full overflow-hidden min-h-screen flex items-center justify-center bg-linear-to-br from-[#080c12] via-[#0d1219] to-[#0a0e14]">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✕</span>
        </div>
        <h1 className="text-3xl font-black text-red-400 mb-2">
          Payment Failed
        </h1>
        <p className="text-[#8a9ab8] mb-6">Payment was not processed</p>
        <p className="text-xs text-[#536480]">Redirecting...</p>
      </div>
    </div>
  );
}
