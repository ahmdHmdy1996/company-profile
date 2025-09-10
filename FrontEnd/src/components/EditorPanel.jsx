import React, { useState } from "react";
import { ChevronDown, ChevronRight, Palette, Type, Edit3 } from "lucide-react";
import { TEMPLATES } from "../templates/templateRegistry.jsx";

export default function EditorPanel({ page, onUpdateData, onUpdateStyle }) {
  const [activeSection, setActiveSection] = useState("data");
  const [expandedFields, setExpandedFields] = useState(new Set(["root"]));

  if (!page || !page.templateId) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center p-4">
          <div className="p-2 bg-white rounded-full w-fit mx-auto mb-2 border border-blue-200">
            <Type size={20} className="text-blue-400" />
          </div>
          <div className="text-sm font-semibold text-blue-700 mb-1">
            No Page Selected
          </div>
          <div className="text-xs text-blue-500">
            Select a page to start editing
          </div>
        </div>
      </div>
    );
  }

  const template = TEMPLATES[page.templateId];
  if (!template) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center p-4">
          <div className="text-sm font-semibold text-blue-700 mb-1">
            Template Not Found
          </div>
          <div className="text-xs text-blue-500">
            Template ID: {page.templateId}
          </div>
        </div>
      </div>
    );
  }

  const toggleFieldExpansion = (fieldKey) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldKey)) {
      newExpanded.delete(fieldKey);
    } else {
      newExpanded.add(fieldKey);
    }
    setExpandedFields(newExpanded);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 bg-blue-50 rounded border border-blue-200">
            <Edit3 size={14} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Edit Page</h2>
            <div className="text-xs text-gray-500">
              Template:{" "}
              <span className="font-medium text-blue-600">{template.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => setActiveSection("data")}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-all relative ${
            activeSection === "data"
              ? "text-blue-600 bg-white"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <Type size={12} />
            Content
          </div>
          {activeSection === "data" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveSection("style")}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-all relative ${
            activeSection === "style"
              ? "text-blue-600 bg-white"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <Palette size={12} />
            Style
          </div>
          {activeSection === "style" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <div key={activeSection}>
          {activeSection === "data" ? (
            <DataEditor
              data={page.data}
              template={template}
              onUpdate={onUpdateData}
              expandedFields={expandedFields}
              onToggleExpansion={toggleFieldExpansion}
            />
          ) : (
            <StyleEditor
              style={page.style || {}}
              onUpdateStyle={onUpdateStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DataEditor({
  data,
  template,
  onUpdate,
  expandedFields,
  onToggleExpansion,
}) {
  // Debug logging
  console.log('DataEditor Debug:', {
    template: template,
    templateFields: template?.fields,
    data: data,
    expandedFields: expandedFields
  });
  const renderField = (field, value, onChange) => {
    switch (field.type) {
      case "text":
      case "email":
        return (
          <input
            type={field.type === "email" ? "email" : "text"}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.placeholder}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder={field.placeholder}
          />
        );

      case "list": {
        const items = Array.isArray(value) ? value : [];
        const updateItem = (idx, val) => {
          const next = [...items];
          next[idx] = val;
          onChange(next);
        };
        const addItem = () => onChange([...items, ""]);
        const removeItem = (idx) => {
          const next = items.filter((_, i) => i !== idx);
          onChange(next);
        };
        return (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <textarea
                  value={item || ""}
                  onChange={(e) => updateItem(idx, e.target.value)}
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="px-2 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100"
            >
              + Add Item
            </button>
          </div>
        );
      }

      case "image":
        return (
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onChange(event.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {value && (
              <div className="mt-2">
                <img
                  src={value}
                  alt="Preview"
                  className="max-w-full h-20 object-cover rounded border"
                />
              </div>
            )}
          </div>
        );

      case "object": {
        const obj =
          value && typeof value === "object" && !Array.isArray(value)
            ? value
            : {};
        const handleSubChange = (key, subVal) => {
          onChange({ ...obj, [key]: subVal });
        };
        return (
          <div className="space-y-3">
            {(field.subFields || []).map((sub) => (
              <div
                key={sub.key}
                className="border border-gray-200 rounded p-2 bg-white"
              >
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {sub.label}
                </label>
                {renderField(sub, obj[sub.key], (nv) =>
                  handleSubChange(sub.key, nv)
                )}
              </div>
            ))}
          </div>
        );
      }

      case "repeater": {
        const items = Array.isArray(value) ? value : [];
        console.log('Repeater Debug:', {
          field: field,
          value: value,
          items: items,
          subFields: field.subFields
        });
        const addItem = () => {
          const blank = {};
          (field.subFields || []).forEach((sf) => {
            if (sf && sf.key) {
              blank[sf.key] = sf.type === "image" ? null : "";
            }
          });
          onChange([...items, blank]);
        };
        const updateItem = (idx, key, val) => {
          const next = items.map((it, i) => {
            if (i === idx) {
              const item = it || {};
              return { ...item, [key]: val };
            }
            return it;
          });
          onChange(next);
        };
        const removeItem = (idx) => {
          const next = items.filter((_, i) => i !== idx);
          onChange(next);
        };
        return (
          <div className="space-y-3">
            {items.map((item, idx) => {
              console.log(`Repeater Item ${idx} Debug:`, {
                item: item,
                itemType: typeof item,
                itemKeys: item ? Object.keys(item) : 'item is null/undefined'
              });
              return (
              <div
                key={idx}
                className="border border-gray-200 rounded p-2 bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-gray-700">
                    Item {idx + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="px-2 py-0.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {(field.subFields || []).map((sub) => {
                    console.log(`SubField Debug for item ${idx}:`, {
                      sub: sub,
                      subKey: sub.key,
                      itemValue: item?.[sub.key],
                      item: item
                    });
                    return (
                    <div key={sub.key} className="">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {sub.label}
                      </label>
                      {renderField(sub, item?.[sub.key] || "", (nv) =>
                        updateItem(idx, sub.key, nv)
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>
              );
            })}
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100"
            >
              + Add Item
            </button>
          </div>
        );
      }

      default:
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.placeholder}
          />
        );
    }
  };

  // Safety check for template
  if (!template || !template.fields) {
    return (
      <div className="text-center p-4 text-gray-500">
        <div className="text-sm">Template configuration not available</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {template.fields.filter(field => field && field.key).map((field) => (
        <FieldItem
          key={field.key}
          field={field}
          value={data ? data[field.key] : undefined}
          onChange={(newValue) => onUpdate({ ...(data || {}), [field.key]: newValue })}
          expanded={expandedFields.has(field.key)}
          onToggleExpansion={() => onToggleExpansion(field.key)}
          renderField={renderField}
        />
      ))}
    </div>
  );
}

function FieldItem({
  field,
  value,
  onChange,
  expanded,
  onToggleExpansion,
  renderField,
}) {
  // Safety check for field
  if (!field) {
    return (
      <div className="border border-red-200 rounded p-3 bg-red-50">
        <div className="text-sm text-red-600">Invalid field configuration</div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded p-3 bg-white">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggleExpansion}
      >
        <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
          <div className="p-1 bg-blue-50 rounded">
            {expanded ? (
              <ChevronDown size={12} className="text-blue-600" />
            ) : (
              <ChevronRight size={12} className="text-blue-600" />
            )}
          </div>
          {field.label || 'Unnamed Field'}
        </label>
      </div>

      {expanded && (
        <div className="mt-3">{renderField(field, value, onChange)}</div>
      )}
    </div>
  );
}

function StyleEditor({ style, onUpdateStyle }) {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdateStyle({
          ...style,
          backgroundImage: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackgroundImage = () => {
    onUpdateStyle({
      ...style,
      backgroundImage: null,
    });
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Palette size={16} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-800">Background</h3>
        </div>

        <div className="space-y-3">
          {/* Background Color */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={style.backgroundColor || "#000000"}
              onChange={(e) =>
                onUpdateStyle({ ...style, backgroundColor: e.target.value })
              }
              className="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Background Image
            </label>

            {style.backgroundImage ? (
              <div className="space-y-2">
                <div className="relative">
                  <img
                    src={style.backgroundImage}
                    alt="Background preview"
                    className="w-full h-24 object-cover rounded border border-gray-300"
                  />
                  <button
                    onClick={removeBackgroundImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>

          {/* Background Position (only show if image exists) */}
          {style.backgroundImage && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Image Position
              </label>
              <select
                value={style.backgroundPosition || "center"}
                onChange={(e) =>
                  onUpdateStyle({
                    ...style,
                    backgroundPosition: e.target.value,
                  })
                }
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="top left">Top Left</option>
                <option value="top right">Top Right</option>
                <option value="bottom left">Bottom Left</option>
                <option value="bottom right">Bottom Right</option>
              </select>
            </div>
          )}

          {/* Background Size (only show if image exists) */}
          {style.backgroundImage && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Image Size
              </label>
              <select
                value={style.backgroundSize || "cover"}
                onChange={(e) =>
                  onUpdateStyle({ ...style, backgroundSize: e.target.value })
                }
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cover">Cover (fill)</option>
                <option value="contain">Contain (fit)</option>
                <option value="auto">Original Size</option>
                <option value="100% 100%">Stretch</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
