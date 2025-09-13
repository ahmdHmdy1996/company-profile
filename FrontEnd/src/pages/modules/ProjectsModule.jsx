import React, { useState } from "react";
import PageManager from "../../components/PageManager";
import SectionManager from "../../components/SectionManager";

const ProjectsModule = () => {
  const [selectedPageId, setSelectedPageId] = useState(null);

  const handlePageSelected = (pageId) => {
    setSelectedPageId(pageId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">مديول مشاريعنا</h1>
          <p className="text-gray-600 mt-1">
            إدارة صفحات ومحتوى قسم "مشاريعنا"
          </p>
        </div>

        <div className="p-6">
          {/* Page Management */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              إدارة الصفحات
            </h2>
            <PageManager
              moduleType="projects"
              onPageSelected={handlePageSelected}
              selectedPageId={selectedPageId}
            />
          </div>

          {/* Section Management - Shows below when page is selected */}
          {selectedPageId && (
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                إدارة الأقسام
              </h2>
              <SectionManager pageId={selectedPageId} moduleType="projects" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsModule;
