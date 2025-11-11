/**
 * Export utilities for Chromap extension
 * Provides functions to export color palettes in various formats
 */

/**
 * Export colors as JSON
 * @param {Array<Object>} colors - Array of color objects
 * @returns {string} JSON string
 */
function exportAsJson(colors) {
  return JSON.stringify(colors, null, 2);
}

/**
 * Export colors as CSV
 * @param {Array<Object>} colors - Array of color objects
 * @returns {string} CSV string
 */
function exportAsCsv(colors) {
  const header = "Hex,RGB,HSL,Frequency,Sources\n";
  const rows = colors.map((color) => {
    const sources = color.sources ? color.sources.join(";") : "";
    return `"${color.hex}","${color.rgb}","${color.hsl}",${color.frequency},"${sources}"`;
  });
  return header + rows.join("\n");
}

/**
 * Export colors as CSS variables
 * @param {Array<Object>} colors - Array of color objects
 * @returns {string} CSS string
 */
function exportAsCss(colors) {
  let css = ":root {\n";
  colors.forEach((color, index) => {
    css += `  --color-${index + 1}: ${color.hex};\n`;
  });
  css += "}\n";
  return css;
}

/**
 * Export colors as Adobe Swatch (.ase) format (basic implementation)
 * Note: This is a simplified implementation. Full .ase format is binary.
 * @param {Array<Object>} colors - Array of color objects
 * @returns {ArrayBuffer} ASE file data
 */
function exportAsAse(colors) {
  // This is a placeholder - full ASE format requires binary encoding
  // For now, we'll create a simple text representation
  // Note: ASE export is not fully implemented. Use JSON or CSV instead.
  return null;
}

/**
 * Download file with given content
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    exportAsJson,
    exportAsCsv,
    exportAsCss,
    exportAsAse,
    downloadFile,
  };
}
