import React from 'react';

const HeaderDesignSelector = ({ selectedDesign, onDesignSelect }) => {
  const headerDesigns = [
    {
      id: 'header_1',
      name: 'تصميم كلاسيكي',
      preview: '/images/headers/header_1.jpg',
      description: 'تصميم بسيط وأنيق مع شعار الشركة'
    },
    {
      id: 'header_2',
      name: 'تصميم حديث',
      preview: '/images/headers/header_2.jpg',
      description: 'تصميم عصري مع خطوط جريئة'
    },
    {
      id: 'header_3',
      name: 'تصميم مؤسسي',
      preview: '/images/headers/header_3.jpg',
      description: 'تصميم رسمي للشركات الكبيرة'
    },
    {
      id: 'header_4',
      name: 'تصميم إبداعي',
      preview: '/images/headers/header_4.jpg',
      description: 'تصميم مبتكر مع عناصر جرافيكية'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {headerDesigns.map((design) => (
        <div
          key={design.id}
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
            selectedDesign?.id === design.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onDesignSelect(design)}
        >
          <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            <img
              src={design.preview}
              alt={design.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center text-gray-500">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 className="font-medium text-gray-800 mb-1">{design.name}</h3>
          <p className="text-sm text-gray-600">{design.description}</p>
          {selectedDesign?.id === design.id && (
            <div className="mt-2 flex items-center text-blue-600">
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">محدد</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HeaderDesignSelector;