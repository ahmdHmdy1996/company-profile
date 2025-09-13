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

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("auth_token");
    if (token) {
      apiService.setToken(token);
      setIsAuthenticated(true);
    }
    setLoading(false);
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
