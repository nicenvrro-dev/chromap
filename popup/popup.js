/**
 * Popup script for Chromap extension
 * Handles UI interactions and color display
 */

// State
let colors = [];
let filteredColors = [];
let selectedColor = null;
let fonts = [];
let filteredFonts = [];
let selectedFont = null;
let activeTab = 'colors';

// DOM Elements - Tabs
const colorsTab = document.getElementById('colorsTab');
const fontsTab = document.getElementById('fontsTab');
const colorsPanel = document.getElementById('colorsPanel');
const fontsPanel = document.getElementById('fontsPanel');

// DOM Elements - Colors
const extractColorsBtn = document.getElementById('extractColorsBtn');
const refreshColorsBtn = document.getElementById('refreshColorsBtn');
const filterSelect = document.getElementById('filterSelect');
const sortSelect = document.getElementById('sortSelect');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');
const empty = document.getElementById('empty');
const palette = document.getElementById('palette');
const colorCount = document.getElementById('colorCount');
const exportBtn = document.getElementById('exportBtn');

// DOM Elements - Fonts
const extractFontsBtn = document.getElementById('extractFontsBtn');
const refreshFontsBtn = document.getElementById('refreshFontsBtn');
const fontFilterSelect = document.getElementById('fontFilterSelect');
const fontSortSelect = document.getElementById('fontSortSelect');
const fontEmpty = document.getElementById('fontEmpty');
const fontPalette = document.getElementById('fontPalette');
const fontCount = document.getElementById('fontCount');

// Modal elements - Colors
const colorModal = document.getElementById('colorModal');
const closeModal = document.getElementById('closeModal');
const modalSwatch = document.getElementById('modalSwatch');
const modalHex = document.getElementById('modalHex');
const modalRgb = document.getElementById('modalRgb');
const modalHsl = document.getElementById('modalHsl');
const modalFrequency = document.getElementById('modalFrequency');
const modalSources = document.getElementById('modalSources');

// Modal elements - Fonts
const fontModal = document.getElementById('fontModal');
const closeFontModal = document.getElementById('closeFontModal');
const modalFontPreview = document.getElementById('modalFontPreview');
const modalFontPreviewText = document.getElementById('modalFontPreviewText');
const modalFontFamily = document.getElementById('modalFontFamily');
const modalFontSize = document.getElementById('modalFontSize');
const modalFontWeight = document.getElementById('modalFontWeight');
const modalFontStyle = document.getElementById('modalFontStyle');
const modalLineHeight = document.getElementById('modalLineHeight');
const modalLetterSpacing = document.getElementById('modalLetterSpacing');
const modalTextTransform = document.getElementById('modalTextTransform');
const modalTextDecoration = document.getElementById('modalTextDecoration');
const modalFontShorthand = document.getElementById('modalFontShorthand');
const modalFontFrequency = document.getElementById('modalFontFrequency');
const modalFontSources = document.getElementById('modalFontSources');

// Export modal elements
const exportModal = document.getElementById('exportModal');
const closeExportModalBtn = document.getElementById('closeExportModal');
const exportOptions = document.querySelectorAll('#exportModal .btn[data-format]');

// Event Listeners - Tabs
if (colorsTab) colorsTab.addEventListener('click', () => switchTab('colors'));
if (fontsTab) fontsTab.addEventListener('click', () => switchTab('fonts'));

// Event Listeners - Colors
if (extractColorsBtn) extractColorsBtn.addEventListener('click', extractColors);
if (refreshColorsBtn) refreshColorsBtn.addEventListener('click', extractColors);
if (retryBtn) retryBtn.addEventListener('click', extractColors);
if (filterSelect) filterSelect.addEventListener('change', applyFilters);
if (sortSelect) sortSelect.addEventListener('change', applyFilters);
if (closeModal) closeModal.addEventListener('click', closeColorModal);

// Event Listeners - Fonts
if (extractFontsBtn) extractFontsBtn.addEventListener('click', extractFonts);
if (refreshFontsBtn) refreshFontsBtn.addEventListener('click', extractFonts);
if (fontFilterSelect) fontFilterSelect.addEventListener('change', applyFontFilters);
if (fontSortSelect) fontSortSelect.addEventListener('change', applyFontFilters);
if (closeFontModal) closeFontModal.addEventListener('click', closeFontModalFunc);
if (closeExportModalBtn) {
  closeExportModalBtn.addEventListener('click', () => {
    exportModal.style.display = 'none';
    exportModal.setAttribute('aria-hidden', 'true');
    if (exportBtn) exportBtn.focus();
  });
}
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    exportModal.style.display = 'flex';
    exportModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      if (closeExportModalBtn) closeExportModalBtn.focus();
    }, 100);
  });
}

