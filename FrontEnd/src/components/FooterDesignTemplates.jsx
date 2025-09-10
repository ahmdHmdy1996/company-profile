import React from 'react';

const FooterDesignTemplates = ({ onSelectDesign, selectedDesign }) => {
  const footerDesigns = [
    {
      id: 'standard',
      name: 'تذييل قياسي',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMzAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjhmOWZhIiBzdHJva2U9IiNkZGRkZGQiLz4KPGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMzAwIiB5Mj0iMCIgc3Ryb2tlPSIjZGRkZGRkIiBzdHJva2Utd2lkdGg9IjEiLz4KPHRleHQgeD0iMTUwIiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiIgZm9udC1zaXplPSIxMiI+wqkgMjAyNCDYtNix2YPYqSDYp9mE2YXYs9iq2YLYqNmEIC0g2KzZhdmK2Lkg2KfZhNit2YLZiNmCINmF2K3Zgdin2LjYqTwvdGV4dD4KPHRleHQgeD0iMTUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiIgZm9udC1zaXplPSIxMCI+2KfZhNmH2KfYqtmBOiArOTY2IDExIDEyMyA0NTY3IHwg2KfZhNio2LHZitiv2YrYp9mE2KXZhNmD2KrYsdmI2YbZiiA8L3RleHQ+Cjx0ZXh0IHg9IjE1MCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjY2NjYiIGZvbnQtc2l6ZT0iMTAiPmluZm9AZnV0dXJlLWNvbXBhbnkuY29tPC90ZXh0Pgo8L3N2Zz4=',
      htmlCode: '<div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; font-family: Arial, sans-serif;"><p style="margin: 0 0 5px 0;">© 2024 شركة المستقبل - جميع الحقوق محفوظة</p><p style="margin: 0;">الهاتف: +966 11 123 4567 | البريد الإلكتروني: info@future-company.com</p></div>'
    },
    {
      id: 'detailed',
      name: 'تذييل مفصل',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDMwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMmMzZTUwIi8+Cjx0ZXh0IHg9IjIwIiB5PSIyNSIgZmlsbD0iIzM0OThkYiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiPtmF2LnZhNmI2YXYp9iqINin2YTYp9iq2LXYp9mEPC90ZXh0Pgo8dGV4dCB4PSIyMCIgeT0iNDAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEwIj7Yp9mE2YfYp9iq2YE6ICs5NjYgMTEgMTIzIDQ1Njc8L3RleHQ+Cjx0ZXh0IHg9IjIwIiB5PSI1NSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiPtmK2YXYp9mK2YQ6IGluZm9AZnV0dXJlLWNvbXBhbnkuY29tPC90ZXh0Pgo8dGV4dCB4PSIxMjAiIHk9IjI1IiBmaWxsPSIjMzQ5OGRiIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCI+2KfZhNi52YbZiNin2YY8L3RleHQ+Cjx0ZXh0IHg9IjEyMCIgeT0iNDAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEwIj7Yp9mE2LHZitin2LYsINin2YTZhdmF2YTZg9ipINin2YTYudix2KjZitipPC90ZXh0Pgo8dGV4dCB4PSIxMjAiIHk9IjU1IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMCI+2KfZhNiz2LnZiNiv2YrYqTwvdGV4dD4KPHRleHQgeD0iMjIwIiB5PSIyNSIgZmlsbD0iIzM0OThkYiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiPtiq2KfYqNi52YbYpzwvdGV4dD4KPHRleHQgeD0iMjIwIiB5PSI0MCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiPkxpbmtlZEluIHwgVHdpdHRlcjwvdGV4dD4KPHRleHQgeD0iMjIwIiB5PSI1NSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiPkluc3RhZ3JhbSB8IEZhY2Vib29rPC90ZXh0Pgo8bGluZSB4MT0iMCIgeTE9Ijc1IiB4Mj0iMzAwIiB5Mj0iNzUiIHN0cm9rZT0iIzM0NDk1ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iOTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEwIj7CqSAyMDI0INi02LHZg9ipINin2YTZhdiz2KrZgtio2YQgLSDYrNmF2YrYuSDYp9mE2K3ZgtmI2YIg2YXYrdmB2YjYuNipPC90ZXh0Pgo8L3N2Zz4=',
      htmlCode: '<div style="background: #2c3e50; color: white; padding: 20px; font-family: Arial, sans-serif;"><div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 15px;"><div><h4 style="margin: 0 0 10px 0; color: #3498db; font-size: 14px;">معلومات الاتصال</h4><p style="margin: 0 0 5px 0; font-size: 12px;">الهاتف: +966 11 123 4567</p><p style="margin: 0; font-size: 12px;">البريد: info@future-company.com</p></div><div><h4 style="margin: 0 0 10px 0; color: #3498db; font-size: 14px;">العنوان</h4><p style="margin: 0 0 5px 0; font-size: 12px;">الرياض، المملكة العربية</p><p style="margin: 0; font-size: 12px;">السعودية</p></div><div><h4 style="margin: 0 0 10px 0; color: #3498db; font-size: 14px;">تابعنا</h4><p style="margin: 0 0 5px 0; font-size: 12px;">LinkedIn | Twitter</p><p style="margin: 0; font-size: 12px;">Instagram | Facebook</p></div></div><div style="text-align: center; border-top: 1px solid #34495e; padding-top: 15px; font-size: 12px;">© 2024 شركة المستقبل - جميع الحقوق محفوظة</div></div>'
    },
    {
      id: 'compact',
      name: 'تذييل مضغوط',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMzAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZWNmMGYxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM3ZjhjOGQiIGZvbnQtc2l6ZT0iMTAiPsKpIDIwMjQg2LTYsdmD2Kkg2KfZhNmF2LPYqtmC2KjZhCB8INin2YTZh9in2KrZgTogKzk2NiAxMSAxMjMgNDU2NyB8IGluZm9AZnV0dXJlLWNvbXBhbnkuY29tPC90ZXh0Pgo8L3N2Zz4=',
      htmlCode: '<div style="background: #ecf0f1; padding: 8px; text-align: center; font-size: 10px; color: #7f8c8d; font-family: Arial, sans-serif;">© 2024 شركة المستقبل | الهاتف: +966 11 123 4567 | info@future-company.com</div>'
    },
    {
      id: 'modern',
      name: 'تذييل عصري',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDMwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNjY3ZWVhIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzc2NGJhMiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MykiLz4KPHRleHQgeD0iNDAiIHk9IjMwIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiPti02LHZg9ipINin2YTZhdiz2KrZgtio2YQ8L3RleHQ+Cjx0ZXh0IHg9IjQwIiB5PSI1MCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiPmluZm9AZnV0dXJlLWNvbXBhbnkuY29tPC90ZXh0Pgo8dGV4dCB4PSI0MCIgeT0iNjUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEwIj4rOTY2IDExIDEyMyA0NTY3PC90ZXh0Pgo8Y2lyY2xlIGN4PSIyNDAiIGN5PSI0MCIgcj0iMTIiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8Y2lyY2xlIGN4PSIyNjAiIGN5PSI0MCIgcj0iMTIiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8Y2lyY2xlIGN4PSIyODAiIGN5PSI0MCIgcj0iMTIiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8dGV4dCB4PSIxNTAiIHk9Ijg1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI5IiBmaWxsLW9wYWNpdHk9IjAuOCI+wqkgMjAyNCDYrNmF2YrYuSDYp9mE2K3ZgtmI2YIg2YXYrdmB2YjYuNipPC90ZXh0Pgo8L3N2Zz4=',
      htmlCode: '<div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; font-family: Arial, sans-serif;"><div><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">شركة المستقبل</h3><p style="margin: 0 0 3px 0; font-size: 11px;">info@future-company.com</p><p style="margin: 0; font-size: 11px;">+966 11 123 4567</p></div><div style="display: flex; gap: 10px;"><div style="width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div><div style="width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div><div style="width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div></div></div><div style="background: rgba(0,0,0,0.1); text-align: center; padding: 8px; font-size: 10px; color: rgba(255,255,255,0.8);">© 2024 جميع الحقوق محفوظة</div>'
    },
    {
      id: 'professional',
      name: 'تذييل احترافي',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMzAwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNlNWU3ZWIiLz4KPGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMzAwIiB5Mj0iMCIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjIiLz4KPHRleHQgeD0iMjAiIHk9IjI1IiBmaWxsPSIjMzc0MTUxIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCI+2LTYsdmD2Kkg2KfZhNmF2LPYqtmC2KjZhDwvdGV4dD4KPHRleHQgeD0iMjAiIHk9IjQ1IiBmaWxsPSIjNmI3MjgwIiBmb250LXNpemU9IjEwIj7Yp9mE2LHZitin2K/YqSDZgdmKINiq2YLYr9mK2YUg2K3ZhNmI2YQg2YXYqNiq2YPYsdipINmE2YTYo9i52YXYp9mEPC90ZXh0Pgo8dGV4dCB4PSIyMCIgeT0iNjAiIGZpbGw9IiM2YjcyODAiIGZvbnQtc2l6ZT0iMTAiPtmI2KfZhNiu2K/ZhdinINin2YTYqtmC2YbZitipINmE2YTYtNix2YPYp9iqINmI2KfZhNmF2KTYs9iz2KfYqjwvdGV4dD4KPHRleHQgeD0iMjAiIHk9IjgwIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjkiPsKpIDIwMjQg2LTYsdmD2Kkg2KfZhNmF2LPYqtmC2KjZhCAtINis2YXZitiqINin2YTYrdmC2YjZgiDZhdmB2YjYuNipPC90ZXh0Pgo8cmVjdCB4PSIyMDAiIHk9IjIwIiB3aWR0aD0iODAiIGhlaWdodD0iNDAiIGZpbGw9IiNmOWZhZmIiIHN0cm9rZT0iI2U1ZTdlYiIgcng9IjQiLz4KPHRleHQgeD0iMjQwIiB5PSIzNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzM3NDE1MSIgZm9udC1zaXplPSI5Ij7Yp9iq2LXZhCDYqNmG2Kc8L3RleHQ+Cjx0ZXh0IHg9IjI0MCIgeT0iNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiIGZvbnQtc2l6ZT0iOCI+KzEyMzQ1Njc4OTA8L3RleHQ+Cjwvc3ZnPg==',
      htmlCode: '<div style="background: white; border-top: 2px solid #e5e7eb; padding: 20px; font-family: Arial, sans-serif;"><div style="display: flex; justify-content: space-between; align-items: flex-start;"><div style="flex: 1;"><h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: bold;">شركة المستقبل</h3><p style="margin: 0 0 5px 0; color: #6b7280; font-size: 11px; line-height: 1.4;">الريادة في تقديم حلول مبتكرة للأعمال</p><p style="margin: 0 0 10px 0; color: #6b7280; font-size: 11px; line-height: 1.4;">والخدمات التقنية للشركات والمؤسسات</p><p style="margin: 0; color: #9ca3af; font-size: 10px;">© 2024 شركة المستقبل - جميع الحقوق محفوظة</p></div><div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; text-align: center; min-width: 120px;"><p style="margin: 0 0 5px 0; color: #374151; font-size: 10px; font-weight: bold;">اتصل بنا</p><p style="margin: 0; color: #6b7280; font-size: 9px;">+1234567890</p></div></div></div>'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">اختر تصميم الفوتر</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {footerDesigns.map((design) => (
          <div
            key={design.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedDesign === design.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectDesign(design.id, design.htmlCode)}
          >
            <div className="mb-3">
              <img
                src={design.preview}
                alt={design.name}
                className="w-full h-16 object-cover rounded border"
              />
            </div>
            <h4 className="font-medium text-gray-800 text-center">{design.name}</h4>
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