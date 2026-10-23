"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PageProvider } from "../context/PageContext";
import { LoginProvider } from "../context/LoginContext";
import { PaymentProvider } from "../context/PaymentContext";
import { InterviewProvider } from "../context/InterviewContext";
import { CurrentUserProvider } from "../context/CurrentUserContext";
import { RegisterProvider } from "../context/RegisterContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <PageProvider>
        <CurrentUserProvider>
          <LoginProvider>
            <RegisterProvider>
              <PaymentProvider>
                <InterviewProvider>{children}</InterviewProvider>
              </PaymentProvider>
            </RegisterProvider>
          </LoginProvider>
        </CurrentUserProvider>
      </PageProvider>
    </GoogleOAuthProvider>
  );
}