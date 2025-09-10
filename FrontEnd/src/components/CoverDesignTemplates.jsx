import React from 'react';

const CoverDesignTemplates = ({ selectedDesign, onSelectDesign }) => {
  const coverDesigns = [
    {
      id: 'modern-cover',
      name: 'غلاف حديث',
      preview: 'https://via.placeholder.com/300x400/667eea/ffffff?text=Modern+Cover',
      htmlCode: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 40px; text-align: center; min-height: 500px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;">
  <div style="background: rgba(255,255,255,0.1); padding: 40px; border-radius: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
    <h1 style="margin: 0 0 20px 0; font-size: 48px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">شركة المستقبل</h1>
    <div style="width: 100px; height: 4px; background: white; margin: 0 auto 20px auto; border-radius: 2px;"></div>
    <h2 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 300; opacity: 0.9;">تقرير سنوي 2024</h2>
    <p style="margin: 0; font-size: 16px; opacity: 0.8; line-height: 1.6;">نحو مستقبل أفضل وأكثر إشراقاً</p>
  </div>
  <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); font-size: 14px; opacity: 0.7;">
    تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}
  </div>
</div>`
    },
    {
      id: 'classic-cover',
      name: 'غلاف كلاسيكي',
      preview: 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=Classic+Cover',
      htmlCode: `<div style="background: #2c3e50; color: white; padding: 60px 40px; text-align: center; min-height: 500px; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
  <div style="border: 3px solid #3498db; padding: 40px; margin: 20px 0;">
    <div style="border: 1px solid #3498db; padding: 30px;">
      <h1 style="margin: 0 0 30px 0; font-size: 42px; font-weight: bold; letter-spacing: 2px;">شركة المستقبل</h1>
      <div style="display: flex; align-items: center; justify-content: center; margin: 30px 0;">
        <div style="width: 50px; height: 1px; background: #3498db;"></div>
        <div style="margin: 0 20px; font-size: 18px; color: #3498db;">★</div>
        <div style="width: 50px; height: 1px; background: #3498db;"></div>
      </div>
      <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 300;">التقرير السنوي</h2>
      <h3 style="margin: 0; font-size: 36px; font-weight: bold; color: #3498db;">2024</h3>
    </div>
  </div>
  <div style="text-align: center; font-size: 14px; opacity: 0.8;">
    <p style="margin: 0;">المملكة العربية السعودية</p>
    <p style="margin: 5px 0 0 0;">${new Date().toLocaleDateString('ar-SA')}</p>
  </div>
</div>`
    },
    {
      id: 'minimal-cover',
      name: 'غلاف بسيط',
      preview: 'https://via.placeholder.com/300x400/ffffff/333333?text=Minimal+Cover',
      htmlCode: `<div style="background: white; color: #333; padding: 80px 40px; text-align: center; min-height: 500px; display: flex; flex-direction: column; justify-content: center; border: 1px solid #ddd;">
  <div style="max-width: 400px; margin: 0 auto;">
    <h1 style="margin: 0 0 40px 0; font-size: 48px; font-weight: 300; color: #2c3e50; line-height: 1.2;">شركة<br/>المستقبل</h1>
    <div style="width: 80px; height: 2px; background: #3498db; margin: 0 auto 40px auto;"></div>
    <h2 style="margin: 0 0 60px 0; font-size: 24px; font-weight: 400; color: #7f8c8d;">التقرير السنوي 2024</h2>
    <div style="border-top: 1px solid #ecf0f1; padding-top: 30px;">
      <p style="margin: 0; font-size: 16px; color: #95a5a6; font-weight: 300;">نحو مستقبل أفضل</p>
    </div>
  </div>
</div>`
    },
    {
      id: 'corporate-cover',
      name: 'غلاف مؤسسي',
      preview: 'https://via.placeholder.com/300x400/34495e/ffffff?text=Corporate+Cover',
      htmlCode: `<div style="background: linear-gradient(to bottom, #34495e 0%, #2c3e50 100%); color: white; padding: 40px; min-height: 500px; display: flex; flex-direction: column; position: relative;">
  <div style="background: rgba(52, 152, 219, 0.1); padding: 2px; margin-bottom: 40px;">
    <div style="background: #34495e; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">شركة المستقبل</h1>
    </div>
  </div>
  
  <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; text-align: center;">
    <h2 style="margin: 0 0 30px 0; font-size: 36px; font-weight: 300; color: #3498db;">التقرير السنوي</h2>
    <div style="background: rgba(255,255,255,0.1); padding: 30px; margin: 20px 0; border-left: 4px solid #3498db;">
      <h3 style="margin: 0 0 15px 0; font-size: 48px; font-weight: bold;">2024</h3>
      <p style="margin: 0; font-size: 18px; opacity: 0.9;">الإنجازات والتطلعات</p>
    </div>
  </div>
  
  <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; text-align: center; font-size: 14px; opacity: 0.8;">
    <p style="margin: 0;">تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}</p>
    <p style="margin: 5px 0 0 0;">المملكة العربية السعودية</p>
  </div>
