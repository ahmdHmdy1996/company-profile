/**
 * Utility functions for handling HTML content
 */

/**
 * Processes HTML content from API that may be escaped or stringified
 * @param {string|object} htmlContent - The HTML content from API
 * @returns {string} - Processed HTML string ready for rendering
 */
export const processHtmlContent = (htmlContent) => {
  if (!htmlContent) return '';
  
  let processedHtml = htmlContent;
  
  // If it's an object, stringify it first
  if (typeof htmlContent === 'object') {
    processedHtml = JSON.stringify(htmlContent);
  }
  
  // If it's a string that looks like JSON, parse it
  if (typeof processedHtml === 'string' && processedHtml.startsWith('"') && processedHtml.endsWith('"')) {
    try {
      processedHtml = JSON.parse(processedHtml);
    } catch (e) {
      // If parsing fails, remove the outer quotes manually
      processedHtml = processedHtml.slice(1, -1);
    }
  }
  
  // Unescape common HTML entities and escape sequences
  if (typeof processedHtml === 'string') {
    processedHtml = processedHtml
      .replace(/\\"/g, '"')  // Unescape quotes
      .replace(/\\n/g, '\n')   // Unescape newlines
      .replace(/\\t/g, '\t')   // Unescape tabs
      .replace(/\\\\/g, '\\'); // Unescape backslashes
  }
  
  return processedHtml;
};

/**
 * Sanitizes HTML content for safe rendering
 * @param {string} htmlContent - The HTML content to sanitize
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHtml = (htmlContent) => {
  if (!htmlContent) return '';
  
  // Basic sanitization - remove script tags and dangerous attributes
  return htmlContent
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
};

/**
 * Complete processing pipeline for API HTML content
 * @param {string|object} htmlContent - Raw HTML content from API
 * @returns {string} - Processed and sanitized HTML ready for rendering
 */
export const processApiHtml = (htmlContent) => {
  const processed = processHtmlContent(htmlContent);
  return sanitizeHtml(processed);
};

/**
 * Processes HTML content and converts local image paths to base64 for download
 * @param {string|object} htmlContent - Raw HTML content from API
 * @returns {Promise<string>} - Processed HTML with base64 images
 */
export const processApiHtmlForDownload = async (htmlContent) => {
  let processed = processHtmlContent(htmlContent);
  processed = sanitizeHtml(processed);
  
  // Find all local image paths in the HTML
  const imageRegex = /url\(['"]?\/src\/assets\/([^'"\)]+)['"]?\)/g;
  const matches = [...processed.matchAll(imageRegex)];
  
  // Convert each image to base64
  for (const match of matches) {
    const imagePath = match[1]; // Extract filename
    const fullMatch = match[0]; // Full match to replace
    
    try {
      // Try to import the image using new URL

      
      const imageUrl = new URL(`../assets/${imagePath}`, import.meta.url).href;
      
      // Fetch and convert to base64
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      const reader = new FileReader();
      
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
      // Replace the original path with base64
      processed = processed.replace(fullMatch, `url('${base64}')`);
    } catch (error) {
      console.error(`Error converting image ${imagePath} to base64:`, error);
      // Keep original path if conversion fails
    }
  }
  
  return processed;
};