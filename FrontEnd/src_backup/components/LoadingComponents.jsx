import React from "react";
import { AlertCircle, Loader } from "lucide-react";

// Loading spinner component
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader className={`animate-spin ${sizeClasses[size]}`} />
    </div>
  );
};

// Error message component
export const ErrorMessage = ({ message, onRetry, className = "" }) => {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 mb-3">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

// Full page loading component
export const PageLoading = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// API status indicators
export const ApiStatus = ({ loading, error, onRetry, children }) => {
  if (loading) {
    return <LoadingSpinner className="my-4" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} className="my-4" />;
  }

  return children;
};

export default {
  LoadingSpinner,
  ErrorMessage,
  PageLoading,
  ApiStatus,
};
