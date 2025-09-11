import React, { useState } from 'react';
import PageManager from '../../components/PageManager';
import SectionManager from '../../components/SectionManager';

const ToolsInstrumentsModule = () => {
  const [selectedPageId, setSelectedPageId] = useState(null);

  const handlePageSelected = (pageId) => {
    setSelectedPageId(pageId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">مديول الأدوات والمعدات</h1>
          <p className="text-gray-600 mt-1">إدارة صفحات ومحتوى قسم "الأدوات والمعدات"</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Page Management */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">إدارة الصفحات</h2>
              <PageManager
                moduleType="tools_instruments"
                onPageSelected={handlePageSelected}
                selectedPageId={selectedPageId}
              />
            </div>

            {/* Section Management */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">إدارة الأقسام</h2>
              {selectedPageId ? (
                <SectionManager
                  pageId={selectedPageId}
                  moduleType="tools_instruments"
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">اختر صفحة لإدارة أقسامها</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsInstrumentsModule;