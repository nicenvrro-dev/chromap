# Pre-Publish Checklist

## ✅ Completed Items

### Critical Fixes
- [x] Removed unused `storage` permission from manifest.json
- [x] Updated author name in manifest.json and package.json
- [x] Removed all console.log/error/warn statements from production code
- [x] Extracted magic numbers to constants (CONFIG object)
- [x] Updated privacy policy to reflect permission changes
- [x] Enhanced README.md with comprehensive documentation
- [x] Created CONTRIBUTING.md
- [x] Created GitHub issue and PR templates
- [x] Created SECURITY.md
- [x] Created CODE_OF_CONDUCT.md
- [x] Created .editorconfig and .prettierrc

## 🔴 Critical (Before Publishing)

### 1. Update Repository URLs
- [ ] Update `homepage_url` in `manifest.json` with actual GitHub URL
- [ ] Update `repository.url` in `package.json` with actual GitHub URL
- [ ] Update `bugs.url` and `homepage` in `package.json`
- [ ] Update all GitHub links in README.md
- [ ] Update SECURITY.md email address (replace `security@example.com`)

### 2. Create Store Assets
- [ ] **Screenshots** (1280x800 or 640x400 pixels)
  - Take screenshots of the extension in action
  - Show color extraction on various websites
  - Highlight key features
- [ ] **Small Promotional Tile** (440x280 pixels)
  - Eye-catching design with extension name
  - Brief tagline
- [ ] **Large Promotional Tile** (920x680 pixels)
  - More detailed promotional image
  - Feature highlights
- [ ] **Store Icon** (128x128 pixels) - ✅ Already exists

### 3. Host Privacy Policy
- [ ] Host PRIVACY_POLICY.md on GitHub Pages or dedicated URL
- [ ] Update manifest.json with privacy policy URL (if required)
- [ ] Add privacy policy URL to Chrome Web Store listing

