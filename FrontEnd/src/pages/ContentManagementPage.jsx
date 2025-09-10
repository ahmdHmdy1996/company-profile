import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Edit3, 
  Plus, 
  Trash2, 
  FileText,
  Building,
  Users,
  Briefcase,
  Wrench,
  Award,
  Eye,
  Save,
  ArrowLeft,
  Settings
} from 'lucide-react';
// import EditorPanel from '../components/EditorPanel'; // Removed for inline editing
import TemplateRenderer from '../components/TemplateRenderer';
import PageHeader from '../components/PageHeader';
import GlobalSettings from '../components/GlobalSettings';
import LanguageSelector from '../components/LanguageSelector';
import { PageContentService, StaffService, ProjectService } from '../services';

const ContentManagementPage = ({ 
  sections = [], 
  selectedPageId, 
  companyProfileId,
  onSelectPage = () => {}, 
  onUpdatePage = () => {},
  onAddSection = () => {},
  onAddPage = () => {},
  onDeleteSection = () => {},
  onDeletePage = () => {}
}) => {
  const { section } = useParams();
  const [expandedSections, setExpandedSections] = useState({});
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    header: {
      logo: null,
      showLogo: true
    },
    footer: {
      showEmail: true,
      showPhone: true,
      showPageNumber: true,
      email: 'info@teamarabia.com',
      phone: '+966 11 234 5678'
    }
  });
  const [pageContents, setPageContents] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from services
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (!companyProfileId) {
          console.log('لا يوجد معرف ملف الشركة');
          setLoading(false);
          return;
        }
        
        // Load page contents
        const pageContentsData = await PageContentService.getAllPageContents(companyProfileId);
        setPageContents(pageContentsData || []);
        
        // Load staff members
        const staffData = await StaffService.getAllStaffMembers(companyProfileId);
        setStaffMembers(staffData || []);
        
        // Load projects
        const projectsData = await ProjectService.getAllProjects(companyProfileId);
        setProjects(projectsData || []);
        
        console.log('تم تحميل البيانات من الخدمات:', {
          pageContents: pageContentsData,
          staff: staffData,
          projects: projectsData
        });
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [companyProfileId]);
  
  // Default sections if none provided
  const defaultSections = [
    {
      id: 'about',
      name: 'About Us',
      pages: [
        { 
          id: 'about-1', 
          title: 'About Us Page', 
          name: 'About Us Page', 
          templateId: 'About', 
          data: {
            title: "About\nUs",
            vision: {
              title: "Our Vision",
              content: "Team Arabia's vision is to continue advancing our roles as leaders in the industry and develop strong relationships with all our skilled employees and esteemed clients. Integrity, trust, and performance drive us towards our journey of becoming the benchmark within our field."
            },
            coreValues: {
              title: "Core Values",
              content: "At Team Arabia, we have five core values that define us and guide us through our routine work as well as in addressing your project requirements. These values include:",
              values: [
                "Clients & Partnership",
                "People & Teamwork",
                "Dedication",
                "Continuous Improvement",
                "Quality & Professional Safety"
              ]
            },
            company: {
              title: "The Company",
              content: "Team Arabia is recognized as one of the leading companies in the market for MEP systems testing and commissioning services. We have been exceeding and meeting industry standards since we started. We aim to provide easy, affordable, and fast services to our clients with the goal of returning the environment to its natural state. Our background and expertise in energy efficiency is extremely distinguished."
            },
            images: {
              topImage: null,
              middleImage: null,
              bottomImage: null
            }
          },
          style: {
            backgroundColor: '#16a34a'
          }
        }
      ]
    },
    {
      id: 'staff',
      name: 'Our Staff',
      pages: [
        { 
          id: 'staff-1', 
          title: 'Our Staff Page', 
          name: 'Our Staff Page', 
          templateId: 'Staff', 
          data: {
            title: "Our\nStaff",
            subtitle: "Team Arabia's vision is to continue advancing our roles as leaders in the industry and develop strong relationships with all our skilled employees and esteemed clients.",
            ceo: {
              name: "John Smith",
              position: "Chief Executive Officer",
              image: ""
            },
            managers: [
              {
                name: "Sarah Johnson",
                position: "Project Manager",
                image: ""
              },
              {
                name: "Michael Brown",
                position: "Quality Manager",
                image: ""
              }
            ],
            staff: [
              {
                name: "David Wilson",
                position: "Electrical Engineer",
                image: ""
              },
              {
                name: "Lisa Anderson",
                position: "Mechanical Engineer",
                image: ""
              }
            ],
            juniorStaff: [
              {
                name: "Robert Taylor",
                position: "Junior Engineer",
                image: ""
              }
            ]
          },
          style: {
            backgroundColor: '#ffffff'
          }
        }
      ]
    },
    {
      id: 'clients',
      name: 'Our Clients',
      pages: [
        { 
          id: 'clients-1', 
          title: 'Our Clients Page', 
          name: 'Our Clients Page', 
          templateId: 'Content', 
          data: {
            title: "Our Clients",
            sections: [
               {
                 heading: "Government Sector Clients",
                 content: "We are proud to serve numerous government agencies and official institutions."
               },
               {
                 heading: "Private Sector Clients",
                 content: "We provide our services to private sector companies with the highest quality standards."
               }
             ]
          },
          style: {
            backgroundColor: '#ffffff'
          }
        }
      ]
    },
    {
      id: 'services',
      name: 'Our Services',
      pages: [
        { 
          id: 'services-1', 
          title: 'Our Services Page', 
          name: 'Our Services Page', 
          templateId: 'Content', 
          data: {
            title: "Our Services",
            sections: [
               {
                 heading: "MEP Systems Testing and Commissioning",
                 content: "We provide comprehensive services for testing and commissioning electrical, mechanical, and plumbing systems."
               },
               {
                 heading: "Energy Consulting",
                 content: "We help our clients improve energy efficiency and reduce operational costs."
               },
               {
                 heading: "Maintenance and Operations",
                 content: "We provide periodic maintenance and operation services for buildings and facilities."
               }
             ]
          },
          style: {
            backgroundColor: '#ffffff'
          }
        }
      ]
    },
    {
      id: 'projects',
      name: 'Our Projects',
      pages: [
        { 
          id: 'projects-1', 
          title: 'Our Projects Page', 
          name: 'Our Projects Page', 
          templateId: 'Projects', 
          data: {
            title: "Our Projects",
            projects: [
               {
                 title: "Residential Projects",
                 subtitle: "We have executed numerous large residential projects in Saudi Arabia",
                 image: "/api/placeholder/400/250"
               },
               {
                 title: "Commercial Projects",
                 subtitle: "We have extensive experience in implementing commercial and office projects",
                 image: "/api/placeholder/400/250"
               }
             ],
            currentPage: 1,
            totalPages: 244
          },
          style: {
            backgroundColor: '#ffffff'
          }
        }
      ]
    }
  ];
  
  const activeSections = sections.length > 0 ? sections : defaultSections;
  
  // Filter sections based on URL parameter
  const filteredSections = section 
    ? activeSections.filter(sec => sec.id === section)
    : activeSections;
  
  const [editingPageId, setEditingPageId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [tempPageData, setTempPageData] = useState(null);

  // Auto-select first page if none selected
  useEffect(() => {
    if (!selectedPageId && filteredSections.length > 0) {
      const firstPage = filteredSections[0]?.pages?.[0];
      if (firstPage) {
        onSelectPage(firstPage.id);
      }
    }
  }, [selectedPageId, filteredSections, onSelectPage]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleEditPage = (pageId) => {
    const page = filteredSections
      .flatMap(section => section.pages)
      .find(page => page.id === pageId);
    setEditingPageId(pageId);
    setTempPageData(page?.data || {});
    onSelectPage(pageId);
    setShowPreview(false);
  };

  const handlePreviewPage = (pageId) => {
    onSelectPage(pageId);
    setEditingPageId(null);
    setShowPreview(true);
  };

  const handleSavePage = async (pageId, updatedData) => {
    try {
      const dataToSave = updatedData || tempPageData;
      
      // Check if this is an existing page content or new one
      const existingContent = Array.isArray(pageContents) ? pageContents.find(content => content.page_id === pageId) : null;
      
      if (existingContent) {
        // Update existing page content
        await PageContentService.updatePageContent(companyProfileId, existingContent.id, {
          page_id: pageId,
          content_data: JSON.stringify(dataToSave),
          page_title: dataToSave.title || 'Untitled Page'
        });
        
        // Update local state
        setPageContents(prev => prev.map(content => 
          content.id === existingContent.id 
            ? { ...content, content_data: JSON.stringify(dataToSave), page_title: dataToSave.title || 'Untitled Page' }
            : content
        ));
      } else {
        // Create new page content
        const newContent = await PageContentService.createPageContent(companyProfileId, {
          page_id: pageId,
          content_data: JSON.stringify(dataToSave),
          page_title: dataToSave.title || 'Untitled Page'
        });
        
        // Update local state
        setPageContents(prev => [...prev, newContent]);
      }
      
      // Also call the parent update function for backward compatibility
      await onUpdatePage(pageId, dataToSave);
      
      setEditingPageId(null);
      setTempPageData(null);
      
      console.log('تم حفظ محتوى الصفحة بنجاح');
      alert('تم حفظ التغييرات بنجاح!');
    } catch (error) {
      console.error('خطأ في حفظ الصفحة:', error);
      alert('حدث خطأ أثناء حفظ التغييرات: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setTempPageData(null);
  };

  const handleDataChange = (newData) => {
    setTempPageData(newData);
  };

  const getPageIcon = (templateId) => {
    const iconMap = {
      'Cover': FileText,
      'About': Building,
      'Staff': Users,
      'Content': Briefcase,
      'TOC': FileText,
      'Services': Wrench,
      'Projects': Award
    };
    return iconMap[templateId] || FileText;
  };

  const selectedPage = filteredSections
    .flatMap(section => section.pages)
    .find(page => page.id === selectedPageId);

  return (
    <div className="flex-1 flex h-full bg-gray-50">
      {/* Sidebar - Pages List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <PageHeader 
          title="إدارة محتوى الصفحات"
          subtitle="تحرير وإدارة صفحات الملف التعريفي"
        >
          <div className="flex items-center gap-2">
            
            <button
              onClick={() => setShowGlobalSettings(true)}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="الإعدادات العامة"
            >
              <Settings size={16} />
            </button>
            
          </div>
        </PageHeader>

        {/* Back Button - Only show when editing */}
        {editingPageId && (
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setEditingPageId(null)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              العودة إلى قائمة الصفحات
            </button>
          </div>
        )}

        {/* Sections and Pages List */}
        <div className="flex-1 overflow-y-auto p-4">
          {editingPageId ? (
            /* Show Edit Page section when editing */
            <div className="mb-4">
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-4">
                <div className="flex items-center gap-3">
                  <Edit3 size={20} className="text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">تحرير الصفحة</h3>
                    <p className="text-sm text-gray-600">{selectedPage?.title || selectedPage?.name}</p>
                  </div>
                </div>
              </div>
              
              {/* View Panel integrated here */}
              <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">عرض الصفحة</h3>
                  <div 
                    className="border border-gray-200 rounded-lg overflow-hidden"
                    style={{ 
                      backgroundColor: selectedPage?.style?.backgroundColor || '#ffffff',
                      backgroundImage: selectedPage?.style?.backgroundImage ? `url(${selectedPage.style.backgroundImage})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minHeight: '600px'
                    }}
                  >
                    <TemplateRenderer
                      templateId={selectedPage?.templateId}
                      data={selectedPage?.data}
                      style={selectedPage?.style}
                      globalSettings={globalSettings}
                      isEditing={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Show filtered sections and pages when not editing */
            filteredSections.map((section) => {
              const isExpanded = expandedSections[section.id];
              
              return (
                <div key={section.id} className="mb-4">
                  {/* Section Header */}
                  <div className="bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between p-3">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center gap-2 flex-1 text-right"
                      >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <span className="font-semibold text-gray-800">{section.name}</span>
                        <span className="text-sm text-gray-500">({section.pages.length})</span>
                      </button>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onAddPage(section.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="إضافة صفحة"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteSection(section.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="حذف القسم"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Pages List */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-2 space-y-1">
                        {section.pages.map((page) => {
                          const PageIcon = getPageIcon(page.templateId);
                          const isSelected = selectedPageId === page.id;
                          const isEditing = editingPageId === page.id;
                          
                          return (
                            <div
                              key={page.id}
                              onClick={() => onSelectPage(page.id)}
                              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedPageId === page.id
                                  ? 'bg-blue-50 border border-blue-200'
                                : 'hover:bg-gray-100'
                            }`}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <PageIcon size={16} className="text-gray-600" />
                                <span className="text-sm font-medium text-gray-800">
                                  {page.title || page.name}
                                </span>
                                {isEditing && (
                                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                    قيد التحرير
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handlePreviewPage(page.id)}
                                  className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                                  title="معاينة"
                                >
                                  <Eye size={12} />
                                </button>
                                <button
                                  onClick={() => handleEditPage(page.id)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                  title="تحرير"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button
                                  onClick={() => onDeletePage(page.id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                  title="حذف"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {activeSections.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد أقسام</h3>
              <p className="text-gray-500 mb-4">ابدأ بإنشاء قسم جديد لإضافة الصفحات</p>
              <button
                onClick={onAddSection}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                إنشاء قسم جديد
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedPage ? (
          <>
            {/* Content Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedPage.name}</h2>
                  <p className="text-gray-600 mt-1">
                    {editingPageId === selectedPage.id ? 'وضع التحرير' : 'وضع المعاينة'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {editingPageId === selectedPage.id ? (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => handleSavePage(selectedPage.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save size={16} />
                        حفظ التغييرات
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditPage(selectedPage.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit3 size={16} />
                        تحرير الصفحة
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-hidden">
              {editingPageId === selectedPage.id ? (
                /* Editing Mode with Inline Editing */
                <div className="h-full bg-gray-100 p-4 overflow-auto">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">وضع التحرير المباشر</h3>
                    <div 
                      className="border border-gray-200 rounded-lg overflow-hidden"
                      style={{ 
                        backgroundColor: selectedPage?.style?.backgroundColor || '#ffffff',
                        backgroundImage: selectedPage?.style?.backgroundImage ? `url(${selectedPage.style.backgroundImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '600px'
                      }}
                    >
                      <TemplateRenderer
                        templateId={selectedPage?.templateId}
                        data={tempPageData || selectedPage?.data}
                        style={selectedPage?.style}
                        globalSettings={globalSettings}
                        isEditing={true}
                        onDataChange={handleDataChange}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="h-full p-6 overflow-auto bg-gray-100">
                  <div className="max-w-4xl mx-auto">
                    <div 
                      className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                      style={{ 
                        backgroundColor: selectedPage?.style?.backgroundColor || '#ffffff',
                        backgroundImage: selectedPage?.style?.backgroundImage ? `url(${selectedPage.style.backgroundImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '800px'
                      }}
                    >
                      <TemplateRenderer
                        templateId={selectedPage?.templateId}
                        data={selectedPage?.data}
                        style={selectedPage?.style}
                        globalSettings={globalSettings}
                        isEditing={false}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* No Page Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <FileText size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">اختر صفحة للتحرير</h3>
              <p className="text-gray-500 max-w-md">
                اختر صفحة من القائمة الجانبية لبدء التحرير أو المعاينة
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Global Settings Modal */}
      <GlobalSettings
        globalSettings={globalSettings}
        onUpdateSettings={setGlobalSettings}
        isOpen={showGlobalSettings}
        onClose={() => setShowGlobalSettings(false)}
      />
    </div>
  );
};

export default ContentManagementPage;