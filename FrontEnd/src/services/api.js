import axios from "axios";

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV
  ? "/api" // This will be proxied to the backend by Vite
  : "https://backend-company-profile.codgoo.com/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("auth_token") || null;
    this.onUnauthorized = null; // Callback for 401 errors
    this.toastCallbacks = null; // Toast callbacks for showing messages

    // Create axios instance
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds timeout
      withCredentials: false, // Don't send cookies with requests
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Always ensure Accept header is set
        config.headers.Accept = "application/json";

        // For FormData requests, remove Content-Type to let browser set it with boundary
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        } else {
          // For non-FormData requests, ensure Content-Type is application/json
          config.headers["Content-Type"] = "application/json";
        }

        // Debug: Log the final request headers
        console.log("Request URL:", config.url);
        console.log("Request Headers:", config.headers);
        console.log("Full config:", config);

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response.data; // Return only the data part
      },
      (error) => {
        // Enhanced error logging
        console.error("API request failed:", error);
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          url: error.config?.url,
          method: error.config?.method,
          requestHeaders: error.config?.headers,
        });

        // Handle 401 unauthorized errors
        if (error.response?.status === 401 && this.onUnauthorized) {
          this.onUnauthorized();
        }

        // Create a more user-friendly error message
        let errorMessage = "حدث خطأ غير متوقع";

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.statusText) {
          errorMessage = error.response.statusText;
        } else if (error.message) {
          if (
            error.code === "ECONNABORTED" ||
            error.message.includes("timeout")
          ) {
            errorMessage = "انتهت مهلة الاتصال - تحقق من اتصال الإنترنت";
          } else if (error.message === "Network Error") {
            errorMessage = "خطأ في الشبكة - تحقق من اتصال الإنترنت";
          } else {
            errorMessage = error.message;
          }
        }

        const customError = new Error(errorMessage);
        customError.status = error.response?.status;
        customError.isNetworkError = !error.response;

        return Promise.reject(customError);
      }
    );
  }

  setToastCallbacks(callbacks) {
    this.toastCallbacks = callbacks;
  }

  setUnauthorizedHandler(callback) {
    this.onUnauthorized = callback;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("auth_token", token);
      // Update the default auth header
      this.axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("auth_token");
      // Remove the auth header
      delete this.axiosInstance.defaults.headers.common["Authorization"];
    }
  }

  // PDF Management
  async createPDF(pdfData) {
    try {
      let response;

      if (pdfData instanceof FormData) {
        // For FormData, axios will automatically set the correct Content-Type
        response = await this.axiosInstance.post("/pdfs", pdfData);
      } else {
        // For regular objects, send as JSON
        response = await this.axiosInstance.post("/pdfs", pdfData);
      }

      // Show success toast if available
      if (this.toastCallbacks?.showSuccess) {
        this.toastCallbacks.showSuccess("تم إنشاء ملف PDF بنجاح");
      }

      return response;
    } catch (error) {
      // Show error toast if available
      if (this.toastCallbacks?.showError) {
        this.toastCallbacks.showError(
          error.message || "حدث خطأ أثناء إنشاء ملف PDF"
        );
      }
      throw error;
    }
  }

  async getPDFs() {
    try {
      // Debug: Log the current token and headers
      console.log("Current token:", this.token);
      console.log(
        "Auth header:",
        this.token ? `Bearer ${this.token}` : "No token"
      );

      const response = await this.axiosInstance.get("/pdfs");

      // Show success toast if available
      if (this.toastCallbacks?.showSuccess) {
        this.toastCallbacks.showSuccess("تم تحميل ملفات PDF بنجاح");
      }

      return response;
    } catch (error) {
      // Enhanced error logging
      console.error("getPDFs Error Details:", {
        status: error.status,
        message: error.message,
        response: error.response?.data,
        headers: error.response?.headers,
        token: this.token ? "Token exists" : "No token",
      });

      // Show error toast if available
      if (this.toastCallbacks?.showError) {
        this.toastCallbacks.showError(
          error.message || "حدث خطأ أثناء تحميل ملفات PDF"
        );
      }
      throw error;
    }
  }

  async getPDF(id) {
    return await this.axiosInstance.get(`/pdfs/${id}`);
  }

  async updatePDF(id, pdfData) {
    return await this.axiosInstance.put(`/pdfs/${id}`, pdfData);
  }

  async deletePDF(id) {
    try {
      const response = await this.axiosInstance.delete(`/pdfs/${id}`);

      // Show success toast if available
      if (this.toastCallbacks?.showSuccess) {
        this.toastCallbacks.showSuccess("تم حذف ملف PDF بنجاح");
      }

      return response;
    } catch (error) {
      // Show error toast if available
      if (this.toastCallbacks?.showError) {
        this.toastCallbacks.showError(
          error.message || "حدث خطأ أثناء حذف ملف PDF"
        );
      }
      throw error;
    }
  }

  // Generate PDF for viewing
  async generatePDFView(id) {
    return await this.axiosInstance.post(`/pdfs/${id}/generate`);
  }

  // Download PDF
  async downloadPDFFile(id) {
    return await this.axiosInstance.get(`/pdfs/${id}/download`);
  }

  // Page Management
  async createPage(pageData) {
    return await this.axiosInstance.post("/pages", pageData);
  }

  async getPages(pdfId = null) {
    const endpoint = pdfId ? `/pages?pdf_id=${pdfId}` : "/pages";
    return await this.axiosInstance.get(endpoint);
  }

  async getPage(id) {
    return await this.axiosInstance.get(`/pages/${id}`);
  }

  async updatePage(id, pageData) {
    return await this.axiosInstance.put(`/pages/${id}`, pageData);
  }

  async deletePage(id) {
    return await this.axiosInstance.delete(`/pages/${id}`);
  }

  // Section Management
  async createSection(sectionData) {
    return await this.axiosInstance.post("/sections", sectionData);
  }

  async getSections(pageId = null) {
    const endpoint = pageId ? `/sections?page_id=${pageId}` : "/sections";
    return await this.axiosInstance.get(endpoint);
  }

  async getSection(id) {
    return await this.axiosInstance.get(`/sections/${id}`);
  }

  async updateSection(id, sectionData) {
    return await this.axiosInstance.put(`/sections/${id}`, sectionData);
  }

  async deleteSection(id) {
    return await this.axiosInstance.delete(`/sections/${id}`);
  }

  async updateSectionOrder(pageId, sectionsOrder) {
    return await this.axiosInstance.put(`/pages/${pageId}/sections/reorder`, {
      sections: sectionsOrder,
    });
  }

  // Module-specific endpoints
  async getModuleData(moduleType, pageId = null) {
    const endpoint = pageId
      ? `/modules/${moduleType}?page_id=${pageId}`
      : `/modules/${moduleType}`;
    return await this.axiosInstance.get(endpoint);
  }

  async saveModuleData(moduleType, data) {
    return await this.axiosInstance.post(`/modules/${moduleType}`, data);
  }

  // File Upload
  async uploadFile(file, type = "image") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    return await this.axiosInstance.post("/upload", formData);
  }

  // Design Templates
  async getHeaderDesigns() {
    return await this.axiosInstance.get("/designs/headers");
  }

  async getFooterDesigns() {
    return await this.axiosInstance.get("/designs/footers");
  }

  async getSectionDesigns(moduleType = null) {
    const endpoint = moduleType
      ? `/designs/sections?module=${moduleType}`
      : "/designs/sections";
    return await this.axiosInstance.get(endpoint);
  }

  // PDF Generation
  async generatePDF(pdfId) {
    return await this.axiosInstance.post(`/pdfs/${pdfId}/generate`);
  }

  async downloadPDF(pdfId) {
    const url = `${this.baseURL}/pdfs/${pdfId}/download`;
    window.open(url, "_blank");
  }

  // Statistics and Analytics
  async getStatistics() {
    return await this.axiosInstance.get("/statistics");
  }

  async getModuleStatistics(moduleType) {
    return await this.axiosInstance.get(`/statistics/modules/${moduleType}`);
  }

  // Settings Management
  async getSettings() {
    return await this.axiosInstance.get("/settings");
  }

  async createSetting(settingData) {
    return await this.axiosInstance.post("/settings", settingData);
  }

  async getSetting(id) {
    return await this.axiosInstance.get(`/settings/${id}`);
  }

  async updateSetting(id, settingData) {
    return await this.axiosInstance.put(`/settings/${id}`, settingData);
  }

  async deleteSetting(id) {
    return await this.axiosInstance.delete(`/settings/${id}`);
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await this.axiosInstance.post("/login", credentials);

      // Set the token if login is successful
      if (response.data && response.data.token) {
        this.setToken(response.data.token);
      }

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  // Quick test login with demo credentials
  async testLogin() {
    const credentials = {
      email: "admin@company.com",
      password: "password123",
    };

    try {
      const response = await this.login(credentials);
      console.log("Test login successful:", response);
      return response;
    } catch (error) {
      console.error("Test login failed:", error);
      throw error;
    }
  }

  async register(userData) {
    return await this.axiosInstance.post("/register", userData);
  }

  async logout() {
    return await this.axiosInstance.post("/logout");
  }

  async getCurrentUser() {
    return await this.axiosInstance.get("/user");
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

// Make it available globally for debugging
if (typeof window !== "undefined") {
  window.apiService = apiService;
}

export { apiService };
export default apiService;

// Export individual methods for convenience
export const {
  createPDF,
  getPDFs,
  getPDF,
  updatePDF,
  deletePDF,
  createPage,
  getPages,
  getPage,
  updatePage,
  deletePage,
  createSection,
  getSections,
  getSection,
  updateSection,
  deleteSection,
  updateSectionOrder,
  getModuleData,
  saveModuleData,
  uploadFile,
  getHeaderDesigns,
  getFooterDesigns,
  getSectionDesigns,
  generatePDF,
  downloadPDF,
  getStatistics,
  getModuleStatistics,
  getSettings,
  createSetting,
  getSetting,
  updateSetting,
  deleteSetting,
  login,
  register,
  logout,
  getCurrentUser,
} = apiService;
