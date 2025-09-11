import React from "react";

const HeaderDesignTemplates = ({ onSelectDesign, selectedDesign, pageName }) => {
  const headerDesigns = [
    {
      id: "modern",
      name: "تصميم عصري",
      preview:"/src/assets/header1.png",
      getHtmlCode: (pageTitle) => `<div id="tac-header" style="
  position: relative; width: 100%; height: 140px; 
  background:#fff; overflow:hidden;">

  <!-- اللوح الرمادي المائل -->
  <div style="
    position:absolute; left:-120px; top:0; width:70%; height:100%;
    background:#eaeaea; transform: skewX(-20deg);">
  </div>

  <!-- محتوى الهيدر مع تصحيح الميل -->
  <div style="
    position:absolute; left:0; top:0; height:100%; width:64%;
    display:flex; align-items:center; gap:18px;
    padding-inline-start: 110px; transform: skewX(20deg);" dir="ltr">

    <!-- الشعار (صورة لضمان التوافق مع html2canvas) -->
    <img src="/src/assets/logo.png" crossOrigin="anonymous" alt="TAC" 
         style="height:64px; width:auto; transform: skewX(-20deg);">

    <!-- النص -->
    <div ">
      <div style="font-size:34px; font-weight:800; color:#1f5132; letter-spacing:.5px;">
        ${pageTitle || 'Page Title'}
      </div>
      <div style="font-size:13px; color:#7c7c7c; margin-top:6px;">
        Team <span style="color:#18a957;">Arabia</span> Company
      </div>
    </div>
  </div>
</div>`,
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        اختر تصميم الهيدر
      </h3>
      <div className="grid grid-cols-1  gap-4">
        {headerDesigns.map((design) => (
          <div
            key={design.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedDesign === design.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelectDesign(design.id, design.getHtmlCode(pageName))}
          >
            <div className="mb-3">
              <img
                src={design.preview}
                alt={design.name}
                className="w-full h-20 object-cover rounded border"
              />
            </div>
            <h4 className="font-medium text-gray-800 text-center">
              {design.name}
            </h4>
            {selectedDesign === design.id && (
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                <p className="text-gray-600 mb-1">كود HTML:</p>
                <code className="text-gray-800 break-all">
                  {design.getHtmlCode(pageName).substring(0, 100)}...
                </code>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderDesignTemplates;
