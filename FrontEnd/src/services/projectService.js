import apiClient from './apiClient';

class ProjectService {
  // Get all projects
  static async getAllProjects(companyProfileId) {
    try {
      const response = await apiClient.get(`/company-profiles/${companyProfileId}/projects`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch projects'
      );
    }
  }

  // Get project by ID
  static async getProject(companyProfileId, projectId) {
    try {
      const response = await apiClient.get(`/company-profiles/${companyProfileId}/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch project'
      );
    }
  }

  // Create project
  static async createProject(companyProfileId, projectData) {
    try {
      const response = await apiClient.post(`/company-profiles/${companyProfileId}/projects`, projectData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create project'
      );
    }
  }

  // Update project
  static async updateProject(companyProfileId, projectId, projectData) {
    try {
      const response = await apiClient.put(`/company-profiles/${companyProfileId}/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update project'
      );
    }
  }

  // Delete project
  static async deleteProject(companyProfileId, projectId) {
    try {
      const response = await apiClient.delete(`/company-profiles/${companyProfileId}/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete project'
      );
    }
  }
}

export default ProjectService;