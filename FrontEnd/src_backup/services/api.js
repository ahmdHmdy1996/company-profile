// API service for company profile backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

class CompanyProfileAPI {
  // Get authentication token from localStorage
  static getToken() {
    return localStorage.getItem("auth_token");
  }

  // Set authentication token in localStorage
  static setToken(token) {
    localStorage.setItem("auth_token", token);
  }

  // Remove authentication token
  static removeToken() {
    localStorage.removeItem("auth_token");
  }

  // Get headers with authentication
  static getHeaders(includeAuth = true) {
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Authentication methods
  static async register(name, email, password, passwordConfirmation) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    if (data.success && data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  static async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.success && data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  static async logout() {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    this.removeToken();
    
    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return response.json();
  }

  static async getUser() {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to get user");
    }

    return response.json();
  }

  // Image upload
  static async uploadImage(file, type = "logo") {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    const token = this.getToken();
    const headers = {};
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload-image`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    return response.json();
  }

  // Profile management
  static async saveProfile(templateId, data, name = null, description = null) {
    const response = await fetch(`${API_BASE_URL}/company-profiles`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        template_id: templateId,
        data: data,
        name: name,
        description: description,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save profile");
    }

    return response.json();
  }

  static async getLastProfile() {
    const response = await fetch(`${API_BASE_URL}/company-profiles`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch last profile");
    }

    return response.json();
  }

  static async getProfile(id) {
    const response = await fetch(`${API_BASE_URL}/company-profiles/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  }

  static async updateProfile(id, templateId, data, name = null, description = null) {
    const response = await fetch(`${API_BASE_URL}/company-profiles/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({
        template_id: templateId,
        data: data,
        name: name,
        description: description,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return response.json();
  }

  static async deleteProfile(id) {
    const response = await fetch(`${API_BASE_URL}/company-profiles/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete profile");
    }

    return response.json();
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!this.getToken();
  }
}

export { CompanyProfileAPI };