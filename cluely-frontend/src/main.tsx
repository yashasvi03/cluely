
// This file is the entry point for the React application.
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Admin from "./pages/Admin.tsx"; // (we'll create this next)
import { Toaster } from './components/ui/sonner.tsx'
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  </React.StrictMode>
);
