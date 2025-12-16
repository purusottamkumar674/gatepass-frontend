import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CoreDataProvider } from "./context/CoreDataContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CoreDataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CoreDataProvider>
  </AuthProvider>,
);
