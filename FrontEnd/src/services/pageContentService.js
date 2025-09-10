import apiClient from './apiClient';

class PageContentService {
  // Get all page contents
  static async getAllPageContents(companyProfileId) {
    try {
      const response = await apiClient.get(`/company-profiles/${companyProfileId}/page-contents`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch page contents'
      );
    }
  }

  // Get page content by ID
  static async getPageContent(companyProfileId, pageContentId) {
    try {
      const response = await apiClient.get(`/company-profiles/${companyProfileId}/page-contents/${pageContentId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch page content'
      );
    }
  }

  // Create page content
  static async createPageContent(companyProfileId, contentData) {
    try {
      const response = await apiClient.post(`/company-profiles/${companyProfileId}/page-contents`, contentData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create page content'
      );
    }
  }

  // Update page content
  static async updatePageContent(companyProfileId, pageContentId, contentData) {
    try {
      const response = await apiClient.put(`/company-profiles/${companyProfileId}/page-contents/${pageContentId}`, contentData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update page content'
      );
    }
  }

  // Delete page content
  static async deletePageContent(companyProfileId, pageContentId) {
    try {
      const response = await apiClient.delete(`/company-profiles/${companyProfileId}/page-contents/${pageContentId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete page content'
      );
    }
  }
}

export default PageContentService;