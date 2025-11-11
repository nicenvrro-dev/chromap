/**
 * Color extraction utilities for analyzing DOM and extracting colors
 */

// Import color utilities (will be injected as a string in content script)
// This file assumes colorUtils functions are available in the same scope

/**
 * Extract colors from a single element's computed styles
 * @param {Element} element - DOM element
 * @param {Object} computedStyle - Computed style object
 * @returns {Array<Object>} Array of color objects with source information
 */
function extractColorsFromElement(element, computedStyle) {
  const colors = [];
  const colorProperties = [
    "backgroundColor",
    "color",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "borderColor",
    "outlineColor",
    "textDecorationColor",
    "columnRuleColor",
  ];

  // Extract colors from standard color properties
  colorProperties.forEach((prop) => {
    const colorValue = computedStyle[prop];
    if (
      colorValue &&
      colorValue !== "transparent" &&
      colorValue !== "rgba(0, 0, 0, 0)"
    ) {
      const hex = normalizeColorToHex(colorValue);
      if (hex) {
        colors.push({
          hex: hex,
          source: prop,
          element: element.tagName.toLowerCase(),
          originalValue: colorValue,
        });
      }
    }
  });

  // Extract colors from box-shadow
  const boxShadow = computedStyle.boxShadow;
  if (boxShadow && boxShadow !== "none") {
    // Match color values in box-shadow (can have multiple shadows)
    const shadowColors = boxShadow.match(
      /(rgba?\([^)]+\)|#[0-9a-f]{3,6}|hsla?\([^)]+\)|\b\w+\b)(?=\s*(?:,|$))/gi
    );
    if (shadowColors) {
      shadowColors.forEach((colorStr) => {
        const hex = normalizeColorToHex(colorStr.trim());
        if (hex) {
          colors.push({
            hex: hex,
            source: "boxShadow",
            element: element.tagName.toLowerCase(),
            originalValue: colorStr.trim(),
          });
        }
      });
    }
  }

  // Extract colors from text-shadow
  const textShadow = computedStyle.textShadow;
  if (textShadow && textShadow !== "none") {
    const shadowColors = textShadow.match(
      /(rgba?\([^)]+\)|#[0-9a-f]{3,6}|hsla?\([^)]+\)|\b\w+\b)(?=\s*(?:,|$))/gi
    );
    if (shadowColors) {
      shadowColors.forEach((colorStr) => {
        const hex = normalizeColorToHex(colorStr.trim());
        if (hex) {
          colors.push({
            hex: hex,
            source: "textShadow",
            element: element.tagName.toLowerCase(),
            originalValue: colorStr.trim(),
          });
        }
      });
    }
  }

  // Extract colors from background-image (gradients)
  const backgroundImage = computedStyle.backgroundImage;
  if (backgroundImage && backgroundImage !== "none") {
    const gradientColors = extractColorsFromGradient(backgroundImage);
    gradientColors.forEach((hex) => {
      colors.push({
        hex: hex,
        source: "backgroundImage",
        element: element.tagName.toLowerCase(),
        originalValue: backgroundImage,
      });
    });
  }

  return colors;
}

/**
 * Extract colors from CSS stylesheets
 * @returns {Array<Object>} Array of color objects
 */
function extractColorsFromStylesheets() {
  const colors = [];
  const styleSheets = Array.from(document.styleSheets);

  styleSheets.forEach((stylesheet) => {
    try {
      const rules = Array.from(stylesheet.cssRules || []);
      rules.forEach((rule) => {
        if (rule.style) {
          // Check various color properties
          const colorProperties = [
            "backgroundColor",
            "background-color",
            "color",
            "borderColor",
            "border-color",
            "borderTopColor",
            "border-top-color",
            "borderRightColor",
            "border-right-color",
            "borderBottomColor",
            "border-bottom-color",
            "borderLeftColor",
            "border-left-color",
            "outlineColor",
            "outline-color",
            "textDecorationColor",
            "text-decoration-color",
            "boxShadow",
            "box-shadow",
            "textShadow",
            "text-shadow",
          ];

          colorProperties.forEach((prop) => {
            const value = rule.style[prop] || rule.style.getPropertyValue(prop);
            if (value && value !== "transparent" && value !== "none") {
              const hex = normalizeColorToHex(value);
              if (hex) {
                colors.push({
                  hex: hex,
                  source: "stylesheet",
                  selector: rule.selectorText || "unknown",
                  originalValue: value,
                });
              }
            }
          });

          // Check background-image for gradients
          const bgImage =
            rule.style.backgroundImage ||
            rule.style.getPropertyValue("background-image");
          if (bgImage && bgImage !== "none") {
            const gradientColors = extractColorsFromGradient(bgImage);
            gradientColors.forEach((hex) => {
              colors.push({
                hex: hex,
                source: "stylesheet-gradient",
                selector: rule.selectorText || "unknown",
                originalValue: bgImage,
              });
            });
          }
        }
      });
    } catch (e) {
      // Cross-origin stylesheets may throw errors, skip them silently
      // This is expected behavior for cross-origin resources
    }
  });

  return colors;
}

