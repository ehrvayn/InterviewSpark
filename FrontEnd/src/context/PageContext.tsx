import { createContext, useContext, useState, useEffect } from "react";
import { Page } from "../types";

interface PageContextType {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const pageContext = createContext<PageContextType | null>(null);

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activePage, setActivePage] = useState<Page>("landing");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");

    if (payment === "success") {
      setActivePage("payment-success");
      return;
    }

    if (payment === "failed") {
      setActivePage("payment-failed");
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      setActivePage("interview");
      return;
    }

    setActivePage("landing");
  }, []);

  return (
    <pageContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </pageContext.Provider>
  );
};

export const usePage = () => {
  const context = useContext(pageContext);
  if (!context) throw new Error("Page must be used inside PageProvider");
  return context;
};
