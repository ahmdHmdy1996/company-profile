import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ContentManagementPage from '../pages/ContentManagementPage';
import GeneralSettingsPage from '../pages/GeneralSettingsPage';
import AttachmentsSectionPage from '../pages/AttachmentsSectionPage';
import MainSidebar from './MainSidebar';
import LoginPage from '../pages/LoginPage';
import { useAuth } from '../hooks/useAuth';
import CompanyProfileService from '../services/companyProfileService';

const AppRouter = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = React.useState('home');
  const [selectedPageId, setSelectedPageId] = React.useState(null);
  const [sections, setSections] = React.useState([]);
  
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
      
      // Get the last profile to update
      const profiles = await CompanyProfileService.getLastProfile();
      
      if (profiles && profiles.length > 0) {
        // Update existing profile with only changed data
        const lastProfile = profiles[0];
        
        // Merge changed data with existing data
        const updatedData = {
          ...lastProfile,
          data: {
            ...lastProfile.data
          }
        };
        
        // Update only the changed fields
        if (changedCompanyData.name !== undefined) {
          updatedData.data.companyName = Array.isArray(changedCompanyData.name) ? changedCompanyData.name : [changedCompanyData.name];
        }
        if (changedCompanyData.description !== undefined) {
          updatedData.data.companyDescription = Array.isArray(changedCompanyData.description) ? changedCompanyData.description : [changedCompanyData.description];
        }
        if (changedCompanyData.email !== undefined) {
          updatedData.data.contactInfo = {
            ...updatedData.data.contactInfo,
            email: changedCompanyData.email
          };
        }
        if (changedCompanyData.phone !== undefined) {
          updatedData.data.contactInfo = {
            ...updatedData.data.contactInfo,
            phone: changedCompanyData.phone
          };
        }
        if (changedCompanyData.address !== undefined) {
          updatedData.data.contactInfo = {
            ...updatedData.data.contactInfo,
            address: changedCompanyData.address
          };
        }
        if (changedCompanyData.website !== undefined) {
          updatedData.data.contactInfo = {
            ...updatedData.data.contactInfo,
            website: changedCompanyData.website
          };
        }
        
        console.log('تحديث ملف تعريف موجود بالبيانات المعدلة فقط...');
        console.log('البيانات المرسلة للخادم:', JSON.stringify(updatedData, null, 2));
        await CompanyProfileService.updateProfile(lastProfile.id, updatedData);
        
        // Update local state with merged data
        setCompanyData(prev => ({ ...prev, ...changedCompanyData }));
        console.log('تم تحديث بيانات الشركة بنجاح');
      } else {
        // Create new profile with changed data
        console.log('إنشاء ملف تعريف جديد...');
        const newProfile = {
          template_id: 'default',
          name: 'ملف تعريف الشركة',
          description: 'ملف تعريف الشركة الأساسي',
          data: {
            companyName: [changedCompanyData.name || ''],
            companyDescription: [changedCompanyData.description || ''],
            contactInfo: {
              email: changedCompanyData.email || '',
              phone: changedCompanyData.phone || '',
              address: changedCompanyData.address || '',
              website: changedCompanyData.website || ''
            }
          }
        };
        
        console.log('البيانات المرسلة للخادم (ملف جديد):', JSON.stringify(newProfile, null, 2));
        await CompanyProfileService.createProfile(newProfile);
        setCompanyData(changedCompanyData);
        console.log('تم إنشاء ملف تعريف جديد بنجاح');
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
      
      // Get the last profile to update
      const profiles = await CompanyProfileService.getLastProfile();
      
      if (profiles && profiles.length > 0) {
        // Update existing profile with only changed data
        const lastProfile = profiles[0];
        
        const updatedData = {
          ...lastProfile,
          data: {
            ...lastProfile.data
          }
        };
        
        // Update only the changed fields
        if (changedBackgroundSettings.backgroundImage !== undefined) {
          updatedData.data.backgroundImage = Array.isArray(changedBackgroundSettings.backgroundImage) ? changedBackgroundSettings.backgroundImage : [changedBackgroundSettings.backgroundImage];
        }
        if (changedBackgroundSettings.defaultBackgroundColor !== undefined) {
          updatedData.data.style = {
            ...updatedData.data.style,
            backgroundColor: changedBackgroundSettings.defaultBackgroundColor
          };
        }
        
        console.log('تحديث إعدادات الخلفية في ملف موجود بالبيانات المعدلة فقط...');
        console.log('بيانات إعدادات الخلفية المرسلة:', JSON.stringify(updatedData, null, 2));
        await CompanyProfileService.updateProfile(lastProfile.id, updatedData);
        
        // Update local state with merged data
        setBackgroundSettings(prev => ({ ...prev, ...changedBackgroundSettings }));
        console.log('تم تحديث إعدادات الخلفية بنجاح');
      } else {
        // Create new profile with background settings
        console.log('إنشاء ملف تعريف جديد مع إعدادات الخلفية...');
        const newProfile = {
          template_id: 'default',
          name: 'ملف تعريف الشركة',
          description: 'ملف تعريف الشركة الأساسي',
          data: {
            backgroundImage: [changedBackgroundSettings.backgroundImage || ''],
            style: {
              backgroundColor: changedBackgroundSettings.defaultBackgroundColor || '#ffffff'
            }
          }
        };
        
        await CompanyProfileService.createProfile(newProfile);
        setBackgroundSettings(changedBackgroundSettings);
        console.log('تم إنشاء ملف تعريف جديد مع إعدادات الخلفية بنجاح');
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
      
      // Get the last profile to update
      const profiles = await CompanyProfileService.getLastProfile();
      
      if (profiles && profiles.length > 0) {
        // Update existing profile with only changed data
        const lastProfile = profiles[0];
        
        const updatedData = {
          ...lastProfile,
          data: {
            ...lastProfile.data,
            themeSettings: {
              ...lastProfile.data.themeSettings,
              ...changedThemeSettings
            }
          }
        };
        
        console.log('تحديث إعدادات الثيم في ملف موجود بالبيانات المعدلة فقط...');
        await CompanyProfileService.updateProfile(lastProfile.id, updatedData);
        
        // Update local state with merged data
        setThemeSettings(prev => ({ ...prev, ...changedThemeSettings }));
        console.log('تم تحديث إعدادات الثيم بنجاح');
      } else {
        // Create new profile with theme settings
        console.log('إنشاء ملف تعريف جديد مع إعدادات الثيم...');
        const newProfile = {
          template_id: 'default',
          name: 'ملف تعريف الشركة',
          description: 'ملف تعريف الشركة الأساسي',
          data: {
            themeSettings: changedThemeSettings
          }
        };
        
        await CompanyProfileService.createProfile(newProfile);
        setThemeSettings(changedThemeSettings);
        console.log('تم إنشاء ملف تعريف جديد مع إعدادات الثيم بنجاح');
      }
    } catch (error) {
      console.error('خطأ في تحديث إعدادات الثيم:', error);
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
            <div className="flex h-screen bg-gray-50" dir="rtl">
              {/* Main Sidebar */}
              <MainSidebar 
                activeSection={activePage}
                onSectionChange={setActivePage}
                user={user}
                onLogout={logout}
              />
              
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/content" element={
                    <ContentManagementPage 
                      sections={sections}
                      selectedPageId={selectedPageId}
                      onSelectPage={handleSelectPage}
                      onUpdatePage={handleUpdatePage}
                      onAddSection={handleAddSection}
                      onAddPage={handleAddPage}
                      onDeleteSection={handleDeleteSection}
                      onDeletePage={handleDeletePage}
                    />
                  } />
                  <Route path="/content/:section" element={
                    <ContentManagementPage 
                      sections={sections}
                      selectedPageId={selectedPageId}
                      onSelectPage={handleSelectPage}
                      onUpdatePage={handleUpdatePage}
                      onAddSection={handleAddSection}
                      onAddPage={handleAddPage}
                      onDeleteSection={handleDeleteSection}
                      onDeletePage={handleDeletePage}
                    />
                  } />
                  <Route path="/attachments" element={<AttachmentsSectionPage />} />
                  <Route path="/settings" element={
                    <GeneralSettingsPage 
                      companyData={companyData}
                      onUpdateCompanyData={handleUpdateCompanyData}
                      backgroundSettings={backgroundSettings}
                      onUpdateBackgroundSettings={handleUpdateBackgroundSettings}
                      themeSettings={themeSettings}
                      onUpdateThemeSettings={handleUpdateThemeSettings}
                    />
                  } />
                </Routes>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;