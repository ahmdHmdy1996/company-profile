import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import PDFCreator from "./pages/PDFCreator";
import AboutUsModule from "./pages/modules/AboutUsModule";
import OurStaffModule from "./pages/modules/OurStaffModule";
import KeyClientsModule from "./pages/modules/KeyClientsModule";
import ServicesModule from "./pages/modules/ServicesModule";
import ProjectsModule from "./pages/modules/ProjectsModule";
import ToolsInstrumentsModule from "./pages/modules/ToolsInstrumentsModule";
import GeneralSettingsPage from "./pages/GeneralSettingsPage";
import { apiService } from "./services/api";
import { ToastProvider } from "./contexts/ToastContext";
import "./index.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("auth_token");
    if (token) {
      apiService.setToken(token);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Handle screen resize
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = (token) => {
    // Save token and authenticate user
    apiService.setToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      // Try to logout on the backend
      await apiService.logout();
    } catch (error) {
      // Even if backend logout fails, we should clear local auth
      console.warn("Backend logout failed:", error);
    } finally {
      // Always clear local authentication state
      localStorage.removeItem("auth_token");
      apiService.setToken(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  // Check if screen is too small (less than 790px)
  if (screenWidth < 790) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-blue-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Desktop Only
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            This website can only be viewed on PC
          </p>
          <p className="text-sm text-gray-500">
            Please use a desktop or laptop computer to access this website.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Current screen width: {screenWidth}px (minimum required: 790px)
          </p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            {/* Public login route (redirect to home if already authenticated) */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            {/* Protected dashboard routes */}
            <Route
              path="/*"
              element={
                isAuthenticated ? (
                  <Dashboard onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<Navigate to="pdf-creator" replace />} />
              <Route path="pdf-creator" element={<PDFCreator />} />
              <Route path="modules/about-us" element={<AboutUsModule />} />
              <Route path="modules/our-staff" element={<OurStaffModule />} />
              <Route
                path="modules/key-clients"
                element={<KeyClientsModule />}
              />
              <Route path="modules/services" element={<ServicesModule />} />
              <Route path="modules/projects" element={<ProjectsModule />} />
              <Route
                path="modules/tools-instruments"
                element={<ToolsInstrumentsModule />}
              />
              <Route
                path="general-settings"
                element={<GeneralSettingsPage />}
              />
            </Route>
            {/* Redirect any unknown paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
