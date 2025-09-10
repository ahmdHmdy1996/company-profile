import React from 'react';
import CustomHeader from '../components/CustomHeader';
import CustomFooter from '../components/CustomFooter';
import InlineEditor from '../components/InlineEditor';

// Background component for templates
function Background({
  style,
  className = "",
  fallbackColor = "#000",
  overlayClass,
}) {
  const bgStyle = {
    backgroundColor: style?.backgroundColor || fallbackColor,
    backgroundImage: style?.backgroundImage
      ? `url(${style.backgroundImage})`
      : undefined,
    backgroundSize: style?.backgroundSize || "cover",
    backgroundPosition: style?.backgroundPosition || "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <>
      <div className={`absolute inset-0 ${className}`} style={bgStyle} />
      {overlayClass && (
        <div className={`absolute inset-0 ${overlayClass} opacity-80`} />
      )}
    </>
  );
}

// Organization chart card component
function OrgCard({ person, variant = "filled", size = "md" }) {
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const baseClasses = `rounded-2xl text-center text-white font-medium ${sizeClasses[size]}`;
  const bgStyle = { backgroundColor: person.color || "#666" };

  return (
    <div className={baseClasses} style={bgStyle}>
      <div className="font-bold">{person.name}</div>
      <div className="text-white/80 text-sm mt-1">{person.role}</div>
    </div>
  );
}

// Helper function to merge API data with template defaults
export const mergeTemplateData = (templateId, apiData, defaultData) => {
  if (!apiData) return defaultData;

  // Extract template-specific data from nested structure
  const templateData = apiData[templateId] || apiData;

  switch (templateId) {
    case "Cover":
      return {
        headline: templateData.headline || defaultData.headline,
        subtitle: templateData.subtitle || defaultData.subtitle,
        website: templateData.website || defaultData.website,
        logoText: templateData.logoText || defaultData.logoText,
        logoImage: templateData.logoImage || defaultData.logoImage,
      };
    case "About":
      return {
        title: templateData.title || defaultData.title,
        paragraphs:
          templateData.paragraphs && templateData.paragraphs.length > 0
            ? templateData.paragraphs
            : defaultData.paragraphs,
        heroCaption: templateData.heroCaption || defaultData.heroCaption,
      };
    case "Staff":
      return {
        title: templateData.title || defaultData.title,
        subtitle: templateData.subtitle || defaultData.subtitle,
        ceo: templateData.ceo || defaultData.ceo,
        managers:
          templateData.managers && templateData.managers.length > 0
            ? templateData.managers
            : defaultData.managers,
        staff:
          templateData.staff && templateData.staff.length > 0
            ? templateData.staff
            : defaultData.staff,
        juniorStaff:
          templateData.juniorStaff && templateData.juniorStaff.length > 0
            ? templateData.juniorStaff
            : defaultData.juniorStaff,
      };
    case "Content":
      return {
        title: templateData.title || defaultData.title,
        sections:
          templateData.sections && templateData.sections.length > 0
            ? templateData.sections
            : defaultData.sections,
      };
    case "TOC":
      return {
        items:
          templateData.items && templateData.items.length > 0
            ? templateData.items
            : defaultData.items,
        heading: templateData.heading || defaultData.heading,
      };
    case "Projects":
      return {
        title: templateData.title || defaultData.title,
        projects:
          templateData.projects && templateData.projects.length > 0
            ? templateData.projects
            : defaultData.projects,
        currentPage: templateData.currentPage || defaultData.currentPage,
        totalPages: templateData.totalPages || defaultData.totalPages,
      };
    default:
      return { ...defaultData, ...apiData };
  }
};

