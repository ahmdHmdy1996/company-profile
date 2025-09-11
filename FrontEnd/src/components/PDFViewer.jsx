import React, { useState, useEffect } from "react";
import { X, FileText, Download } from "lucide-react";
import { processApiHtml, processApiHtmlForDownload } from "../utils/htmlUtils";
import { apiService } from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Function to process header HTML with page title replacement
const processHeaderWithPageTitle = (headerHtml, pageTitle) => {
  if (!headerHtml) return headerHtml;

  let processedHeader = processApiHtml(headerHtml);

  // Replace various forms of "our project" with the page title
  if (pageTitle) {
    processedHeader = processedHeader
      .replace(/our project/gi, pageTitle)
      .replace(/OUR PROJECT/g, pageTitle)
      .replace(/Our Project/g, pageTitle)
      .replace(/Page Title/gi, pageTitle)
      .replace(/مشروعنا/g, pageTitle) // Arabic for "our project"
      .replace(/المشروع/g, pageTitle); // Arabic for "the project"
  }

  return processedHeader;
};

// Function to process header HTML for download with page title replacement
const processHeaderWithPageTitleForDownload = async (headerHtml, pageTitle) => {
  if (!headerHtml) return headerHtml;

  let processedHeader = await processApiHtmlForDownload(headerHtml);

  // Replace various forms of "our project" with the page title
  if (pageTitle) {
    processedHeader = processedHeader
      .replace(/our project/gi, pageTitle)
      .replace(/OUR PROJECT/g, pageTitle)
      .replace(/Our Project/g, pageTitle)
      .replace(/Page Title/gi, pageTitle)
      .replace(/مشروعنا/g, pageTitle) // Arabic for "our project"
      .replace(/المشروع/g, pageTitle); // Arabic for "the project"
  }

  return processedHeader;
};

