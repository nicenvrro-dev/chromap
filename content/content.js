/**
 * Content script for Chromap extension
 * This script is injected into web pages to extract colors
 * Includes all color utility functions inline
 */

(function() {
  'use strict';

  // ========== Color Utility Functions ==========
  
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

  const namedColors = {
    'transparent': null, 'none': null,
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

  function namedColorToHex(colorName) {
    if (!colorName) return null;
    const normalizedName = colorName.toLowerCase().trim();
    return namedColors[normalizedName] || null;
  }

  function normalizeColorToHex(color) {
    if (!color || typeof color !== 'string') return null;
    const trimmed = color.trim().toLowerCase();
    if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) {
      if (trimmed.length === 4) {
        return '#' + trimmed[1] + trimmed[1] + trimmed[2] + trimmed[2] + trimmed[3] + trimmed[3];
      }
      return trimmed.length === 7 ? trimmed : null;
    }
    if (trimmed.startsWith('rgb')) return rgbToHex(trimmed);
    if (trimmed.startsWith('hsl')) return hslToHex(trimmed);
    return namedColorToHex(trimmed);
  }

  function extractColorsFromGradient(gradient) {
    if (!gradient || typeof gradient !== 'string') return [];
    const colors = [];
    let matches = gradient.match(/#([0-9a-f]{3,6})\b/gi);
    if (matches) {
      matches.forEach(match => {
        const hex = normalizeColorToHex(match);
        if (hex) colors.push(hex);
      });
    }
    matches = gradient.match(/rgba?\([^)]+\)/gi);
    if (matches) {
      matches.forEach(match => {
        const hex = normalizeColorToHex(match);
        if (hex) colors.push(hex);
      });
    }
    matches = gradient.match(/hsla?\([^)]+\)/gi);
    if (matches) {
      matches.forEach(match => {
        const hex = normalizeColorToHex(match);
        if (hex) colors.push(hex);
      });
    }
    return colors;
  }

  function hexToRgb(hex) {
    if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function hexToHsl(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
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

  function formatRgb(rgb) {
    if (!rgb) return '';
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  function formatHsl(hsl) {
    if (!hsl) return '';
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  // ========== Color Extraction Functions ==========

  function extractColorsFromElement(element, computedStyle) {
    const colors = [];
    const colorProperties = [
      'backgroundColor', 'color', 'borderTopColor', 'borderRightColor',
      'borderBottomColor', 'borderLeftColor', 'borderColor', 'outlineColor',
      'textDecorationColor', 'columnRuleColor'
    ];

    colorProperties.forEach(prop => {
      const colorValue = computedStyle[prop];
      if (colorValue && colorValue !== 'transparent' && colorValue !== 'rgba(0, 0, 0, 0)') {
        const hex = normalizeColorToHex(colorValue);
        if (hex) {
          colors.push({
            hex: hex,
            source: prop,
            element: element.tagName.toLowerCase(),
            originalValue: colorValue
          });
        }
      }
    });

    const boxShadow = computedStyle.boxShadow;
    if (boxShadow && boxShadow !== 'none') {
      const shadowColors = boxShadow.match(/(rgba?\([^)]+\)|#[0-9a-f]{3,6}|hsla?\([^)]+\)|\b\w+\b)(?=\s*(?:,|$))/gi);
      if (shadowColors) {
        shadowColors.forEach(colorStr => {
          const hex = normalizeColorToHex(colorStr.trim());
          if (hex) {
            colors.push({
              hex: hex,
              source: 'boxShadow',
              element: element.tagName.toLowerCase(),
              originalValue: colorStr.trim()
            });
          }
        });
      }
    }

    const textShadow = computedStyle.textShadow;
    if (textShadow && textShadow !== 'none') {
      const shadowColors = textShadow.match(/(rgba?\([^)]+\)|#[0-9a-f]{3,6}|hsla?\([^)]+\)|\b\w+\b)(?=\s*(?:,|$))/gi);
      if (shadowColors) {
        shadowColors.forEach(colorStr => {
          const hex = normalizeColorToHex(colorStr.trim());
          if (hex) {
            colors.push({
              hex: hex,
              source: 'textShadow',
              element: element.tagName.toLowerCase(),
              originalValue: colorStr.trim()
            });
          }
        });
      }
    }

    const backgroundImage = computedStyle.backgroundImage;
    if (backgroundImage && backgroundImage !== 'none') {
      const gradientColors = extractColorsFromGradient(backgroundImage);
      gradientColors.forEach(hex => {
        colors.push({
          hex: hex,
          source: 'backgroundImage',
          element: element.tagName.toLowerCase(),
          originalValue: backgroundImage
        });
      });
    }

    return colors;
  }

  function extractColorsFromStylesheets() {
    const colors = [];
    const styleSheets = Array.from(document.styleSheets);

    styleSheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        rules.forEach(rule => {
          if (rule.style) {
            const colorProperties = [
              'backgroundColor', 'background-color', 'color',
              'borderColor', 'border-color', 'borderTopColor', 'border-top-color',
              'borderRightColor', 'border-right-color', 'borderBottomColor', 'border-bottom-color',
              'borderLeftColor', 'border-left-color', 'outlineColor', 'outline-color',
              'textDecorationColor', 'text-decoration-color', 'boxShadow', 'box-shadow',
              'textShadow', 'text-shadow'
            ];

            colorProperties.forEach(prop => {
              const value = rule.style[prop] || rule.style.getPropertyValue(prop);
              if (value && value !== 'transparent' && value !== 'none') {
                const hex = normalizeColorToHex(value);
                if (hex) {
                  colors.push({
                    hex: hex,
                    source: 'stylesheet',
                    selector: rule.selectorText || 'unknown',
                    originalValue: value
                  });
                }
              }
            });

            const bgImage = rule.style.backgroundImage || rule.style.getPropertyValue('background-image');
            if (bgImage && bgImage !== 'none') {
              const gradientColors = extractColorsFromGradient(bgImage);
              gradientColors.forEach(hex => {
                colors.push({
                  hex: hex,
                  source: 'stylesheet-gradient',
                  selector: rule.selectorText || 'unknown',
                  originalValue: bgImage
                });
              });
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheets may throw errors
      }
    });

    return colors;
  }

  function extractAllColors(options = {}) {
    const { maxElements = 0, includeStylesheets = true } = options;
    const colorMap = new Map();
    const allElements = document.querySelectorAll('*');
    const elementsToProcess = maxElements > 0 
      ? Array.from(allElements).slice(0, maxElements)
      : Array.from(allElements);

    elementsToProcess.forEach(element => {
      try {
        const computedStyle = window.getComputedStyle(element);
        const elementColors = extractColorsFromElement(element, computedStyle);

        elementColors.forEach(colorObj => {
          if (!colorMap.has(colorObj.hex)) {
            const rgb = hexToRgb(colorObj.hex);
            const hsl = hexToHsl(colorObj.hex);
            colorMap.set(colorObj.hex, {
              hex: colorObj.hex,
              rgb: rgb ? formatRgb(rgb) : '',
              hsl: hsl ? formatHsl(hsl) : '',
              frequency: 0,
              sources: []
            });
          }

          const colorData = colorMap.get(colorObj.hex);
          colorData.frequency++;
          if (!colorData.sources.includes(colorObj.source)) {
            colorData.sources.push(colorObj.source);
          }
        });
      } catch (e) {
        // Skip elements that can't be processed
      }
    });

    if (includeStylesheets) {
      try {
        const stylesheetColors = extractColorsFromStylesheets();
        stylesheetColors.forEach(colorObj => {
          if (!colorMap.has(colorObj.hex)) {
            const rgb = hexToRgb(colorObj.hex);
            const hsl = hexToHsl(colorObj.hex);
            colorMap.set(colorObj.hex, {
              hex: colorObj.hex,
              rgb: rgb ? formatRgb(rgb) : '',
              hsl: hsl ? formatHsl(hsl) : '',
              frequency: 0,
              sources: []
            });
          }

          const colorData = colorMap.get(colorObj.hex);
          colorData.frequency++;
          if (!colorData.sources.includes(colorObj.source)) {
            colorData.sources.push(colorObj.source);
          }
        });
      } catch (e) {
        // Error processing stylesheets
      }
    }

    const colorsArray = Array.from(colorMap.values());
    colorsArray.sort((a, b) => b.frequency - a.frequency);

    return colorsArray;
  }

  // ========== Configuration Constants ==========
  const CONFIG = {
    LARGE_PAGE_THRESHOLD: 10000,  // Elements threshold for sampling
    MAX_SAMPLED_ELEMENTS: 5000,   // Maximum elements to sample on large pages
    SCRIPT_INIT_DELAY: 100        // Delay for script initialization (ms)
  };

  // ========== Message Listener ==========

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractColors') {
      try {
        const elementCount = document.querySelectorAll('*').length;
        const maxElements = elementCount > CONFIG.LARGE_PAGE_THRESHOLD 
          ? CONFIG.MAX_SAMPLED_ELEMENTS 
          : 0;
        
        const colors = extractAllColors({
          maxElements: maxElements,
          includeStylesheets: true
        });

        sendResponse({ success: true, colors: colors });
      } catch (error) {
        // Error handling - send error response
        sendResponse({ 
          success: false, 
          error: error.message || 'Failed to extract colors' 
        });
      }
      
      return true; // Indicate asynchronous response
    }
  });

})();
