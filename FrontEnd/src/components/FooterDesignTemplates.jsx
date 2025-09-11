import React from "react";

const FooterDesignTemplates = ({ onSelectDesign, selectedDesign }) => {
  const footerDesigns = [
    {
      id: "standard",
      name: "تذييل قياسي",
      preview:
        "/src/assets/footer1.png",
      htmlCode: `<div id="tac-footer" style="
  position: relative; width: 100%; height: 120px; 
  background:#fff; overflow:hidden;">

  <!-- حاوية الشريطين -->
  <div style="
    position:absolute; left:50%; top:30px; transform:translateX(-50%);
    width: 70%; height: 26px;">

    <!-- شريط التقدّم الأخضر -->
    <div id="bar-green" style="
      position:absolute; left:0; top:0; height:100%; width: 40%; 
      background:#6dab2e; border-radius: 14px;">
    </div>
    <!-- رأس مائل صغير للأخضر -->
    <div id="cap-green" style="
      position:absolute; left:-18px; top:4px; width:26px; height:18px;
      background:#6dab2e; transform: skewX(-30deg); border-radius:4px;">
    </div>

    <!-- الشريط الرمادي (الجزء المتبقي) يوضع بعد الأخضر -->
    <div id="bar-gray" style="
      position:absolute; top:0; height:100%; width: 50%; left: 46%;
      background:#c7c7c7; border-radius: 14px;">
    </div>
    <!-- رأس مائل صغير للرمادي -->
    <div id="cap-gray" style="
      position:absolute; top:4px; width:26px; height:18px; 
      background:#c7c7c7; transform: skewX(-30deg); border-radius:4px; left: 44%;">
    </div>
  </div>

  <!-- مؤشر الصفحة -->
  <div id="page-indicator" style="
    position:absolute; left:50%; bottom:18px; transform:translateX(-50%);
    font-size:18px; color:#333; letter-spacing:3px;">
    <!-- سيتم ملؤه بالسكربت -->
  </div>
</div>`,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        اختر تصميم الفوتر
      </h3>
      <div className="grid grid-cols-1  gap-4">
        {footerDesigns.map((design) => (
          <div
            key={design.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedDesign === design.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelectDesign(design.id, design.htmlCode)}
          >
            <div className="mb-3">
              <img
                src={design.preview}
                alt={design.name}
                className="w-full h-24 object-contain rounded border"
              />
            </div>
            <h4 className="font-medium text-gray-800 text-center">
              {design.name}
            </h4>
            {selectedDesign === design.id && (
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                <p className="text-gray-600 mb-1">كود HTML:</p>
                <code className="text-gray-800 break-all">
                  {design.htmlCode.substring(0, 100)}...
                </code>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterDesignTemplates;
