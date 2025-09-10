import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  X, 
  FileImage, 
  Download, 
  Eye,
  Trash2,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useAttachments } from '../contexts/AttachmentsContext';
import AttachmentService from '../services/attachmentService';
import PageHeader from '../components/PageHeader';

const AttachmentsSectionPage = ({ 
  maxFileSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}) => {
  const { 
    attachments, 
    addAttachment, 
    removeAttachment, 
    updateAttachment,
    setAttachments,
    loading,
    error,
    clearError,
    setLoading,
    setError
  } = useAttachments();
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Load attachments from backend on component mount
  useEffect(() => {
    loadAttachments();
  }, []);

  const loadAttachments = async () => {
    try {
      setLoading(true);
      const result = await AttachmentService.getAttachments();
      if (result.success) {
        const formattedAttachments = result.data.data.map(attachment => ({
          id: attachment.id,
          name: attachment.original_name,
          type: attachment.mime_type,
          size: attachment.size,
          data: attachment.url,
          description: attachment.description || '',
          path: attachment.path,
          order: attachment.order
        }));
        setAttachments(formattedAttachments);
      }
    } catch (error) {
      console.error('خطأ في تحميل المرفقات:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAttachment = async (id) => {
    try {
      setLoading(true);
      await AttachmentService.deleteAttachment(id);
      removeAttachment(id);
    } catch (error) {
      console.error('خطأ في حذف المرفق:', error);
      alert(`فشل في حذف المرفق: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (files) => {
    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) {
        alert(`نوع الملف غير مدعوم: ${file.type}`);
        continue;
      }

      if (file.size > maxFileSize) {
        alert(`حجم الملف كبير جداً. الحد الأقصى ${maxFileSize / (1024 * 1024)}MB`);
        continue;
      }

      try {
        setLoading(true);
        // Upload to backend
        const result = await AttachmentService.uploadAttachment(file, '', null, attachments.length);
        
        if (result.success) {
          // Add to local state with backend data
          const newAttachment = {
            id: result.data.id,
            name: result.data.original_name,
            type: result.data.mime_type,
            size: result.data.size,
            data: result.data.url,
            description: result.data.description || '',
            path: result.data.path,
            order: result.data.order
          };
          addAttachment(newAttachment);
        }
      } catch (error) {
        console.error('خطأ في رفع الملف:', error);
        alert(`فشل في رفع الملف: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDescriptionChange = async (id, description) => {
    try {
      // Update locally first for immediate UI feedback
      updateAttachment(id, { description });
      
      // Then update in backend
      await AttachmentService.updateAttachment(id, { description });
    } catch (error) {
      console.error('خطأ في تحديث وصف المرفق:', error);
      // Revert local change if backend update fails
      const originalAttachment = attachments.find(att => att.id === id);
      if (originalAttachment) {
        updateAttachment(id, { description: originalAttachment.description });
      }
      alert(`فشل في تحديث وصف المرفق: ${error.message}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      <PageHeader 
        title="المرفقات" 
        subtitle="إدارة الصور والمرفقات التي ستظهر في نهاية ملف PDF"
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          إضافة مرفق
        </button>
      </PageHeader>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Upload Area */}
          <div className="mb-8">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                اسحب الصور هنا أو انقر للاختيار
              </h3>
              <p className="text-gray-500">
                يدعم: JPEG, PNG, GIF, WebP (حتى {maxFileSize / (1024 * 1024)}MB)
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Attachments Grid */}
          {attachments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Image Preview */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={attachment.data}
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => setPreviewImage(attachment)}
                        className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        title="معاينة"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        className="p-1 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                        title="حذف"
                        disabled={loading}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <FileImage size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate" title={attachment.name}>
                          {attachment.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        وصف المرفق (اختياري)
                      </label>
                      <textarea
                        value={attachment.description || ''}
                        onChange={(e) => handleDescriptionChange(attachment.id, e.target.value)}
                        placeholder="أضف وصفاً للمرفق..."
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileImage className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد مرفقات
              </h3>
              <p className="text-gray-500">
                ابدأ بإضافة صور ومرفقات لتظهر في نهاية ملف PDF
              </p>
            </div>
          )}

          {/* Info Box */}
          {attachments.length > 0 && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">معلومات مهمة:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>ستظهر المرفقات في نهاية ملف PDF بالترتيب المعروض</li>
                    <li>يمكن إضافة وصف لكل مرفق ليظهر تحت الصورة في PDF</li>
                    <li>الصور الكبيرة سيتم تصغيرها تلقائياً لتناسب صفحة PDF</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <img
              src={previewImage.data}
              alt={previewImage.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-3">
              <h4 className="font-medium text-gray-900">{previewImage.name}</h4>
              <p className="text-sm text-gray-600">{formatFileSize(previewImage.size)}</p>
              {previewImage.description && (
                <p className="text-sm text-gray-700 mt-1">{previewImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentsSectionPage;