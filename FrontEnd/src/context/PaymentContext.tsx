import React, { createContext, useContext, useState } from "react";
import api from "../lib/api";

interface PaymentContextType {
  showPayment: boolean;
  setShowPayment: React.Dispatch<React.SetStateAction<boolean>>;
  handleBuy: (packId: string) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showPayment, setShowPayment] = useState(false);

  const handleBuy = async (packId: string) => {
    const response = await api.post("/payment/create", { packId });
    if (response.data.success) {
      window.location.href = response.data.checkoutUrl;
    }
  };

  return (
    <PaymentContext.Provider value={{ showPayment, setShowPayment, handleBuy }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context)
    throw new Error("usePayment must be used inside PaymentProvider");
  return context;
};
