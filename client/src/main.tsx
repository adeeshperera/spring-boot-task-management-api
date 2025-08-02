import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import { AppProvider } from "./AppProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <NextUIProvider>
        {/* Dark Mode */}
        <div className="dark text-foreground bg-background min-h-screen min-w-screen flex justify-center items-center">
          <App />
        </div>
      </NextUIProvider>
    </AppProvider>
  </StrictMode>
);
