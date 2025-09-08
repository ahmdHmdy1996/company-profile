import React, { useMemo, useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Download,
  FileText,
  Edit,
  User,
  LogOut,
  Save,
  FolderOpen,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import Sidebar from "./Sidebar";
import TemplateSelector from "./TemplateSelector";
import EditorPanel from "./EditorPanel";
import TemplateRenderer from "./TemplateRenderer";
import AuthModal from "./AuthModal";
import { TEMPLATES, mergeTemplateData } from "../templates/templateRegistry.jsx";
import { useAuth } from "../hooks/useAuth";
import { useTemplateData } from "../hooks/useTemplateData";
import CompanyProfileService from "../services/companyProfileService";

// Helper function to create a new page
function makePage(templateId, apiData = null) {
  const template = TEMPLATES[templateId];
  
  // Handle new structure where apiData contains both data and style
  const templateApiData = apiData && apiData.data ? apiData.data : apiData;
  const mergedData = templateApiData 
    ? mergeTemplateData(templateId, templateApiData, template.defaultData)
    : template.defaultData;
  
  // Set template-specific default background colors
  const getDefaultBackgroundColor = (templateId) => {
    const defaultColors = {
      'Cover': '#000000',
      'TOC': '#3b82f6',
      'About': '#1e40af', 
      'Staff': '#f8fafc',
      'Content': '#244d86'
    };
    return defaultColors[templateId] || '#000000';
  };
  
  // Use style from API if available, otherwise use defaults
  const defaultStyle = { backgroundColor: getDefaultBackgroundColor(templateId), backgroundImage: null };
  const apiStyle = apiData && apiData.style ? apiData.style : {};
  
  return {
    id: uuidv4(),
    templateId,
    data: { ...mergedData },
    style: { ...defaultStyle, ...apiStyle },
  };
}

// Helper function to create sections with API data
function createSectionsWithData(apiData = null) {
  return [
    {
      id: uuidv4(),
      name: "Cover",
      templateId: "Cover",
      pages: [makePage("Cover", apiData?.Cover)],
    },
    {
      id: uuidv4(),
      name: "Table of Contents",
      templateId: "TOC",
      pages: [makePage("TOC", apiData?.TOC)],
    },
    {
      id: uuidv4(),
      name: "About Us",
      templateId: "About",
      pages: [makePage("About", apiData?.About)],
    },
    {
      id: uuidv4(),
      name: "Our Staff",
      templateId: "Staff",
      pages: [makePage("Staff", apiData?.Staff)],
    },
    {
      id: uuidv4(),
      name: "Content",
      templateId: "Content",
      pages: [makePage("Content", apiData?.Content)],
    },
  ];
}

// Default sections configuration
const DEFAULT_SECTIONS = createSectionsWithData();

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [showSavedProfiles, setShowSavedProfiles] = useState(false);
  const [showProfileDataModal, setShowProfileDataModal] = useState(false);
  const [selectedProfileData, setSelectedProfileData] = useState(null);
  const [currentProfileId, setCurrentProfileId] = useState(null);
  const [profileName, setProfileName] = useState("");
  
  // Hook for loading template data from API
  const { templateData, loading: templateLoading, error: templateError, loadTemplateData } = useTemplateData(currentProfileId);

  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [selectedPageId, setSelectedPageId] = useState(
    DEFAULT_SECTIONS[0]?.pages[0]?.id
  );
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef(null);

  // Load profiles when user authenticates or on component mount
  useEffect(() => {
    console.log('🔍 DEBUG: useEffect triggered - isAuthenticated:', isAuthenticated, 'user:', user);
    if (isAuthenticated && user) {
      console.log('🔍 DEBUG: User authenticated, calling loadSavedProfiles');
      loadSavedProfiles();
    } else {
      console.log('🔍 DEBUG: User not authenticated, loading local profiles');
      // Load local profiles when not authenticated
      const localProfiles = JSON.parse(localStorage.getItem('localProfiles') || '[]');
      console.log('🔍 DEBUG: Local profiles loaded:', localProfiles);
      setSavedProfiles(localProfiles);
    }
  }, [isAuthenticated, user]);

  // Load local profiles on component mount (only once)
  useEffect(() => {
    if (!user) {
      const localProfiles = JSON.parse(localStorage.getItem('localProfiles') || '[]');
      setSavedProfiles(localProfiles);
    }
  }, [user]); // Add user as dependency to prevent unnecessary resets

  // Handle templateData changes from useTemplateData hook
  useEffect(() => {
    if (templateData && currentProfileId) {
      // Update sections with the loaded template data
      const updatedSections = createSectionsWithData(templateData);
      setSections(updatedSections);
      setSelectedPageId(updatedSections[0]?.pages[0]?.id);
    }
  }, [templateData, currentProfileId]);

  // Auto-save current work to prevent data loss on refresh
  useEffect(() => {
    // Save current sections to localStorage as draft
    const draftData = {
      sections,
      selectedPageId,
      profileName,
      currentProfileId,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('currentDraft', JSON.stringify(draftData));
  }, [sections, selectedPageId, profileName, currentProfileId]);

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('currentDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        // Only restore if it's recent (within last 24 hours) and has valid data
        const lastSaved = new Date(draftData.lastSaved);
        const now = new Date();
        const hoursDiff = (now - lastSaved) / (1000 * 60 * 60);
        
        if (hoursDiff < 24 && draftData.sections && draftData.sections.length > 0) {
          setSections(draftData.sections);
          setSelectedPageId(draftData.selectedPageId || draftData.sections[0]?.pages[0]?.id);
          setProfileName(draftData.profileName || "");
          setCurrentProfileId(draftData.currentProfileId || null);
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []); // Only run once on mount

  const loadSavedProfiles = async () => {
    try {
      console.log('🔍 DEBUG: Starting loadSavedProfiles...');
      const result = await CompanyProfileService.getLastProfile();
      console.log('🔍 DEBUG: API Response:', result);
      console.log('🔍 DEBUG: API Response Type:', typeof result);
      console.log('🔍 DEBUG: API Response Keys:', Object.keys(result || {}));
      
      if (result.data) {
        console.log('🔍 DEBUG: Profile Data Found:', result.data);
        console.log('🔍 DEBUG: Profile Data Type:', typeof result.data);
        console.log('🔍 DEBUG: Profile Data Keys:', Object.keys(result.data || {}));
        console.log('🔍 DEBUG: Profile Data Structure:');
        console.log('  - ID:', result.id);
        console.log('  - Name:', result.name);
        console.log('  - Template ID:', result.template_id);
        console.log('  - Description:', result.description);
        console.log('  - Data Object:', result.data);
        
        if (result.data && result.data.sections) {
          console.log('🔍 DEBUG: Sections Found:', result.data.sections.length);
          result.data.sections.forEach((section, index) => {
            console.log(`  - Section ${index + 1}:`, {
              name: section.name,
              templateId: section.templateId,
              pagesCount: section.pages ? section.pages.length : 0
            });
          });
        } else {
          console.log('🔍 DEBUG: No sections found in data object');
        }
        
        setSavedProfiles([result]); // Wrap single profile in array for compatibility
        console.log('🔍 DEBUG: savedProfiles state updated with:', [result]);
        
        // Auto-load the profile to trigger useTemplateData
        console.log('🔍 DEBUG: Auto-loading profile ID:', result.id);
        setProfileName(result.name || "");
        setCurrentProfileId(result.id);
        console.log('🔍 DEBUG: currentProfileId set to:', result.id, '- useTemplateData should trigger');
      } else {
        console.log('🔍 DEBUG: No profile data found in API response');
        setSavedProfiles([]); // No profile found
      }
    } catch (error) {
      console.error('❌ DEBUG: Failed to load last profile:', error);
      console.error('❌ DEBUG: Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
  };

  const handleLogin = () => {
    // User state is managed by AuthContext now
    setShowAuthModal(false);
    // loadSavedProfiles will be called automatically via useEffect
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setSavedProfiles([]);
      setCurrentProfileId(null);
      setProfileName("");
    }
  };

  const saveProfile = async () => {
    const name = profileName || `Profile ${new Date().toLocaleDateString()}`;

    // If user is not logged in, save locally
    if (!user) {
      const profileData = {
        id: currentProfileId || uuidv4(),
        name,
        template_id: "multi-section",
        data: {
          sections: sections.map((section) => ({
            name: section.name,
            templateId: section.templateId,
            pages: section.pages.map((page) => ({
              templateId: page.templateId,
              data: page.data,
              style: page.style,
            })),
          })),
        },
        description: `Company profile with ${sections.length} sections`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to localStorage
      const savedProfiles = JSON.parse(localStorage.getItem('localProfiles') || '[]');
      const existingIndex = savedProfiles.findIndex(p => p.id === profileData.id);
      
      if (existingIndex >= 0) {
        savedProfiles[existingIndex] = profileData;
      } else {
        savedProfiles.push(profileData);
      }
      
      localStorage.setItem('localProfiles', JSON.stringify(savedProfiles));
      setCurrentProfileId(profileData.id);
      setSavedProfiles(savedProfiles);
      // Clear draft after successful local save
      localStorage.removeItem('currentDraft');
      alert("Profile saved locally!");
      return;
    }

    setIsSaving(true);
    try {
      // Prepare profile data for backend
      const profileData = {
        template_id: "multi-section",
        data: {
          sections: sections.map((section) => ({
            name: section.name,
            templateId: section.templateId,
            pages: section.pages.map((page) => ({
              templateId: page.templateId,
              data: page.data,
              style: page.style,
            })),
          })),
        },
        name,
        description: `Company profile with ${sections.length} sections`,
      };

      let result;
      if (currentProfileId) {
        // Update existing profile
        result = await CompanyProfileService.updateProfile(
          currentProfileId,
          profileData
        );
      } else {
        // Create new profile
        result = await CompanyProfileService.createProfile(profileData);
      }

      if (result.success) {
        setCurrentProfileId(result.data.id);
        await loadSavedProfiles();
        // Clear draft after successful save
        localStorage.removeItem('currentDraft');
        alert("Profile saved successfully!");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const loadProfile = async (profileId) => {
    try {
      let profile;
      
      if (user) {
        // Load from backend if user is authenticated
        const result = await CompanyProfileService.getProfile(profileId);
        if (result.success) {
          profile = result.data;
        } else {
          throw new Error('Failed to load profile from server');
        }
        
        console.log('🔍 DEBUG: loadProfile - Setting profile name and ID');
        console.log('🔍 DEBUG: loadProfile - Profile name:', profile.name);
        console.log('🔍 DEBUG: loadProfile - Profile ID:', profile.id);
        
        setProfileName(profile.name || "");
        setCurrentProfileId(profile.id);
        
        // Let useTemplateData hook handle the data loading and section creation
        // The useEffect for templateData will trigger and update sections
        console.log('🔍 DEBUG: loadProfile - currentProfileId set, useTemplateData should trigger');
        
      } else {
        // Load from localStorage if not authenticated
        const localProfiles = JSON.parse(localStorage.getItem('localProfiles') || '[]');
        profile = localProfiles.find(p => p.id === profileId);
        if (!profile) {
          throw new Error('Profile not found in local storage');
        }
        
        setProfileName(profile.name || "");
        setCurrentProfileId(profile.id);

        // Reconstruct sections from saved data for local profiles
        const profileData = profile.data;
        if (profileData.sections) {
          const loadedSections = profileData.sections.map((section) => ({
            id: uuidv4(),
            name: section.name,
            templateId: section.templateId,
            pages: section.pages.map((page) => ({
              id: uuidv4(),
              templateId: page.templateId,
              data: page.data,
              style: page.style,
            })),
          }));

          setSections(loadedSections);
          setSelectedPageId(loadedSections[0]?.pages[0]?.id);
        }
      }

      setShowSavedProfiles(false);
      // Clear draft after successful load
      localStorage.removeItem('currentDraft');
      alert("Profile loaded successfully!");
    } catch (error) {
      console.error("Load failed:", error);
      alert("Failed to load profile.");
    }
  };

  const deleteProfile = async (profileId) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;

    try {
      if (user) {
        // Delete from backend if user is authenticated
        await CompanyProfileService.deleteProfile(profileId);
        await loadSavedProfiles();
      } else {
        // Delete from localStorage if not authenticated
        const localProfiles = JSON.parse(localStorage.getItem('localProfiles') || '[]');
        const updatedProfiles = localProfiles.filter(p => p.id !== profileId);
        localStorage.setItem('localProfiles', JSON.stringify(updatedProfiles));
        setSavedProfiles(updatedProfiles);
      }
      
      if (currentProfileId === profileId) {
        setCurrentProfileId(null);
        setProfileName("");
      }
      alert("Profile deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete profile.");
    }
  };

  const showProfileData = (profile) => {
    console.log('🔍 DEBUG: showProfileData called with profile:', profile);
    console.log('🔍 DEBUG: Profile object type:', typeof profile);
    console.log('🔍 DEBUG: Profile object keys:', Object.keys(profile || {}));
    console.log('🔍 DEBUG: Profile data structure for modal:');
    console.log('  - Profile ID:', profile?.id);
    console.log('  - Profile Name:', profile?.name);
    console.log('  - Profile Template ID:', profile?.template_id);
    console.log('  - Profile Description:', profile?.description);
    console.log('  - Profile Data Object:', profile?.data);
    
    if (profile?.data?.sections) {
      console.log('🔍 DEBUG: Sections in modal data:', profile.data.sections.length);
      profile.data.sections.forEach((section, index) => {
        console.log(`  - Modal Section ${index + 1}:`, {
          name: section.name,
          templateId: section.templateId,
          pages: section.pages?.length || 0
        });
      });
    } else {
      console.log('🔍 DEBUG: No sections found in profile data for modal');
    }
    
    setSelectedProfileData(profile);
    setShowProfileDataModal(true);
  };

  // Get currently selected page
  const selectedPage = useMemo(() => {
    for (const section of sections) {
      const page = section.pages.find((p) => p.id === selectedPageId);
      if (page) return page;
    }
    return null;
  }, [sections, selectedPageId]);

  // Get section containing selected page
  const selectedSection = useMemo(() => {
    return sections.find((section) =>
      section.pages.some((p) => p.id === selectedPageId)
    );
  }, [sections, selectedPageId]);

  // Add new section
  const addSection = (templateId) => {
    const newSection = {
      id: uuidv4(),
      name: TEMPLATES[templateId].name,
      templateId,
      pages: [makePage(templateId)],
    };
    setSections((prev) => [...prev, newSection]);
    setSelectedPageId(newSection.pages[0].id);
  };

  // Add new page to section
  const addPageToSection = (sectionId) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const newPage = makePage(section.templateId);
          setSelectedPageId(newPage.id);
          return {
            ...section,
            pages: [...section.pages, newPage],
          };
        }
        return section;
      })
    );
  };

  // Delete section
  const deleteSection = (sectionId) => {
    setSections((prev) => {
      const filtered = prev.filter((s) => s.id !== sectionId);
      if (filtered.length > 0) {
        setSelectedPageId(filtered[0].pages[0].id);
      }
      return filtered;
    });
  };

  // Delete page
  const deletePage = (sectionId, pageId) => {
    setSections((prev) =>
      prev
        .map((section) => {
          if (section.id === sectionId) {
            const newPages = section.pages.filter((p) => p.id !== pageId);
            if (newPages.length === 0) {
              return null;
            }
            if (pageId === selectedPageId && newPages.length > 0) {
              setSelectedPageId(newPages[0].id);
            }
            return { ...section, pages: newPages };
          }
          return section;
        })
        .filter(Boolean)
    );
  };

  // Update page data
  const updatePageData = (pageId, newData) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        pages: section.pages.map((page) =>
          page.id === pageId ? { ...page, data: newData } : page
        ),
      }))
    );
  };

  // Update page style
  const updatePageStyle = (pageId, newStyle) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        pages: section.pages.map((page) =>
          page.id === pageId ? { ...page, style: newStyle } : page
        ),
      }))
    );
  };

  // Change template for section
  const changeTemplate = (sectionId, newTemplateId) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const newPages = section.pages.map((page) => ({
            ...page,
            templateId: newTemplateId,
            data: { ...TEMPLATES[newTemplateId].defaultData },
          }));
          return {
            ...section,
            templateId: newTemplateId,
            name: TEMPLATES[newTemplateId].name,
            pages: newPages,
          };
        }
        return section;
      })
    );
  };

  // Export to PDF
  const exportToPDF = async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const allPages = sections.flatMap((section) => section.pages);

      for (let i = 0; i < allPages.length; i++) {
        const page = allPages[i];
        setSelectedPageId(page.id);
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = await html2canvas(canvasRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        const imgData = canvas.toDataURL("image/png");
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      }

      pdf.save(`${profileName || "company-profile"}.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Profile Builder
          </h1>
          {user && (
            <p className="text-xs text-gray-500">Welcome, {user.name}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={saveProfile}
            disabled={isSaving}
            className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
          >
            <Save size={12} />
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
          >
            <Download size={12} />
            {isExporting ? "Exporting..." : "Export"}
          </button>
          {!user && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1 bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
            >
              <User size={12} />
              Login
            </button>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:flex-shrink-0 border-r border-gray-200 bg-white">
        <Sidebar
          sections={sections}
          selectedPageId={selectedPageId}
          onSelectPage={setSelectedPageId}
          onAddSection={() => setShowTemplateSelector(true)}
          onAddPage={addPageToSection}
          onDeleteSection={deleteSection}
          onDeletePage={deletePage}
          isLoading={templateLoading && currentProfileId}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Desktop Header */}
        <div className="hidden lg:flex bg-white border-b border-gray-200 px-4 py-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Company Profile Builder
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Create professional PDF profiles</span>
                {user && (
                  <>
                    <span>•</span>
                    <span>Welcome, {user.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Profile name..."
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={() => setShowSavedProfiles(true)}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm"
            >
              <FolderOpen size={16} />
              {user ? "My Profiles" : "Local Profiles"}
            </button>
            <button
              onClick={saveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : (user ? "Save" : "Save Locally")}
            </button>
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              <Download size={16} />
              {isExporting ? "Exporting..." : "Export PDF"}
            </button>
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                <User size={16} />
                Login for Cloud Save
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col xl:flex-row gap-2 p-2 min-h-0">
          {/* Editor Panel */}
          {selectedPage && (
            <div className="xl:w-64 xl:flex-shrink-0 order-2 xl:order-1 border-r border-gray-200 bg-white">
              <div className="h-full max-h-[35vh] xl:max-h-none overflow-y-auto">
                {templateLoading && currentProfileId ? (
                  <div className="p-4">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ) : (
                  <EditorPanel
                    page={selectedPage}
                    section={selectedSection}
                    onUpdateData={(newData) =>
                      updatePageData(selectedPage.id, newData)
                    }
                    onUpdateStyle={(newStyle) =>
                      updatePageStyle(selectedPage.id, newStyle)
                    }
                    onChangeTemplate={(newTemplateId) =>
                      changeTemplate(selectedSection.id, newTemplateId)
                    }
                    isAuthenticated={!!user}
                  />
                )}
              </div>
            </div>
          )}

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto order-1 xl:order-2 min-h-0 bg-gray-50">
            <div className="flex justify-center items-start min-h-full py-2">
              <div
                ref={canvasRef}
                className="shadow-md rounded overflow-hidden bg-white border border-gray-200 w-full max-w-lg xl:max-w-2xl"
              >
                {/* Loading State for API Data */}
                {templateLoading && currentProfileId ? (
                  <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-spin">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Loading Profile Data
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Fetching your company profile from the server...
                      </p>
                    </div>
                  </div>
                ) : templateError && currentProfileId ? (
                  <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <div className="w-6 h-6 text-red-600">⚠</div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Failed to Load Profile
                      </h3>
                      <p className="text-gray-500 text-sm mb-3">
                        {templateError}
                      </p>
                      <button
                        onClick={() => loadTemplateData(currentProfileId)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : !selectedSection ? (
                  <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        No Section Selected
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Choose a section from the sidebar to start editing.
                      </p>
                    </div>
                  </div>
                ) : !selectedPage ? (
                  <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Edit className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        No Page Selected
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Select a page to begin customizing.
                      </p>
                    </div>
                  </div>
                ) : (
                  <TemplateRenderer page={selectedPage} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          onSelect={(templateId) => {
            addSection(templateId);
            setShowTemplateSelector(false);
          }}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleLogin}
      />

      {/* Saved Profiles Modal */}
      {showSavedProfiles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Profiles</h2>
              <button
                onClick={() => setShowSavedProfiles(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {savedProfiles.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No saved profiles yet
              </p>
            ) : (
              <div className="space-y-2">
                {(() => {
                  console.log('🔍 DEBUG: Rendering savedProfiles in UI:', savedProfiles);
                  console.log('🔍 DEBUG: savedProfiles length:', savedProfiles.length);
                  return null;
                })()}
                {savedProfiles.map((profile, index) => {
                  console.log(`🔍 DEBUG: Rendering profile ${index + 1}:`, {
                    id: profile.id,
                    name: profile.name,
                    template_id: profile.template_id,
                    hasData: !!profile.data,
                    hasSections: !!(profile.data && profile.data.sections),
                    sectionsCount: profile.data?.sections?.length || 0
                  });
                  
                  return (
                    <div
                      key={profile.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{profile.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(profile.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => showProfileData(profile)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Show Data
                        </button>
                        <button
                          onClick={() => loadProfile(profile.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteProfile(profile.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Data Modal */}
      {showProfileDataModal && selectedProfileData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Profile Data Structure</h2>
              <button
                onClick={() => setShowProfileDataModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Profile Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>ID:</strong> {selectedProfileData.id}</div>
                  <div><strong>Name:</strong> {selectedProfileData.name}</div>
                  <div><strong>Template ID:</strong> {selectedProfileData.template_id}</div>
                  <div><strong>Description:</strong> {selectedProfileData.description}</div>
                  <div><strong>Created:</strong> {new Date(selectedProfileData.created_at).toLocaleString()}</div>
                  <div><strong>Updated:</strong> {new Date(selectedProfileData.updated_at).toLocaleString()}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Sections Data</h3>
                {selectedProfileData.data && selectedProfileData.data.sections ? (
                  <div className="space-y-2">
                    {selectedProfileData.data.sections.map((section, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="font-medium text-sm mb-2">
                          Section {index + 1}: {section.name} ({section.templateId})
                        </div>
                        <div className="text-xs text-gray-600">
                          Pages: {section.pages ? section.pages.length : 0}
                        </div>
                        {section.pages && section.pages.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {section.pages.map((page, pageIndex) => (
                              <div key={pageIndex} className="bg-gray-100 p-2 rounded text-xs">
                                <div><strong>Page {pageIndex + 1}:</strong> {page.templateId}</div>
                                <div><strong>Data fields:</strong> {page.data ? Object.keys(page.data).length : 0}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No sections data available</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Raw JSON Data</h3>
                <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                  {JSON.stringify(selectedProfileData, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowProfileDataModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
