import { useState, useEffect, useCallback } from "react";
import CompanyProfileService from "../services/companyProfileService";
import { useAuth } from "./useAuth";

export const useTemplateData = (profileId = null) => {
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load template data from API
  const loadTemplateData = useCallback(async (id) => {
    if (!id || !isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await CompanyProfileService.getProfile(id);
      if (result.success && result.data) {
        // Transform API data to template format
        const apiData = result.data;
        console.log('🔍 DEBUG: useTemplateData - Raw API Data:', apiData);
        console.log('🔍 DEBUG: useTemplateData - API Data Type:', typeof apiData);
        console.log('🔍 DEBUG: useTemplateData - API Data Keys:', Object.keys(apiData || {}));
        
        // Extract data from nested sections structure
        const sections = apiData.data?.sections || [];
        console.log('🔍 DEBUG: useTemplateData - Sections:', sections);
        const transformedData = {};
        
        // Process each section and extract page data AND style
        sections.forEach((section, index) => {
          console.log(`🔍 DEBUG: useTemplateData - Processing Section ${index + 1}:`, section);
          if (section.pages && section.pages.length > 0) {
            const pageData = section.pages[0].data; // Get first page data
            const pageStyle = section.pages[0].style; // Get first page style
            console.log(`🔍 DEBUG: useTemplateData - Section ${section.templateId} Page Data:`, pageData);
            console.log(`🔍 DEBUG: useTemplateData - Section ${section.templateId} Page Style:`, pageStyle);
            transformedData[section.templateId] = {
               data: pageData,
               style: pageStyle
             };
           }
         });
        
        console.log('🔍 DEBUG: useTemplateData - Transformed Data:', transformedData);
        
        // Ensure all required templates have data (fallback to defaults if missing)
        if (!transformedData.Cover) {
          console.log('🔍 DEBUG: useTemplateData - Creating Cover fallback data');
          console.log('🔍 DEBUG: useTemplateData - API name for headline:', apiData.name);
          console.log('🔍 DEBUG: useTemplateData - API description for subtitle:', apiData.description);
          console.log('🔍 DEBUG: useTemplateData - Checking for other potential headline fields:');
          console.log('  - apiData.headline:', apiData.headline);
          console.log('  - apiData.title:', apiData.title);
          console.log('  - apiData.company_name:', apiData.company_name);
          console.log('  - apiData.owner_name:', apiData.owner_name);
          
          transformedData.Cover = {
            data: {
              headline: apiData.headline || apiData.name || "company\nprofile",
              subtitle: apiData.description || "Team Arabia company",
              website: "www.name.com",
              logoText: "company name",
              logoImage: null,
            },
            style: { backgroundColor: "#000000", backgroundImage: null }
          };
          
          console.log('🔍 DEBUG: useTemplateData - Final Cover data:', transformedData.Cover);
        }
        
        if (!transformedData.About) {
          transformedData.About = {
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
                content: "شركة تيم أرابيا معترف بها كواحدة من الشركات الرائدة في السوق في خدمات اختبار وتشغيل أنظمة MEP، لقد كنا نتجاوز ونلبي معايير الصناعة منذ أن بدأنا. نهدف إلى تقديم خدمات سهلة وبأسعار معقولة وسريعة لعملائنا بهدف إعادة البيئة إلى طبيعتها."
              },
              images: {
                topImage: null,
                middleImage: null,
                bottomImage: null
              }
            },
            style: { backgroundColor: "#16a34a", backgroundImage: null }
          };
        }
        
        if (!transformedData.Staff) {
          transformedData.Staff = {
            data: {
              title: "our\nstaff.",
              subtitle: "Meet our professional team",
              staff: [],
            },
            style: { backgroundColor: "#f8fafc", backgroundImage: null }
          };
        }
        
        if (!transformedData.Content) {
          transformedData.Content = {
            data: {
              title: "content.",
              sections: [],
            },
            style: { backgroundColor: "#244d86", backgroundImage: null }
          };
        }
        
        if (!transformedData.TOC) {
          transformedData.TOC = {
            data: {
              items: [
                { num: "01", title: "About Us" },
                { num: "02", title: "Our Staff" },
                { num: "03", title: "Services" },
              ],
              heading: "table of\ncontents",
            },
            style: { backgroundColor: "#3b82f6", backgroundImage: null }
          };
        }
        setTemplateData(transformedData);
        return transformedData;
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to load template data:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Auto-load data when profileId changes
  useEffect(() => {
    if (profileId) {
      loadTemplateData(profileId);
    }
  }, [profileId, loadTemplateData]);

  // Save template data back to API
  const saveTemplateData = useCallback(async (id, data) => {
    if (!id || !isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      // Transform template data back to API format
      const apiData = {
        name: data.Cover?.data?.headline?.replace('\n', ' ') || "Company Profile",
        description: data.Cover?.data?.subtitle || "Company description",
        website: data.Cover?.data?.website || "",
        logo_url: data.Cover?.data?.logoImage || null,
        about_vision: data.About?.data?.vision || {},
        about_core_values: data.About?.data?.coreValues || {},
        about_company: data.About?.data?.company || {},
        about_images: data.About?.data?.images || {},
        staff_members: data.Staff?.data?.staff || [],
        content_sections: data.Content?.data?.sections || [],
        toc_items: data.TOC?.data?.items || [],
      };
      
      const result = await CompanyProfileService.updateProfile(id, apiData);
      if (result.success) {
        return result.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get data for a specific template
  const getTemplateDataForType = useCallback((templateType) => {
    if (!templateData) return null;
    return templateData[templateType] || null;
  }, [templateData]);

  // Update specific template data
  const updateTemplateData = useCallback((templateType, newData) => {
    setTemplateData(prev => ({
      ...prev,
      [templateType]: {
        ...prev?.[templateType],
        ...newData
      }
    }));
  }, []);

  return {
    templateData,
    loading,
    error,
    loadTemplateData,
    saveTemplateData,
    getTemplateDataForType,
    updateTemplateData,
  };
};

export default useTemplateData;