</div>`
    },
    {
      id: 'creative-cover',
      name: 'غلاف إبداعي',
      preview: 'https://via.placeholder.com/300x400/e74c3c/ffffff?text=Creative+Cover',
      htmlCode: `<div style="background: linear-gradient(45deg, #e74c3c 0%, #c0392b 50%, #8e44ad 100%); color: white; padding: 40px; min-height: 500px; display: flex; flex-direction: column; position: relative; overflow: hidden;">
  <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%; transform: rotate(45deg);"></div>
  <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
  
  <div style="position: relative; z-index: 2; text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center;">
    <div style="background: rgba(255,255,255,0.15); padding: 40px; border-radius: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); transform: rotate(-2deg);">
      <h1 style="margin: 0 0 20px 0; font-size: 42px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); transform: rotate(2deg);">شركة المستقبل</h1>
      <div style="display: flex; align-items: center; justify-content: center; margin: 20px 0;">
        <div style="width: 30px; height: 3px; background: white; margin: 0 10px; transform: rotate(15deg);"></div>
        <div style="width: 30px; height: 3px; background: white; margin: 0 10px; transform: rotate(-15deg);"></div>
        <div style="width: 30px; height: 3px; background: white; margin: 0 10px; transform: rotate(15deg);"></div>
      </div>
      <h2 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 300; transform: rotate(1deg);">تقرير الإنجازات</h2>
      <h3 style="margin: 0; font-size: 32px; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">2024</h3>
    </div>
  </div>
  
  <div style="position: relative; z-index: 2; text-align: center; margin-top: 30px; font-size: 14px; opacity: 0.9;">
    <p style="margin: 0;">الإبداع والتميز في كل خطوة</p>
  </div>
</div>`
    }
  ];

  const handleDesignSelect = (design) => {
    onSelectDesign(design.id, design.htmlCode);
  };

  return (
    <div className="cover-design-templates">
      <div className="designs-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '15px'
      }}>
        {coverDesigns.map((design) => (
          <div
            key={design.id}
            className={`design-card ${selectedDesign === design.id ? 'selected' : ''}`}
            onClick={() => handleDesignSelect(design)}
            style={{
              border: selectedDesign === design.id ? '3px solid #3498db' : '2px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: selectedDesign === design.id ? '#f8f9fa' : 'white',
              boxShadow: selectedDesign === design.id ? '0 4px 12px rgba(52, 152, 219, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              width: '100%',
              height: '200px',
              backgroundImage: `url(${design.preview})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              marginBottom: '10px',
              border: '1px solid #eee'
            }}></div>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '16px',
              fontWeight: 'bold',
              color: selectedDesign === design.id ? '#3498db' : '#333',
              textAlign: 'center'
            }}>
              {design.name}
            </h4>
            {selectedDesign === design.id && (
              <div style={{
                textAlign: 'center',
                color: '#3498db',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                ✓ محدد
              </div>
            )}
          </div>
        ))}
      </div>
      
      {selectedDesign && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>معاينة التصميم المحدد:</h5>
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            {coverDesigns.find(d => d.id === selectedDesign)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default CoverDesignTemplates;