/**
 * Popup script for Chromap extension
 * Handles UI interactions and color display
 */

// State
let colors = [];
let filteredColors = [];
let selectedColor = null;

// DOM Elements
const extractBtn = document.getElementById('extractBtn');
const refreshBtn = document.getElementById('refreshBtn');
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

// Modal elements
const colorModal = document.getElementById('colorModal');
const closeModal = document.getElementById('closeModal');
const modalSwatch = document.getElementById('modalSwatch');
const modalHex = document.getElementById('modalHex');
const modalRgb = document.getElementById('modalRgb');
const modalHsl = document.getElementById('modalHsl');
const modalFrequency = document.getElementById('modalFrequency');
const modalSources = document.getElementById('modalSources');

// Export modal elements
const exportModal = document.getElementById('exportModal');
const closeExportModalBtn = document.getElementById('closeExportModal');
const exportOptions = document.querySelectorAll('#exportModal .btn[data-format]');

// Event Listeners
extractBtn.addEventListener('click', extractColors);
refreshBtn.addEventListener('click', extractColors);
retryBtn.addEventListener('click', extractColors);
filterSelect.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);
closeModal.addEventListener('click', closeColorModal);
closeExportModalBtn.addEventListener('click', () => {
  exportModal.style.display = 'none';
  exportModal.setAttribute('aria-hidden', 'true');
  exportBtn.focus();
});
exportBtn.addEventListener('click', () => {
  exportModal.style.display = 'flex';
  exportModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    closeExportModalBtn.focus();
  }, 100);
});

// Close modals when clicking outside
colorModal.addEventListener('click', (e) => {
  if (e.target === colorModal) {
    closeColorModal();
  }
});

exportModal.addEventListener('click', (e) => {
  if (e.target === exportModal) {
    exportModal.style.display = 'none';
  }
});

// Export options
exportOptions.forEach(btn => {
  btn.addEventListener('click', () => {
    const format = btn.getAttribute('data-format');
    exportPalette(format);
    exportModal.style.display = 'none';
    exportModal.setAttribute('aria-hidden', 'true');
    exportBtn.focus();
  });
});

// Copy buttons in modal
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('copy-btn')) {
    const format = e.target.getAttribute('data-format');
    const color = selectedColor;
    if (color) {
      copyToClipboard(color, format, e.target);
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
  selectedColor = color;
  modalSwatch.style.backgroundColor = color.hex;
  modalHex.textContent = color.hex.toUpperCase();
  modalRgb.textContent = color.rgb || '';
  modalHsl.textContent = color.hsl || '';
  modalFrequency.textContent = color.frequency || 0;
  modalSources.textContent = color.sources ? color.sources.join(', ') : '';

  // Update copy buttons - highlight hex button since it was just copied
  const copyButtons = document.querySelectorAll('.copy-btn');
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
    closeModal.focus();
  });
}

// Close color modal
function closeColorModal() {
  colorModal.style.display = 'none';
  colorModal.setAttribute('aria-hidden', 'true');
  selectedColor = null;
  
  // Return focus to the last focused element
  const lastFocused = document.querySelector('.color-card:focus') || extractBtn;
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
function exportPalette(format) {
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
      filename = 'chromap-palette.json';
      mimeType = 'application/json';
      break;
    case 'csv':
      content = 'Hex,RGB,HSL,Frequency,Sources\n';
      filteredColors.forEach(color => {
        const sources = color.sources ? color.sources.join(';') : '';
        content += `"${color.hex}","${color.rgb}","${color.hsl}",${color.frequency},"${sources}"\n`;
      });
      filename = 'chromap-palette.csv';
      mimeType = 'text/csv';
      break;
    case 'css':
      content = ':root {\n';
      filteredColors.forEach((color, index) => {
        content += `  --color-${index + 1}: ${color.hex};\n`;
      });
      content += '}\n';
      filename = 'chromap-palette.css';
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


// Initialize: Extract colors on load
document.addEventListener('DOMContentLoaded', () => {
  extractColors();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (colorModal.style.display === 'flex') {
      closeColorModal();
    } else if (exportModal.style.display === 'flex') {
      exportModal.style.display = 'none';
      exportModal.setAttribute('aria-hidden', 'true');
      exportBtn.focus();
    }
  }
});

