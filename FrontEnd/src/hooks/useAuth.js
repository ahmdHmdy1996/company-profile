import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("auth_token");
    apiService.setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      apiService.setToken(token);
      const response = await apiService.getCurrentUser();

      if (response.success && response.data) {
        setIsAuthenticated(true);
        setUser(response.data);
      } else {
        // Invalid token
        clearAuthData();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  }, [clearAuthData]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);

      if (response.success && response.data && response.data.token) {
        apiService.setToken(response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: "فشل في تسجيل الدخول" };
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول";

      if (error.status === 401) {
        errorMessage = "بيانات تسجيل الدخول غير صحيحة";
      } else if (error.isNetworkError) {
        errorMessage = "خطأ في الشبكة. تحقق من اتصال الإنترنت";
      } else if (error.status >= 500) {
        errorMessage = "خطأ في الخادم. حاول مرة أخرى لاحقاً";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      if (isAuthenticated) {
        await apiService.logout();
      }
    } catch (error) {
      console.warn("Backend logout failed:", error);
    } finally {
      clearAuthData();
    }
  };

  return {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    checkAuthStatus,
  };
};
