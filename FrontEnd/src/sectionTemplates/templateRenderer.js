import SectionTemplatesData from "./SectionTemplatesData";

// Simple HTML escape to avoid accidental injection when inserting plain text
const escapeHtml = (str) => {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

// Render a template string with a data object.
// Supports:
// - {{key}} replacements
// - {{#if key}}...{{/if}} blocks
// - {{#each arr}}...{{/each}} loops with {{this}}
export function renderTemplate(template, data = {}) {
  if (!template) return "";

  let out = template;

  // Handle #if blocks
  out = out.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (m, key, inner) => {
    const val = data[key];
    if (val === undefined || val === null || val === "") return "";
    // keep inner and allow further replacements
    return inner;
  });

  // Handle #each loops (simple): {{#each arr}}...{{/each}} with {{this}}
  out = out.replace(
    /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g,
    (m, key, inner) => {
      const arr = data[key];
      if (!Array.isArray(arr) || arr.length === 0) return "";
      return arr
        .map((item) => {
          if (typeof item === "object") {
            // simple object: replace {{this.prop}} occurrences
            let block = inner;
            Object.keys(item).forEach((p) => {
              const re = new RegExp("{{\\s*this\\." + p + "\\s*}}", "g");
              block = block.replace(re, escapeHtml(item[p]));
            });
            // fallback for {{this}}
            block = block.replace(/{{\s*this\s*}}/g, escapeHtml(item));
            return block;
          }
          return inner.replace(/{{\s*this\s*}}/g, escapeHtml(item));
        })
        .join("");
    }
  );

  // Replace simple {{key}} placeholders
  out = out.replace(/{{\s*(\w+)\s*}}/g, (m, key) => {
    const val = data[key];
    if (val === undefined || val === null) return "";
    // preserve line breaks for text fields
    if (typeof val === "string") return escapeHtml(val).replace(/\n/g, "<br/>");
    return escapeHtml(val);
  });

  return out;
}

// Find a template by module and id and render it with data
export function getRenderedTemplate(moduleType, templateId, data = {}) {
  const list = SectionTemplatesData[moduleType] || [];
  const tpl = list.find((t) => t.id === templateId);
  if (!tpl) return null;
  const html = renderTemplate(tpl.htmlCode, data);
  // Return an object suitable for sending to backend
  return {
    id: tpl.id,
    module: moduleType,
    data,
    html,
  };
}

export default renderTemplate;
