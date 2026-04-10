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
    const token = localStorage.getItem("token");
    if (token && activePage === "landing") {
      setActivePage("interview");
    }
  }, []);

  return (
    <pageContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </pageContext.Provider>
  );
};

export const usePage = () => {
  const context = useContext(pageContext);
  if (!context) {
    throw new Error("Page must be used inside PageProvider");
  }
  return context;
};
