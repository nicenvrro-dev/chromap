/**
 * Color utility functions for converting between different color formats
 * and validating color values
 */

/**
 * Convert RGB/RGBA string to hex
 * @param {string} rgb - RGB/RGBA string (e.g., "rgb(255, 87, 51)" or "rgba(255, 87, 51, 0.5)")
 * @returns {string|null} Hex color string or null if invalid
 */
function rgbToHex(rgb) {
  if (!rgb || rgb === 'transparent' || rgb === 'none') {
    return null;
  }

  const rgbMatch = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (!rgbMatch) {
    return null;
  }

  const r = parseInt(rgbMatch[1], 10);
  const g = parseInt(rgbMatch[2], 10);
  const b = parseInt(rgbMatch[3], 10);

  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    return null;
  }

  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Convert HSL/HSLA string to RGB, then to hex
 * @param {string} hsl - HSL/HSLA string (e.g., "hsl(120, 100%, 50%)")
 * @returns {string|null} Hex color string or null if invalid
 */
function hslToHex(hsl) {
  if (!hsl || hsl === 'transparent' || hsl === 'none') {
    return null;
  }

  const hslMatch = hsl.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/);
  if (!hslMatch) {
    return null;
  }

  const h = parseInt(hslMatch[1], 10) / 360;
  const s = parseInt(hslMatch[2], 10) / 100;
  const l = parseInt(hslMatch[3], 10) / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return rgbToHex(`rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`);
}

/**
 * Convert named color to hex
 * @param {string} colorName - Named color (e.g., "red", "blue")
 * @returns {string|null} Hex color string or null if invalid
 */
function namedColorToHex(colorName) {
  if (!colorName) {
    return null;
  }

  const namedColors = {
    'transparent': null,
    'none': null,
    'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff',
    'aquamarine': '#7fffd4', 'azure': '#f0ffff', 'beige': '#f5f5dc',
    'bisque': '#ffe4c4', 'black': '#000000', 'blanchedalmond': '#ffebcd',
    'blue': '#0000ff', 'blueviolet': '#8a2be2', 'brown': '#a52a2a',
    'burlywood': '#deb887', 'cadetblue': '#5f9ea0', 'chartreuse': '#7fff00',
    'chocolate': '#d2691e', 'coral': '#ff7f50', 'cornflowerblue': '#6495ed',
    'cornsilk': '#fff8dc', 'crimson': '#dc143c', 'cyan': '#00ffff',
    'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b',
    'darkgray': '#a9a9a9', 'darkgrey': '#a9a9a9', 'darkgreen': '#006400',
    'darkkhaki': '#bdb76b', 'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f',
    'darkorange': '#ff8c00', 'darkorchid': '#8b008b', 'darkred': '#8b0000',
    'darksalmon': '#e9967a', 'darkseagreen': '#90ee90', 'darkslateblue': '#483d8b',
    'darkslategray': '#2f4f4f', 'darkslategrey': '#2f4f4f', 'darkturquoise': '#00ced1',
    'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff',
    'dimgray': '#696969', 'dimgrey': '#696969', 'dodgerblue': '#1e90ff',
    'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22',
    'fuchsia': '#ff00ff', 'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff',
    'gold': '#ffd700', 'goldenrod': '#daa520', 'gray': '#808080',
    'grey': '#808080', 'green': '#008000', 'greenyellow': '#adff2f',
    'honeydew': '#f0fff0', 'hotpink': '#ff69b4', 'indianred': '#cd5c5c',
    'indigo': '#4b0082', 'ivory': '#fffff0', 'khaki': '#f0e68c',
    'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00',
    'lemonchiffon': '#fffacd', 'lightblue': '#add8e6', 'lightcoral': '#f08080',
    'lightcyan': '#f0ffff', 'lightgoldenrodyellow': '#fafad2', 'lightgray': '#d3d3d3',
    'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1',
    'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa', 'lightskyblue': '#87cefa',
    'lightslategray': '#778899', 'lightslategrey': '#778899', 'lightsteelblue': '#b0c4de',
    'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32',
    'linen': '#faf0e6', 'magenta': '#ff00ff', 'maroon': '#800000',
    'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd', 'mediumorchid': '#9932cc',
    'mediumpurple': '#9370db', 'mediumseagreen': '#3cb371', 'mediumslateblue': '#483d8b',
    'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585',
    'midnightblue': '#191970', 'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1',
    'moccasin': '#ffe4b5', 'navajowhite': '#ffdead', 'navy': '#000080',
    'oldlace': '#fdf5e6', 'olive': '#808000', 'olivedrab': '#6b8e23',
    'orange': '#ffa500', 'orangered': '#ff4500', 'orchid': '#da70d6',
    'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee',
    'palevioletred': '#db7093', 'papayawhip': '#ffefd5', 'peachpuff': '#ffdab9',
    'peru': '#cd853f', 'pink': '#ffc0cb', 'plum': '#dda0dd',
    'powderblue': '#87ceeb', 'purple': '#800080', 'rebeccapurple': '#663399',
    'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1',
    'saddlebrown': '#654321', 'salmon': '#fa8072', 'sandybrown': '#f4a460',
    'seagreen': '#2e8b57', 'seashell': '#fff5ee', 'sienna': '#a0522d',
    'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd',
    'slategray': '#708090', 'slategrey': '#708090', 'snow': '#fffafa',
    'springgreen': '#00ff7f', 'steelblue': '#4682b4', 'tan': '#d2b48c',
    'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347',
    'turquoise': '#40e0d0', 'violet': '#ee82ee', 'wheat': '#f5deb3',
    'white': '#ffffff', 'whitesmoke': '#f5f5f5', 'yellow': '#ffff00',
    'yellowgreen': '#9acd32'
  };

  const normalizedName = colorName.toLowerCase().trim();
  return namedColors[normalizedName] || null;
}

