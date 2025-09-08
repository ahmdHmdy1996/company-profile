import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import AuthModal from "./components/AuthModal";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import "./App.css";

// Main App Content Component
function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);

  const handleAuthSuccess = (user) => {
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setShowAuthModal(true);
  };

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="App min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Company Profile Builder
          </h1>
          <p className="text-gray-600 mb-8">
            Please login to access the dashboard
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // Show dashboard if authenticated
  return (
    <div className="App min-h-screen bg-white">
      <Dashboard onLogout={handleLogout} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
