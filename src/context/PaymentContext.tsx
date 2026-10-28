"use client";
import React, { createContext, useContext, useState } from "react";
import api from "../lib/api";

interface PaymentContextType {
  showPayment: boolean;
  setShowPayment: React.Dispatch<React.SetStateAction<boolean>>;
  handleBuy: (packId: string) => Promise<void>;
  isBuying: boolean;
  setIsbuying: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const [isBuying, setIsbuying] = useState(false);

  const handleBuy = async (packId: string) => {
    setIsbuying(true);
    try {
      const response = await api.post("/payment/create", { packId });
      if (response.data.success) {
        window.location.href = response.data.checkoutUrl;
        return;
      }
      console.error("Checkout failed:", response.data.message);
    } catch (error) {
      console.error("Checkout error:", error);
    }
    setIsbuying(false);
  };

  return (
    <PaymentContext.Provider
      value={{ showPayment, setShowPayment, handleBuy, isBuying, setIsbuying }}
    >
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
