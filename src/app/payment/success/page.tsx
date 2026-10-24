"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/context/CurrentUserContext";

export default function PaymentSuccess() {
  const router = useRouter();
  const { refreshUser } = useCurrentUser();

  useEffect(() => {
    const handleSuccess = async () => {
      await refreshUser();

      setTimeout(() => {
        window.history.replaceState({}, document.title, "/");
        router.push("/interview");
      }, 2000);
    };

    handleSuccess();
  }, []);

  return (
    <div className="w-full max-w-full overflow-hidden min-h-screen flex items-center justify-center bg-black">
      <div className="text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-neutral-500/20 border border-neutral-500/40 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-neutral-400">✓</span>
        </div>
        <h1 className="text-3xl font-black text-neutral-400 mb-2 uppercase tracking-tighter">
          Payment Successful
        </h1>
        <p className="text-white mb-6 font-medium">
          Credits have been added to your account.
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-pulse" />
          <p className="text-xs font-mono text-white uppercase tracking-widest">
            Redirecting to Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}





