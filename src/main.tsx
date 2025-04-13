import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = "pk_live_Y2xlcmsuZ2F0ZWNoZXNwb3J0cy5jb20k";
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