// Close modals when clicking outside
if (colorModal) {
  colorModal.addEventListener('click', (e) => {
    if (e.target === colorModal) {
      closeColorModal();
    }
  });
}

if (exportModal) {
  exportModal.addEventListener('click', (e) => {
    if (e.target === exportModal) {
      exportModal.style.display = 'none';
    }
  });
}

if (fontModal) {
  fontModal.addEventListener('click', (e) => {
    if (e.target === fontModal) {
      closeFontModalFunc();
    }
  });
}

// Export options
if (exportOptions && exportOptions.length > 0) {
  exportOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      const format = btn.getAttribute('data-format');
      const type = btn.getAttribute('data-type');
      exportPalette(format, type);
      if (exportModal) {
        exportModal.style.display = 'none';
        exportModal.setAttribute('aria-hidden', 'true');
      }
      if (exportBtn) exportBtn.focus();
    });
  });
}

// Copy buttons in modal
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('copy-btn')) {
    const format = e.target.getAttribute('data-format');
    if (selectedColor && colorModal && colorModal.style.display === 'flex') {
      copyToClipboard(selectedColor, format, e.target);
    } else if (selectedFont && fontModal && fontModal.style.display === 'flex') {
      copyFontToClipboard(selectedFont, format, e.target);
    }
  }
});

// Extract colors from current page
async function extractColors() {
  showLoading();
  hideError();
  hideEmpty();

  try {
    const response = await chrome.runtime.sendMessage({ action: 'getColors' });
    
    if (response && response.success) {
      colors = response.colors || [];
      if (colors.length === 0) {
        showEmpty();
      } else {
        applyFilters();
      }
    } else {
      showError(response?.error || 'Failed to extract colors');
    }
  } catch (error) {
    showError(error.message || 'An error occurred while extracting colors');
  } finally {
    hideLoading();
  }
}

// Show loading state
function showLoading() {
  // Show shimmer animation in palette area instead of spinner
  showLoadingShimmer();
  loading.style.display = 'none';
}

// Hide loading state
function hideLoading() {
  loading.style.display = 'none';
  // Shimmer will be replaced by renderPalette()
}

// Show loading shimmer animation
function showLoadingShimmer() {
  const shimmerHTML = Array.from({ length: 12 }, () => `
    <div class="shimmer-card">
      <div class="shimmer-swatch"></div>
      <div class="shimmer-info">
        <div class="shimmer-line"></div>
        <div class="shimmer-line"></div>
      </div>
    </div>
  `).join('');
  palette.innerHTML = shimmerHTML;
  palette.style.display = 'grid';
  palette.classList.add('loading-shimmer');
}

// Hide loading shimmer
function hideLoadingShimmer() {
  palette.classList.remove('loading-shimmer');
  // Will be replaced by renderPalette()
}

// Show error state
function showError(message) {
  error.style.display = 'block';
  errorMessage.textContent = message;
  palette.style.display = 'none';
  palette.innerHTML = '';
  palette.classList.remove('loading-shimmer');
}

// Hide error state
function hideError() {
  error.style.display = 'none';
}

// Show empty state
function showEmpty() {
  empty.style.display = 'block';
  palette.style.display = 'none';
  palette.innerHTML = '';
  palette.classList.remove('loading-shimmer');
}

// Hide empty state
function hideEmpty() {
  empty.style.display = 'none';
}

// Apply filters and sorting
function applyFilters() {
  const filterValue = filterSelect.value;
  const sortValue = sortSelect.value;

  // Filter colors
  if (filterValue === 'all') {
    filteredColors = [...colors];
  } else {
    filteredColors = colors.filter(color => 
      color.sources && color.sources.includes(filterValue)
    );
  }

  // Sort colors
  if (sortValue === 'frequency') {
    filteredColors.sort((a, b) => b.frequency - a.frequency);
  } else if (sortValue === 'hue') {
    filteredColors.sort((a, b) => {
      const hueA = getHueFromHex(a.hex);
      const hueB = getHueFromHex(b.hex);
      return hueA - hueB;
    });
  } else if (sortValue === 'brightness') {
    filteredColors.sort((a, b) => {
      const brightnessA = getBrightnessFromHex(a.hex);
      const brightnessB = getBrightnessFromHex(b.hex);
      return brightnessB - brightnessA;
    });
  }

  renderPalette();
  updateColorCount();
}

