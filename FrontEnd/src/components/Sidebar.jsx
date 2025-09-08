import React from "react";
import { FilePlus2, Plus, Folder, Trash2, FileText } from "lucide-react";

export default function Sidebar({
  sections,
  selectedPageId,
  onSelectPage,
  onAddSection,
  onAddPage,
  onDeleteSection,
  onDeletePage,
  isLoading = false,
}) {
  return (
    <div className="w-full lg:w-60 border-r border-gray-200 lg:border-b-0 border-b flex flex-col h-64 lg:h-full overflow-y-auto lg:overflow-visible bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Sections
            </h2>
            <p className="text-gray-500 text-xs">Manage your content</p>
          </div>
          <button
            onClick={onAddSection}
            className="flex items-center gap-1 bg-blue-600 text-white px-2 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {isLoading ? (
          // Loading skeleton for sections
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded border border-gray-200 overflow-hidden animate-pulse">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {[1, 2].map((j) => (
                    <div key={j} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          sections.map((section) => (
            <div key={section.id}>
              <SectionItem
                section={section}
                selectedPageId={selectedPageId}
                onSelectPage={onSelectPage}
                onAddPage={onAddPage}
                onDeleteSection={onDeleteSection}
                onDeletePage={onDeletePage}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SectionItem({
  section,
  selectedPageId,
  onSelectPage,
  onAddPage,
  onDeleteSection,
  onDeletePage,
}) {
  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden hover:shadow-sm transition-all">
      {/* Section Header */}
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <span className="font-medium text-gray-800 text-sm">
                {section.name}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                  {section.pages.length} pages
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onAddPage(section.id)}
              className="p-1 rounded bg-white text-blue-600 hover:bg-blue-50 transition-all"
              title="Add Page"
            >
              <FilePlus2 size={14} />
            </button>
            <button
              onClick={() => onDeleteSection(section.id)}
              className="p-1 rounded bg-white text-red-500 hover:bg-red-50 transition-all"
              title="Delete Section"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="p-3 space-y-2">
        {section.pages.map((page, index) => (
          <PageItem
            key={page.id}
            page={page}
            index={index}
            isSelected={page.id === selectedPageId}
            onSelect={() => onSelectPage(page.id)}
            onDelete={() => onDeletePage(section.id, page.id)}
            canDelete={section.pages.length > 1}
          />
        ))}
        <button
          onClick={() => onAddPage(section.id)}
          className="w-full p-2 border border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-xs"
        >
          <Plus size={14} className="mx-auto mb-1" />
          Add Page
        </button>
      </div>
    </div>
  );
}

function PageItem({ page, index, isSelected, onSelect, onDelete, canDelete }) {
  return (
    <div
      className={`p-2 cursor-pointer rounded border transition-all group ${
        isSelected
          ? "bg-white border-blue-600 text-blue-600"
          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          
          <div>
            <span className="text-xs font-medium">Page {index + 1}</span>
            <div className="text-xs opacity-75">{page.templateId}</div>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-black hover:text-red-600 hover:bg-red-100 rounded transition-all opacity-0 group-hover:opacity-100"
            title="Delete Page"
          >
            <Trash2 size={10} />
          </button>
        )}
      </div>

      {/* Background indicator */}
      {page.style?.backgroundImage && (
        <div className="mt-1 flex items-center gap-1 text-xs opacity-75">
          <div className="w-2 h-2 bg-blue-500 rounded border border-gray-300" />
          <span>Custom background</span>
        </div>
      )}
    </div>
  );
}
