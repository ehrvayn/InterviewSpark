import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CurrentUserProvider } from "./context/CurrentUserContext.tsx";
import { PageProvider } from "./context/PageContext.tsx";
import { LoginProvider } from "./context/LoginContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RegisterProvider } from "./context/RegisterContext.tsx";
import { InterviewProvider } from "./context/InterviewContext.tsx";
import { PaymentProvider } from "./context/PaymentContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="830423507480-b4hhnqur51r7d4po7fa9oq7lp1mrak1a.apps.googleusercontent.com">
      <PageProvider>
        <CurrentUserProvider>
          <LoginProvider>
            <RegisterProvider>
              <InterviewProvider>
                <PaymentProvider>
                  <App />
                </PaymentProvider>
              </InterviewProvider>
            </RegisterProvider>
          </LoginProvider>
        </CurrentUserProvider>
      </PageProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
