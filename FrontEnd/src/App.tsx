import Sidebar from "./components/SideBar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/interview/Interview";
import Progress from "./pages/Progress";
import Questions from "./pages/Questions";
import { usePage } from "./context/PageContext";
import { useLogin } from "./context/LoginContext";
import LogoutModal from "./components/modal/LogoutModal";

export default function App() {
  const { activePage, setActivePage } = usePage();
  const { showLogout } = useLogin();

  const renderPage = () => {
    switch (activePage) {
      case "landing":
        return <Landing />;
      case "dashboard":
        return <Dashboard onNavigate={setActivePage} />;
      case "interview":
        return <Interview />;
      case "progress":
        return <Progress onNavigate={setActivePage} />;
      case "questions":
        return <Questions onNavigate={setActivePage} />;
      default:
        return <Landing />;
    }
  };

  const isLanding = activePage === "landing";

  return (
    <div
      className={`w-full min-h-screen bg-[#080c12] text-[#e8edf5] font-sans ${
        !isLanding ? "lg:grid lg:grid-cols-[256px_1fr]" : ""
      }`}
    >
      {!isLanding && (
        <Sidebar currentPage={activePage} onNavigate={setActivePage} />
      )}

      <main
        className={
          isLanding ? "w-full" : "min-h-screen flex flex-col pt-14 px-1 lg:pt-0"
        }
      >
        {renderPage()}
        {showLogout && <LogoutModal />}
      </main>
    </div>
  );
}