// Template definitions
export const TEMPLATES = {
  Cover: {
    id: "cover",
    name: "Cover (Hero Photo)",
    defaultData: {
      headline: "company\nprofile",
      subtitle: "Team Arabia company",
      website: "www.name.com",
      logoText: "company name",
      logoImage: null,
      showHeader: true
    },
    Component: ({ data, style, globalSettings, isEditing = false, onDataChange, isRTL = false, currentLanguage = 'ar' }) => {
      return (
        <div className={`relative w-full min-h-screen bg-white flex flex-col ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Background style={style} fallbackColor="#1a1a1a" />
        
        {/* Custom Header */}
        <CustomHeader 
          pageName={data.headline || "Company Profile"}
          globalSettings={globalSettings}
          showHeader={data.showHeader !== false}
        />

        {/* Logo Section - only show if header is hidden */}
        {data.showHeader === false && (
          <div className="absolute top-8 left-8 z-10">
            <div className="flex items-center gap-3 mb-2">
              {data.logoImage ? (
                <img
                  src={data.logoImage}
                  alt="Company Logo"
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6zm8 0h6v6h-6v-6zM3 19h6v6H3v-6zm8 0h6v6h-6v-6zm8 0h6v6h-6v-6z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="text-white text-sm font-medium tracking-wide">
              {data.logoText || "company name"}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
          <h1 className="text-white font-bold text-8xl leading-none text-center whitespace-pre-line mb-8">
            {data.headline || "company\nprofile"}
          </h1>
          <div className="bg-amber-600 text-white px-8 py-4 text-xl font-semibold tracking-wide">
            {data.subtitle || "Team Arabia company"}
          </div>
        </div>

        {/* Website Footer - only show if header is hidden */}
        {data.showHeader === false && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-lg font-medium z-10">
            {data.website || "www.name.com"}
          </div>
        )}
        
        {/* Custom Footer */}
        <CustomFooter 
          pageNumber={1}
          totalPages={244}
          globalSettings={globalSettings}
        />
        </div>
      );
    },
    fields: [
      { key: "showHeader", label: "Show Header", type: "checkbox", defaultValue: true },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "subtitle", label: "Subtitle" },
      { key: "website", label: "Website" },
      { key: "logoText", label: "Logo Text" },
      { key: "logoImage", label: "Logo Image", type: "image" },
    ],
  },
  TOC: {
    id: "toc",
    name: "Table of Contents",
    defaultData: {
      items: [
        { title: "About Us" },
        { title: "Our Staff" },
        { title: "Services" },
        { title: "Projects" },
        { title: "Contact" },
        { title: "Appendix" },
      ],
      showHeader: true
    },
    Component: ({ data, style, globalSettings, isEditing = false, onDataChange, isRTL = false, currentLanguage = 'ar' }) => (
      <div className={`relative w-full min-h-screen aspect-[210/297] flex flex-col ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Background style={style} fallbackColor="#3b82f6" />
        <div className="flex-1 flex flex-col text-white px-16 pt-16">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-white font-light text-5xl mb-4 opacity-80">
              table
            </h1>
            <h2 className="text-white font-light text-6xl">of contents</h2>
          </div>

          {/* Content Items */}
          <div className="flex justify-center max-w-4xl mx-auto w-full relative">
            {/* Vertical Line */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-amber-400 opacity-60"
              style={{ height: `${(data.items || []).length * 120}px` }}
            ></div>

            <div className="flex flex-col w-full">
              {(data.items || []).map((item, index) => (
                <div key={index} className="relative">
                  {/* Item Row */}
                  <div
                    className={`flex items-center py-8 ${
                      index % 2 === 0
                        ? "justify-start pr-8"
                        : "justify-end pl-8"
                    }`}
                  >
                    {index % 2 === 0 ? (
                      // Left aligned (even indices)
                      <div className="flex items-center mr-8">
                        <div className="text-amber-400 font-bold text-5xl mr-6">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="text-white text-2xl font-light">
                          {item.title}
                        </div>
                      </div>
                    ) : (
                      // Right aligned (odd indices)
                      <div className="flex items-center ml-8">
                        <div className="text-white text-2xl font-light">
                          {item.title}
                        </div>
                        <div className="text-amber-400 font-bold text-5xl ml-6">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    fields: [
      {
        key: "items",
        label: "Items",
        type: "repeater",
        subFields: [{ key: "title", label: "Title" }],
      },
    ],
  },
  About: {
    id: "about",
    name: "About Us (Enhanced)",
    defaultData: {
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
        content: "Our clients are our partners, and this is precisely why we are fully committed to ensuring customer satisfaction. Additionally, we focus on developing partnerships with leading companies and individuals to provide you with added value.\n\nOur members are the catalyst for our prosperity and our greatest assets. We retain and recruit the best, and foster teamwork that results in excellent performance. We provide motivation and opportunities to help our talents discover their true capabilities.\n\nOur dedication to delivering high-quality standards, full compliance with project requirements, and on-time delivery is tangible. We are dedicated to providing TAB (Testing and Balancing) services to ensure that the HVAC (Heating, Ventilation, and Air Conditioning) system provides maximum comfort for building occupants using the lowest possible energy cost.\n\nTo become the leader in our field, we are driven to continuously improve our operations, communication, structure, and approach to construction challenges. We embrace the latest trends and technologies while building on proven methods.\n\nOur rapidly advancing business depends on maintaining and achieving quality and health/safety standards and procedures. At Team Arabia, we consider health and safety requirements in the work environment to be of paramount importance. This is reflected through the absence of any reportable incidents in all operations we have participated in so far."
      },
      images: {
        topImage: null,
        middleImage: null,
        bottomImage: null
      },
      showHeader: true
    },
    Component: ({ data, style, globalSettings, isEditing = false, onDataChange, isRTL = false, currentLanguage = 'ar' }) => (
      <div className={`relative w-full min-h-full bg-white flex flex-col ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Custom Header */}
        <CustomHeader 
          pageName="About"
          globalSettings={globalSettings}
          showHeader={data.showHeader !== false}
        />

        {/* Main Content */}
        <div className="flex-1">
        {/* Top Image */}
        {data.images?.topImage && (
          <div className="px-12 mb-8">
            <img 
              src={data.images.topImage} 
              alt="Top Image" 
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Vision Section */}
        <div className="px-12 mb-8">
          <div className="border-l-4 border-green-600 pl-6">
            <InlineEditor
              value={data.vision?.title}
              onChange={(value) => onDataChange?.({ ...data, vision: { ...data.vision, title: value } })}
              className="text-2xl font-bold text-gray-800 mb-4"
              placeholder="Vision Title"
              isEditing={isEditing}
              showLanguageSelector={true}
            />
          </div>
          <InlineEditor
            value={data.vision?.content}
            onChange={(value) => onDataChange?.({ ...data, vision: { ...data.vision, content: value } })}
            className="text-gray-700 leading-relaxed text-justify px-12"
            placeholder="Vision Description"
            multiline={true}
            isEditing={isEditing}
            showLanguageSelector={true}
          />
        </div>

        {/* Middle Image */}
        {data.images?.middleImage && (
          <div className="px-12 mb-8">
            <img 
              src={data.images.middleImage} 
              alt="Middle Image" 
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Core Values Section */}
        <div className="px-12 mb-8">
          <div className="border-l-4 border-green-600 pl-6">
            <InlineEditor
              value={data.coreValues?.title}
              onChange={(value) => onDataChange?.({ ...data, coreValues: { ...data.coreValues, title: value } })}
              className="text-2xl font-bold text-gray-800 mb-4"
              placeholder="Core Values Title"
              isEditing={isEditing}
              showLanguageSelector={true}
            />
          </div>
          <InlineEditor
            value={data.coreValues?.content}
            onChange={(value) => onDataChange?.({ ...data, coreValues: { ...data.coreValues, content: value } })}
            className="text-gray-700 leading-relaxed text-justify mb-4 px-12"
            placeholder="Core Values Description"
            multiline={true}
            isEditing={isEditing}
            showLanguageSelector={true}
          />
          <ul className="list-disc list-inside space-y-2 text-gray-700 px-12">
            {(data.coreValues?.values || []).map((value, index) => (
              <li key={index} className="text-right">
                <InlineEditor
                  value={value}
                  onChange={(newValue) => {
                    const newValues = [...(data.coreValues?.values || [])];
                    newValues[index] = newValue;
                    onDataChange?.({ ...data, coreValues: { ...data.coreValues, values: newValues } });
                  }}
                  placeholder="Vision Title"
                  isEditing={isEditing}
                  showLanguageSelector={true}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Company Section - No green border, just content */}
        <div className="px-12 mb-8">
          <InlineEditor
            value={data.company?.content}
            onChange={(value) => onDataChange?.({ ...data, company: { ...data.company, content: value } })}
            className="text-gray-700 leading-relaxed text-justify"
            placeholder="Company Description"
            multiline={true}
            isEditing={isEditing}
            showLanguageSelector={true}
          />
        </div>

        {/* Bottom Image */}
        {data.images?.bottomImage && (
          <div className="px-12 mb-8">
            <img 
              src={data.images.bottomImage} 
              alt="Bottom Image" 
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
        </div>

        {/* Custom Footer */}
        <CustomFooter 
          pageNumber={2}
          totalPages={244}
          globalSettings={globalSettings}
        />
      </div>
    ),
    fields: [
      { key: "showHeader", label: "Show Header", type: "checkbox", defaultValue: true },
      { key: "title", label: "Main Title", type: "textarea" },
      {
        key: "vision",
        label: "Vision Section",
        type: "object",
        subFields: [
          { key: "title", label: "Vision Title", type: "text" },
          { key: "content", label: "Vision Content", type: "textarea" }
        ]
      },
      {
        key: "coreValues",
        label: "Core Values",
        type: "object",
        subFields: [
          { key: "title", label: "Values Title", type: "text" },
          { key: "content", label: "Values Description", type: "textarea" },
          { key: "values", label: "Values List", type: "list" }
        ]
      },
      {
        key: "company",
        label: "Company Section",
        type: "object",
        subFields: [
          { key: "title", label: "Company Title", type: "text" },
          { key: "content", label: "Company Description", type: "textarea" }
        ]
      },
      {
        key: "images",
        label: "Images",
        type: "object",
        subFields: [
          { key: "topImage", label: "Top Image", type: "image" },
          { key: "middleImage", label: "Middle Image", type: "image" },
          { key: "bottomImage", label: "Bottom Image", type: "image" }
        ]
      }
    ],
  },
  Staff: {
    id: "staff",
    name: "Our Staff (Organizational Chart)",
    defaultData: {
      title: "Our\nStaff",
      subtitle:
        "The vision of Team Arabia is to continue advancing our roles as the leaders within the industry and develop strong relationships with all our skilled employees and esteemed clients. Integrity, trust, and performance drive us towards our journey of becoming the benchmark within our field",
      ceo: {
        name: "John Smith",
        position: "Chief Executive Officer",
        image: "",
      },
      managers: [
        {
          name: "Sarah Johnson",
          position: "Operations Manager",
          image: "",
        },
        {
          name: "Michael Brown",
          position: "Project Manager",
          image: "",
        },
        {
          name: "Emily Davis",
          position: "HR Manager",
          image: "",
        },
      ],
      staff: [
        {
          name: "David Wilson",
          position: "Senior Engineer",
          image: "",
        },
        {
          name: "Lisa Anderson",
          position: "Marketing Specialist",
          image: "",
        },
        {
          name: "Robert Taylor",
          position: "Financial Analyst",
          image: "",
        },
        {
          name: "Jennifer Martinez",
          position: "Quality Assurance",
          image: "",
        },
        {
          name: "Christopher Lee",
          position: "Technical Lead",
          image: "",
        },
      ],
      juniorStaff: [
        {
          name: "Amanda White",
          position: "Junior Developer",
          image: "",
        },
        {
          name: "Kevin Garcia",
          position: "Assistant Analyst",
          image: "",
        },
        {
          name: "Rachel Thompson",
          position: "Intern",
          image: "",
        },
        {
          name: "Daniel Rodriguez",
          position: "Junior Designer",
          image: "",
        },
        {
          name: "Ashley Clark",
          position: "Administrative Assistant",
          image: "",
        },
      ],
      showHeader: true
    },
    Component: ({ data, style, globalSettings, isEditing = false, onDataChange, isRTL = false, currentLanguage = 'ar' }) => {
      // Create styled node components
      const StyledCEONode = ({ person }) => (
        <div className="bg-blue-600 text-white p-3 rounded-2xl text-center w-[140px] h-[60px] flex flex-col justify-center shadow-lg">
          <h3 className="font-bold text-sm text-white leading-tight">
            {person.name}
          </h3>
          <p className="text-blue-100 text-xs">{person.position}</p>
        </div>
      );

      const StyledManagerNode = ({ person }) => (
        <div className="bg-orange-500 text-white p-3 rounded-2xl text-center w-[140px] h-[60px] flex flex-col justify-center shadow-lg">
          <h4 className="font-bold text-sm leading-tight text-white">
            {person.name}
          </h4>
          <p className="text-orange-100 text-xs">{person.position}</p>
        </div>
      );

      const StyledStaffNode = ({ person }) => (
        <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl p-3 text-center w-[140px] h-[60px] flex flex-col justify-center shadow-md">
          <h5 className="font-bold text-blue-900 text-sm leading-tight">
            {person.name}
          </h5>
          <p className="text-blue-700 text-xs">{person.position}</p>
        </div>
      );

      return (
        <div className={`relative w-full min-h-full  aspect-[210/297] bg-white flex flex-col ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          <Background style={style} fallbackColor="#ffffff" />
          <div className="relative z-10 flex-1 flex flex-col">
            {/* Custom Header */}
            <CustomHeader 
              pageName={data.title || "Our Staff"}
              globalSettings={globalSettings}
              showHeader={data.showHeader !== false}
            />
            
            {/* Content */}
            <div className="flex-1 p-8">
              <div className="mb-12">
                {isEditing ? (
                  <InlineEditor
                    value={data.title}
                    onChange={(value) => onDataChange({ ...data, title: value })}
                    className="text-blue-900 font-bold text-6xl leading-tight mb-6"
                    placeholder="Vision Description"
                    multiline
                    showLanguageSelector={true}
                  />
                ) : (
                  <h2 className="text-blue-900 font-bold text-6xl leading-tight mb-6">
                    {data.title}
                  </h2>
                )}
                {isEditing ? (
                  <InlineEditor
                    value={data.subtitle}
                    onChange={(value) => onDataChange({ ...data, subtitle: value })}
                    className="text-gray-600 text-lg leading-relaxed max-w-4xl"
                    placeholder="Mission Title"
                    multiline
                    showLanguageSelector={true}
                  />
                ) : (
                  <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">
                    {data.subtitle}
                  </p>
                )}
              </div>

            {/* Organizational Chart - Tree Layout with Simple Connecting Lines */}
            <div className="flex-1 flex flex-col justify-center items-center relative">
              {/* CEO Level */}
              {data.ceo && (
                <div className="relative mb-12">
                  <StyledCEONode person={data.ceo} />
                  {/* Vertical line down from CEO */}
                  {data.managers && data.managers.length > 0 && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-orange-500"></div>
                  )}
                </div>
              )}

              {/* Horizontal line connecting managers */}
              {data.managers && data.managers.length > 0 && (
                <div className="relative mb-4">
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 h-0.5 bg-orange-500"
                    style={{ width: "400px", top: "-16px" }}
                  ></div>
                  {/* Vertical lines down to each manager */}
                  <div className="flex justify-center space-x-24 relative">
                    {data.managers.map((manager, index) => (
                      <div key={index} className="relative">
                        <div
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-orange-500"
                          style={{ top: "-20px" }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Managers Level */}
              {data.managers && data.managers.length > 0 && (
                <div className="relative mb-12">
                  <div className="flex justify-center space-x-24 relative z-10">
                    {data.managers.map((manager, index) => (
                      <div key={index} className="relative">
                        <StyledManagerNode person={manager} />
                        {/* Vertical line down from each manager */}
                        {data.staff && data.staff.length > 0 && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-blue-400"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Horizontal line connecting staff */}
              {data.staff && data.staff.length > 0 && (
                <div className="relative mb-4">
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-400"
                    style={{ width: "600px", top: "-16px" }}
                  ></div>
                  {/* Vertical lines down to each staff member */}
                  <div className="flex justify-center space-x-16 relative">
                    {data.staff.slice(0, 5).map((staff, index) => (
                      <div key={index} className="relative">
                        <div
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-blue-400"
                          style={{ top: "-20px" }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff Level */}
              {data.staff && data.staff.length > 0 && (
                <div className="relative mb-12">
                  <div className="flex justify-center space-x-16 relative z-10">
                    {data.staff.slice(0, 5).map((staff, index) => (
                      <div key={index} className="relative">
                        <StyledStaffNode person={staff} />
                        {/* Vertical line down to junior staff */}
                        {data.juniorStaff && data.juniorStaff.length > 0 && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-blue-400"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Horizontal line connecting junior staff */}
              {data.juniorStaff && data.juniorStaff.length > 0 && (
                <div className="relative mb-4">
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-400"
                    style={{ width: "600px", top: "-16px" }}
                  ></div>
                  {/* Vertical lines down to each junior staff member */}
                  <div className="flex justify-center space-x-16 relative">
                    {data.juniorStaff.slice(0, 5).map((junior, index) => (
                      <div key={index} className="relative">
                        <div
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-blue-400"
                          style={{ top: "-20px" }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Junior Staff Level */}
              {data.juniorStaff && data.juniorStaff.length > 0 && (
                <div className="relative">
                  <div className="flex justify-center space-x-16 relative z-10">
                    {data.juniorStaff.slice(0, 5).map((junior, index) => (
                      <StyledStaffNode key={index} person={junior} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            </div>
            
            {/* Custom Footer */}
            <CustomFooter 
              pageNumber={2}
              totalPages={244}
              globalSettings={globalSettings}
            />
          </div>
        </div>
      );
    },
    fields: [
      { key: "showHeader", label: "إظهار الهيدر", type: "checkbox", defaultValue: true },
      { key: "title", label: "Title", type: "textarea" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      {
        key: "ceo",
        label: "CEO/Top Executive",
        type: "object",
        subFields: [
          { key: "name", label: "Name" },
          { key: "position", label: "Position" },
          { key: "image", label: "Image", type: "image" },
        ],
      },
      {
        key: "managers",
        label: "Managers",
        type: "repeater",
        subFields: [
          { key: "name", label: "Name" },
          { key: "position", label: "Position" },
          { key: "image", label: "Image", type: "image" },
        ],
      },
      {
        key: "staff",
        label: "Staff Members",
        type: "repeater",
        subFields: [
          { key: "name", label: "Name" },
          { key: "position", label: "Position" },
          { key: "image", label: "Image", type: "image" },
        ],
      },
      {
        key: "juniorStaff",
        label: "Junior Staff",
        type: "repeater",
        subFields: [
          { key: "name", label: "Name" },
          { key: "position", label: "Position" },
          { key: "image", label: "Image", type: "image" },
        ],
      },
    ],
  },
  Content: {
    id: "content",
    name: "Content (Left Ruler)",
    defaultData: {
      title: "content.",
      sections: [
        {
          heading: "MEP Testing & Commissioning",
          content:
            "Team Arabia Company specializes in comprehensive MEP testing and commissioning services, ensuring all mechanical, electrical, and plumbing systems operate at peak efficiency. Our experienced engineers conduct thorough testing protocols to verify system performance against design specifications and industry standards.",
        },
        {
          heading: "HVAC Testing and Balancing (TAB)",
          content:
            "Our TAB services ensure optimal air and water flow throughout your building systems. We use state-of-the-art equipment to measure, adjust, and balance HVAC systems for maximum comfort, energy efficiency, and indoor air quality. Our certified technicians follow NEBB and AABC standards.",
        },
        {
          heading: "LEED Commissioning Services",
          content:
            "As certified LEED commissioning agents, we help projects achieve green building certification by ensuring all systems meet LEED requirements. Our commissioning process includes design review, construction oversight, functional testing, and ongoing monitoring to maintain sustainable performance.",
        },
        {
          heading: "Energy Efficiency Optimization",
          content:
            "We provide comprehensive energy audits and optimization services to reduce operational costs and environmental impact. Our team identifies opportunities for energy savings through system improvements, control strategies, and equipment upgrades that deliver measurable results.",
        },
        {
          heading: "Operation & Maintenance Manuals",
          content:
            "Our detailed O&M manuals provide building operators with essential information for maintaining optimal system performance. We create comprehensive documentation including equipment specifications, maintenance schedules, troubleshooting guides, and performance benchmarks.",
        },
      ],
      showHeader: true
    },
    Component: ({ data, style, globalSettings, isEditing = false, onDataChange, isRTL = false, currentLanguage = 'ar' }) => (
      <div className="relative w-full h-[1123px] bg-white">
        <Background style={style} fallbackColor="#ffffff" />
        <div className="relative z-10 h-full flex flex-col">
          {/* Custom Header */}
          <CustomHeader 
            pageName={data.title || "Content"}
            globalSettings={globalSettings}
            showHeader={data.showHeader !== false}
          />
          
          <div className="flex-1 flex">
            <div className="w-20 bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center py-12">
              <div className="text-white font-bold text-2xl mb-6">03</div>
              <div className="flex-1 w-0.5 bg-white/30" />
              <div className="text-white/70 text-sm font-medium transform -rotate-90 origin-center mt-6">
                CONTENT
              </div>
            </div>
            <div className="flex-1 p-12">
              <div className="h-full flex flex-col">
                {isEditing ? (
                  <InlineEditor
                    value={data.title}
                    onChange={(value) => onDataChange({ ...data, title: value })}
                    className="text-blue-900 font-bold text-6xl leading-tight mb-10"
                    placeholder="Mission Description"
                    showLanguageSelector={true}
                  />
                ) : (
                  <h2 className="text-blue-900 font-bold text-6xl leading-tight mb-10">
                    {data.title}
                  </h2>
                )}
                <div className="flex-1 space-y-8 overflow-hidden">
                  {(data.sections || []).map((section, i) => (
                    <div key={i} className="border-l-4 border-blue-300 pl-8 py-2">
                      {isEditing ? (
                        <InlineEditor
                          value={section.heading}
                          onChange={(value) => {
                            const newSections = [...(data.sections || [])];
                            newSections[i] = { ...section, heading: value };
                            onDataChange({ ...data, sections: newSections });
                          }}
                          className="text-blue-900 font-bold text-xl mb-3 leading-tight"
                          placeholder="Section Heading"
                          showLanguageSelector={true}
                        />
                      ) : (
                        <h3 className="text-blue-900 font-bold text-xl mb-3 leading-tight">
                          {section.heading}
                        </h3>
                      )}
                      {isEditing ? (
                        <InlineEditor
                          value={section.content}
                          onChange={(value) => {
                            const newSections = [...(data.sections || [])];
                            newSections[i] = { ...section, content: value };
                            onDataChange({ ...data, sections: newSections });
                          }}
                          className="text-gray-700 text-base leading-relaxed text-justify"
                          placeholder="Section Content"
                          multiline
                          showLanguageSelector={true}
                        />
                      ) : (
                        <p className="text-gray-700 text-base leading-relaxed text-justify">
                          {section.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Custom Footer */}
          <CustomFooter 
            pageNumber={3}
            totalPages={244}
            globalSettings={globalSettings}
          />
        </div>
      </div>
    ),
    fields: [
      { key: "title", label: "Title", type: "textarea" },
      {
        key: "sections",
        label: "Sections",
        type: "repeater",
        subFields: [
          { key: "heading", label: "Heading" },
          { key: "content", label: "Content", type: "textarea" },
        ],
      },
    ],
  },
  Projects: {
    id: "projects",
    name: "Our Projects",
    defaultData: {
      title: "OUR PROJECTS",
      projects: [
        {
          title: "Holiday Inn Hotel",
          subtitle: "Estidama Tower Riyadh",
          image: "/api/placeholder/400/250",
          description: "A luxury hotel project featuring modern architecture and sustainable design principles."
        },
        {
          title: "Psychiatric and Addiction Hospital",
          subtitle: "Abha",
          image: "/api/placeholder/400/250",
          description: "A specialized healthcare facility designed with patient comfort and therapeutic environments in mind."
        },
        {
          title: "College of Medicine Building",
          subtitle: "King Saud University",
          image: "/api/placeholder/400/250",
          description: "Health sciences complex featuring three medical buildings with state-of-the-art facilities."
        },
        {
          title: "College of Medicine Building",
          subtitle: "King Saud University",
          image: "/api/placeholder/400/250",
          description: "Health sciences complex featuring three medical buildings with advanced research facilities."
        }
      ],
      currentPage: 1,
      totalPages: 244,
      showHeader: true
    },
    Component: ({ data, style, globalSettings, isEditing = false, onDataChange, isRTL = false, currentLanguage = 'ar' }) => (
      <div className={`relative w-full min-h-full bg-white flex flex-col ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Background style={style} fallbackColor="#ffffff" />
        
        {/* Custom Header */}
        <CustomHeader 
          pageName="Projects"
          globalSettings={globalSettings}
          showHeader={data.showHeader !== false}
        />

        {/* Main Content */}
        <div className="flex-1 px-12 py-8">
          {/* Title */}
          <div className="mb-12 text-center">
            <InlineEditor
              value={data.title}
              onChange={(value) => onDataChange?.({ ...data, title: value })}
              isEditing={isEditing}
              className="text-3xl font-bold text-gray-800 tracking-wide"
              placeholder="OUR PROJECTS"
            />
          </div>

          {/* Projects Grid - 1 column */}
          <div className="grid grid-cols-1 gap-6 w-full max-w-none">
            {data.projects && data.projects.map((project, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col h-80">
                  {/* Project Image */}
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <InlineEditor
                      value={project.image}
                      onChange={(value) => {
                        const updatedProjects = [...data.projects];
                        updatedProjects[index] = { ...project, image: value };
                        onDataChange?.({ ...data, projects: updatedProjects });
                      }}
                      isEditing={isEditing}
                      type="image"
                      className="w-full h-full object-cover"
                      placeholder="Click to upload project image"
                    />
                  </div>
                  
                  {/* Project Info */}
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    <InlineEditor
                      value={project.title}
                      onChange={(value) => {
                        const updatedProjects = [...data.projects];
                        updatedProjects[index] = { ...project, title: value };
                        onDataChange?.({ ...data, projects: updatedProjects });
                      }}
                      isEditing={isEditing}
                      className="text-base font-bold text-gray-800 mb-1 leading-tight"
                      placeholder="Project Title"
                    />
                    <InlineEditor
                      value={project.subtitle}
                      onChange={(value) => {
                        const updatedProjects = [...data.projects];
                        updatedProjects[index] = { ...project, subtitle: value };
                        onDataChange?.({ ...data, projects: updatedProjects });
                      }}
                      isEditing={isEditing}
                      className="text-sm text-gray-600 font-medium"
                      placeholder="Project Subtitle"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Footer with Pagination */}
        <CustomFooter 
          currentPage={data.currentPage || 1}
          totalPages={data.totalPages || 244}
          globalSettings={globalSettings}
        />
      </div>
    ),
    fields: [
      { key: "title", label: "Page Title", type: "text" },
      {
        key: "projects",
        label: "Projects",
        type: "repeater",
        subFields: [
          { key: "title", label: "Project Title", type: "text" },
          { key: "subtitle", label: "Project Subtitle", type: "text" },
          { key: "image", label: "Project Image", type: "image" },
          { key: "description", label: "Project Description", type: "textarea" }
        ],
      },
      { key: "currentPage", label: "Current Page", type: "number" },
      { key: "totalPages", label: "Total Pages", type: "number" }
    ],
  },
};
