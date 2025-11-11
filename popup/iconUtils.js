/**
 * Icon utility for Chromap extension
 * Converts Lucide icon data to SVG strings
 * 
 * To add more icons:
 * 1. Find the icon in node_modules/lucide/dist/esm/icons/[icon-name].js
 * 2. Copy the icon data array (e.g., const IconName = [...])
 * 3. Add it to this file and create a getter function
 * 4. Use it in HTML: <span class="icon-[name]"></span>
 * 5. Add initialization in popup.js initializeIcons() function
 */

/**
 * Convert Lucide icon data to SVG string
 * @param {Array} iconData - Lucide icon data array
 * @param {Object} options - SVG options (size, color, strokeWidth)
 * @returns {string} SVG string
 */
function iconToSvg(iconData, options = {}) {
  const {
    size = 16,
    color = 'currentColor',
    strokeWidth = 1.5,
    viewBox = '0 0 24 24'
  } = options;

  const paths = iconData
    .map(([tag, attrs]) => {
      if (tag === 'path') {
        const fill = attrs.fill || 'none';
        const stroke = attrs.stroke || color;
        const width = attrs['stroke-width'] || strokeWidth;
        const linecap = attrs['stroke-linecap'] || 'round';
        const linejoin = attrs['stroke-linejoin'] || 'round';
        return `<path d="${attrs.d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="${linecap}" stroke-linejoin="${linejoin}" />`;
      }
      return '';
    })
    .join('');

  return `<svg width="${size}" height="${size}" viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
}

/**
 * Refresh icon (refresh-cw from Lucide)
 */
const refreshIcon = [
  ['path', { d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' }],
  ['path', { d: 'M21 3v5h-5' }],
  ['path', { d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' }],
  ['path', { d: 'M8 16H3v5' }]
];

/**
 * Get refresh icon SVG
 * @param {Object} options - SVG options
 * @returns {string} SVG string
 */
function getRefreshIcon(options = {}) {
  return iconToSvg(refreshIcon, options);
}

// Export for use in popup.js
if (typeof window !== 'undefined') {
  window.iconUtils = {
    getRefreshIcon,
    iconToSvg
  };
}

