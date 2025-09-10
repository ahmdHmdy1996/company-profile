import React, { useState, useRef } from 'react';
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Printer,
  FileText,
  Eye
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import TemplateRenderer from '../components/TemplateRenderer';
import PageHeader from '../components/PageHeader';

const HomePage = ({ sections, onExportPDF, globalSettings }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef(null);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleExportPDF = async () => {
    if (!sections || sections.length === 0) {
      alert('لا توجد صفحات لتصديرها');
      return;
    }

    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm

      for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
        const section = sections[sectionIndex];
        
        for (let pageIndex = 0; pageIndex < section.pages.length; pageIndex++) {
          const page = section.pages[pageIndex];
          
          // Find the existing rendered page in the preview
          const existingPageElements = document.querySelectorAll(`[data-page-id="${page.id}"]`);
          let targetElement = null;
          
          if (existingPageElements.length > 0) {
            // Use the existing rendered page
            targetElement = existingPageElements[0];
          } else {
            // Fallback: find by page content in the preview
            const previewElements = document.querySelectorAll('.bg-white.rounded-lg.shadow-lg');
            for (let elem of previewElements) {
              if (elem.textContent.includes(page.name)) {
                const contentDiv = elem.querySelector('.p-6 > div');
                if (contentDiv) {
                  targetElement = contentDiv;
                  break;
                }
              }
            }
          }

          if (!targetElement) {
            console.warn(`Could not find rendered element for page: ${page.name}`);
            continue;
          }

          // Wait for images to load
          const images = targetElement.querySelectorAll('img');
          await Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }));

          // Capture the existing rendered page
          const canvas = await html2canvas(targetElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: page.style?.backgroundColor || '#ffffff',
            width: targetElement.offsetWidth,
            height: targetElement.offsetHeight,
            logging: false,
            imageTimeout: 15000,
            removeContainer: false
          });

          // Add page to PDF
          if (sectionIndex > 0 || pageIndex > 0) {
            pdf.addPage();
          }

          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
        }
      }

      // Save the PDF
      const fileName = `company-profile-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('خطأ في تصدير PDF:', error);
      alert('حدث خطأ أثناء تصدير الملف');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      <PageHeader 
        title="الملف التعريفي الكامل"
        subtitle="معاينة شاملة لجميع صفحات الملف التعريفي"
      >
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-white rounded transition-colors"
            title="تصغير"
          >
            <ZoomOut size={16} />
          </button>
          <span className="px-3 py-1 text-sm font-medium min-w-[60px] text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-white rounded transition-colors"
            title="تكبير"
          >
            <ZoomIn size={16} />
          </button>
        </div>
        
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          title="طباعة"
        >
          <Printer size={16} />
          طباعة
        </button>
        
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="تصدير PDF"
        >
          {isExporting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {isExporting ? 'جاري التصدير...' : 'تصدير PDF'}
        </button>
      </PageHeader>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {sections && sections.length > 0 ? (
          <div 
            ref={previewRef}
            className="max-w-4xl mx-auto space-y-8"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="space-y-6">
                {/* Section Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    {section.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {section.pages.length} صفحة
                  </p>
                </div>

                {/* Section Pages */}
                {section.pages.map((page, pageIndex) => (
                  <div key={page.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    {/* Page Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">
                          {page.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          صفحة {pageIndex + 1} من {section.pages.length}
                        </span>
                      </div>
                    </div>

                    {/* Page Content */}
                    <div className="p-6">
                      <div 
                        data-page-id={page.id}
                        className="w-full min-h-[600px] border border-gray-200 rounded-lg overflow-hidden"
                        style={{ 
                          backgroundColor: page.style?.backgroundColor || '#ffffff',
                          backgroundImage: page.style?.backgroundImage ? `url(${page.style.backgroundImage})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <TemplateRenderer
                          templateId={page.templateId}
                          data={page.data}
                          style={page.style}
                          globalSettings={globalSettings}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileText size={64} className="mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">لا توجد صفحات</h3>
            <p className="text-center max-w-md">
              لم يتم إنشاء أي صفحات بعد. يرجى الانتقال إلى قسم إدارة المحتوى لإنشاء صفحات جديدة.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;