"use client";
import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../context/CurrentUserContext";
import api from "../lib/api";

interface LoginContextType {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  loggingOut: boolean;
  setLoggingOut: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogin: () => Promise<void>;
  showLogout: boolean;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => Promise<void>;
  loginError: string;
  setLoginError: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { loadUser, setCurrentUser } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await api.post("/user/logout");
      setLoggingOut(true);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setCurrentUser(null);
    setShowLogout(false);
    setLoggingOut(false);
    router.replace("/");
    router.refresh();
  };

  const handleLogin = async () => {
    setLoginError("");
    setLoading(true);
    try {
      const response = await api.post("/user/login", { email, password });
      const data = response.data;

      if (data.success) {
        await loadUser();
        setEmail("");
        setPassword("");
        router.replace("/interview");
        setLoading(false);
        router.refresh();
      } else {
        setLoginError(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        loggingOut,
        setLoggingOut,
        logout,
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        showLogout,
        setShowLogout,
        loginError,
        setLoginError,
        loading,
        setLoading,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) throw new Error("useLogin must be used inside LoginProvider");
  return context;
};
