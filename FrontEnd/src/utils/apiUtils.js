// Utility functions for handling API responses and errors

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 401:
        return "Authentication required. Please log in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 422:
        // Validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          return errorMessages.join(", ");
        }
        return data.message || "Validation failed.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return data.message || `Error: ${status}`;
    }
  } else if (error.request) {
    // Network error
    return "Network error. Please check your connection and try again.";
  } else {
    // Other error
    return error.message || "An unexpected error occurred.";
  }
};

export const handleApiResponse = (response) => {
  if (response.data && response.data.success) {
    return response.data;
  }
  throw new Error(response.data?.message || "API request failed");
};

export const showNotification = (message, type = "info") => {
  // Simple notification system
  // In a real app, you might use a toast library like react-hot-toast
  console.log(`[${type.toUpperCase()}] ${message}`);

  // For now, use browser alert for success/error messages
  if (type === "error") {
    alert(`Error: ${message}`);
  } else if (type === "success") {
    alert(`Success: ${message}`);
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const validateImageFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please select a valid image file (JPEG, PNG, GIF)");
  }

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${formatFileSize(maxSize)}`);
  }

  return true;
};

export default {
  handleApiError,
  handleApiResponse,
  showNotification,
  validateEmail,
  validatePassword,
  formatFileSize,
  validateImageFile,
};