// Get dominant color (highest frequency)
function getDominantColor() {
  if (filteredColors.length === 0) return null;
  return filteredColors.reduce((prev, current) => 
    (prev.frequency > current.frequency) ? prev : current
  );
}

// Render color palette
function renderPalette() {
  palette.innerHTML = '';

  if (filteredColors.length === 0) {
    palette.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 24px;">No colors match the current filter.</p>';
    return;
  }

  // Get dominant color (only if sorting by frequency)
  const dominantColor = sortSelect.value === 'frequency' ? getDominantColor() : null;

  filteredColors.forEach(color => {
    const isDominant = dominantColor && color.hex === dominantColor.hex;
    const card = createColorCard(color, isDominant);
    palette.appendChild(card);
  });
}

// Create color card element
function createColorCard(color, isDominant = false) {
  const card = document.createElement('div');
  card.className = 'color-card';
  if (isDominant) {
    card.classList.add('dominant');
  }
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Color ${color.hex}`);
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'copy-tooltip';
  tooltip.textContent = 'Click to view details';
  card.appendChild(tooltip);

  // Add hover glow effect using the color's own tone
  const rgb = hexToRgb(color.hex);
  const glowIntensity = 0.4;
  const glowColor = rgb 
    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${glowIntensity})`
    : `rgba(128, 128, 128, ${glowIntensity})`; // Fallback for invalid colors
    
  // Combined hover effect: glow + tooltip
  card.addEventListener('mouseenter', () => {
    // Apply glow effect
    if (!isDominant) {
      card.style.boxShadow = `0 6px 24px ${glowColor}, 0 0 0 1px ${color.hex}30`;
    } else {
      // Dominant color gets enhanced glow
      card.style.boxShadow = `0 0 0 2px rgba(99, 102, 241, 0.3), 0 6px 24px ${glowColor}, 0 0 0 1px ${color.hex}30`;
    }
    // Show tooltip
    tooltip.textContent = 'Click to view details';
    tooltip.classList.add('show');
  });

  card.addEventListener('mouseleave', () => {
    // Reset shadow - dominant color styling is handled by CSS
    if (!isDominant) {
      card.style.boxShadow = '';
    } else {
      // Keep dominant color's base shadow
      card.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2), 0 4px 12px rgba(99, 102, 241, 0.15)';
    }
    // Hide tooltip
    tooltip.classList.remove('show');
  });

  // Handle click - open modal immediately
  card.addEventListener('click', () => {
    // Copy hex to clipboard (async, don't wait)
    copyHexToClipboard(color.hex);
    
    // Open modal immediately
    openColorModal(color);
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Copy hex to clipboard (async, don't wait)
      copyHexToClipboard(color.hex);
      
      // Open modal immediately
      openColorModal(color);
    }
  });

  const swatch = document.createElement('div');
  swatch.className = 'color-swatch';
  swatch.style.backgroundColor = color.hex;
  swatch.setAttribute('aria-hidden', 'true');

  const info = document.createElement('div');
  info.className = 'color-info';

  const hex = document.createElement('div');
  hex.className = 'color-hex';
  hex.textContent = color.hex.toUpperCase();

  const rgbText = document.createElement('div');
  rgbText.className = 'color-rgb';
  rgbText.textContent = color.rgb || '';

  info.appendChild(hex);
  info.appendChild(rgbText);
  card.appendChild(swatch);
  card.appendChild(info);

  return card;
}

// Helper function to convert hex to RGB object
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Copy hex to clipboard (quick copy on card click)
async function copyHexToClipboard(hex) {
  try {
    await navigator.clipboard.writeText(hex.toUpperCase());
  } catch (error) {
    // Fallback for older browsers or clipboard API failure
    const textarea = document.createElement('textarea');
    textarea.value = hex.toUpperCase();
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      // Fallback copy also failed - silent fail for better UX
    }
    document.body.removeChild(textarea);
  }
}

// Open color modal
function openColorModal(color) {
  if (!colorModal) return;
  selectedColor = color;
  
  if (modalSwatch) modalSwatch.style.backgroundColor = color.hex;
  if (modalHex) modalHex.textContent = color.hex.toUpperCase();
  if (modalRgb) modalRgb.textContent = color.rgb || '';
  if (modalHsl) modalHsl.textContent = color.hsl || '';
  if (modalFrequency) modalFrequency.textContent = color.frequency || 0;
  if (modalSources) modalSources.textContent = color.sources ? color.sources.join(', ') : '';

  // Update copy buttons - highlight hex button since it was just copied
  const copyButtons = document.querySelectorAll('#colorModal .copy-btn');
  copyButtons.forEach(btn => {
    btn.classList.remove('copied');
    if (btn.getAttribute('data-format') === 'hex') {
      // Show brief "Copied!" feedback on hex button
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    } else {
      btn.textContent = 'Copy';
    }
  });

  // Show modal immediately
  colorModal.style.display = 'flex';
  colorModal.setAttribute('aria-hidden', 'false');
  colorModal.setAttribute('role', 'dialog');
  colorModal.setAttribute('aria-labelledby', 'modalTitle');
  
  // Focus the close button for accessibility (minimal delay for smooth transition)
  requestAnimationFrame(() => {
    if (closeModal) closeModal.focus();
  });
}

// Close color modal
function closeColorModal() {
  if (!colorModal) return;
  colorModal.style.display = 'none';
  colorModal.setAttribute('aria-hidden', 'true');
  selectedColor = null;
  
  // Return focus to the last focused element
  const lastFocused = document.querySelector('.color-card:focus') || extractColorsBtn;
  if (lastFocused) {
    lastFocused.focus();
  }
}

// Copy to clipboard
async function copyToClipboard(color, format, button) {
  let text = '';

  switch (format) {
    case 'hex':
      text = color.hex.toUpperCase();
      break;
    case 'rgb':
      text = color.rgb || '';
      break;
    case 'hsl':
      text = color.hsl || '';
      break;
    default:
      text = color.hex.toUpperCase();
  }

  try {
    await navigator.clipboard.writeText(text);
    button.classList.add('copied');
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.classList.remove('copied');
      button.textContent = 'Copy';
    }, 2000);
  } catch (error) {
    // Fallback for older browsers or clipboard API failure
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      button.classList.add('copied');
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.classList.remove('copied');
        button.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      // Fallback copy also failed - silent fail for better UX
    }
    document.body.removeChild(textarea);
  }
}

// Export palette
function exportPalette(format, type = 'colors') {
  if (type === 'colors') {
    if (filteredColors.length === 0) {
      alert('No colors to export');
      return;
    }

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'json':
        content = JSON.stringify(filteredColors, null, 2);
        filename = 'chromap-colors.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        content = 'Hex,RGB,HSL,Frequency,Sources\n';
        filteredColors.forEach(color => {
          const sources = color.sources ? color.sources.join(';') : '';
          content += `"${color.hex}","${color.rgb}","${color.hsl}",${color.frequency},"${sources}"\n`;
        });
        filename = 'chromap-colors.csv';
        mimeType = 'text/csv';
        break;
      case 'css':
        content = ':root {\n';
        filteredColors.forEach((color, index) => {
          content += `  --color-${index + 1}: ${color.hex};\n`;
        });
        content += '}\n';
        filename = 'chromap-colors.css';
        mimeType = 'text/css';
        break;
      default:
        return;
    }

    // Create download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else if (type === 'fonts') {
    if (filteredFonts.length === 0) {
      alert('No fonts to export');
      return;
    }

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'json':
        content = JSON.stringify(filteredFonts, null, 2);
        filename = 'chromap-fonts.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        content = 'Family,Size,Weight,Style,LineHeight,LetterSpacing,TextTransform,TextDecoration,Frequency,Sources\n';
        filteredFonts.forEach(font => {
          const sources = font.sources ? font.sources.join(';') : '';
          content += `"${font.family}","${font.size}","${font.weight}","${font.style}","${font.lineHeight}","${font.letterSpacing}","${font.textTransform}","${font.textDecoration}",${font.frequency},"${sources}"\n`;
        });
        filename = 'chromap-fonts.csv';
        mimeType = 'text/csv';
        break;
      case 'css':
        content = ':root {\n';
        filteredFonts.forEach((font, index) => {
          content += `  --font-${index + 1}-family: "${font.family}";\n`;
          content += `  --font-${index + 1}-size: ${font.size};\n`;
          content += `  --font-${index + 1}-weight: ${font.weight};\n`;
          content += `  --font-${index + 1}-style: ${font.style};\n`;
          content += `  --font-${index + 1}-line-height: ${font.lineHeight};\n`;
          content += `  --font-${index + 1}-letter-spacing: ${font.letterSpacing};\n`;
        });
        content += '}\n';
        filename = 'chromap-fonts.css';
        mimeType = 'text/css';
        break;
      default:
        return;
    }

    // Create download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Update color count
