import React, { useState, useEffect } from 'react';
import HeaderDesignTemplates from '../components/HeaderDesignTemplates';
import FooterDesignTemplates from '../components/FooterDesignTemplates';
import CoverDesignTemplates from '../components/CoverDesignTemplates';
import BackgroundImageUploader from '../components/BackgroundImageUploader';
import { apiService } from '../services/api';

const PDFCreator = () => {
  const [pdfData, setPdfData] = useState({
    name: '',
    headerDesign: null,
    footerDesign: null,
    coverDesign: null,
    headerHtmlCode: '',
    footerHtmlCode: '',
    coverHtmlCode: '<div></div>',
    backgroundImage: null
  });
  const [existingPDFs, setExistingPDFs] = useState([]);
  const [loadingPDFs, setLoadingPDFs] = useState(true);

  useEffect(() => {
    loadExistingPDFs();
  }, []);

  const loadExistingPDFs = async () => {
    try {
      setLoadingPDFs(true);
      const response = await apiService.getPDFs();
      setExistingPDFs(response.data || []);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    } finally {
      setLoadingPDFs(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPdfData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewPDF = async (pdfId) => {
    try {
      const response = await apiService.generatePDFView(pdfId);
      if (response.success && response.pdf_url) {
        window.open(response.pdf_url, '_blank');
      } else {
        alert('فشل في عرض ملف PDF');
      }
    } catch (error) {
      console.error('Error viewing PDF:', error);
      alert('خطأ في عرض ملف PDF');
    }
  };

  const handleDownloadPDF = async (pdfId) => {
    try {
      const response = await apiService.downloadPDFFile(pdfId);
      if (response.success && response.download_url) {
        const link = document.createElement('a');
        link.href = response.download_url;
        link.download = `pdf_${pdfId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('فشل في تحميل ملف PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('خطأ في تحميل ملف PDF');
    }
  };

  const handleDeletePDF = async (pdfId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      try {
        await apiService.deletePDF(pdfId);
        alert('تم حذف الملف بنجاح');
        loadExistingPDFs();
      } catch (error) {
        console.error('Error deleting PDF:', error);
        alert('خطأ في حذف الملف');
      }
    }
  };

  const handleHeaderDesignSelect = (designId, htmlCode) => {
    setPdfData({
      ...pdfData,
      headerDesign: designId,
      headerHtmlCode: htmlCode
    });
  };

  const handleFooterDesignSelect = (designId, htmlCode) => {
    setPdfData({
      ...pdfData,
      footerDesign: designId,
      footerHtmlCode: htmlCode
    });
  };

  const handleCoverDesignSelect = (designId, htmlCode) => {
    setPdfData({
      ...pdfData,
      coverDesign: designId,
      coverHtmlCode: htmlCode
    });
  };

  const handleCreatePDF = async () => {
    if (!pdfData.name.trim()) {
      alert('يرجى إدخال اسم PDF');
      return;
    }

    if (!pdfData.headerHtmlCode) {
      alert('يرجى اختيار تصميم الهيدر');
      return;
    }

    if (!pdfData.footerHtmlCode) {
      alert('يرجى اختيار تصميم الفوتر');
      return;
    }

    try {
      // If there's a background image, we need to send it as FormData
      if (pdfData.backgroundImage) {
        const formData = new FormData();
        formData.append('name', pdfData.name);
        formData.append('header', pdfData.headerHtmlCode);
        formData.append('footer', pdfData.footerHtmlCode);
        formData.append('cover', pdfData.coverHtmlCode);
        formData.append('background_image', pdfData.backgroundImage);
        
        await apiService.createPDF(formData);
        
        alert('تم إنشاء PDF بنجاح!');
        // Reset form
        setPdfData({
           name: '',
           headerDesign: null,
           footerDesign: null,
           coverDesign: null,
           headerHtmlCode: '',
           footerHtmlCode: '',
           coverHtmlCode: '<div></div>',
           backgroundImage: null
         });
        // Reload existing PDFs
        loadExistingPDFs();
      } else {
        // Send as JSON if no background image
        const jsonData = {
          name: pdfData.name,
          header: pdfData.headerHtmlCode,
          footer: pdfData.footerHtmlCode,
          cover: pdfData.coverHtmlCode
        };
        await apiService.createPDF(jsonData);
        
        alert('تم إنشاء PDF بنجاح!');
        // Reset form
        setPdfData({
            name: '',
            headerDesign: null,
            footerDesign: null,
            coverDesign: null,
            headerHtmlCode: '',
            footerHtmlCode: '',
            coverHtmlCode: '<div></div>',
            backgroundImage: null
          });
          // Reload existing PDFs
          loadExistingPDFs();
      }
    } catch (error) {
      console.error('Error creating PDF:', error);
      alert('حدث خطأ أثناء إنشاء PDF');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Existing PDFs Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">ملفات PDF الموجودة</h2>
        {loadingPDFs ? (
          <div className="text-center py-8">
            <div className="text-gray-500">جاري تحميل الملفات...</div>
          </div>
        ) : existingPDFs.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-gray-500">لا توجد ملفات PDF حالياً</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingPDFs.map((pdf) => (
              <div key={pdf.id} className="bg-white rounded-lg shadow-md p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{pdf.name}</h3>
                  <span className="text-sm text-gray-500">#{pdf.id}</span>
                </div>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div>تصميم الهيدر: {pdf.headerDesign || 'غير محدد'}</div>
                  <div>تصميم الفوتر: {pdf.footerDesign || 'غير محدد'}</div>
                  <div>تاريخ الإنشاء: {new Date(pdf.created_at).toLocaleDateString('ar-SA')}</div>
                </div>
                
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => handleViewPDF(pdf.id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    عرض
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(pdf.id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    تحميل
                  </button>
                  <button
                    onClick={() => handleDeletePDF(pdf.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Create New PDF Section */}
      <div className="border-t pt-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">إنشاء ملف PDF جديد</h1>
        
        <div className="space-y-8">
          {/* PDF Name */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              اسم الملف
            </label>
            <input
              type="text"
              value={pdfData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل اسم الملف"
            />
          </div>

          {/* Header Design Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              اختيار تصميم الهيدر
            </label>
            <HeaderDesignTemplates
              selectedDesign={pdfData.headerDesign}
              onSelectDesign={handleHeaderDesignSelect}
            />
          </div>

          {/* Footer Design Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              اختيار تصميم الفوتر
            </label>
            <FooterDesignTemplates
              selectedDesign={pdfData.footerDesign}
              onSelectDesign={handleFooterDesignSelect}
            />
          </div>

          {/* Cover Design Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              اختيار تصميم الغلاف
            </label>
            <CoverDesignTemplates
              selectedDesign={pdfData.coverDesign}
              onSelectDesign={handleCoverDesignSelect}
            />
          </div>

          {/* Cover HTML Code */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              كود HTML للغلاف
            </label>
            <textarea
              value={pdfData.coverHtmlCode}
              onChange={(e) => handleInputChange('coverHtmlCode', e.target.value)}
              placeholder="<div>محتوى الغلاف</div>"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              يمكنك استخدام HTML و CSS inline لتصميم غلاف مخصص أو اختيار من التصميمات أعلاه
            </p>
          </div>

          {/* Background Image Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              صورة خلفية الورق
            </label>
            <BackgroundImageUploader
              selectedImage={pdfData.backgroundImage}
              onImageSelect={(image) => handleInputChange('backgroundImage', image)}
            />
          </div>

          {/* Create Button */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleCreatePDF}
              disabled={!pdfData.name}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              إنشاء ملف PDF
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PDFCreator;