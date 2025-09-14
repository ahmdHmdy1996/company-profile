import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderDesignTemplates from "../components/HeaderDesignTemplates";
import FooterDesignTemplates from "../components/FooterDesignTemplates";
import CoverDesignTemplates from "../components/CoverDesignTemplates";
import BackgroundImageUploader from "../components/BackgroundImageUploader";
import { apiService } from "../services/api";
import { usePDFViewer } from "../contexts/PDFViewerContext.js";
import { useApiToast } from "../hooks/useApiToast";

const PDFEditor = () => {
  const { pdfId } = useParams();
  const navigate = useNavigate();
  const { showPDF } = usePDFViewer();
  const toast = useApiToast();

  const [pdfData, setPdfData] = useState({
    id: null,
    name: "",
    header_design: "template1",
    footer_design: "template1",
    cover_design: "template1",
    header_html: "",
    footer_html: "",
    cover_html: "",
    background_image: null,
    background_image_url: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState({
    step: 0,
    total: 3,
    message: "",
  });

  useEffect(() => {
    const loadPDFData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getPDF(pdfId);

        if (response.status && response.data) {
          const pdf = response.data;

          // Parse JSON fields if they exist
          let headerData = {};
          let footerData = {};
          let coverData = {};

          try {
            headerData = pdf.header ? JSON.parse(pdf.header) : {};
          } catch (e) {
            console.warn("Failed to parse header JSON:", e);
          }

          try {
            footerData = pdf.footer ? JSON.parse(pdf.footer) : {};
          } catch (e) {
            console.warn("Failed to parse footer JSON:", e);
          }

          try {
            coverData = pdf.cover ? JSON.parse(pdf.cover) : {};
          } catch (e) {
            console.warn("Failed to parse cover JSON:", e);
          }

          setPdfData({
            id: pdf.id,
            name: pdf.name || "",
            header_design: headerData.template || "template1",
            footer_design: footerData.template || "template1",
            cover_design: coverData.template || "template1",
            header_html: headerData.html || "",
            footer_html: footerData.html || "",
            cover_html: coverData.html || "",
            background_image: null, // Will be handled separately for editing
            background_image_url: pdf.background_image_url || null,
          });
        } else {
          toast.showError("لم يتم العثور على ملف PDF");
          navigate("/pdf-creator");
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
        toast.showError("خطأ في تحميل بيانات PDF");
        navigate("/pdf-creator");
      } finally {
        setIsLoading(false);
      }
    };

    if (pdfId) {
      loadPDFData();
    }
  }, [pdfId, toast, navigate]);

  const handleInputChange = (field, value) => {
    setPdfData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleHeaderDesignSelect = (designId, htmlCode) => {
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

  const handlePreviewPDF = () => {
    // Create preview data object
    const previewData = {
      id: pdfData.id,
      name: pdfData.name,
      cover: pdfData.cover_html,
      header: pdfData.header_html,
      footer: pdfData.footer_html,
      background_image: pdfData.background_image,
      background_image_url: pdfData.background_image_url,
      pages: [], // Empty for preview
    };

    showPDF(previewData, `${pdfData.name} - معاينة`);
  };

  const handleSavePDF = async () => {
    if (!pdfData.name.trim()) {
      toast.showWarning("يرجى إدخال اسم PDF");
      return;
    }

    if (!pdfData.header_html) {
      toast.showWarning("يرجى اختيار تصميم الهيدر");
      return;
    }

    if (!pdfData.footer_html) {
      toast.showWarning("يرجى اختيار تصميم الفوتر");
      return;
    }

    try {
      setIsSaving(true);

      // Step 1: Update basic info (name)
      setSavingProgress({
        step: 1,
        total: 3,
        message: "تحديث المعلومات الأساسية...",
      });

      await apiService.updatePDF(pdfData.id, { name: pdfData.name });

      // Step 2: Update header and footer
      setSavingProgress({
        step: 2,
        total: 3,
        message: "تحديث الرأسية والتذييل...",
      });

      await apiService.updatePDFHeaderFooter(
        pdfData.id,
        pdfData.header_html,
        pdfData.footer_html
      );

      // Step 3: Update cover and background image (if any)
      setSavingProgress({
        step: 3,
        total: 3,
        message: "تحديث الغلاف والخلفية...",
      });

      await apiService.updatePDFCoverAndBackground(
        pdfData.id,
        pdfData.cover_html,
        pdfData.background_image
      );

      toast.showSuccess("تم حفظ التغييرات بنجاح!");

      // Navigate back to PDF creator page
      navigate("/pdf-creator");
    } catch (error) {
      console.error("Error saving PDF:", error);
      toast.showError(error.message || "خطأ في حفظ التغييرات");
    } finally {
      setIsSaving(false);
      setSavingProgress({
        step: 0,
        total: 3,
        message: "",
      });
    }
  };

  const handleCancel = () => {
    navigate("/pdf-creator");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">تحرير ملف PDF</h1>
            <p className="text-gray-600 mt-2">ID: {pdfData.id}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePreviewPDF}
              className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              معاينة
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
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
              {pdfData.background_image_url && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">الصورة الحالية:</p>
                  <img
                    src={pdfData.background_image_url}
                    alt="Background"
                    className="max-w-xs max-h-32 object-contain border rounded"
                  />
                </div>
              )}
              <BackgroundImageUploader
                selectedImage={pdfData.background_image}
                onImageSelect={(image) =>
                  handleInputChange("background_image", image)
                }
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-center pt-4">
              <div className="w-full max-w-md">
                {/* Progress indicator */}
                {isSaving && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">
                        الخطوة {savingProgress.step} من {savingProgress.total}
                      </span>
                      <span className="text-sm text-blue-600">
                        {Math.round(
                          (savingProgress.step / savingProgress.total) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (savingProgress.step / savingProgress.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-blue-600 text-center">
                      {savingProgress.message}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleSavePDF}
                  disabled={!pdfData.name || isSaving}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFEditor;
