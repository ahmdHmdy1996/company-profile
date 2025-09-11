import React, { useState, useEffect } from "react";
import SectionDesignSelector from "./SectionDesignSelector";
import DynamicDataFields from "./DynamicDataFields";
import apiService from "../services/api";
import { createSectionPayload } from "../utils/htmlTemplateRenderer";

const SectionManager = ({ pageId, moduleType }) => {
  const [sections, setSections] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sectionData, setSectionData] = useState({
    design: null,
    order: 1,
    data: {},
  });

  useEffect(() => {
    // Load sections when pageId changes
    if (pageId) {
      const loadSections = async () => {
        try {
          const response = await apiService.getSections(pageId);
          if (response.status) {
            setSections(response.data || []);
          }
        } catch (error) {
          console.error("Error loading sections:", error);
        }
      };

      loadSections();
    }
  }, [pageId]);

  const handleInputChange = (field, value) => {
    setSectionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDynamicDataChange = (newData) => {
    setSectionData((prev) => ({
      ...prev,
      data: newData,
    }));
  };

  const handleCreateSection = async () => {
    if (!sectionData.design) {
      alert("يرجى اختيار تصميم للقسم");
      return;
    }

    try {
      // Use the utility function to create section payload with rendered HTML
      const sectionPayload = createSectionPayload(
        sectionData.design,
        sectionData.data,
        pageId,
        sectionData.order
      );

      // Log the payload to see what's being sent
      console.log("Section payload being sent:", sectionPayload);
      console.log("Parsed data preview:", JSON.parse(sectionPayload.data));

      const response = await apiService.createSection(sectionPayload);

      if (response.status) {
        setSections((prev) => [...prev, response.data]);
        setSectionData({
          design: null,
          order: sections.length + 2,
          data: {},
        });
        setShowCreateForm(false);
        alert("تم إنشاء القسم بنجاح!");
      } else {
        alert("حدث خطأ أثناء إنشاء القسم");
      }
    } catch (error) {
      console.error("Error creating section:", error);
      alert("حدث خطأ أثناء إنشاء القسم");
    }
  };

  const handleDesignSelect = (design) => {
    setSectionData((prev) => ({
      ...prev,
      design,
      data: design.defaultData || {},
    }));
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) {
      return;
    }

    try {
      const response = await apiService.deleteSection(sectionId);

      if (response.status) {
        setSections(sections.filter((section) => section.id !== sectionId));
        alert("تم حذف القسم بنجاح!");
      } else {
        alert("حدث خطأ أثناء حذف القسم");
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("حدث خطأ أثناء حذف القسم");
    }
  };

  return (
    <div className="space-y-4">
      {/* Create Section Button */}
      <button
        onClick={() => setShowCreateForm(true)}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        إضافة قسم جديد
      </button>

      {/* Create Section Form */}
      {showCreateForm && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            إنشاء قسم جديد
          </h3>

          {/* Section Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ترتيب القسم
            </label>
            <input
              type="number"
              value={sectionData.order}
              onChange={(e) =>
                handleInputChange("order", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>

          {/* Design Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختيار التصميم
            </label>
            <SectionDesignSelector
              moduleType={moduleType}
              selectedDesign={sectionData.design}
              onDesignSelect={handleDesignSelect}
            />
          </div>

          {/* Dynamic Data Fields */}
          {sectionData.design && (
            <div className="space-y-4">
              <DynamicDataFields
                design={sectionData.design}
                data={sectionData.data}
                onChange={handleDynamicDataChange}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 space-x-reverse pt-4">
            <button
              onClick={handleCreateSection}
              disabled={!sectionData.design}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              إنشاء القسم
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          الأقسام الموجودة
        </h3>
        {sections.length === 0 ? (
          <p className="text-gray-500 text-center py-4">لا توجد أقسام بعد</p>
        ) : (
          sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {section.design?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      الترتيب: {section.order}
                    </p>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      حذف
                    </button>
                  </div>
                </div>
                {section.design?.preview && (
                  <div className="mt-3">
                    <img
                      src={section.design.preview}
                      alt={section.design.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default SectionManager;
