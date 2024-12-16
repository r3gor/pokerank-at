import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import { UserDashboard } from "../pages/UserDashboard";
import { OAuthSuccess } from "../pages/OAuthSuccess";
import { AppProvider } from "../context/AppContext";
import { AdminDashboard } from "../pages/AdminDashboard";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/success" element={<OAuthSuccess />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </AppProvider>

        {/* <Routes> */}
        {/* </Routes> */}
      </BrowserRouter>
  );
};

export default AppRouter;

