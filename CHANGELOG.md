# Changelog

All notable changes to Chromap will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-XX

### Added

- Font extraction from DOM elements and CSS stylesheets
- Tabbed interface for switching between Colors and Fonts
- Font detail modal with complete typography information
- Font filtering by source (Element, Stylesheet, All)
- Font sorting by frequency or family name
- Font export functionality (JSON, CSV, CSS variables)
- Dominant font highlighting (most frequently used)
- Font preview cards with rendered text samples
- Typography details: font family, size, weight, style, line height, letter spacing, text transform, text decoration
- Combined export option for colors and fonts together
- Lucide icon integration for better UI icons

### Changed

- Updated UI to support tabbed navigation
- Enhanced export modal to include font export options
- Improved refresh button with tooltip and clearer icon visualization

### Technical

- Added font extraction utilities in content script
- Integrated Lucide icons via iconUtils.js for CSP compliance
- Added null safety checks throughout the codebase
- Improved error handling for font extraction

## [1.0.0] - 2024-01-01

### Added

- Initial release of Chromap
- Automatic color extraction from web pages
- Support for multiple color formats (Hex, RGB, HSL)
- Color extraction from backgrounds, text, borders, shadows, and gradients
- Color palette display with grid layout
- Filter colors by source type
- Sort colors by frequency, hue, or brightness
- Copy color values to clipboard (Hex, RGB, HSL)
- Export palette as JSON, CSV, or CSS variables
- Color detail modal with full color information
- Dark/Light mode support
- Responsive design
- Keyboard shortcuts (ESC to close modals)
- Error handling and user-friendly error messages
- Loading states and empty states

### Technical

- Manifest V3 compliance
- Content script injection
- Background service worker
- Message passing between popup and content script
- DOM traversal and computed style extraction
- CSS stylesheet parsing
- Gradient color extraction
- Color format conversion utilities
