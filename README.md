# Chromap - Color & Font Extractor

<div align="center">

![Chromap Logo](icons/icon128.png)

**Instantly extract and visualize every color palette and font style from any website.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Coming%20Soon-blue)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-1.1.0-blue)](https://github.com/nicenvrro-dev/chromap)
![JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-F7DF1E)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Development](#development) • [Contributing](#contributing)

</div>

## Demo Preview

See Chromap in action! Watch how it extracts colors from any webpage:

<div align="center">

![Chromap Demo](docs/screenshots/demo.gif)

_Extracting colors from a webpage in real-time_

</div>

## Screenshots

<div align="center">

### Extension Popup Interface

![Chromap color extraction popup showing color grid with HEX values](docs/screenshots/popup-ui.png)

_Clean, modern interface displaying extracted color palette with HEX and RGB values_

</div>

---

## Overview

Whether you’re a designer, developer, or curious creative, Chromap helps you peek behind the pixels — revealing every color and font that shapes a site’s design.

### Key Features

- 🎨 **Extract all colors and fonts** from any webpage instantly
- ⚡ **Smart deduplication** and frequency-based sorting
- 📋 **One-click copy & export** (JSON, CSV, CSS variables)
- 🌓 **Dark/Light mode** popup UI with real-time preview
- 🧠 **Fully local processing** — no data ever leaves your browser

**UI/UX:**

- 🌓 **Dark/Light Mode**: Automatic theme support in popup UI
- ⚡ **Instant Modal**: Click any color or font to view details immediately
- 📑 **Tabbed Interface**: Seamless switching between Colors and Fonts tabs
- ✨ **Visual Enhancements**: Hover glow effects, dominant color/font highlighting, loading animations

## Features in Detail

### Color Extraction

- Extracts colors from DOM elements' computed styles
- Parses CSS stylesheets for additional colors
- Extracts colors from gradients (linear, radial, conic)
- Handles transparent and named colors
- Optimized for large pages with element sampling

### Font Extraction

- Extracts fonts from DOM elements' computed styles
- Parses CSS stylesheets for font-family declarations
- Captures complete typography information:
  - Font family (with fallback fonts)
  - Font size (px, em, rem, %, etc.)
  - Font weight (normal, bold, numeric values)
  - Font style (normal, italic, oblique)
  - Line height
  - Letter spacing
  - Text transform (uppercase, lowercase, capitalize)
  - Text decoration (underline, overline, line-through)
- Shows font preview with actual rendered text
- Identifies dominant font (most frequently used)
- Optimized for large pages with element sampling

### User Interface

- **Modern Design**: Clean, minimalist interface
- **Tabbed Navigation**: Easy switching between Colors and Fonts
- **Color Grid**: Responsive grid layout with color swatches
- **Font Grid**: Responsive grid layout with font preview cards
- **Color Modal**: Detailed view with hex, RGB, HSL values
- **Font Modal**: Detailed view with complete typography information
- **Hover Effects**: Subtle glow using each color's own tone
- **Dominant Highlighting**: Highlights the most frequent color or font
- **Loading Animation**: Professional shimmer effect during extraction
- **Copy Feedback**: Visual confirmation when colors or fonts are copied

### Export Options

- **JSON**: Structured data format for programmatic use (colors and fonts)
- **CSV**: Spreadsheet-compatible format (colors and fonts)
- **CSS Variables**: Ready-to-use CSS custom properties (colors and fonts)

### Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Screen reader compatible
- Focus management
- High contrast support

## Installation

### From Chrome Web Store

_(Coming soon)_

### From Source

1. **Clone the repository**

   ```bash
   git clone https://github.com/nicenvrro-dev/chromap.git
   cd chromap
   ```

2. **Load in Chrome**

   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `chromap` folder
   - The extension icon should appear in your toolbar

3. **Verify Installation**
   - The Chromap icon should appear in your Chrome toolbar
   - Icons are already included in the repository

## Usage

### Basic Usage

1. Navigate to any website
2. Click the Chromap icon in your Chrome toolbar
3. Colors are automatically extracted and displayed in the Colors tab
4. Switch to the Fonts tab to view extracted fonts
5. Click any color or font card to view details
6. Copy colors/fonts or export the palette

### Advanced Features

#### Filtering Colors

- Use the filter dropdown to show colors by source:
  - **All Colors**: Show all extracted colors
  - **Background**: Only background colors
  - **Text**: Only text/foreground colors
  - **Border**: Only border colors
  - **Shadow**: Only shadow colors
  - **Gradient**: Only gradient colors

#### Sorting Colors

- Sort by:
  - **Frequency**: Most used colors first
  - **Hue**: Colors organized by hue
  - **Brightness**: Light to dark or vice versa

#### Filtering Fonts

- Use the filter dropdown to show fonts by source:
  - **All Fonts**: Show all extracted fonts
  - **Element**: Fonts extracted from DOM elements
  - **Stylesheet**: Fonts extracted from CSS stylesheets

#### Sorting Fonts

- Sort by:
  - **Frequency**: Most used fonts first
  - **Family Name**: Alphabetical order by font family

#### Exporting Palettes

1. Click "Export" in the footer
2. Choose format:
   - **JSON**: For developers and tools
   - **CSV**: For spreadsheets
   - **CSS Variables**: For styling
3. Select what to export:
   - **Colors Only**: Export only color data
   - **Fonts Only**: Export only font data
   - **Both**: Export colors and fonts together

#### Keyboard Shortcuts

- **ESC**: Close modals
- **Enter/Space**: Activate color/font cards (when focused)
- **Tab**: Navigate between elements
- **1/2**: Switch between Colors and Fonts tabs (when popup is focused)

**Key UI Features:**

- **Color Grid**: Responsive grid layout showing all extracted colors
- **Font Grid**: Responsive grid layout showing all extracted fonts with preview
- **Tabbed Interface**: Seamless navigation between Colors and Fonts
- **Dominant Highlighting**: Most frequent color/font highlighted with star icon and accent border
- **Filter & Sort**: Easy filtering by type and sorting options for both colors and fonts
- **Dark Mode**: Automatic theme support for comfortable viewing
- **Hover Effects**: Subtle glow effects on color cards

## Development

### Project Structure

```
chromap/
├── manifest.json          # Extension manifest (Manifest V3)
├── popup/                 # Popup UI
│   ├── popup.html        # Popup HTML structure
│   ├── popup.css         # Popup styles
│   ├── popup.js          # Popup logic
│   └── iconUtils.js      # Icon utility (Lucide icons)
├── content/               # Content scripts
│   ├── content.js        # Color and font extraction script
│   └── colorExtractor.js # Color extraction utilities (reference)
├── background/            # Background service worker
│   └── background.js     # Message passing logic
├── utils/                 # Shared utilities (reference)
│   ├── colorUtils.js     # Color conversion utilities
│   └── exportUtils.js    # Export functionality
└── icons/                 # Extension icons
    ├── icon.svg          # Source SVG
    └── *.png             # Icon assets
```

### Tech Stack

- **Manifest V3**: Latest Chrome extension API
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern CSS with CSS Variables, Grid, Flexbox
- **Chrome APIs**: `chrome.tabs`, `chrome.scripting`, `chrome.runtime`
- **Lucide Icons**: SVG icon library (bundled locally for CSP compliance)

### Building

Chromap runs directly from source — no build tools required.
Use the script below only to package files into a `.zip` for Chrome Web Store submission.

```bash
# Package for Chrome Web Store
npm run package
```

### Testing

1. Load the extension in Chrome (see Installation)
2. Test on various websites:
   - Simple HTML pages
   - Complex SPAs (React, Vue, Angular)
   - Websites with many colors
   - Websites with gradients
3. Test all features:
   - Color extraction
   - Font extraction
   - Filtering and sorting (colors and fonts)
   - Tab navigation
   - Copy to clipboard
   - Export functionality (colors, fonts, and both)
   - Modal interactions
   - Keyboard shortcuts

### Debugging

- **Popup**: Right-click extension icon → "Inspect popup"
- **Content Script**: Open DevTools on the webpage
- **Background**: Go to `chrome://extensions/` → Click "service worker" link

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Troubleshooting

### Extension won't load

- Check that all icon files exist in `icons/` folder
- Verify `manifest.json` is valid JSON
- Check browser console for errors

### Colors/Fonts not extracting

- Ensure you're on a regular webpage (not chrome:// pages)
- Check browser console for errors
- Try refreshing the page and extracting again
- For fonts: Some fonts may not appear if they're loaded via web fonts that haven't loaded yet

### Popup not showing

- Check browser console for errors
- Verify popup.html exists and is accessible
- Try reloading the extension

### Export not working

- Check browser supports File API (modern browsers)
- Verify colors/fonts are loaded
- Check browser console for errors
- Ensure you've selected what to export (colors, fonts, or both)

## Browser Support

- ✅ Chrome 88+ (Manifest V3)
- ✅ Edge 88+ (Chromium-based)
- ❌ Firefox (requires Manifest V2 adaptation)
- ❌ Safari (requires different extension format)

## Privacy

Chromap does not collect, store, or transmit any personal data. All color and font extraction happens locally in your browser. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with vanilla JavaScript
- Inspired by the need for better color extraction tools
- Thanks to all contributors and users

## Roadmap

- [x] Font extraction from DOM and stylesheets
- [x] Tabbed interface for Colors and Fonts
- [x] Font export functionality
- [ ] Color contrast checker (WCAG compliance)
- [ ] Extract colors from images
- [ ] Save favorite palettes
- [ ] Export as Adobe Swatch (.ase) format
- [ ] Color and font history across websites
- [ ] Settings page for preferences
- [ ] Improved gradient color extraction
- [ ] Font pairing suggestions
- [ ] Typography scale analysis

## Support

- **Issues**: [GitHub Issues](https://github.com/nicenvrro-dev/chromap/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nicenvrro-dev/chromap/discussions)
- **Email**: nicenvrro@gmail.com

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

<div align="center">

Made with ❤️ for designers and developers

[⭐ Star on GitHub](https://github.com/nicenvrro-dev/chromap) • [🐛 Report Bug](https://github.com/nicenvrro-dev/chromap/issues) • [💡 Request Feature](https://github.com/nicenvrro-dev/chromap/issues)

</div>
