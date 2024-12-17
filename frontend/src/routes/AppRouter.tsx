import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Login/Login";
import { UserDashboard } from "../pages/UserDashboard/UserDashboard";
import { OAuthSuccess } from "../pages/OAuthSuccess/OAuthSuccess";
import { AppProvider } from "../context/AppContext";
import { AdminDashboard } from "../pages/AdminDashboard/AdminDashboard";
import { AdminProvider } from "../context/AdminContext";
import { UserProvider } from "../context/UserContext";
import { UserLayout } from "../components/layout/UserLayout/userLayout";
import { AdminLayout } from "../components/layout/AdminLayout/adminLayout";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>

          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/success" element={<OAuthSuccess />} />

          {/* User routes */}
          <Route
            path="/user/*"
            element={
              <UserProvider>
                <UserLayout>
                  <Routes>
                    <Route path="/dashboard" element={<UserDashboard />} />
                  </Routes>
                </UserLayout>
              </UserProvider>
            }/>

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <AdminProvider>
                <AdminLayout>
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                  </Routes>
                </AdminLayout>
              </AdminProvider>
            }/>

        </Routes>
      </AppProvider>

      </BrowserRouter>
  );
};

export default AppRouter;

