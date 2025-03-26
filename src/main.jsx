import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "../src/components/App";
import AppProvider from "./contexts/AppContext";
import CurrentUserProvider from "./contexts/CurrentUserContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <CurrentUserProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </CurrentUserProvider>
    </HashRouter>
  </React.StrictMode>
);
