import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { LocaleProvider } from "./i18n/locale";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </React.StrictMode>
);
