# Chromap Setup Guide

## Quick Start

1. **Generate Icons**
   - Open `icons/generate-icons.html` in your browser
   - Right-click each canvas and save as PNG files:
     - `icon16.png` (16x16)
     - `icon48.png` (48x48)
     - `icon128.png` (128x128)
   - Save all files in the `icons/` folder

2. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `chromap` folder
   - The extension should now appear in your toolbar

3. **Use the Extension**
   - Navigate to any website
   - Click the Chromap icon in your toolbar
   - Colors will be automatically extracted and displayed

## Development

### File Structure

```
chromap/
├── manifest.json          # Extension manifest (Manifest V3)
├── popup/                 # Popup UI
│   ├── popup.html        # Popup HTML
│   ├── popup.css         # Popup styles
│   └── popup.js          # Popup logic
├── content/               # Content scripts
│   ├── content.js        # Main content script
│   └── colorExtractor.js # Color extraction utilities (reference)
├── background/            # Background service worker
│   └── background.js     # Message passing logic
├── utils/                 # Shared utilities
│   ├── colorUtils.js     # Color conversion utilities
│   └── exportUtils.js    # Export functionality
└── icons/                 # Extension icons
    ├── icon.svg          # Source SVG
    └── generate-icons.html # Icon generator tool
```

### Testing

1. Load the extension in Chrome
2. Test on various websites:
   - Simple HTML pages
   - Complex SPAs (React, Vue, etc.)
   - Websites with lots of colors
   - Websites with gradients
3. Test all features:
   - Color extraction
   - Filtering
   - Sorting
   - Copy to clipboard
   - Export functionality
   - Modal interactions
   - Keyboard shortcuts

### Debugging

1. **Popup Debugging**
   - Right-click the extension icon → "Inspect popup"
   - Use Chrome DevTools to debug

2. **Content Script Debugging**
   - Open DevTools on the webpage
   - Check Console for errors
   - Look for "Chromap" log messages

3. **Background Script Debugging**
   - Go to `chrome://extensions/`
   - Find Chromap extension
   - Click "service worker" link
   - Use DevTools to debug

## Building for Production

1. **Minify Files** (optional)
   - Minify JavaScript files
   - Minify CSS files
   - Optimize images

2. **Create ZIP**
   - Create a ZIP file of the entire `chromap` folder
   - Exclude:
     - `.git/`
     - `node_modules/`
     - `*.md` files (except README.md)
     - `generate-icons.html`

3. **Test the ZIP**
   - Load the ZIP as an unpacked extension
   - Verify everything works

## Publishing to Chrome Web Store

1. **Prepare Assets**
   - Create screenshots (1280x800 or 640x400)
   - Create promotional images (440x280 and 920x680)
   - Write detailed description
   - Prepare privacy policy URL

2. **Update Manifest**
   - Ensure version number is correct
   - Add store listing metadata
   - Verify all permissions are necessary

3. **Create ZIP**
   - Package extension as ZIP file
   - Name it `chromap-v1.0.0.zip`

4. **Submit to Store**
   - Go to Chrome Web Store Developer Dashboard
   - Create new item
   - Upload ZIP file
   - Fill in store listing information
   - Submit for review

## Troubleshooting

### Extension won't load
- Check that all icon files exist (icon16.png, icon48.png, icon128.png)
- Verify manifest.json is valid JSON
- Check for syntax errors in JavaScript files

### Colors not extracting
- Check browser console for errors
- Verify content script is injecting (check page source)
- Ensure page is not a special Chrome page (chrome://, etc.)
- Check that page has loaded completely

### Popup not showing
- Check popup.html exists
- Verify popup.js is loading
- Check browser console for errors
- Ensure manifest.json points to correct popup file

### Export not working
- Check browser supports File API
- Verify colors are loaded
- Check browser console for errors

## Support

For issues or questions:
- Check the README.md
- Review the code comments
- Open an issue on GitHub (if applicable)

