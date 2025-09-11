import React from 'react';

const DynamicDataFields = ({ design, data, onChange }) => {
  if (!design || !design.fields) {
    return null;
  }

  const handleFieldChange = (fieldKey, value) => {
    onChange({
      ...data,
      [fieldKey]: value
    });
  };

  const handleImageChange = (fieldKey, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleFieldChange(fieldKey, e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      handleFieldChange(fieldKey, null);
    }
  };

  const renderField = (field) => {
    const value = data[field.key] || '';

    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>
        );

      case 'image':
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(field.key, e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {value && (
                <div className="relative inline-block">
                  <img
                    src={value}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleFieldChange(field.key, null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'number':
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{field.placeholder || 'اختر...'}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.key} className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="mr-2 text-sm font-medium text-gray-700">
                {field.label}
              </span>
            </label>
          </div>
        );

      case 'date':
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        بيانات القسم - {design.name}
      </h3>
      {design.fields.map(renderField)}
    </div>
  );
};

export default DynamicDataFields;