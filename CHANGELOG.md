# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Vault merging logic for intelligent sync conflict resolution
- `lastModified` timestamp field to vault entries
- `updatedAt` timestamp field to stored vaults
- `addVaultEntry()` and `deleteVaultEntry()` functions for better encapsulation
- `mergeVaults()` function for combining local and remote vault data
- Comprehensive test coverage for vault management functions

### Changed
- Refactored `App.tsx` to use new vault management functions
- Updated `importEncryptedVault()` to merge instead of replace vault data
- Improved type safety in storage layer using `EncryptedPayload`

### Fixed
- Critical sync bug where local changes were overwritten by cloud data
- Test failures due to cryptographic function updates
- Type inconsistencies in vault entry creation

## [0.2.0] - 2026-02-03

### Added
- Browser extension support (Chrome/Edge)
- Web application with React and Vite
- Zero-knowledge encryption architecture
- Client-side vault encryption using AES-256-GCM
- Master key derivation using Argon2id
- IndexedDB for local encrypted storage
- Optional cloud sync with encrypted blobs
- Auto-lock on inactivity
- Secure clipboard operations
- Comprehensive test suite
- CI/CD pipeline with GitHub Actions
- Documentation (README, CONTRIBUTING, SECURITY)
- Threat model documentation

### Security
- All encryption happens client-side
- Master password never leaves device
- Backend stores only encrypted blobs
- Rate limiting on API endpoints
- Helmet security headers

## [0.1.0] - 2026-02-02

### Added
- Initial project structure
- Monorepo setup with workspaces
- Core crypto package
- Vault data structures
- Storage abstraction layer
- Basic UI components
- Backend API with Express
- Prisma database schema

---

## Release Notes

### Version 0.2.0
This release includes the core password manager functionality with web and extension support. The application uses zero-knowledge encryption to ensure user data privacy.

**⚠️ Important**: This is an experimental release. Do not use for production secrets without a professional security audit.

### Version 0.1.0
Initial development release with basic project structure and core packages.
