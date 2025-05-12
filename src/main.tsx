import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AppWrapper } from "./components/common/PageMeta";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppWrapper>
    </ThemeProvider>
  </React.StrictMode>
);
