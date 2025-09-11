import React, { useState, useEffect } from "react";
import HeaderDesignTemplates from "../components/HeaderDesignTemplates";
import FooterDesignTemplates from "../components/FooterDesignTemplates";
import CoverDesignTemplates from "../components/CoverDesignTemplates";
import BackgroundImageUploader from "../components/BackgroundImageUploader";
import { apiService } from "../services/api";
import { usePDFViewer } from "../components/Dashboard";
import { processApiHtmlForDownload } from "../utils/htmlUtils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PDFCreator = () => {
  const { showPDF, pdfViewer } = usePDFViewer();

  // Auto-show PDF viewer on component mount
  useEffect(() => {
    if (!pdfViewer.isVisible) {
      showPDF(null, null); // Show viewer with "choose PDF" message
    }
  }, []);

  // Test function for PDF viewer
  const testPDFViewer = () => {
    const testPdfData = {
      id: "test",
      name: "اختبار عارض PDF",
      cover: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 40px; text-align: center; min-height: 500px; display: flex; flex-direction: column; justify-content: center;">
        <div style="max-width: 400px; margin: 0 auto;">
          <h1 style="margin: 0 0 40px 0; font-size: 48px; font-weight: bold; line-height: 1.2;">شركة المستقبل</h1>
          <div style="width: 80px; height: 2px; background: white; margin: 0 auto 40px auto;"></div>
          <h2 style="margin: 0 0 60px 0; font-size: 24px; font-weight: 400;">التقرير السنوي 2024</h2>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">الإنجازات والتطلعات</p>
        </div>
      </div>`,
      header: `<div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">شركة المستقبل - التقرير السنوي 2024</h1>
      </div>`,
      footer: `<div style="background: #34495e; color: white; padding: 15px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">© 2024 شركة المستقبل - جميع الحقوق محفوظة</p>
      </div>`,
      pages: [],
    };
    showPDF(testPdfData, "اختبار عارض PDF");
  };
  const [pdfData, setPdfData] = useState({
    name: "",
    header_design: "template1",
    footer_design: "template1",
    cover_design: "template1",
    header_html: "",
    footer_html: "",
    cover_html: "",
    background_image: null,
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
      if (response.status) {
        setExistingPDFs(response.data || []);
      } else {
        console.error("Failed to load PDFs:", response.message);
        setExistingPDFs([]);
      }
    } catch (error) {
      console.error("Error loading PDFs:", error);
      setExistingPDFs([]);
    } finally {
      setLoadingPDFs(false);
    }
  };

  const handleViewPDF = async (pdfId, pdfName) => {
    try {
      // Find the PDF data from existing PDFs
      const selectedPdf = existingPDFs.find((pdf) => pdf.id === pdfId);
      if (selectedPdf) {
        console.log("PDFCreator - selectedPdf found:", selectedPdf);
        console.log("PDFCreator - selectedPdf.pages:", selectedPdf.pages);

        // Create PDF data object from stored HTML codes
        const pdfData = {
          id: selectedPdf.id,
          name: selectedPdf.name,
          cover: selectedPdf.cover || "",
          header: selectedPdf.header || "",
          footer: selectedPdf.footer || "",
          background_image: selectedPdf.background_image || null,
          background_image_url: selectedPdf.background_image_url || null,
          pages: selectedPdf.pages || [], // Use actual pages from API response
        };

        console.log("PDFCreator - Sending pdfData to viewer:", pdfData);
        showPDF(pdfData, pdfName);
      } else {
        alert("لم يتم العثور على ملف PDF");
      }
    } catch (error) {
      console.error("Error viewing PDF:", error);
      alert("خطأ في عرض ملف PDF");
    }
  };

  const handleDownloadPDF = async (pdfId, pdfName) => {
    try {
      // Find the PDF data from existing PDFs
      const selectedPdf = existingPDFs.find((pdf) => pdf.id === pdfId);
      if (selectedPdf) {
        // Process cover content with base64 images
        const coverContent = selectedPdf.cover
          ? typeof selectedPdf.cover === "string"
            ? selectedPdf.cover
            : JSON.parse(selectedPdf.cover)
          : "";
        const processedCoverContent = coverContent
          ? await processApiHtmlForDownload(coverContent)
          : "";

        // Create a temporary div to render the HTML content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = processedCoverContent;
        tempDiv.style.cssText = `
          font-family: Arial, sans-serif;
          direction: rtl;
          padding: 20px;
          background: white;
          width: 210mm;
          min-height: 297mm;
          margin: 0;
          box-sizing: border-box;
        `;

        // Add background image if exists
        if (selectedPdf.background_image) {
          tempDiv.style.backgroundImage = `url(${selectedPdf.background_image})`;
          tempDiv.style.backgroundSize = "cover";
          tempDiv.style.backgroundPosition = "center";
          tempDiv.style.backgroundRepeat = "no-repeat";
        }

        document.body.appendChild(tempDiv);

        // Create PDF using html2canvas + jsPDF
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: tempDiv.scrollWidth,
          height: tempDiv.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save((pdfName || `pdf_${pdfId}`) + ".pdf");

        // Clean up
        document.body.removeChild(tempDiv);
      } else {
        alert("لم يتم العثور على ملف PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("خطأ في تحميل ملف PDF");
    }
  };

  const handleDeletePDF = async (pdfId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الملف؟")) {
      try {
        const response = await apiService.deletePDF(pdfId);
        if (response.status) {
          alert("تم حذف الملف بنجاح");
          loadExistingPDFs();
        } else {
          alert("فشل في حذف الملف");
        }
      } catch (error) {
        console.error("Error deleting PDF:", error);
        alert("خطأ في حذف الملف");
      }
    }
  };

  const handleInputChange = (field, value) => {
    setPdfData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleHeaderDesignSelect = (designId, htmlCode , ) => {
    setPdfData((prevData) => ({
      ...prevData,
      header_design: designId,
      header_html: htmlCode,
    }));
  };

  const handleFooterDesignSelect = (designId, htmlCode) => {
    setPdfData((prevData) => ({
      ...prevData,
      footer_design: designId,
      footer_html: htmlCode,
    }));
  };

  const handleCoverDesignSelect = (designId, htmlCode) => {
    setPdfData((prevData) => ({
      ...prevData,
      cover_design: designId,
      cover_html: htmlCode,
    }));
  };

  const handleCreatePDF = async () => {
    if (!pdfData.name.trim()) {
      alert("يرجى إدخال اسم PDF");
      return;
    }

    if (!pdfData.header_html) {
      alert("يرجى اختيار تصميم الهيدر");
      return;
    }

    if (!pdfData.footer_html) {
      alert("يرجى اختيار تصميم الفوتر");
      return;
    }

    try {
      if (pdfData.background_image) {
        const formData = new FormData();
        formData.append("name", pdfData.name);
        formData.append("header", JSON.stringify(pdfData.header_html));
        formData.append("footer", JSON.stringify(pdfData.footer_html));
        formData.append("cover", JSON.stringify(pdfData.cover_html));
        formData.append("background_image", pdfData.background_image.file);

        await apiService.createPDF(formData);
      } else {
        const jsonData = {
          name: pdfData.name,
          header: JSON.stringify(pdfData.header_html),
          footer: JSON.stringify(pdfData.footer_html),
          cover: JSON.stringify(pdfData.cover_html),
        };
        await apiService.createPDF(jsonData);
      }

      alert("تم إنشاء ملف PDF بنجاح!");
      setPdfData({
        name: "",
        header_design: "template1",
        footer_design: "template1",
        cover_design: "template1",
        header_html: "",
        footer_html: "",
        cover_html: "",
        background_image: null,
      });
      loadExistingPDFs();
    } catch (error) {
      console.error("Error creating PDF:", error);
      alert("خطأ في إنشاء ملف PDF");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            إنشاء وإدارة ملفات PDF
          </h1>
        </div>

        <div className="space-y-6">
          {/* Existing PDFs Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              ملفات PDF الموجودة
            </h2>

            {loadingPDFs ? (
              <div className="text-center py-4">
                <div className="text-gray-500">جاري تحميل الملفات...</div>
              </div>
            ) : existingPDFs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                لا توجد ملفات PDF
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {existingPDFs.map((pdf) => (
                  <div
                    key={pdf.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-800">{pdf.name}</h3>
                      <p className="text-sm text-gray-500">ID: {pdf.id}</p>
                      <p className="text-sm text-gray-500">
                        تاريخ الإنشاء:{" "}
                        {new Date(pdf.created_at).toLocaleDateString("ar-SA")}
                      </p>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleViewPDF(pdf.id, pdf.name)}
                          className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          عرض
                        </button>

                        <button
                          onClick={() => handleDeletePDF(pdf.id)}
                          className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create New PDF Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              إنشاء ملف PDF جديد
            </h2>

            <div className="space-y-6">
              {/* PDF Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الملف
                </label>
                <input
                  type="text"
                  value={pdfData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="أدخل اسم ملف PDF"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Header Design Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختيار تصميم الهيدر
                </label>
                <HeaderDesignTemplates
                  selectedDesign={pdfData.header_design}
                  onSelectDesign={handleHeaderDesignSelect}
                 
                />
              </div>

              {/* Footer Design Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختيار تصميم الفوتر
                </label>
                <FooterDesignTemplates
                  selectedDesign={pdfData.footer_design}
                  onSelectDesign={handleFooterDesignSelect}
                />
              </div>

              {/* Cover Design Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختيار تصميم الغلاف
                </label>
                <CoverDesignTemplates
                  selectedDesign={pdfData.cover_design}
                  onSelectDesign={handleCoverDesignSelect}
                />
              </div>

              {/* Background Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة الخلفية (اختيارية)
                </label>
                <BackgroundImageUploader
                  selectedImage={pdfData.background_image}
                  onImageSelect={(image) =>
                    handleInputChange("background_image", image)
                  }
                />
              </div>

              {/* Create Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleCreatePDF}
                  disabled={!pdfData.name}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  إنشاء ملف PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFCreator;
