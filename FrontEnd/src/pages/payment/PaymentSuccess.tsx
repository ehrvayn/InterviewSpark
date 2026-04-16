import { useEffect } from "react";
import { usePage } from "../../context/PageContext";
import { useCurrentUser } from "../../context/CurrentUserContext";

export default function PaymentSuccess() {
  const { setActivePage } = usePage();
  const { refreshUser, currentUser } = useCurrentUser();

  useEffect(() => {
    const handleSuccess = async () => {
      console.log("Before refresh - Credits:", currentUser?.credit);
      await refreshUser();
      console.log("After refresh - Credits:", currentUser?.credit);
      
      setTimeout(() => {
        setActivePage("dashboard");
      }, 2000);
    };
    handleSuccess();
  }, [refreshUser, setActivePage, currentUser?.credit]);

  return (
    <div className="w-full max-w-full overflow-hidden min-h-screen flex items-center justify-center bg-linear-to-br from-[#080c12] via-[#0d1219] to-[#0a0e14]">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-3xl font-black text-green-400 mb-2">
          Payment Successful!
        </h1>
        <p className="text-[#8a9ab8] mb-6">Credits added to your account</p>
        <p className="text-xs text-[#536480]">Refreshing credits...</p>
      </div>
    </div>
  );
}