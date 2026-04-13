import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../lib/api";
import { User } from "../types";

interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  credit: number;
}

interface CurrentUserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  loadUser: () => void;
  updateCredit: (newCredit: number) => void;
  refreshUser: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextType | null>(null);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        jwtDecode<JWTPayload>(token);
        const response = await api.get("/user/retrieve");
        if (response.data.user) {
          setCurrentUser(response.data.user);
        } else {
          localStorage.removeItem("token");
          setCurrentUser(null);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setIsLoading(false);
  };

  const updateCredit = (newCredit: number) => {
    setCurrentUser((prev) => (prev ? { ...prev, credit: newCredit } : prev));
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/user/retrieve");
      console.log("Retrieve response:", response.data);
      if (response.data.user) {
        console.log("Setting user to:", response.data.user);
        setCurrentUser(response.data.user);
      }
    } catch (error) {
      console.error("Refresh user failed:", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

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