function updateColorCount() {
  const count = filteredColors.length;
  const total = colors.length;
  if (count === total) {
    colorCount.textContent = `${count} color${count !== 1 ? 's' : ''} found`;
  } else {
    colorCount.textContent = `${count} of ${total} color${total !== 1 ? 's' : ''}`;
  }
}

// Get hue from hex color
function getHueFromHex(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max !== min) {
    const d = max - min;
    if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }
  }

  return h * 360;
}

// Get brightness from hex color
function getBrightnessFromHex(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Using relative luminance formula
  return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
}


// Tab switching
function switchTab(tab) {
  activeTab = tab;
  
  if (tab === 'colors') {
    colorsTab.classList.add('active');
    colorsTab.setAttribute('aria-selected', 'true');
    fontsTab.classList.remove('active');
    fontsTab.setAttribute('aria-selected', 'false');
    colorsPanel.classList.add('active');
    colorsPanel.style.display = 'flex';
    fontsPanel.classList.remove('active');
    fontsPanel.style.display = 'none';
    colorCount.style.display = 'block';
    fontCount.style.display = 'none';
  } else {
    fontsTab.classList.add('active');
    fontsTab.setAttribute('aria-selected', 'true');
    colorsTab.classList.remove('active');
    colorsTab.setAttribute('aria-selected', 'false');
    fontsPanel.classList.add('active');
    fontsPanel.style.display = 'flex';
    colorsPanel.classList.remove('active');
    colorsPanel.style.display = 'none';
    fontCount.style.display = 'block';
    colorCount.style.display = 'none';
  }
}

// Extract fonts from current page
async function extractFonts() {
  showLoading();
  hideError();
  hideFontEmpty();

  try {
    const response = await chrome.runtime.sendMessage({ action: 'getFonts' });
    
    if (response && response.success) {
      fonts = response.fonts || [];
      if (fonts.length === 0) {
        showFontEmpty();
      } else {
        applyFontFilters();
      }
    } else {
      showError(response?.error || 'Failed to extract fonts');
    }
  } catch (error) {
    showError(error.message || 'An error occurred while extracting fonts');
  } finally {
    hideLoading();
  }
}

// Show font empty state
function showFontEmpty() {
  if (fontEmpty) fontEmpty.style.display = 'block';
  if (fontPalette) {
    fontPalette.style.display = 'none';
    fontPalette.innerHTML = '';
  }
}

// Hide font empty state
function hideFontEmpty() {
  if (fontEmpty) fontEmpty.style.display = 'none';
}

// Apply font filters and sorting
function applyFontFilters() {
  if (!fontFilterSelect || !fontSortSelect) return;
  const filterValue = fontFilterSelect.value;
  const sortValue = fontSortSelect.value;

  // Filter fonts
  if (filterValue === 'all') {
    filteredFonts = [...fonts];
  } else if (filterValue === 'family') {
    const familyMap = new Map();
    fonts.forEach(font => {
      if (!familyMap.has(font.family)) {
        familyMap.set(font.family, []);
      }
      familyMap.get(font.family).push(font);
    });
    filteredFonts = Array.from(familyMap.values()).flat();
  } else {
    filteredFonts = fonts.filter(font => {
      if (filterValue === 'size') {
        return font.size;
      } else if (filterValue === 'weight') {
        return font.weight && font.weight !== '400';
      } else if (filterValue === 'style') {
        return font.style && font.style !== 'normal';
      }
      return true;
    });
  }

  // Sort fonts
  if (sortValue === 'frequency') {
    filteredFonts.sort((a, b) => b.frequency - a.frequency);
  } else if (sortValue === 'family') {
    filteredFonts.sort((a, b) => a.family.localeCompare(b.family));
  } else if (sortValue === 'size') {
    filteredFonts.sort((a, b) => {
      const sizeA = parseFloat(a.size) || 0;
      const sizeB = parseFloat(b.size) || 0;
      return sizeB - sizeA;
    });
  } else if (sortValue === 'weight') {
    filteredFonts.sort((a, b) => {
      const weightA = parseInt(a.weight) || 400;
      const weightB = parseInt(b.weight) || 400;
      return weightB - weightA;
    });
  }

  renderFontPalette();
  updateFontCount();
}

