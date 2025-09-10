import React, { useRef } from 'react';

const BackgroundImageUploader = ({ selectedImage, onImageSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect({
          file: file,
          preview: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {!selectedImage ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700 mb-2">اختر صورة خلفية</p>
          <p className="text-sm text-gray-500">PNG, JPG, GIF حتى 10MB</p>
        </div>
      ) : (
        <div className="relative">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex-shrink-0">
                <img
                  src={selectedImage.preview}
                  alt="معاينة الصورة"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedImage.name}
                </p>
                <p className="text-sm text-gray-500">صورة خلفية محددة</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={handleRemoveImage}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            تغيير الصورة
          </button>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default BackgroundImageUploader;