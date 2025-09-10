import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import PDFManagementPage from '../pages/PDFManagementPage';
import AboutUsPage from '../pages/AboutUsPage';
import OurStaffPage from '../pages/OurStaffPage';
import KeyClientsPage from '../pages/KeyClientsPage';
import OurServicesPage from '../pages/OurServicesPage';
import OurProjectsPage from '../pages/OurProjectsPage';
import ToolsInstrumentsPage from '../pages/ToolsInstrumentsPage';
import LoginPage from '../pages/LoginPage';
import { useAuth } from '../hooks/useAuth';
import { AttachmentsProvider } from '../contexts/AttachmentsContext';
import { 
  CompanyProfileService, 
  SettingsService, 
  PageContentService, 
  StaffService, 
  ProjectService 
} from '../services';

const AppRouter = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = React.useState('home');
  const [selectedPageId, setSelectedPageId] = React.useState(null);
  const [sections, setSections] = React.useState([]);
  const [companyProfileId, setCompanyProfileId] = React.useState(null);
  
  // Settings state
  const [companyData, setCompanyData] = React.useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: ''
  });
  
  const [backgroundSettings, setBackgroundSettings] = React.useState({
    defaultBackgroundColor: '#ffffff',
    backgroundImage: null
  });
  
  const [themeSettings, setThemeSettings] = React.useState({
    selectedTheme: 'modern',
    colors: {
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#10B981',
      background: '#F8FAFC'
    }
  });

  // Load existing data on component mount
  React.useEffect(() => {
    const loadExistingData = async () => {
      if (user) {
        try {
          const profiles = await CompanyProfileService.getLastProfile();
          if (profiles && profiles.length > 0) {
            const lastProfile = profiles[0];
            setCompanyProfileId(lastProfile.id);
            const data = lastProfile.data || {};
            
            // Update company data
            if (data.companyName || data.contactInfo) {
              setCompanyData({
                name: Array.isArray(data.companyName) ? data.companyName[0] || '' : data.companyName || '',
                email: data.contactInfo?.email || '',
                phone: data.contactInfo?.phone || '',
                website: data.contactInfo?.website || '',
                address: data.contactInfo?.address || '',
                description: Array.isArray(data.companyDescription) ? data.companyDescription[0] || '' : data.companyDescription || ''
              });
            }
            
            // Update background settings
            if (data.backgroundImage || data.style?.backgroundColor) {
              setBackgroundSettings({
                defaultBackgroundColor: data.style?.backgroundColor || '#ffffff',
                backgroundImage: Array.isArray(data.backgroundImage) ? data.backgroundImage[0] || null : data.backgroundImage || null
              });
            }
            
            // Update theme settings
            if (data.themeSettings) {
              setThemeSettings(data.themeSettings);
            }
          }
        } catch (error) {
          console.error('Error loading existing data:', error);
        }
      }
    };
    
    loadExistingData();
  }, [user]);

  // Handle page selection
  const handleSelectPage = (pageId) => {
    setSelectedPageId(pageId);
  };

  // Handle page updates
  const handleUpdatePage = async (pageId, updatedData) => {
    try {
      // Update local state first for immediate UI feedback
      setSections(prevSections => 
        prevSections.map(section => ({
          ...section,
          pages: section.pages.map(page => 
            page.id === pageId ? { ...page, ...updatedData } : page
          )
        }))
      );

      // Save to backend if user is authenticated
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Get the last profile to update
        const profiles = await CompanyProfileService.getLastProfile();
        
        if (profiles && profiles.length > 0) {
          const lastProfile = profiles[0];
          
          // Update the profile data with the new page data
          const updatedProfileData = {
            ...lastProfile,
            data: {
              ...lastProfile.data,
              // Update the specific page data based on pageId
              [pageId]: updatedData
            }
          };
          
          await CompanyProfileService.updateProfile(lastProfile.id, updatedProfileData);
          console.log('تم حفظ تغييرات الصفحة بنجاح في قاعدة البيانات');
        }
      }
    } catch (error) {
      console.error('خطأ في حفظ تغييرات الصفحة:', error);
      // Optionally show error message to user
      alert('حدث خطأ أثناء حفظ التغييرات: ' + error.message);
    }
  };

  // Handle adding new section
  const handleAddSection = (newSection) => {
    setSections(prevSections => [...prevSections, newSection]);
  };

  // Handle adding new page
  const handleAddPage = (sectionId, newPage) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? { ...section, pages: [...section.pages, newPage] }
          : section
      )
    );
  };

  // Handle deleting section
  const handleDeleteSection = (sectionId) => {
    setSections(prevSections => 
      prevSections.filter(section => section.id !== sectionId)
    );
  };

  // Handle deleting page
  const handleDeletePage = (pageId) => {
    setSections(prevSections => 
      prevSections.map(section => ({
        ...section,
        pages: section.pages.filter(page => page.id !== pageId)
      }))
    );
  };

  // Handle updating company data (only changed fields)
  const handleUpdateCompanyData = async (changedCompanyData) => {
    try {
      console.log('بدء تحديث بيانات الشركة المعدلة...');
      console.log('البيانات المعدلة:', changedCompanyData);
      
      // Get the last profile to get company profile ID
      const profiles = await CompanyProfileService.getLastProfile();
      
      if (profiles && profiles.length > 0) {
        const lastProfile = profiles[0];
        
        // Use SettingsService to save company settings
        const companySettingsData = {
          company_name: changedCompanyData.name || '',
          company_email: changedCompanyData.email || '',
          company_phone: changedCompanyData.phone || '',
          company_website: changedCompanyData.website || '',
          company_address: changedCompanyData.address || '',
          company_description: changedCompanyData.description || ''
        };
        
        console.log('البيانات المرسلة لخدمة الإعدادات:', JSON.stringify(companySettingsData, null, 2));
        await SettingsService.saveCompanySettings(lastProfile.id, companySettingsData);
        
        // Update local state with merged data
        setCompanyData(prev => ({ ...prev, ...changedCompanyData }));
        console.log('تم تحديث إعدادات الشركة بنجاح');
      } else {
        // Create new profile first, then save settings
        console.log('إنشاء ملف تعريف جديد...');
        const newProfile = {
          template_id: 'default',
          name: 'ملف تعريف الشركة',
          description: 'ملف تعريف الشركة الأساسي',
          data: {}
        };
        
        const createdProfile = await CompanyProfileService.createProfile(newProfile);
        
        // Now save company settings
        const companySettingsData = {
          company_name: changedCompanyData.name || '',
          company_email: changedCompanyData.email || '',
          company_phone: changedCompanyData.phone || '',
          company_website: changedCompanyData.website || '',
          company_address: changedCompanyData.address || '',
          company_description: changedCompanyData.description || ''
        };
        
        await SettingsService.saveCompanySettings(createdProfile.id, companySettingsData);
        setCompanyData(changedCompanyData);
        console.log('تم إنشاء ملف تعريف جديد وحفظ إعدادات الشركة بنجاح');
      }
    } catch (error) {
      console.error('خطأ في تحديث بيانات الشركة:', error);
      throw error;
    }
  };

  // Handle updating background settings (only changed fields)
  const handleUpdateBackgroundSettings = async (changedBackgroundSettings) => {
    try {
      console.log('بدء تحديث إعدادات الخلفية المعدلة...');
      console.log('إعدادات الخلفية المعدلة:', changedBackgroundSettings);
      
      // Get the last profile to get company profile ID
      const profiles = await CompanyProfileService.getLastProfile();
      
      if (profiles && profiles.length > 0) {
        const lastProfile = profiles[0];
        
        // Use SettingsService to save background settings
        const backgroundSettingsData = {
          default_background_color: changedBackgroundSettings.defaultBackgroundColor || '#ffffff',
          background_image: changedBackgroundSettings.backgroundImage || null,
          background_opacity: changedBackgroundSettings.backgroundOpacity || 1.0,
          background_repeat_pattern: changedBackgroundSettings.backgroundRepeatPattern || 'no-repeat'
        };
        
        console.log('البيانات المرسلة لخدمة إعدادات الخلفية:', JSON.stringify(backgroundSettingsData, null, 2));
        await SettingsService.saveBackgroundSettings(lastProfile.id, backgroundSettingsData);
        
        // Update local state with merged data
        setBackgroundSettings(prev => ({ ...prev, ...changedBackgroundSettings }));
        console.log('تم تحديث إعدادات الخلفية بنجاح');
      } else {
        // Create new profile first, then save settings
        console.log('إنشاء ملف تعريف جديد...');
        const newProfile = {
          template_id: 'default',
          name: 'ملف تعريف الشركة',
          description: 'ملف تعريف الشركة الأساسي',
          data: {}
        };
        
        const createdProfile = await CompanyProfileService.createProfile(newProfile);
        
        // Now save background settings
        const backgroundSettingsData = {
          default_background_color: changedBackgroundSettings.defaultBackgroundColor || '#ffffff',
          background_image: changedBackgroundSettings.backgroundImage || null,
          background_opacity: changedBackgroundSettings.backgroundOpacity || 1.0,
          background_repeat_pattern: changedBackgroundSettings.backgroundRepeatPattern || 'no-repeat'
        };
        
        await SettingsService.saveBackgroundSettings(createdProfile.id, backgroundSettingsData);
        setBackgroundSettings(changedBackgroundSettings);
        console.log('تم إنشاء ملف تعريف جديد وحفظ إعدادات الخلفية بنجاح');
      }
    } catch (error) {
      console.error('خطأ في تحديث إعدادات الخلفية:', error);
      throw error;
    }
  };

  // Handle updating theme settings (only changed fields)
  const handleUpdateThemeSettings = async (changedThemeSettings) => {
    try {
      console.log('بدء تحديث إعدادات الثيم المعدلة...');
      console.log('إعدادات الثيم المعدلة:', changedThemeSettings);
      
      // Get the last profile to get company profile ID
      const profiles = await CompanyProfileService.getLastProfile();
      
      if (profiles && profiles.length > 0) {
        const lastProfile = profiles[0];
        
        // Use SettingsService to save theme settings
        const themeSettingsData = {
          selected_theme: changedThemeSettings.selectedTheme || 'modern',
          primary_color: changedThemeSettings.colors?.primary || '#3B82F6',
          secondary_color: changedThemeSettings.colors?.secondary || '#64748B',
          accent_color: changedThemeSettings.colors?.accent || '#10B981',
          background_color: changedThemeSettings.colors?.background || '#F8FAFC'
        };
        
        console.log('البيانات المرسلة لخدمة إعدادات الثيم:', JSON.stringify(themeSettingsData, null, 2));
        await SettingsService.saveThemeSettings(lastProfile.id, themeSettingsData);
        
        // Update local state with merged data
        setThemeSettings(prev => ({ ...prev, ...changedThemeSettings }));
        console.log('تم تحديث إعدادات الثيم بنجاح');
      } else {
        // Create new profile first, then save settings
        console.log('إنشاء ملف تعريف جديد...');
        const newProfile = {
          template_id: 'default',
          name: 'ملف تعريف الشركة',
          description: 'ملف تعريف الشركة الأساسي',
          data: {}
        };
        
        const createdProfile = await CompanyProfileService.createProfile(newProfile);
        
        // Now save theme settings
        const themeSettingsData = {
          selected_theme: changedThemeSettings.selectedTheme || 'modern',
          primary_color: changedThemeSettings.colors?.primary || '#3B82F6',
          secondary_color: changedThemeSettings.colors?.secondary || '#64748B',
          accent_color: changedThemeSettings.colors?.accent || '#10B981',
          background_color: changedThemeSettings.colors?.background || '#F8FAFC'
        };
        
        await SettingsService.saveThemeSettings(createdProfile.id, themeSettingsData);
        setThemeSettings(changedThemeSettings);
        console.log('تم إنشاء ملف تعريف جديد وحفظ إعدادات الثيم بنجاح');
      }
    } catch (error) {
      console.error('خطأ في تحديث إعدادات الثيم:', error);
      throw error;
    }
  };

  // Handle global settings updates
  const handleUpdateGlobalSettings = async (changedGlobalSettings) => {
    try {
      // Get the last profile to get company profile ID
      const profiles = await CompanyProfileService.getLastProfile();
      
      if (profiles && profiles.length > 0) {
        const lastProfile = profiles[0];
        
        // Use SettingsService to save global settings
        const globalSettingsData = {
          header_logo: changedGlobalSettings.header?.logo || null,
          show_logo: changedGlobalSettings.header?.showLogo || true,
          show_email: changedGlobalSettings.footer?.showEmail || true,
          show_phone: changedGlobalSettings.footer?.showPhone || true,
          show_page_number: changedGlobalSettings.footer?.showPageNumber || true,
          email: changedGlobalSettings.footer?.email || '',
          phone: changedGlobalSettings.footer?.phone || ''
        };
        
        console.log('البيانات المرسلة لخدمة الإعدادات العامة:', JSON.stringify(globalSettingsData, null, 2));
        await SettingsService.saveGlobalSettings(lastProfile.id, globalSettingsData);
        setGlobalSettings(changedGlobalSettings);
        console.log('تم تحديث الإعدادات العامة بنجاح');
      } else {
        // Create new profile first, then save settings
        const newProfile = {
          name: 'ملف تعريف الشركة',
          description: 'ملف تعريف الشركة الأساسي',
          data: {}
        };
        
        const createdProfile = await CompanyProfileService.createProfile(newProfile);
        
        // Now save global settings
        const globalSettingsData = {
          header_logo: changedGlobalSettings.header?.logo || null,
          show_logo: changedGlobalSettings.header?.showLogo || true,
          show_email: changedGlobalSettings.footer?.showEmail || true,
          show_phone: changedGlobalSettings.footer?.showPhone || true,
          show_page_number: changedGlobalSettings.footer?.showPageNumber || true,
          email: changedGlobalSettings.footer?.email || '',
          phone: changedGlobalSettings.footer?.phone || ''
        };
        
        await SettingsService.saveGlobalSettings(createdProfile.id, globalSettingsData);
        setGlobalSettings(changedGlobalSettings);
        console.log('تم إنشاء ملف تعريف جديد وحفظ الإعدادات العامة بنجاح');
      }
    } catch (error) {
      console.error('خطأ في تحديث الإعدادات العامة:', error);
      throw error;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route path="/*" element={
          user ? (
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pdf-management" element={<PDFManagementPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/our-staff" element={<OurStaffPage />} />
              <Route path="/key-clients" element={<KeyClientsPage />} />
              <Route path="/our-services" element={<OurServicesPage />} />
              <Route path="/our-projects" element={<OurProjectsPage />} />
              <Route path="/tools-instruments" element={<ToolsInstrumentsPage />} />
            </Routes>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;