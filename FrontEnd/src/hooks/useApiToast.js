import { useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import { apiService } from "../services/api";

export const useApiToast = () => {
  const toast = useToast();

  useEffect(() => {
    // Set toast callbacks in the API service
    apiService.setToastCallbacks({
      showSuccess: toast.showSuccess,
      showError: toast.showError,
      showInfo: toast.showInfo,
      showWarning: toast.showWarning,
      showLoading: toast.showLoading,
      dismiss: toast.dismiss,
      dismissAll: toast.dismissAll,
    });

    // Cleanup function to remove callbacks when component unmounts
    return () => {
      apiService.setToastCallbacks(null);
    };
  }, [toast]);

  return toast;
};
