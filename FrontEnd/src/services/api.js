const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token') || null;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  getFormHeaders() {
    const headers = {
      'Accept': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // PDF Management
  async createPDF(pdfData) {
    // Check if pdfData is FormData
    if (pdfData instanceof FormData) {
      return this.request('/pdfs', {
        method: 'POST',
        headers: this.getFormHeaders(),
        body: pdfData,
      });
    } else {
      return this.request('/pdfs', {
        method: 'POST',
        body: JSON.stringify(pdfData),
      });
    }
  }

  async getPDFs() {
    return this.request('/pdfs');
  }

  async getPDF(id) {
    return this.request(`/pdfs/${id}`);
  }

  async updatePDF(id, pdfData) {
    return this.request(`/pdfs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pdfData),
    });
  }

  async deletePDF(id) {
    return this.request(`/pdfs/${id}`, {
      method: 'DELETE',
    });
  }

  // Generate PDF for viewing
  async generatePDFView(id) {
    return this.request(`/pdfs/${id}/generate`, {
      method: 'POST',
    });
  }

  // Download PDF
  async downloadPDFFile(id) {
    return this.request(`/pdfs/${id}/download`, {
      method: 'GET',
    });
  }

  // Page Management
  async createPage(pageData) {
    return this.request('/pages', {
      method: 'POST',
      body: JSON.stringify(pageData),
    });
  }

  async getPages(pdfId = null) {
    const endpoint = pdfId ? `/pages?pdf_id=${pdfId}` : '/pages';
    return this.request(endpoint);
  }

  async getPage(id) {
    return this.request(`/pages/${id}`);
  }

  async updatePage(id, pageData) {
    return this.request(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pageData),
    });
  }

  async deletePage(id) {
    return this.request(`/pages/${id}`, {
      method: 'DELETE',
    });
  }

  // Section Management
  async createSection(sectionData) {
    return this.request('/sections', {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  }

  async getSections(pageId = null) {
    const endpoint = pageId ? `/sections?page_id=${pageId}` : '/sections';
    return this.request(endpoint);
  }

  async getSection(id) {
    return this.request(`/sections/${id}`);
  }

  async updateSection(id, sectionData) {
    return this.request(`/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    });
  }

  async deleteSection(id) {
    return this.request(`/sections/${id}`, {
      method: 'DELETE',
    });
  }

  async updateSectionOrder(pageId, sectionsOrder) {
    return this.request(`/pages/${pageId}/sections/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ sections: sectionsOrder }),
    });
  }

  // Module-specific endpoints
  async getModuleData(moduleType, pageId = null) {
    const endpoint = pageId 
      ? `/modules/${moduleType}?page_id=${pageId}` 
      : `/modules/${moduleType}`;
    return this.request(endpoint);
  }

  async saveModuleData(moduleType, data) {
    return this.request(`/modules/${moduleType}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // File Upload
  async uploadFile(file, type = 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/upload', {
      method: 'POST',
      headers: this.getFormHeaders(), // Use form headers for file upload
      body: formData,
    });
  }

  // Design Templates
  async getHeaderDesigns() {
    return this.request('/designs/headers');
  }

  async getFooterDesigns() {
    return this.request('/designs/footers');
  }

  async getSectionDesigns(moduleType = null) {
    const endpoint = moduleType 
      ? `/designs/sections?module=${moduleType}` 
      : '/designs/sections';
    return this.request(endpoint);
  }

  // PDF Generation
  async generatePDF(pdfId) {
    return this.request(`/pdfs/${pdfId}/generate`, {
      method: 'POST',
    });
  }

  async downloadPDF(pdfId) {
    const url = `${this.baseURL}/pdfs/${pdfId}/download`;
    window.open(url, '_blank');
  }

  // Statistics and Analytics
  async getStatistics() {
    return this.request('/statistics');
  }

  async getModuleStatistics(moduleType) {
    return this.request(`/statistics/modules/${moduleType}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
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
} = apiService;