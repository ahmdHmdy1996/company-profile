import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const PageManager = ({ moduleType, onPageSelected, selectedPageId }) => {
  const [pages, setPages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pageData, setPageData] = useState({
    pdf_id: '',
    name: '',
    has_header: false,
    has_footer: false,
    page_number: 1
  });

  useEffect(() => {
    const loadPages = async () => {
      try {
        const response = await apiService.getPages();
        if (response.success) {
          setPages(response.data || []);
        }
      } catch (error) {
        console.error('Error loading pages:', error);
      }
    };
    
    const loadPdfs = async () => {
      try {
        const response = await apiService.getPDFs();
        if (response.success) {
          setPdfs(response.data || []);
        }
      } catch (error) {
        console.error('Error loading PDFs:', error);
      }
    };
    
    loadPages();
    loadPdfs();
  }, []);

  const handleInputChange = (field, value) => {
    setPageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreatePage = async () => {
    if (!pageData.name.trim()) {
      alert('يرجى إدخال اسم الصفحة');
      return;
    }

    if (!pageData.pdf_id) {
      alert('يرجى اختيار PDF');
      return;
    }

    try {
      const response = await apiService.createPage(pageData);
      
      if (response.success) {
        setPages([...pages, response.data]);
        setPageData({
          pdf_id: '',
          name: '',
          has_header: false,
          has_footer: false,
          page_number: pages.length + 1
        });
        setShowCreateForm(false);
        alert('تم إنشاء الصفحة بنجاح!');
      } else {
        alert('حدث خطأ أثناء إنشاء الصفحة');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      alert('حدث خطأ أثناء إنشاء الصفحة');
    }
  };

  return (
    <div className="space-y-4">
      {/* Create Page Button */}
      <button
        onClick={() => setShowCreateForm(true)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        إضافة صفحة جديدة
      </button>

      {/* Create Page Form */}
      {showCreateForm && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">إنشاء صفحة جديدة</h3>
          
          {/* PDF Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر الـ PDF
            </label>
            <select
              value={pageData.pdf_id}
              onChange={(e) => handleInputChange('pdf_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">اختر PDF</option>
              {pdfs.map((pdf) => (
                <option key={pdf.id} value={pdf.id}>
                  {pdf.name}
                </option>
              ))}
            </select>
          </div>

          {/* Page Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الصفحة
            </label>
            <input
              type="text"
              value={pageData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل اسم الصفحة"
            />
          </div>

          {/* Page Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ترقيم الصفحة
            </label>
            <input
              type="number"
              value={pageData.page_number}
              onChange={(e) => handleInputChange('page_number', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل رقم الصفحة"
            />
          </div>

          {/* Header Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasHeader"
              checked={pageData.has_header}
              onChange={(e) => handleInputChange('has_header', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasHeader" className="mr-2 text-sm font-medium text-gray-700">
              تحتوي على هيدر
            </label>
          </div>

          {/* Footer Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasFooter"
              checked={pageData.has_footer}
              onChange={(e) => handleInputChange('has_footer', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasFooter" className="mr-2 text-sm font-medium text-gray-700">
              تحتوي على فوتر
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 space-x-reverse pt-4">
            <button
              onClick={handleCreatePage}
              disabled={!pageData.pdf_id || !pageData.name}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              إنشاء الصفحة
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

      {/* Pages List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">الصفحات الموجودة</h3>
        {pages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">لا توجد صفحات بعد</p>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedPageId === page.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPageSelected(page.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{page.name}</h4>
                  <p className="text-sm text-gray-600">PDF ID: {page.pdf_id}</p>
                  <p className="text-sm text-gray-600">رقم الصفحة: {page.page_number}</p>
                </div>
                <div className="flex space-x-2 space-x-reverse text-xs">
                  {page.has_header && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">هيدر</span>
                  )}
                  {page.has_footer && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">فوتر</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PageManager;