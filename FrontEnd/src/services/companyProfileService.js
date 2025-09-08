import apiClient from "./apiClient";

class CompanyProfileService {
  // Create a new company profile
  static async createProfile(profileData) {
    try {
      const response = await apiClient.post("/company-profiles", profileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create profile"
      );
    }
  }

  // Get the last updated company profile
  static async getLastProfile() {
    try {
      const response = await apiClient.get("/company-profiles");
      console.log(response.data.data);
      
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch last profile"
      );
    }
  }

  // Get a specific company profile
  static async getProfile(id) {
    try {
      const response = await apiClient.get(`/company-profiles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch profile"
      );
    }
  }

  // Update a company profile
  static async updateProfile(id, profileData) {
    try {
      const response = await apiClient.put(
        `/company-profiles/${id}`,
        profileData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    }
  }

  // Delete a company profile
  static async deleteProfile(id) {
    try {
      const response = await apiClient.delete(`/company-profiles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete profile"
      );
    }
  }

  // Upload image
  static async uploadImage(file, type = "logo") {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      const response = await apiClient.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload image"
      );
    }
  }
}

export default CompanyProfileService;