/**
 * Extract all colors from the page
 * @param {Object} options - Extraction options
 * @param {number} options.maxElements - Maximum number of elements to process (0 = no limit)
 * @param {boolean} options.includeStylesheets - Whether to include stylesheet colors
 * @returns {Array<Object>} Array of unique color objects with frequency
 */
function extractAllColors(options = {}) {
  const { maxElements = 0, includeStylesheets = true } = options;

  const colorMap = new Map(); // Map<hex, {hex, rgb, hsl, frequency, sources: []}>
  const allElements = document.querySelectorAll("*");
  const elementsToProcess =
    maxElements > 0
      ? Array.from(allElements).slice(0, maxElements)
      : Array.from(allElements);

  // Extract colors from DOM elements
  elementsToProcess.forEach((element) => {
    try {
      const computedStyle = window.getComputedStyle(element);
      const elementColors = extractColorsFromElement(element, computedStyle);

      elementColors.forEach((colorObj) => {
        if (!colorMap.has(colorObj.hex)) {
          const rgb = hexToRgb(colorObj.hex);
          const hsl = hexToHsl(colorObj.hex);
          colorMap.set(colorObj.hex, {
            hex: colorObj.hex,
            rgb: rgb ? formatRgb(rgb) : "",
            hsl: hsl ? formatHsl(hsl) : "",
            frequency: 0,
            sources: [],
          });
        }

        const colorData = colorMap.get(colorObj.hex);
        colorData.frequency++;
        if (!colorData.sources.includes(colorObj.source)) {
          colorData.sources.push(colorObj.source);
        }
      });
    } catch (e) {
      // Skip elements that can't be processed (e.g., detached DOM nodes)
      // Silent fail for better performance
    }
  });

  // Extract colors from stylesheets
  if (includeStylesheets) {
    try {
      const stylesheetColors = extractColorsFromStylesheets();
      stylesheetColors.forEach((colorObj) => {
        if (!colorMap.has(colorObj.hex)) {
          const rgb = hexToRgb(colorObj.hex);
          const hsl = hexToHsl(colorObj.hex);
          colorMap.set(colorObj.hex, {
            hex: colorObj.hex,
            rgb: rgb ? formatRgb(rgb) : "",
            hsl: hsl ? formatHsl(hsl) : "",
            frequency: 0,
            sources: [],
          });
        }

        const colorData = colorMap.get(colorObj.hex);
        colorData.frequency++;
        if (!colorData.sources.includes(colorObj.source)) {
          colorData.sources.push(colorObj.source);
        }
      });
    } catch (e) {
      // Error processing stylesheets - skip and continue
      // This is expected for some edge cases
    }
  }

  // Convert map to array and sort by frequency
  const colorsArray = Array.from(colorMap.values());
  colorsArray.sort((a, b) => b.frequency - a.frequency);

  return colorsArray;
}

/**
 * Extract colors with performance optimization for large pages
 * Uses sampling for very large DOMs
 * @returns {Promise<Array<Object>>} Promise that resolves to color array
 */
function extractColorsOptimized() {
  return new Promise((resolve) => {
    // Use requestIdleCallback if available, otherwise use setTimeout
    const scheduleWork =
      window.requestIdleCallback || ((fn) => setTimeout(fn, 0));

    scheduleWork(
      () => {
        const elementCount = document.querySelectorAll("*").length;
        const maxElements = elementCount > 10000 ? 5000 : 0; // Sample if more than 10k elements

        const colors = extractAllColors({
          maxElements: maxElements,
          includeStylesheets: true,
        });

        resolve(colors);
      },
      { timeout: 5000 }
    ); // Timeout after 5 seconds
  });
}

// Export functions (will be available in content script context)
if (typeof window !== "undefined") {
  window.colorExtractor = {
    extractAllColors,
    extractColorsOptimized,
    extractColorsFromElement,
    extractColorsFromStylesheets,
  };
}
