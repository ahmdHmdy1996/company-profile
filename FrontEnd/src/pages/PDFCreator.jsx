import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import HeaderDesignTemplates from "../components/HeaderDesignTemplates";
import FooterDesignTemplates from "../components/FooterDesignTemplates";
import CoverDesignTemplates from "../components/CoverDesignTemplates";
import BackgroundImageUploader from "../components/BackgroundImageUploader";
import { apiService } from "../services/api";
import { usePDFViewer } from "../contexts/PDFViewerContext.js";
import { useApiToast } from "../hooks/useApiToast";

const PDFCreator = () => {
  const { showPDF } = usePDFViewer();
  const navigate = useNavigate();
  const toast = useApiToast(); // Initialize API toast integration

  // Removed auto-show PDF viewer functionality - users can manually open it when needed

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState({
    step: 0,
    total: 3,
    message: "",
  });

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAuthenticated(true);
    }
    loadExistingPDFs();
  }, []);

  const handleTestLogin = async () => {
    try {
      setIsLoggingIn(true);
      await apiService.testLogin();
      setIsAuthenticated(true);
      toast.showSuccess("تم تسجيل الدخول بنجاح!");
      // Reload PDFs after successful login
      loadExistingPDFs();
    } catch (error) {
      console.error("Login failed:", error);
      toast.showError("فشل في تسجيل الدخول");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadExistingPDFs = async () => {
    try {
      setLoadingPDFs(true);
      const response = await apiService.getPDFs();
      if (response.status) {
        setExistingPDFs(response.data || []);
      } else {
        setExistingPDFs([]);
      }
    } catch {
      // Error is already handled by API service with toast
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
        toast.showError("لم يتم العثور على ملف PDF");
      }
    } catch (error) {
      console.error("Error viewing PDF:", error);
      toast.showError("خطأ في عرض ملف PDF");
    }
  };

  const handleDeletePDF = async (pdfId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الملف؟")) {
      try {
        const response = await apiService.deletePDF(pdfId);
        if (response.status) {
          toast.showSuccess("تم حذف الملف بنجاح");
          loadExistingPDFs();
        } else {
          toast.showError("فشل في حذف الملف");
        }
      } catch (error) {
        console.error("Error deleting PDF:", error);
        toast.showError("خطأ في حذف الملف");
      }
    }
  };

  const handleEditPDF = (pdfId) => {
    navigate(`/pdf-editor/${pdfId}`);
  };

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

  const handleCreatePDF = async () => {
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
      setIsCreating(true);

      // Step 1: Create PDF with basic info
      setCreationProgress({
        step: 1,
        total: 3,
        message: "إنشاء ملف PDF الأساسي...",
      });

      const createResponse = await apiService.createPDFBasic(pdfData.name);
      if (!createResponse.status || !createResponse.data?.id) {
        throw new Error("فشل في إنشاء ملف PDF الأساسي");
      }

      const pdfId = createResponse.data.id;

      // Step 2: Add header and footer
      setCreationProgress({
        step: 2,
        total: 3,
        message: "إضافة الرأسية والتذييل...",
      });

      await apiService.updatePDFHeaderFooter(
        pdfId,
        pdfData.header_html,
        pdfData.footer_html
      );

      // Step 3: Add cover and background image (if any)
      setCreationProgress({
        step: 3,
        total: 3,
        message: "إضافة الغلاف والخلفية...",
      });

      await apiService.updatePDFCoverAndBackground(
        pdfId,
        pdfData.cover_html,
        pdfData.background_image
      );

      toast.showSuccess("تم إنشاء ملف PDF بنجاح!");

      // Reset form data
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

      // Reload existing PDFs
      loadExistingPDFs();
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast.showError(error.message || "خطأ في إنشاء ملف PDF");
    } finally {
      setIsCreating(false);
      setCreationProgress({
        step: 0,
        total: 3,
        message: "",
      });
    }
  };

  return (
    <div className="min-h-screen  ">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            إنشاء وإدارة ملفات PDF
          </h1>
          {!isAuthenticated && (
            <button
              onClick={handleTestLogin}
              disabled={isLoggingIn}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoggingIn ? "جاري تسجيل الدخول..." : "تسجيل الدخول للاختبار"}
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Existing PDFs Section */}
          <div className="bg-white rounded-lg  p-6">
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
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        اسم الملف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المعرف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الإنشاء
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {existingPDFs.map((pdf) => (
                      <tr key={pdf.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {pdf.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{pdf.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(pdf.created_at).toLocaleDateString(
                              "ar-SA"
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewPDF(pdf.id, pdf.name)}
                              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
                              title="عرض"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleEditPDF(pdf.id)}
                              className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center justify-center"
                              title="تحرير"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeletePDF(pdf.id)}
                              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Create New PDF Section */}
          <div className="bg-white rounded-lg p-6">
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
                <div className="w-full max-w-md">
                  {/* Progress indicator */}
                  {isCreating && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700">
                          الخطوة {creationProgress.step} من{" "}
                          {creationProgress.total}
                        </span>
                        <span className="text-sm text-blue-600">
                          {Math.round(
                            (creationProgress.step / creationProgress.total) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (creationProgress.step / creationProgress.total) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-blue-600 text-center">
                        {creationProgress.message}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleCreatePDF}
                    disabled={!pdfData.name || isCreating}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
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
                        جاري الإنشاء...
                      </>
                    ) : (
                      "إنشاء ملف PDF"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFCreator;
