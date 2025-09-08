import apiClient from "./apiClient";

class AuthService {
  // Register a new user
  static async register(userData) {
    try {
      const response = await apiClient.post("/register", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.passwordConfirmation,
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }

  // Login user
  static async login(credentials) {
    try {
      const response = await apiClient.post("/login", credentials);

      if (response.data.success && response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }

  // Logout user
  static async logout() {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const response = await apiClient.get("/user");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || error.message || "Failed to get user"
      );
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!localStorage.getItem("auth_token");
  }

  // Get stored user data
  static getStoredUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  // Get auth token
  static getToken() {
    return localStorage.getItem("auth_token");
  }
}

export default AuthService;
