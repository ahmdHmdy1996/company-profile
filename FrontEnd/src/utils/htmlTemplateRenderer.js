/**
 * Simple template renderer for HTML templates
 * Supports Handlebars-like syntax for basic templating
 */

/**
 * Renders HTML template with provided data
 * @param {string} template - HTML template with handlebars-like placeholders
 * @param {object} data - Data to replace in template
 * @returns {string} - Rendered HTML
 */
export const renderHtmlTemplate = (template, data) => {
  if (!template || typeof template !== "string") {
    return "";
  }

  let renderedHtml = template;

  // Replace {{#if field}} blocks
  renderedHtml = renderedHtml.replace(
    /\{\{#if\s+(\w+)\}\}(.*?)\{\{\/if\}\}/gs,
    (match, fieldName, content) => {
      const fieldValue = data[fieldName];
      // Show content if field exists and is not empty
      if (fieldValue && fieldValue.toString().trim() !== "") {
        return content;
      }
      return "";
    }
  );

  // Replace {{field}} placeholders
  renderedHtml = renderedHtml.replace(/\{\{(\w+)\}\}/g, (match, fieldName) => {
    const fieldValue = data[fieldName];
    if (fieldValue !== undefined && fieldValue !== null) {
      return fieldValue.toString();
    }
    return "";
  });

  return renderedHtml;
};

/**
 * Creates section data payload with rendered HTML
 * @param {object} design - Section design with htmlCode template
 * @param {object} formData - Form data with user inputs
 * @param {number} pageId - Page ID
 * @param {number} order - Section order
 * @returns {object} - Complete section payload
 */
export const createSectionPayload = (design, formData, pageId, order) => {
  // Render HTML template with form data
  const renderedHtml = renderHtmlTemplate(design.htmlCode, formData);

  // Create the complete data object that includes form data and rendered HTML
  const sectionData = {
    // Form data (title, content, etc.)
    ...formData,
    // Design information
    design_id: design.id,
    design_name: design.name,
    // Rendered HTML with actual values
    htmlCode: renderedHtml,
    // Original template for future edits
    templateCode: design.htmlCode,
  };

  return {
    page_id: pageId,
    data: JSON.stringify(sectionData), // Convert to JSON string as expected by backend
    order: order,
  };
};
