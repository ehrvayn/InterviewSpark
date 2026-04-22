import React, { createContext, useContext, useState } from "react";
import api from "../lib/api";

interface LoginContextType {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleRegister: () => Promise<void>;
  showRegister: boolean;
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
  registerError: string;
  setRegisterError: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const RegisterContext = createContext<LoginContextType | null>(null);

export const RegisterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

const handleRegister = async () => {
    setRegisterError("");
    setLoading(true);
    try {
      const response = await api.post("/user/register", { name, email, password });
      const data = response.data;

      if (data.success) {
        localStorage.setItem("token", data.token);
        setName("");
        setEmail("");
        setPassword("");
        setShowRegister(false);
      } else {
        setRegisterError(data.message || "Registration failed!");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      setRegisterError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContext.Provider
      value={{
        name,
        setName,
        showRegister,
        setShowRegister,
        email,
        setEmail,
        password,
        setPassword,
        handleRegister,
        registerError,
        setRegisterError,
        loading,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  const context = useContext(RegisterContext);
  if (!context) throw new Error("useLogin must be used inside RegisterProvider");
  return context;
};
