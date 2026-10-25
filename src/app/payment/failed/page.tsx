"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      window.history.replaceState({}, document.title, "/");
      router.push("/interview");
    }, 2000);
  }, []);

  return (
    <div className="w-full max-w-full overflow-hidden min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-500/20 border border-neutral-500/40 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✕</span>
        </div>
        <h1 className="text-3xl font-black text-neutral-400 mb-2">
          Payment Failed
        </h1>
        <p className="text-white mb-6">Payment was not processed</p>
        <p className="text-xs text-white">Redirecting...</p>
      </div>
    </div>
  );
}






