import SideBar from "./components/SideBar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
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
        return <Landing/>;
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

  return (
    <div className="h-screen overflow-hidden bg-[#080c12] text-[#e8edf5] font-sans flex">
      {activePage !== "landing" && (
        <SideBar currentPage={activePage} onNavigate={setActivePage} />
      )}

      <main
        className={
          activePage === "landing"
            ? "flex-1 w-full overflow-y-auto"
            : "flex-1 overflow-y-auto ml-64 max-w-6xl mx-auto px-10 py-8 w-full"
        }
      >
        {renderPage()}

        {showLogout && <LogoutModal />}
      </main>
    </div>
  );
}
