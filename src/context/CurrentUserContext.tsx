"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import api from "../lib/api";
import { User } from "../types";

interface CurrentUserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  loadUser: () => Promise<void>;
  updateCredit: (newCredit: number) => void;
  refreshUser: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextType | null>(null);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(pathname !== "/");
  const hasLoadedUser = useRef(false);

  const loadUser = useCallback(async () => {
    hasLoadedUser.current = true;

    try {
      const response = await api.get("/user/retrieve");
      if (response.data.user) {
        setCurrentUser(response.data.user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCredit = (newCredit: number) => {
    setCurrentUser((prev) => (prev ? { ...prev, credit: newCredit } : prev));
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/user/retrieve");
      if (response.data.user) {
        setCurrentUser(response.data.user);
      }
    } catch (error) {
      console.error("Refresh user failed:", error);
    }
  };

  useEffect(() => {
    if (pathname === "/" || hasLoadedUser.current) return;
    loadUser();
  }, [pathname, loadUser]);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoading,
        loadUser,
        updateCredit,
        refreshUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used inside CurrentUserProvider");
  }
  return context;
};



