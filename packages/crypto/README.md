# @pwmnger/crypto

Core cryptography package for PwmngerTS.

## Features
- **Argon2id Key Derivation:** memory-hard password hashing.
- **AES-256-GCM Encryption:** authenticated encryption for vault entries.
- **Cross-Platform:** Works in Node.js, Browsers (Web Crypto), and React Native.

## Security
This package implements the zero-knowledge security model by ensuring all cryptographic operations happen client-side. The Master Key never leaves the runtime memory of this package during vault operations.
