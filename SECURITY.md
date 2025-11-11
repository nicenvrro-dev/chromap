# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report security vulnerabilities to: **nicenvrro@gmail.com**

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

When reporting a vulnerability, please include:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Depends on severity and complexity

### Disclosure Policy

- We will acknowledge receipt of your vulnerability report
- We will confirm the issue and determine affected versions
- We will keep you informed of our progress
- We will notify you when the vulnerability is fixed
- We will credit you for the discovery (if desired)

## Security Best Practices

This extension follows security best practices:

- **Minimal Permissions**: Only requests necessary permissions
- **Content Security Policy**: Strict CSP to prevent XSS
- **No External Scripts**: All code is bundled locally
- **No Data Collection**: No user data is collected or transmitted
- **Local Processing**: All color extraction happens locally

## Known Security Considerations

- The extension injects content scripts into web pages
- The extension reads page content for color extraction
- No sensitive data is collected or transmitted
- All processing happens in the browser

If you discover a security vulnerability, please follow the reporting process above.