// Utility function to convert background image path to proper URL
const getImageUrl = (imagePath, pdfData) => {
  if (!imagePath) return null;

  // If pdfData has background_image_url, use it directly
  if (pdfData?.background_image_url) {
    return pdfData.background_image_url;
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a local file path (like C:\xampp\tmp\phpXXX.tmp),
  // we need to convert it to a proper backend URL
  if (imagePath.includes("\\") || imagePath.includes("tmp")) {
    // Extract filename if it's a full path
    const filename = imagePath.split("\\").pop();
    // Return the backend storage URL (adjust this URL based on your backend setup)
    return `http://localhost:8000/storage/background_images/${filename}`;
  }

  // If it's a relative path, prepend the backend URL
  return `http://localhost:8000/storage/${imagePath}`;
};

const PDFViewer = ({ isVisible, pdfData, pdfName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageSections, setPageSections] = useState({});
  const [loadingSections, setLoadingSections] = useState(false);

  // Fetch sections for each page when pdfData changes
  useEffect(() => {
    const fetchPageSections = async () => {
      console.log("PDFViewer - pdfData received:", pdfData);
      console.log("PDFViewer - pdfData.pages:", pdfData?.pages);

      if (
        pdfData?.pages &&
        Array.isArray(pdfData.pages) &&
        pdfData.pages.length > 0
      ) {
        setLoadingSections(true);
        const sectionsData = {};
        console.log(`Fetching sections for ${pdfData.pages.length} pages`);

        for (const page of pdfData.pages) {
          console.log(`Fetching sections for page ${page.id}`);
          try {
            const response = await apiService.getSections(page.id);
            console.log(`Sections for page ${page.id}:`, response.data);

            // Debug: Log the structure of each section
            if (response.data && response.data.length > 0) {
              console.log(`First section structure:`, response.data[0]);
            }

            sectionsData[page.id] = response.data || [];
          } catch (error) {
            console.error(
              `Error fetching sections for page ${page.id}:`,
              error
            );
            sectionsData[page.id] = [];
          }
        }

        setPageSections(sectionsData);
        setLoadingSections(false);
      } else {
        console.log("PDFViewer - No pages found or pages is not a valid array");
        setPageSections({});
        setLoadingSections(false);
      }
    };

    fetchPageSections();
  }, [pdfData]);

  if (!isVisible) {
    return null;
  }

  const handleDownload = async () => {
    if (pdfData) {
      setIsLoading(true);
      try {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        let isFirstPage = true;

        // Process cover page
        if (pdfData.cover) {
          const processedCoverContent =
            await processHeaderWithPageTitleForDownload(
              pdfData.cover,
              pdfData.name ||
                (pdfData.pages && pdfData.pages[0]
                  ? pdfData.pages[0].title
                  : null)
            );
          const coverDiv = document.createElement("div");
          coverDiv.innerHTML = processedCoverContent;
          coverDiv.style.cssText = `
            font-family: Arial, sans-serif;
            direction: rtl;
            padding: 20px;
            background: white;
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            box-sizing: border-box;
          `;

          if (pdfData.background_image) {
            const backgroundImageUrl = getImageUrl(
              pdfData.background_image,
              pdfData
            );
            if (backgroundImageUrl) {
              coverDiv.style.backgroundImage = `url(${backgroundImageUrl})`;
              coverDiv.style.backgroundSize = "cover";
              coverDiv.style.backgroundPosition = "center";
              coverDiv.style.backgroundRepeat = "no-repeat";
            }
          }

          document.body.appendChild(coverDiv);

          const coverCanvas = await html2canvas(coverDiv, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            width: coverDiv.scrollWidth,
            height: coverDiv.scrollHeight,
          });

          const coverImgData = coverCanvas.toDataURL("image/png");
          const imgWidth = 210;
          const imgHeight = (coverCanvas.height * imgWidth) / coverCanvas.width;

          if (!isFirstPage) pdf.addPage();
          pdf.addImage(coverImgData, "PNG", 0, 0, imgWidth, imgHeight);
          isFirstPage = false;

          document.body.removeChild(coverDiv);
        }

        // Process each page
        if (
          pdfData.pages &&
          Array.isArray(pdfData.pages) &&
          pdfData.pages.length > 0
        ) {
          for (
            let pageIndex = 0;
            pageIndex < pdfData.pages.length;
            pageIndex++
          ) {
            const page = pdfData.pages[pageIndex];
            const sections = pageSections[page.id] || [];

            // Create page content
            const pageDiv = document.createElement("div");
            pageDiv.style.cssText = `
              font-family: Arial, sans-serif;
              direction: rtl;
              background: white;
              width: 210mm;
              min-height: 297mm;
              margin: 0;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
            `;

            if (pdfData.background_image) {
              const backgroundImageUrl = getImageUrl(
                pdfData.background_image,
                pdfData
              );
              if (backgroundImageUrl) {
                pageDiv.style.backgroundImage = `url(${backgroundImageUrl})`;
                pageDiv.style.backgroundSize = "cover";
                pageDiv.style.backgroundPosition = "center";
                pageDiv.style.backgroundRepeat = "no-repeat";
              }
            }

            // Add header
            if (page.has_header && pdfData.header) {
              const headerContent = await processHeaderWithPageTitleForDownload(
                pdfData.header,
                page.title
              );
              const headerDiv = document.createElement("div");
              headerDiv.innerHTML = headerContent;
              pageDiv.appendChild(headerDiv);
            }

            // Add page content
            const contentDiv = document.createElement("div");
            contentDiv.style.cssText = "flex: 1; padding: 20px;";

            // Page title
            if (page.title) {
              const titleDiv = document.createElement("h2");
              titleDiv.textContent = page.title;
              titleDiv.style.cssText =
                "font-size: 24px; font-weight: bold; margin-bottom: 24px; text-align: center; color: #1f2937;";
              contentDiv.appendChild(titleDiv);
            }

            // Add sections
            for (const section of sections) {
              // Parse the section data if it's a JSON string
              let sectionData = section;
              if (typeof section.data === "string") {
                try {
                  sectionData = {
                    ...section,
                    ...JSON.parse(section.data),
                  };
                } catch (error) {
                  console.error("Error parsing section data:", error);
                  sectionData = section;
                }
              }

              // Get the HTML content from various possible sources
              const htmlContent =
                sectionData.htmlCode ||
                sectionData.content ||
                sectionData.html ||
                section.content ||
                section.html ||
                "";

              if (htmlContent) {
                const sectionContent = await processApiHtmlForDownload(
                  htmlContent
                );
                const sectionDiv = document.createElement("div");
                sectionDiv.innerHTML = sectionContent;
                sectionDiv.style.cssText = "margin-bottom: 16px;";
                contentDiv.appendChild(sectionDiv);
              }
            }

            pageDiv.appendChild(contentDiv);

            // Add footer
            if (page.has_footer && pdfData.footer) {
              const footerContent = await processApiHtmlForDownload(
                pdfData.footer
              );
              const footerDiv = document.createElement("div");
              footerDiv.innerHTML = footerContent.replace(
                /<!-- سيتم ملؤه بالسكربت -->/g,
                `${pageIndex + 1} / ${pdfData.pages.length}`
              );
              pageDiv.appendChild(footerDiv);
            }

            document.body.appendChild(pageDiv);

            const pageCanvas = await html2canvas(pageDiv, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: "#ffffff",
              width: pageDiv.scrollWidth,
              height: pageDiv.scrollHeight,
            });

            const pageImgData = pageCanvas.toDataURL("image/png");
            const imgWidth = 210;
            const imgHeight = (pageCanvas.height * imgWidth) / pageCanvas.width;

            if (!isFirstPage) pdf.addPage();
            pdf.addImage(pageImgData, "PNG", 0, 0, imgWidth, imgHeight);
            isFirstPage = false;

            document.body.removeChild(pageDiv);
          }
        }

        pdf.save((pdfName || "document") + ".pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("حدث خطأ أثناء إنشاء ملف PDF");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-[40rem] bg-white border-r border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">عارض PDF</h3>
          {pdfData && pdfData.name && (
            <span className="text-sm text-gray-600">- {pdfData.name}</span>
          )}
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {pdfData && (
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={isLoading ? "جاري إنشاء PDF..." : "تحميل PDF"}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="h-full pb-16 overflow-y-auto">
        {pdfData ? (
          <div className="space-y-8">
            {/* Cover Page */}
            {pdfData.cover && (
              <div
                className="aspect-[210/297] bg-white border border-gray-200 shadow-lg mx-2"
                style={{
                  backgroundImage: pdfData.background_image
                    ? `url(${getImageUrl(pdfData.background_image, pdfData)})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{
                    __html: processHeaderWithPageTitle(
                      pdfData.cover,
                      pdfData.name ||
                        (pdfData.pages && pdfData.pages[0]
                          ? pdfData.pages[0].title
                          : null)
                    ),
                  }}
                />
              </div>
            )}

            {/* Pages */}
            {pdfData.pages &&
            Array.isArray(pdfData.pages) &&
            pdfData.pages.length > 0 ? (
              pdfData.pages.map((page, pageIndex) => (
                <div
                  key={page.id}
                  className="aspect-[210/297] bg-white border border-gray-200 shadow-lg mx-2 flex flex-col"
                  style={{
                    backgroundImage: pdfData.background_image
                      ? `url(${getImageUrl(pdfData.background_image, pdfData)})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Page Header */}
                  {page.has_header && pdfData.header && (
                    <div
                      className="w-full flex-shrink-0"
                      dangerouslySetInnerHTML={{
                        __html: processHeaderWithPageTitle(
                          pdfData.header,
                          page.title
                        ),
                      }}
                    />
                  )}

                  {/* Page Content - Sections */}
                  <div className="flex-1 p-6 overflow-hidden">
                    {/* Sections */}
                    {loadingSections ? (
                      <div className="text-center text-blue-500 py-8 flex items-center justify-center h-full">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <p>جاري تحميل محتوى الصفحة...</p>
                        </div>
                      </div>
                    ) : pageSections[page.id] &&
                      pageSections[page.id].length > 0 ? (
                      <div className="space-y-4 h-full overflow-y-auto">
                        {pageSections[page.id].map((section) => {
                          // Parse the section data if it's a JSON string
                          let sectionData = section;
                          if (typeof section.data === "string") {
                            try {
                              sectionData = {
                                ...section,
                                ...JSON.parse(section.data),
                              };
                            } catch (error) {
                              console.error(
                                "Error parsing section data:",
                                error
                              );
                              sectionData = section;
                            }
                          }

                          // Get the HTML content from various possible sources
                          const htmlContent =
                            sectionData.htmlCode ||
                            sectionData.content ||
                            sectionData.html ||
                            section.content ||
                            section.html ||
                            "";

                          return (
                            <div
                              key={section.id}
                              className="section-content prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: processApiHtml(htmlContent),
                              }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8 flex items-center justify-center h-full">
                        <p></p>
                      </div>
                    )}
                  </div>

                  {/* Page Footer */}
                  {page.has_footer && pdfData.footer && (
                    <div
                      className="w-full flex-shrink-0"
                      dangerouslySetInnerHTML={{
                        __html: processApiHtml(pdfData.footer).replace(
                          /<!-- سيتم ملؤه بالسكربت -->/g,
                          `${pageIndex + 1} / ${pdfData.pages.length}`
                        ),
                      }}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8 mx-2">
                <div className="bg-white border border-gray-200 shadow-lg p-8 rounded-lg">
                  <FileText className="w-16 h-16 text-gray-300 mb-4 mx-auto" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">
                    لا توجد صفحات في هذا الملف
                  </h4>
                  <p className="text-gray-500 text-sm">
                    هذا الملف يحتوي على غلاف فقط بدون صفحات إضافية
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              لا يوجد PDF محدد
            </h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              اختر ملف PDF من القائمة لعرضه هنا
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
