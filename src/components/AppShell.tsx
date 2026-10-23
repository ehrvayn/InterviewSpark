"use client";

import Sidebar from "./SideBar";
import Landing from "../views/Landing";
import Dashboard from "../views/Dashboard";
import Interview from "../views/interview/Interview";
import PaymentSuccess from "../views/payment/PaymentSuccess";
import PaymentFailed from "../views/payment/PaymentFailed";
import { usePage } from "../context/PageContext";
import { useLogin } from "../context/LoginContext";
import { usePayment } from "../context/PaymentContext";
import LogoutModal from "./modal/LogoutModal";
import PaymentModal from "./modal/PaymentModal";

export default function AppShell() {
  const { activePage, setActivePage } = usePage();
  const { showLogout } = useLogin();
  const { showPayment } = usePayment();

  const renderPage = () => {
    switch (activePage) {
      case "landing":
        return <Landing />;
      case "dashboard":
        return <Dashboard onNavigate={setActivePage} />;
      case "interview":
        return <Interview />;
      case "payment-success":
        return <PaymentSuccess />;
      case "payment-failed":
        return <PaymentFailed />;
      default:
        return <Landing />;
    }
  };

  const isLanding = activePage === "landing";

  return (
    <div className="w-full min-h-screen bg-[#080c12] text-[#e8edf5] font-sans">
      {!isLanding && (
        <Sidebar currentPage={activePage} onNavigate={setActivePage} />
      )}
      <main
        className={`flex-1 flex flex-col min-h-screen ${!isLanding ? "lg:ml-72" : "w-full"}`}
      >
        {renderPage()}
        {showLogout && <LogoutModal />}
        {showPayment && <PaymentModal />}
      </main>
    </div>
  );
}