// Get dominant font (highest frequency)
function getDominantFont() {
  if (filteredFonts.length === 0) return null;
  return filteredFonts.reduce((prev, current) => 
    (prev.frequency > current.frequency) ? prev : current
  );
}

// Render font palette
function renderFontPalette() {
  if (!fontPalette) return;
  fontPalette.innerHTML = '';

  if (filteredFonts.length === 0) {
    fontPalette.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 24px;">No fonts match the current filter.</p>';
    return;
  }

  // Get dominant font (only if sorting by frequency)
  const dominantFont = fontSortSelect && fontSortSelect.value === 'frequency' ? getDominantFont() : null;

  filteredFonts.forEach(font => {
    const isDominant = dominantFont && createFontSignature(font) === createFontSignature(dominantFont);
    const card = createFontCard(font, isDominant);
    fontPalette.appendChild(card);
  });
}

// Create font signature for comparison
function createFontSignature(font) {
  return `${font.family}|${font.size}|${font.weight}|${font.style}`;
}

// Create font card element
function createFontCard(font, isDominant = false) {
  const card = document.createElement('div');
  card.className = 'font-card';
  if (isDominant) {
    card.classList.add('dominant');
  }
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Font ${font.family} ${font.size}`);

  // Frequency badge
  const frequencyBadge = document.createElement('div');
  frequencyBadge.className = 'font-frequency';
  frequencyBadge.textContent = font.frequency;
  card.appendChild(frequencyBadge);

  // Font preview
  const preview = document.createElement('div');
  preview.className = 'font-preview';
  const previewText = document.createElement('div');
  previewText.className = 'font-preview-text';
  previewText.textContent = 'Aa';
  previewText.style.fontFamily = font.family;
  previewText.style.fontSize = font.size;
  previewText.style.fontWeight = font.weight;
  previewText.style.fontStyle = font.style;
  preview.appendChild(previewText);
  card.appendChild(preview);

  // Font info
  const info = document.createElement('div');
  info.className = 'font-info';

  const familyName = document.createElement('div');
  familyName.className = 'font-family-name';
  familyName.textContent = font.family;
  info.appendChild(familyName);

  const details = document.createElement('div');
  details.className = 'font-details';
  
  const sizeItem = document.createElement('div');
  sizeItem.className = 'font-detail-item';
  sizeItem.textContent = font.size;
  details.appendChild(sizeItem);

  const weightItem = document.createElement('div');
  weightItem.className = 'font-detail-item';
  weightItem.textContent = font.weight === '400' ? 'Regular' : font.weight;
  details.appendChild(weightItem);

  if (font.style !== 'normal') {
    const styleItem = document.createElement('div');
    styleItem.className = 'font-detail-item';
    styleItem.textContent = font.style;
    details.appendChild(styleItem);
  }

  info.appendChild(details);
  card.appendChild(info);

  // Handle click - open modal
  card.addEventListener('click', () => {
    openFontModal(font);
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFontModal(font);
    }
  });

  return card;
}

// Open font modal
function openFontModal(font) {
  if (!fontModal) return;
  selectedFont = font;
  
  // Set preview text with font properties
  if (modalFontPreviewText) {
    modalFontPreviewText.style.fontFamily = font.family;
    modalFontPreviewText.style.fontSize = font.size;
    modalFontPreviewText.style.fontWeight = font.weight;
    modalFontPreviewText.style.fontStyle = font.style;
    modalFontPreviewText.style.lineHeight = font.lineHeight;
    modalFontPreviewText.style.letterSpacing = font.letterSpacing;
    modalFontPreviewText.style.textTransform = font.textTransform;
    modalFontPreviewText.style.textDecoration = font.textDecoration;
  }

  // Set modal values
  if (modalFontFamily) modalFontFamily.textContent = font.family;
  if (modalFontSize) modalFontSize.textContent = font.size;
  if (modalFontWeight) modalFontWeight.textContent = font.weight;
  if (modalFontStyle) modalFontStyle.textContent = font.style;
  if (modalLineHeight) modalLineHeight.textContent = font.lineHeight;
  if (modalLetterSpacing) modalLetterSpacing.textContent = font.letterSpacing;
  if (modalTextTransform) modalTextTransform.textContent = font.textTransform;
  if (modalTextDecoration) modalTextDecoration.textContent = font.textDecoration;
  
  // Generate CSS shorthand
  const shorthand = `${font.style} ${font.weight} ${font.size}/${font.lineHeight} "${font.family}"`;
  if (modalFontShorthand) modalFontShorthand.textContent = shorthand;
  
  if (modalFontFrequency) modalFontFrequency.textContent = font.frequency || 0;
  if (modalFontSources) modalFontSources.textContent = font.sources ? font.sources.join(', ') : '';

  // Reset copy buttons
  const copyButtons = document.querySelectorAll('#fontModal .copy-btn');
  copyButtons.forEach(btn => {
    btn.classList.remove('copied');
    btn.textContent = 'Copy';
  });

  // Show modal
  fontModal.style.display = 'flex';
  fontModal.setAttribute('aria-hidden', 'false');
  fontModal.setAttribute('role', 'dialog');
  fontModal.setAttribute('aria-labelledby', 'fontModalTitle');

  requestAnimationFrame(() => {
    const closeBtn = document.getElementById('closeFontModal');
    if (closeBtn) closeBtn.focus();
  });
}

// Close font modal
function closeFontModalFunc() {
  if (!fontModal) return;
  fontModal.style.display = 'none';
  fontModal.setAttribute('aria-hidden', 'true');
  selectedFont = null;
  
  const lastFocused = document.querySelector('.font-card:focus') || extractFontsBtn;
  if (lastFocused) {
    lastFocused.focus();
  }
}

// Copy font to clipboard
async function copyFontToClipboard(font, format, button) {
  let text = '';

  switch (format) {
    case 'family':
      text = font.family;
      break;
    case 'size':
      text = font.size;
      break;
    case 'weight':
      text = font.weight;
      break;
    case 'style':
      text = font.style;
      break;
    case 'lineHeight':
      text = font.lineHeight;
      break;
    case 'letterSpacing':
      text = font.letterSpacing;
      break;
    case 'textTransform':
      text = font.textTransform;
      break;
    case 'textDecoration':
      text = font.textDecoration;
      break;
    case 'shorthand':
      text = `${font.style} ${font.weight} ${font.size}/${font.lineHeight} "${font.family}"`;
      break;
    default:
      text = font.family;
  }

  try {
    await navigator.clipboard.writeText(text);
    button.classList.add('copied');
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.classList.remove('copied');
      button.textContent = 'Copy';
    }, 2000);
  } catch (error) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      button.classList.add('copied');
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.classList.remove('copied');
        button.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      // Fallback copy failed
    }
    document.body.removeChild(textarea);
  }
}

// Update font count
function updateFontCount() {
  if (!fontCount) return;
  const count = filteredFonts.length;
  const total = fonts.length;
  if (count === total) {
    fontCount.textContent = `${count} font${count !== 1 ? 's' : ''} found`;
  } else {
    fontCount.textContent = `${count} of ${total} font${total !== 1 ? 's' : ''}`;
  }
}

// Initialize icons
function initializeIcons() {
  // Populate refresh icons
  const refreshIcons = document.querySelectorAll('.icon-refresh');
  refreshIcons.forEach(icon => {
    if (window.iconUtils && window.iconUtils.getRefreshIcon) {
      icon.innerHTML = window.iconUtils.getRefreshIcon({ size: 16, strokeWidth: 1.5 });
    }
  });
}

// Initialize: Extract colors on load
document.addEventListener('DOMContentLoaded', () => {
  initializeIcons();
  extractColors();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (colorModal && colorModal.style.display === 'flex') {
      closeColorModal();
    } else if (fontModal && fontModal.style.display === 'flex') {
      closeFontModalFunc();
    } else if (exportModal && exportModal.style.display === 'flex') {
      exportModal.style.display = 'none';
      exportModal.setAttribute('aria-hidden', 'true');
      if (exportBtn) exportBtn.focus();
    }
  }
});

