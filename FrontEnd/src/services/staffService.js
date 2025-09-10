import apiClient from './apiClient';

class StaffService {
  // Get all staff members
  static async getAllStaffMembers(companyProfileId) {
    try {
      const response = await apiClient.get(`/company-profiles/${companyProfileId}/staff-members`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch staff members'
      );
    }
  }

  // Get staff member by ID
  static async getStaffMember(companyProfileId, staffMemberId) {
    try {
      const response = await apiClient.get(`/company-profiles/${companyProfileId}/staff-members/${staffMemberId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch staff member'
      );
    }
  }

  // Create staff member
  static async createStaffMember(companyProfileId, staffData) {
    try {
      const response = await apiClient.post(`/company-profiles/${companyProfileId}/staff-members`, staffData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create staff member'
      );
    }
  }

  // Update staff member
  static async updateStaffMember(companyProfileId, staffMemberId, staffData) {
    try {
      const response = await apiClient.put(`/company-profiles/${companyProfileId}/staff-members/${staffMemberId}`, staffData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update staff member'
      );
    }
  }

  // Delete staff member
  static async deleteStaffMember(companyProfileId, staffMemberId) {
    try {
      const response = await apiClient.delete(`/company-profiles/${companyProfileId}/staff-members/${staffMemberId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete staff member'
      );
    }
  }
}

export default StaffService;