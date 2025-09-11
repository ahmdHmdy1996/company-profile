import React from "react";

const CoverDesignTemplates = ({ selectedDesign, onSelectDesign }) => {
  const coverDesigns = [
    {
      id: "custom-background-cover",
      name: "غلاف مخصص",
      preview: "/src/assets/cover1.png",
      htmlCode: `<div id="cover" style="
  position: relative; 
  width: 100%;               /* يمكن تغييره لأي حجم */
  aspect-ratio: 1 / 1.414;    /* يحافظ على نسبة A4 */
  background:#f5f5f5; overflow:hidden; 
  color:#111; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, 'Noto Kufi Arabic', sans-serif;">

  <!-- صورة الخلفية -->
  <img src="/src/assets/cover1.png" crossOrigin="anonymous" alt="bg" 
       style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">

  <!-- طبقة تعتيم خفيفة -->
  <div style="position:absolute; inset:0; background: rgba(255,255,255,0.12);"></div>

  <!-- اللوح الأبيض المائل الكبير -->
  <div style="
    position:absolute; left:-15%; top:0; width:70%; height:100%;
    background:#ffffff; transform: skewX(-18deg);
    box-shadow: 0 0 0 1px rgba(0,0,0,0.06) inset;">
  </div>

  <!-- محتوى اللوح الأبيض -->
  <div style="
    position:absolute;
    text-align: left;
    left:0;
    top: 30%;
    width:55%;
    height:100%;
    ">

    <!-- شعار -->
    <div style="display:flex;align-items:center;gap:14px;flex-direction: row-reverse;">
      <img src="/src/assets/logo.png" crossOrigin="anonymous" alt="logo" style="height:64px; width:auto;">
    </div>

    <!-- العناوين -->
    <div style="margin-top:8%">
      <div style="font-size:2.2vw; font-weight:800; color:#4a1c1c; letter-spacing:.5px;">COMPANY PROFILE</div>
      <div style="font-size:2vw; font-weight:700; color:#333; margin-top:6px;">Team Arabia Company</div>
      <div style="height:3px; width:20%; background:#4a1c1c; opacity:.8; margin-top:12px;"></div>
    </div>

    <!-- الموقع -->
    <div style="margin-top:5%">
      <span style="font-size:1.6vw; color:#0b3c74; font-weight:700;">www.tac-cx.com</span>
    </div>
  </div>

  <!-- الشرائط البيضاء المائلة -->
  <div style="position:absolute; left:62%; top:-6%; width:2.5%; height:115%; background:#fff; transform: rotate(20deg); opacity:0.98;"></div>
  <div style="position:absolute; left:78%; top:-8%; width:2.5%; height:120%; background:#fff; transform: rotate(20deg); opacity:0.98;"></div>

  <!-- وهج خفيف سفلي -->
  <div style="
    position:absolute; left:-18%; bottom:-25%; width:80%; height:80%;
    background: radial-gradient(closest-side, rgba(255,255,255,.55), rgba(255,255,255,0));
    transform: rotate(22deg);">
  </div>
</div>`,
    },
  ];

  const handleDesignSelect = (design) => {
    onSelectDesign(design.id, design.htmlCode);
  };

  return (
    <div className="cover-design-templates">
      <div
        className="designs-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "15px",
        }}
      >
        {coverDesigns.map((design) => (
          <div
            key={design.id}
            className={`design-card ${
              selectedDesign === design.id ? "selected" : ""
            }`}
            onClick={() => handleDesignSelect(design)}
            style={{
              border:
                selectedDesign === design.id
                  ? "3px solid #3498db"
                  : "2px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backgroundColor:
                selectedDesign === design.id ? "#f8f9fa" : "white",
              boxShadow:
                selectedDesign === design.id
                  ? "0 4px 12px rgba(52, 152, 219, 0.3)"
                  : "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "250px",
                aspectRatio: "1 / 1.414",
                backgroundImage: `url(${design.preview})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "8px",
                marginBottom: "10px",
                border: "1px solid #eee",
              }}
            ></div>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "16px",
                fontWeight: "bold",
                color: selectedDesign === design.id ? "#3498db" : "#333",
                textAlign: "center",
              }}
            >
              {design.name}
            </h4>
            {selectedDesign === design.id && (
              <div
                style={{
                  textAlign: "center",
                  color: "#3498db",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                ✓ محدد
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoverDesignTemplates;
