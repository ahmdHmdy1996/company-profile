import apiClient from './apiClient';

class SettingsService {
  // Company Settings
  static async getCompanySettings(companyProfileId) {
    try {
      const response = await apiClient.get(`/company-profiles/${companyProfileId}/company-settings`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch company settings'
      );
    }
  }

  static async saveCompanySettings(companyProfileId, settingsData) {
    try {
      const response = await apiClient.post(`/company-profiles/${companyProfileId}/company-settings`, settingsData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to save company settings'
      );
    }
  }

  // Background Settings
  static async getBackgroundSettings(companyProfileId) {
    try {
      const response = await apiClient.get(`/company-profiles/${companyProfileId}/background-settings`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch background settings'
      );
    }
  }

  static async saveBackgroundSettings(companyProfileId, settingsData) {
    try {
      const response = await apiClient.post(`/company-profiles/${companyProfileId}/background-settings`, settingsData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to save background settings'
      );
    }
  }

  // Theme Settings
  static async getThemeSettings(companyProfileId) {
    try {
      const response = await apiClient.get(`/company-profiles/${companyProfileId}/theme-settings`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch theme settings'
      );
    }
  }

  static async saveThemeSettings(companyProfileId, settingsData) {
    try {
      const response = await apiClient.post(`/company-profiles/${companyProfileId}/theme-settings`, settingsData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to save theme settings'
      );
    }
  }

  // Global Settings
  static async getGlobalSettings(companyProfileId) {
    try {
      const response = await apiClient.get(`/company-profiles/${companyProfileId}/global-settings`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch global settings'
      );
    }
  }

  static async saveGlobalSettings(companyProfileId, settingsData) {
    try {
      const response = await apiClient.post(`/company-profiles/${companyProfileId}/global-settings`, settingsData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to save global settings'
      );
    }
  }
}

export default SettingsService;