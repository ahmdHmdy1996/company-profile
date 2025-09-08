import React, { createContext, useReducer, useEffect } from "react";
import AuthService from "../services/authService";

// Auth context
const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload.error,
      };
    case "LOGOUT":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    const token = AuthService.getToken();
    const storedUser = AuthService.getStoredUser();

    if (token && storedUser) {
      dispatch({
        type: "SET_USER",
        payload: { user: storedUser },
      });
    }

    // Listen for logout events
    const handleLogout = () => {
      dispatch({ type: "LOGOUT" });
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const result = await AuthService.login(credentials);
      if (result.success) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: result.user },
        });
        return result;
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: { error: error.message },
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const result = await AuthService.register(userData);
      if (result.success) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: result.user },
        });
        return result;
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: { error: error.message },
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
