// Import all services
import AuthService from './authService';
import CompanyProfileService from './companyProfileService';
import AttachmentService from './attachmentService';
import SettingsService from './settingsService';
import PageContentService from './pageContentService';
import StaffService from './staffService';
import ProjectService from './projectService';

// Export all services
export {
  AuthService,
  CompanyProfileService,
  AttachmentService,
  SettingsService,
  PageContentService,
  StaffService,
  ProjectService
};

// Re-export for backward compatibility
export {
  AuthService as authService,
  CompanyProfileService as companyProfileService,
  AttachmentService as attachmentService,
  SettingsService as settingsService,
  PageContentService as pageContentService,
  StaffService as staffService,
  ProjectService as projectService
};

// Default export for convenience
export default {
  AuthService,
  CompanyProfileService,
  AttachmentService,
  SettingsService,
  PageContentService,
  StaffService,
  ProjectService
};