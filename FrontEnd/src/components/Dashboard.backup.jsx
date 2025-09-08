import React, { useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Download, FileText, Edit } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import Sidebar from "./Sidebar";
import TemplateSelector from "./TemplateSelector";
import EditorPanel from "./EditorPanel";
import TemplateRenderer from "./TemplateRenderer";
import { TEMPLATES } from "../templates/templateRegistry.jsx";

// Helper function to create a new page
function makePage(templateId) {
  const template = TEMPLATES[templateId];
  return {
    id: uuidv4(),
    templateId,
    data: { ...template.defaultData },
    style: { backgroundColor: "#000000", backgroundImage: null },
  };
}

// Default sections configuration
const DEFAULT_SECTIONS = [
  {
    id: uuidv4(),
    name: "Cover",
    templateId: "Cover",
    pages: [makePage("Cover")],
  },
  {
    id: uuidv4(),
    name: "Table of Contents",
    templateId: "TOC",
    pages: [makePage("TOC")],
  },
  {
    id: uuidv4(),
    name: "About Us",
    templateId: "About",
    pages: [makePage("About")],
  },
  {
    id: uuidv4(),
    name: "Our Staff",
    templateId: "Staff",
    pages: [makePage("Staff")],
  },
  {
    id: uuidv4(),
    name: "Content",
    templateId: "Content",
    pages: [makePage("Content")],
  },
];

export default function Dashboard() {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [selectedPageId, setSelectedPageId] = useState(
    DEFAULT_SECTIONS[0]?.pages[0]?.id
  );
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef(null);

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
              // If no pages left, delete the section
              return null;
            }
            // If deleted page was selected, select first remaining page
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

        // Temporarily render this page
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

      pdf.save("company-profile.pdf");
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
        </div>
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          <Download size={14} />
          {isExporting ? "Exporting..." : "Export"}
        </button>
      </div>

      {/* Sidebar */}
      <div className="lg:flex-shrink-0  border-r border-gray-200 bg-white">
        <Sidebar
          sections={sections}
          selectedPageId={selectedPageId}
          onSelectPage={setSelectedPageId}
          onAddSection={() => setShowTemplateSelector(true)}
          onAddPage={addPageToSection}
          onDeleteSection={deleteSection}
          onDeletePage={deletePage}
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
              <p className="text-gray-500 text-xs">
                Create professional PDF profiles
              </p>
            </div>
          </div>
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm transition-all"
          >
            <Download size={16} />
            {isExporting ? "Exporting..." : "Export PDF"}
          </button>
        </div>

        <div className="flex-1 flex flex-col xl:flex-row gap-2 p-2 min-h-0">
          {/* Editor Panel */}
          {selectedPage && (
            <div className="xl:w-64 xl:flex-shrink-0 order-2 xl:order-1 border-r border-gray-200 bg-white">
              <div className="h-full max-h-[35vh] xl:max-h-none overflow-y-auto">
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
                />
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
                {!selectedSection ? (
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
    </div>
  );
}
