# Changelog

All notable changes to Chromap will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

