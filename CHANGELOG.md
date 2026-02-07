# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-07

### Added
- **Two-Factor Authentication (2FA)**: Added TOTP support for enhanced vault security.
- **End-to-End Testing**: Implemented Playwright testing suite for smoke and regression testing.
- **Improved Storage Layer**: Added `packages/storage` for better data persistence management.
- **UI Component Package**: Extracted shared UI components into `packages/ui`.
- **Background Script Module support**: Fixed extension background script to be treated as a module.

### Fixed
- Fixed TypeScript errors in `playwright.config.ts` related to `exactOptionalPropertyTypes`.
- Fixed extension background script import issue in Vitest.
- Resolved master password rejection after page reload by improving key serialization.

## [0.1.0] - 2026-02-03

### Added
- Initial release of PwmngerTS.
- Basic vault operations (Create, Unlock, Add/Remove entries).
- Client-side encryption using Web Crypto API.
- Node.js backend for encrypted blob storage.
- Browser extension prototype.
