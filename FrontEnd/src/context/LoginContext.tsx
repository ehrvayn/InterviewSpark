import React, { createContext, useContext, useState } from "react";
import { usePage } from "../context/PageContext";
import { useCurrentUser } from "../context/CurrentUserContext";
import api from "../lib/api";

interface LoginContextType {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: () => Promise<void>;
  showLogout: boolean;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  loginError: string;
  setLoginError: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setActivePage } = usePage();
  const { loadUser } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("session");
    localStorage.removeItem("");
    setActivePage("landing");
    setShowLogout(false);
    window.location.reload();
  };

  const handleLogin = async () => {
    setLoginError("");
    setLoading(true);
    try {
      const response = await api.post("/user/login", { email, password });
      const data = response.data;

      if (data.success) {
        localStorage.setItem("token", data.token);
        loadUser();
        setEmail("");
        setPassword("");
        setActivePage("interview");
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
