import { useEffect } from "react";
import { usePage } from "../../context/PageContext";
import { useCurrentUser } from "../../context/CurrentUserContext";

export default function PaymentSuccess() {
  const { setActivePage } = usePage();
  const { refreshUser } = useCurrentUser();

  useEffect(() => {
    const handleSuccess = async () => {
      await refreshUser();

      setTimeout(() => {
        window.history.replaceState({}, document.title, "/");
        setActivePage("interview");
      }, 2000);
    };

    handleSuccess();
  }, []);

  return (
    <div className="w-full max-w-full overflow-hidden min-h-screen flex items-center justify-center bg-linear-to-br from-[#080c12] via-[#0d1219] to-[#0a0e14]">
      <div className="text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-green-400">✓</span>
        </div>
        <h1 className="text-3xl font-black text-green-400 mb-2 uppercase tracking-tighter">
          Payment Successful
        </h1>
        <p className="text-[#8a9ab8] mb-6 font-medium">
          Credits have been added to your account.
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-xs font-mono text-[#536480] uppercase tracking-widest">
            Redirecting to Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
