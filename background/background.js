/**
 * Background service worker for Chromap extension
 * Handles message passing between popup and content script
 */

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getColors') {
    handleGetColors(sendResponse);
    return true; // Indicate we will send response asynchronously
  }
  return false;
});

/**
 * Handle color extraction request from popup
 * @param {Function} sendResponse - Callback to send response
 */
async function handleGetColors(sendResponse) {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      sendResponse({ 
        success: false, 
        error: 'No active tab found' 
      });
      return;
    }

    // Check if tab URL is valid (not chrome://, chrome-extension://, etc.)
    if (!tab.url || tab.url.startsWith('chrome://') || 
        tab.url.startsWith('chrome-extension://') || 
        tab.url.startsWith('edge://') ||
        tab.url.startsWith('about:') ||
        tab.url.startsWith('moz-extension://')) {
      sendResponse({ 
        success: false, 
        error: 'Cannot extract colors from this page. Please navigate to a regular webpage.' 
      });
      return;
    }

    // Inject content script and extract colors
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content/content.js']
      });

      // Wait for the script to initialize (minimal delay for script registration)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send message to content script to extract colors
      chrome.tabs.sendMessage(tab.id, { action: 'extractColors' }, (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({ 
            success: false, 
            error: chrome.runtime.lastError.message || 'Failed to communicate with content script' 
          });
          return;
        }

        if (response && response.success) {
          sendResponse({ 
            success: true, 
            colors: response.colors || [] 
          });
        } else {
          sendResponse({ 
            success: false, 
            error: response?.error || 'Failed to extract colors' 
          });
        }
      });

    } catch (error) {
      sendResponse({ 
        success: false, 
        error: `Failed to inject script: ${error.message}` 
      });
    }

  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    });
  }
}

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  // Extension installed - ready to use
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  // Extension started - service worker active
});

