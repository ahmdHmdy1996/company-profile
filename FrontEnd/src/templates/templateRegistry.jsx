import React from "react";

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
    case 'Cover':
      return {
        headline: templateData.headline || defaultData.headline,
        subtitle: templateData.subtitle || defaultData.subtitle,
        website: templateData.website || defaultData.website,
        logoText: templateData.logoText || defaultData.logoText,
        logoImage: templateData.logoImage || defaultData.logoImage,
      };
    case 'About':
      return {
        title: templateData.title || defaultData.title,
        paragraphs: templateData.paragraphs && templateData.paragraphs.length > 0 ? templateData.paragraphs : defaultData.paragraphs,
        heroCaption: templateData.heroCaption || defaultData.heroCaption,
      };
    case 'Staff':
      return {
        title: templateData.title || defaultData.title,
        subtitle: templateData.subtitle || defaultData.subtitle,
        ceo: templateData.ceo || defaultData.ceo,
        managers: templateData.managers && templateData.managers.length > 0 ? templateData.managers : defaultData.managers,
        staff: templateData.staff && templateData.staff.length > 0 ? templateData.staff : defaultData.staff,
        juniorStaff: templateData.juniorStaff && templateData.juniorStaff.length > 0 ? templateData.juniorStaff : defaultData.juniorStaff,
      };
    case 'Content':
      return {
        title: templateData.title || defaultData.title,
        sections: templateData.sections && templateData.sections.length > 0 ? templateData.sections : defaultData.sections,
      };
    case 'TOC':
      return {
        items: templateData.items && templateData.items.length > 0 ? templateData.items : defaultData.items,
        heading: templateData.heading || defaultData.heading,
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
    },
    Component: ({ data, style }) => (
      <div className="relative w-full h-[1123px] overflow-hidden">
        <Background style={style} fallbackColor="#1a1a1a" />
        
        {/* Logo Section */}
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
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6zm8 0h6v6h-6v-6zM3 19h6v6H3v-6zm8 0h6v6h-6v-6zm8 0h6v6h-6v-6z"/>
                </svg>
              </div>
            )}
          </div>
          <div className="text-white text-sm font-medium tracking-wide">
            {data.logoText || "company name"}
          </div>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-white font-bold text-8xl leading-none text-center whitespace-pre-line mb-8">
            {data.headline || "company\nprofile"}
          </h1>
          <div className="bg-amber-600 text-white px-8 py-4 text-xl font-semibold tracking-wide">
            {data.subtitle || "Team Arabia company"}
          </div>
        </div>

        {/* Website Footer */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-lg font-medium z-10">
          {data.website || "www.name.com"}
        </div>
      </div>
    ),
    fields: [
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
    },
    Component: ({ data, style }) => (
      <div className="relative w-full h-[1123px]">
        <Background
          style={style}
          fallbackColor="#3b82f6"
        />
        <div className="absolute inset-0 flex flex-col text-white px-16 pt-16">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-white font-light text-5xl mb-4 opacity-80">
              table
            </h1>
            <h2 className="text-white font-light text-6xl">
              of contents
            </h2>
          </div>

          {/* Content Items */}
          <div className="flex justify-center max-w-4xl mx-auto w-full relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-amber-400 opacity-60" style={{height: `${(data.items || []).length * 120}px`}}></div>
            
            <div className="flex flex-col w-full">
              {(data.items || []).map((item, index) => (
                <div key={index} className="relative">
                  {/* Item Row */}
                  <div className={`flex items-center py-8 ${index % 2 === 0 ? 'justify-start pr-8' : 'justify-end pl-8'}`}>
                    {index % 2 === 0 ? (
                      // Left aligned (even indices)
                      <div className="flex items-center mr-8">
                        <div className="text-amber-400 font-bold text-5xl mr-6">
                          {String(index + 1).padStart(2, '0')}
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
                          {String(index + 1).padStart(2, '0')}
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
        subFields: [
          { key: "title", label: "Title" },
        ],
      },
    ],
  },
  About: {
    id: "about",
    name: "About Us (Two‑Column)",
    defaultData: {
      title: "about\nus.",
      paragraphs: [
        "Team Arabia Company is recognized as one of the market leader in MEP Testing & Commissioning services, we've been exceeding and meeting the standards of the industry since we have started.",
        "We aim to offer our clients with the easiest, cheapest, and quickest service possible with the aim of restoring the environment to normal. Our background and experience in energy efficiency are exceedingly superb.",
        "Team Arabia Company 2006 Since our establishment in has aimed at meeting the needs of specialized and professional engineering services to our clients by continually improving the quality of the building environment which manages the entire process perfectly.",
        "We have offered various services to our clients such as commissioning management services for new construction buildings, HVAC Testing and Balancing (TAB), LEED Commissioning Agents, operation and maintenance (O&M) manual, duct cleaning, and improvement of energy efficiency to meet our clients and owners' goals. We care for our clients and aim at offering them the best services. We can produce outcomes and develop long term relationships with our clients.",
        "By working with us, you can reduce the risk of operational problems and ensure higher quality control and plant efficiency.",
        "Team Arabia Company is based in Riyadh, Saudi Arabia. It's dynamic and has the enlighten expertise, solid foundations, and the regional reach required for delivering optimal results and professional services to the rapidly growing sectors in Saudi Arabia. This will help to minimize the energy expenses for our clients.",
        "We firmly believe that energy will always remain to be an essential issue to humankind since its conversion helps us to preserve the natural environment, although energy inefficiency tends to de"
      ],
      heroCaption: "Engineering excellence",
    },
    Component: ({ data, style }) => (
      <div className="relative w-full h-[1123px] flex">
        <div className="w-1/2 p-12 bg-white flex flex-col">
          <h2 className="text-blue-900 font-bold text-6xl leading-tight whitespace-pre-line mb-8">
            {data.title}
          </h2>
          <div className="flex-1 space-y-4 text-gray-700 text-base leading-relaxed overflow-hidden">
            {(data.paragraphs || []).map((para, i) => (
              <p key={i} className="text-justify">{para}</p>
            ))}
          </div>
          <div className="mt-auto pt-8">
            <div className="w-16 h-1 bg-blue-900 mb-3" />
            <div className="text-blue-900 font-bold text-4xl">01</div>
          </div>
        </div>
        <div className="w-1/2 relative">
          <Background style={style} fallbackColor="#1e40af" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-600/60" />
          <div className="absolute bottom-12 right-12 text-white text-lg font-medium">
            {data.heroCaption}
          </div>
        </div>
      </div>
    ),
    fields: [
      { key: "title", label: "Title", type: "textarea" },
      { key: "paragraphs", label: "Paragraphs", type: "list" },
      { key: "heroCaption", label: "Photo Caption" },
    ],
  },
  Staff: {
    id: "staff",
    name: "Our Staff (Organizational Chart)",
    defaultData: {
      title: "Our\nStaff",
      subtitle: "The vision of Team Arabia is to continue advancing our roles as the leaders within the industry and develop strong relationships with all our skilled employees and esteemed clients. Integrity, trust, and performance drive us towards our journey of becoming the benchmark within our field",
      ceo: {
        name: "Murad al-jammal",
        position: "Executive Manager",
        image: "",
      },
      managers: [
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
      ],
      staff: [
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
      ],
      juniorStaff: [
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
        {
          name: "Murad al-jammal",
          position: "Executive Manager",
          image: "",
        },
      ],
    },
    Component: ({ data, style }) => {
      // Create styled node components
      const StyledCEONode = ({ person }) => (
        <div className="bg-blue-600 text-white p-3 rounded-2xl text-center w-[140px] h-[60px] flex flex-col justify-center shadow-lg">
          <h3 className="font-bold text-sm text-white leading-tight">{person.name}</h3>
          <p className="text-blue-100 text-xs">{person.position}</p>
        </div>
      );
      
      const StyledManagerNode = ({ person }) => (
        <div className="bg-orange-500 text-white p-3 rounded-2xl text-center w-[140px] h-[60px] flex flex-col justify-center shadow-lg">
          <h4 className="font-bold text-sm leading-tight text-white">{person.name}</h4>
          <p className="text-orange-100 text-xs">{person.position}</p>
        </div>
      );
      
      const StyledStaffNode = ({ person }) => (
        <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl p-3 text-center w-[140px] h-[60px] flex flex-col justify-center shadow-md">
          <h5 className="font-bold text-blue-900 text-sm leading-tight">{person.name}</h5>
          <p className="text-blue-700 text-xs">{person.position}</p>
        </div>
      );
      
      return (
        <div className="relative w-full h-[1123px] bg-white p-8">
          <Background style={style} fallbackColor="#ffffff" />
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="mb-12">
              <h2 className="text-blue-900 font-bold text-6xl leading-tight mb-6">
                {data.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">
                {data.subtitle}
              </p>
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
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-0.5 bg-orange-500" style={{width: '400px', top: '-16px'}}></div>
                  {/* Vertical lines down to each manager */}
                  <div className="flex justify-center space-x-24 relative">
                    {data.managers.map((manager, index) => (
                      <div key={index} className="relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-orange-500" style={{top: '-20px'}}></div>
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
                        {(data.staff && data.staff.length > 0) && (
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
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-400" style={{width: '600px', top: '-16px'}}></div>
                  {/* Vertical lines down to each staff member */}
                  <div className="flex justify-center space-x-16 relative">
                    {data.staff.slice(0, 5).map((staff, index) => (
                      <div key={index} className="relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-blue-400" style={{top: '-20px'}}></div>
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
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-400" style={{width: '600px', top: '-16px'}}></div>
                  {/* Vertical lines down to each junior staff member */}
                  <div className="flex justify-center space-x-16 relative">
                    {data.juniorStaff.slice(0, 5).map((junior, index) => (
                      <div key={index} className="relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-blue-400" style={{top: '-20px'}}></div>
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

            {/* Footer */}
            <div className="mt-8">
              <div className="w-16 h-1 bg-blue-900 mb-3" />
              <div className="text-blue-900 font-bold text-4xl">02</div>
            </div>
          </div>
        </div>
      );
    },
    fields: [
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
    },
    Component: ({ data, style }) => (
      <div className="relative w-full h-[1123px] bg-white flex">
        <div className="w-20 bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center py-12">
          <div className="text-white font-bold text-2xl mb-6">03</div>
          <div className="flex-1 w-0.5 bg-white/30" />
          <div className="text-white/70 text-sm font-medium transform -rotate-90 origin-center mt-6">
            CONTENT
          </div>
        </div>
        <div className="flex-1 p-12">
          <Background style={style} fallbackColor="#ffffff" />
          <div className="relative z-10 h-full flex flex-col">
            <h2 className="text-blue-900 font-bold text-6xl leading-tight mb-10">
              {data.title}
            </h2>
            <div className="flex-1 space-y-8 overflow-hidden">
              {(data.sections || []).map((section, i) => (
                <div key={i} className="border-l-4 border-blue-300 pl-8 py-2">
                  <h3 className="text-blue-900 font-bold text-xl mb-3 leading-tight">
                    {section.heading}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed text-justify">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between items-center">
              <div className="w-16 h-1 bg-blue-900" />
              <div className="text-gray-400 text-sm font-medium">
                Page 3 of 5
              </div>
            </div>
          </div>
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
};
