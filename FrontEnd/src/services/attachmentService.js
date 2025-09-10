import apiClient from './apiClient';

class AttachmentService {
  // Get all attachments
  static async getAttachments(params = {}) {
    try {
      const response = await apiClient.get('/attachments', { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch attachments'
      );
    }
  }

  // Upload attachment
  static async uploadAttachment(file, description = '', companyProfileId = null, order = 0) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (description) formData.append('description', description);
      if (companyProfileId) formData.append('company_profile_id', companyProfileId);
      formData.append('order', order);

      const response = await apiClient.post('/attachments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to upload attachment'
      );
    }
  }

  // Get specific attachment
  static async getAttachment(id) {
    try {
      const response = await apiClient.get(`/attachments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch attachment'
      );
    }
  }

  // Update attachment
  static async updateAttachment(id, data) {
    try {
      const response = await apiClient.put(`/attachments/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update attachment'
      );
    }
  }

  // Delete attachment
  static async deleteAttachment(id) {
    try {
      const response = await apiClient.delete(`/attachments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete attachment'
      );
    }
  }

  // Download attachment
  static async downloadAttachment(id) {
    try {
      const response = await apiClient.get(`/attachments/${id}/download`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to download attachment'
      );
    }
  }

  // Reorder attachments
  static async reorderAttachments(attachments) {
    try {
      const response = await apiClient.post('/attachments/reorder', {
        attachments: attachments.map((attachment, index) => ({
          id: attachment.id,
          order: index
        }))
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to reorder attachments'
      );
    }
  }
}

export default AttachmentService;