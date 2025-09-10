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

const ContentManagementPage = ({ 
  sections = [], 
  selectedPageId, 
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
  
  // Default sections if none provided
  const defaultSections = [
    {
      id: 'about',
      name: 'نبذة عنا',
      pages: [
        { 
          id: 'about-1', 
          title: 'صفحة نبذة عنا', 
          name: 'صفحة نبذة عنا', 
          templateId: 'About', 
          data: {
            title: "نبذة\nعنا",
            vision: {
              title: "رؤيتنا",
              content: "رؤية شركة تيم أرابيا هي الاستمرار في تطوير أدوارنا كقادة في الصناعة وتطوير علاقات قوية مع جميع موظفينا المهرة وعملائنا المحترمين. النزاهة والثقة والأداء يقودنا نحو رحلتنا لنصبح المعيار في مجالنا."
            },
            coreValues: {
              title: "القيم الأساسية",
              content: "في شركة تيم أرابيا، لدينا خمس قيم رئيسية تحددنا وتوجهنا خلال عملنا الروتيني وكذلك في معالجة متطلبات مشروعك. هذه القيم تشمل:",
              values: [
                "العملاء والشراكة",
                "الأشخاص والعمل الجماعي",
                "التفاني",
                "التحسين المستمر",
                "الجودة والسلامة المهنية"
              ]
            },
            company: {
              title: "الشركة",
              content: "شركة تيم أرابيا معترف بها كواحدة من الشركات الرائدة في السوق في خدمات اختبار وتشغيل أنظمة MEP، لقد كنا نتجاوز ونلبي معايير الصناعة منذ أن بدأنا. نهدف إلى تقديم خدمات سهلة وبأسعار معقولة وسريعة لعملائنا بهدف إعادة البيئة إلى طبيعتها. خلفيتنا وخبرتنا في كفاءة الطاقة متميزة للغاية."
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
      name: 'الموظفين',
      pages: [
        { 
          id: 'staff-1', 
          title: 'صفحة الموظفين', 
          name: 'صفحة الموظفين', 
          templateId: 'Staff', 
          data: {
            title: "فريق\nالعمل",
            subtitle: "رؤية شركة تيم أرابيا هي الاستمرار في تطوير أدوارنا كقادة في الصناعة وتطوير علاقات قوية مع جميع موظفينا المهرة وعملائنا المحترمين.",
            ceo: {
              name: "مراد الجمال",
              position: "المدير التنفيذي",
              image: ""
            },
            managers: [
              {
                name: "أحمد محمد",
                position: "مدير المشاريع",
                image: ""
              },
              {
                name: "سارة أحمد",
                position: "مدير الجودة",
                image: ""
              }
            ],
            staff: [
              {
                name: "محمد علي",
                position: "مهندس كهرباء",
                image: ""
              },
              {
                name: "فاطمة حسن",
                position: "مهندس ميكانيكا",
                image: ""
              }
            ],
            juniorStaff: [
              {
                name: "عبدالله سالم",
                position: "مهندس مبتدئ",
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
      name: 'العملاء',
      pages: [
        { 
          id: 'clients-1', 
          title: 'صفحة العملاء', 
          name: 'صفحة العملاء', 
          templateId: 'Content', 
          data: {
            title: "عملاؤنا",
            sections: [
               {
                 heading: "عملاء القطاع الحكومي",
                 content: "نفخر بخدمة العديد من الجهات الحكومية والمؤسسات الرسمية."
               },
               {
                 heading: "عملاء القطاع الخاص",
                 content: "نقدم خدماتنا لشركات القطاع الخاص بأعلى معايير الجودة."
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
      name: 'الخدمات',
      pages: [
        { 
          id: 'services-1', 
          title: 'صفحة الخدمات', 
          name: 'صفحة الخدمات', 
          templateId: 'Content', 
          data: {
            title: "خدماتنا",
            sections: [
               {
                 heading: "اختبار وتشغيل أنظمة MEP",
                 content: "نقدم خدمات شاملة لاختبار وتشغيل أنظمة الكهرباء والميكانيكا والسباكة."
               },
               {
                 heading: "استشارات الطاقة",
                 content: "نساعد عملاءنا في تحسين كفاءة الطاقة وتقليل التكاليف التشغيلية."
               },
               {
                 heading: "الصيانة والتشغيل",
                 content: "نوفر خدمات الصيانة الدورية والتشغيل للمباني والمنشآت."
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
      name: 'المشاريع',
      pages: [
        { 
          id: 'projects-1', 
          title: 'صفحة المشاريع', 
          name: 'صفحة المشاريع', 
          templateId: 'Content', 
          data: {
            title: "مشاريعنا",
            sections: [
               {
                 heading: "مشاريع سكنية",
                 content: "نفذنا العديد من المشاريع السكنية الكبيرة في المملكة العربية السعودية."
               },
               {
                 heading: "مشاريع تجارية",
                 content: "لدينا خبرة واسعة في تنفيذ المشاريع التجارية والمكتبية."
               },
               {
                 heading: "مشاريع صناعية",
                 content: "نتخصص في المشاريع الصناعية المعقدة التي تتطلب خبرة عالية."
               }
             ]
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
      await onUpdatePage(pageId, updatedData || tempPageData);
      setEditingPageId(null);
      setTempPageData(null);
      // Show success message
      alert('تم حفظ التغييرات بنجاح!');
    } catch (error) {
      console.error('خطأ في حفظ الصفحة:', error);
      alert('حدث خطأ أثناء حفظ التغييرات');
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