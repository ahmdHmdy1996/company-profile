import React, { createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

// Create Toast context
const ToastContext = createContext();

// Toast context provider
export const ToastProvider = ({ children }) => {
  // Success toast
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 4000,
      position: "top-right",
      style: {
        background: "#10B981",
        color: "#fff",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Kufi Arabic", sans-serif',
        direction: "rtl",
        fontSize: "14px",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#10B981",
      },
    });
  };

  // Error toast
  const showError = (message) => {
    toast.error(message, {
      duration: 5000,
      position: "top-right",
      style: {
        background: "#EF4444",
        color: "#fff",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Kufi Arabic", sans-serif',
        direction: "rtl",
        fontSize: "14px",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#EF4444",
      },
    });
  };

  // Info toast
  const showInfo = (message) => {
    toast(message, {
      duration: 4000,
      position: "top-right",
      icon: "ℹ️",
      style: {
        background: "#3B82F6",
        color: "#fff",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Kufi Arabic", sans-serif',
        direction: "rtl",
        fontSize: "14px",
      },
    });
  };

  // Warning toast
  const showWarning = (message) => {
    toast(message, {
      duration: 4000,
      position: "top-right",
      icon: "⚠️",
      style: {
        background: "#F59E0B",
        color: "#fff",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Kufi Arabic", sans-serif',
        direction: "rtl",
        fontSize: "14px",
      },
    });
  };

  // Loading toast
  const showLoading = (message) => {
    return toast.loading(message, {
      position: "top-right",
      style: {
        background: "#6B7280",
        color: "#fff",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Kufi Arabic", sans-serif',
        direction: "rtl",
        fontSize: "14px",
      },
    });
  };

  // Dismiss toast
  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  // Dismiss all toasts
  const dismissAll = () => {
    toast.dismiss();
  };

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            maxWidth: "500px",
          },
        }}
      />
    </ToastContext.Provider>
  );
};

// Hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