### 4. Final Testing
- [ ] Test extension on multiple websites
- [ ] Test all features (extraction, filtering, sorting, export, copy)
- [ ] Test in both light and dark modes
- [ ] Test keyboard navigation
- [ ] Test error cases (chrome:// pages, empty pages, etc.)
- [ ] Test on different screen sizes
- [ ] Verify no console errors in production
- [ ] Verify all permissions are justified

## 🟡 High Priority (Before Open-Source Release)

### 5. Clean Up Files
- [ ] Remove or document `content/colorExtractor.js` (currently unused)
- [ ] Remove or document `utils/colorUtils.js` (code is inline)
- [ ] Remove or document `utils/exportUtils.js` (code is inline)
- [ ] Remove empty `styles/` directory
- [ ] Remove empty `assets/images/` directory
- [ ] Consider consolidating documentation files

### 6. GitHub Repository Setup
- [ ] Create GitHub repository
- [ ] Push code to repository
- [ ] Update repository description
- [ ] Add repository topics:
  - `chrome-extension`
  - `color-extractor`
  - `design-tools`
  - `web-design`
  - `color-picker`
  - `css-colors`
- [ ] Set up GitHub Pages (optional, for hosting privacy policy)
- [ ] Add repository badges to README.md
- [ ] Add screenshots to README.md

### 7. Documentation Enhancements
- [ ] Add screenshots/GIFs to README.md
- [ ] Add demo/preview video (optional)
- [ ] Verify all links work
- [ ] Test installation instructions
- [ ] Add troubleshooting section examples

## 🟢 Medium Priority (Post-Launch)

### 8. Code Quality
- [ ] Add unit tests for color utilities
- [ ] Add input validation
- [ ] Improve error messages
- [ ] Add JSDoc for all public functions
- [ ] Consider adding ESLint configuration

### 9. Features & Improvements
- [ ] Monitor user feedback
- [ ] Plan for future features (see roadmap in README.md)
- [ ] Consider adding analytics (with user consent)
- [ ] Set up issue templates for feature requests
- [ ] Set up automated testing (GitHub Actions)

### 10. Marketing & Promotion
- [ ] Write blog post about the extension
- [ ] Share on social media
- [ ] Submit to Chrome extension directories
- [ ] Gather user testimonials
- [ ] Create demo video

## 📋 Chrome Web Store Submission Checklist

### Store Listing
- [ ] Detailed description (132+ characters)
- [ ] Short description (132 characters max)
- [ ] Category selection
- [ ] Language selection
- [ ] Screenshots (at least 1, up to 5)
- [ ] Promotional images (small and large tiles)
- [ ] Store icon (128x128) - ✅ Ready
- [ ] Privacy policy URL - ⚠️ Needs hosting
- [ ] Single purpose description
- [ ] Permission justification

### Technical Requirements
- [ ] Manifest V3 compliance - ✅ Ready
- [ ] No external dependencies - ✅ Ready
- [ ] CSP compliance - ✅ Ready
- [ ] No minified code obfuscation - ✅ Ready
- [ ] All permissions justified - ✅ Ready
- [ ] Icons present (16, 48, 128) - ✅ Ready

### Submission Process
1. [ ] Create Chrome Web Store Developer account
2. [ ] Pay one-time $5 registration fee
3. [ ] Create new item in Developer Dashboard
4. [ ] Upload ZIP file (use `npm run package`)
5. [ ] Fill in store listing information
6. [ ] Upload screenshots and promotional images
7. [ ] Add privacy policy URL
8. [ ] Submit for review
9. [ ] Monitor review status
10. [ ] Address any review feedback
11. [ ] Publish extension

## 📝 Notes

### Package Command
The `package` script in `package.json` creates a ZIP file for Chrome Web Store submission:
```bash
npm run package
```

### Store Listing Description Template
```
Chromap is a powerful Chrome extension that automatically extracts and displays all colors from any webpage. Perfect for designers, developers, and anyone who wants to understand the color palette of a website.

Key Features:
• Automatic color extraction from DOM and CSS
• Support for Hex, RGB, HSL, and named colors
• Extract from backgrounds, text, borders, shadows, and gradients
• One-click copy to clipboard
• Export as JSON, CSV, or CSS variables
• Filter and sort colors by type, frequency, hue, or brightness
• Dark/light mode support
• Beautiful, modern UI with hover effects

Use Cases:
• Design inspiration and color palette analysis
• Website color scheme extraction
• CSS variable generation
• Color palette export for design tools
• Quick color value copying

Privacy:
Chromap does not collect, store, or transmit any data. All processing happens locally in your browser.

Perfect for:
• Web designers
• Front-end developers
• UI/UX designers
• Color enthusiasts
• Anyone interested in web design
```

### Permission Justification
- **activeTab**: Required to access the current tab's content for color extraction
- **scripting**: Required to inject content scripts that analyze the webpage's DOM and CSS

### Privacy Policy Hosting Options
1. **GitHub Pages** (Free, recommended)
   - Create `docs/` folder
   - Move `PRIVACY_POLICY.md` to `docs/`
   - Enable GitHub Pages in repository settings
   - URL: `https://yourusername.github.io/chromap/privacy-policy`

2. **GitHub Repository** (Free, simple)
   - Link directly to raw GitHub file
   - URL: `https://github.com/yourusername/chromap/blob/main/PRIVACY_POLICY.md`

3. **Dedicated Website** (If you have one)
   - Host on your own website
   - URL: `https://yourwebsite.com/chromap/privacy-policy`

## 🎯 Priority Order

1. **Update repository URLs** (5 minutes)
2. **Create store assets** (2-3 hours)
3. **Host privacy policy** (30 minutes)
4. **Final testing** (1-2 hours)
5. **Clean up files** (30 minutes)
6. **GitHub repository setup** (1 hour)
7. **Chrome Web Store submission** (2-3 hours)

## ✅ Ready to Publish?

Once all critical items are completed, you're ready to:
1. Submit to Chrome Web Store
2. Publish to GitHub as open-source
3. Share with the community

---

**Last Updated**: December 2024
**Status**: 🟡 Ready with minor improvements needed