/**
 * Normalize any color value to hex format
 * @param {string} color - Color in any format (hex, rgb, hsl, named)
 * @returns {string|null} Hex color string or null if invalid
 */
function normalizeColorToHex(color) {
  if (!color || typeof color !== 'string') {
    return null;
  }

  const trimmed = color.trim().toLowerCase();

  // Already hex
  if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) {
    // Convert short hex to long hex
    if (trimmed.length === 4) {
      return '#' + trimmed[1] + trimmed[1] + trimmed[2] + trimmed[2] + trimmed[3] + trimmed[3];
    }
    return trimmed.length === 7 ? trimmed : null;
  }

  // RGB/RGBA
  if (trimmed.startsWith('rgb')) {
    return rgbToHex(trimmed);
  }

  // HSL/HSLA
  if (trimmed.startsWith('hsl')) {
    return hslToHex(trimmed);
  }

  // Named color
  return namedColorToHex(trimmed);
}

/**
 * Extract colors from gradient string
 * @param {string} gradient - Gradient string (e.g., "linear-gradient(to right, #ff0000, #0000ff)")
 * @returns {Array<string>} Array of hex color strings
 */
function extractColorsFromGradient(gradient) {
  if (!gradient || typeof gradient !== 'string') {
    return [];
  }

  const colors = [];
  // Match color values in gradient (hex, rgb, hsl, named)
  const colorPatterns = [
    /#([0-9a-f]{3,6})\b/gi,
    /rgba?\([^)]+\)/gi,
    /hsla?\([^)]+\)/gi,
    /\b(transparent|none|currentColor)\b/gi
  ];

  // Also try to match named colors (this is a simple approach)
  const gradientLower = gradient.toLowerCase();
  const namedColorKeywords = Object.keys({
    'red': true, 'blue': true, 'green': true, 'yellow': true, 'orange': true,
    'purple': true, 'pink': true, 'black': true, 'white': true, 'gray': true,
    'grey': true, 'cyan': true, 'magenta': true, 'lime': true, 'navy': true,
    'maroon': true, 'olive': true, 'teal': true, 'aqua': true, 'silver': true
  });

  // Extract hex colors
  let matches = gradient.match(/#([0-9a-f]{3,6})\b/gi);
  if (matches) {
    matches.forEach(match => {
      const hex = normalizeColorToHex(match);
      if (hex) colors.push(hex);
    });
  }

  // Extract RGB colors
  matches = gradient.match(/rgba?\([^)]+\)/gi);
  if (matches) {
    matches.forEach(match => {
      const hex = normalizeColorToHex(match);
      if (hex) colors.push(hex);
    });
  }

  // Extract HSL colors
  matches = gradient.match(/hsla?\([^)]+\)/gi);
  if (matches) {
    matches.forEach(match => {
      const hex = normalizeColorToHex(match);
      if (hex) colors.push(hex);
    });
  }

  return colors;
}

/**
 * Convert hex to RGB
 * @param {string} hex - Hex color string
 * @returns {Object|null} RGB object {r, g, b} or null
 */
function hexToRgb(hex) {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) {
    return null;
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert hex to HSL
 * @param {string} hex - Hex color string
 * @returns {Object|null} HSL object {h, s, l} or null
 */
function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return null;
  }

  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Format RGB object as string
 * @param {Object} rgb - RGB object {r, g, b}
 * @returns {string} RGB string
 */
function formatRgb(rgb) {
  if (!rgb) return '';
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Format HSL object as string
 * @param {Object} hsl - HSL object {h, s, l}
 * @returns {string} HSL string
 */
function formatHsl(hsl) {
  if (!hsl) return '';
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/**
 * Validate if a color is valid
 * @param {string} color - Color string
 * @returns {boolean} True if valid color
 */
function isValidColor(color) {
  return normalizeColorToHex(color) !== null;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    rgbToHex,
    hslToHex,
    namedColorToHex,
    normalizeColorToHex,
    extractColorsFromGradient,
    hexToRgb,
    hexToHsl,
    formatRgb,
    formatHsl,
    isValidColor
  };
}

