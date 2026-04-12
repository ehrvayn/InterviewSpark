import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../types";

interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  credit: number
}

interface CurrentUserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  loadUser: () => void;
}

const CurrentUserContext = createContext<CurrentUserContextType | null>(null);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        setCurrentUser({
          id: decoded.userId,
          email: decoded.email,
          name: decoded.name,
          credit: decoded.credit,
        } as unknown as User);
      } catch (error) {
        console.error("Token decode failed:", error);
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, isLoading, loadUser }}>
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