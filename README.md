# PwmngerTS 🔐

**An open-source, zero-knowledge, cross-platform password manager built with TypeScript**

PwmngerTS is a secure, client-side encrypted password manager designed to work across web, browser extensions, and mobile/desktop platforms.
All encryption happens **locally on the user's device** — the server never sees plaintext passwords.

> Inspired by zero-knowledge architectures like Bitwarden, but built for learning, extensibility, and open collaboration.

---

## ✨ Features

- 🔐 Client-side encryption (zero-knowledge)
- 🧠 Master password never leaves the device
- 💾 Local encrypted storage (IndexedDB)
- ☁️ Optional cloud sync (encrypted blobs only)
- 🔄 Add / delete / manage vault entries
- ⏱ Auto-lock on inactivity
- 📋 Secure copy-to-clipboard
- 🌍 Cross-platform ready (Web, Extension, Mobile)
- 🧩 Open-source & extensible

---

## 🏗 Architecture Overview

```
Client (Web / Extension / Mobile)
├─ Encrypts vault locally (Web Crypto API + Argon2id)
├─ Stores encrypted vault locally
└─ Syncs encrypted blob to backend

Backend (Node.js)
├─ Auth (email + password hash)
├─ Stores encrypted vault only
└─ Never decrypts user data
```

✔ Backend **never** sees:

- Master password
- Vault contents
- Decrypted secrets

---

## 📁 Project Structure

```
PwmngerTS/
├─ apps/
│  ├─ web/          # React + Vite frontend
│  ├─ mobile/       # React Native (planned)
│  └─ extension/    # Browser extension (Chrome/Edge)
│
├─ packages/
│  ├─ crypto/       # Encryption & key derivation (Argon2id, AES-GCM)
│  ├─ storage/      # IndexedDB logic
│  ├─ appLogic/     # Vault manager & business logic
│  ├─ ui/           # Shared UI components
│  └─ vault/        # Vault types & operations
│
├─ backend/         # Node.js + Express API
│
├─ docs/            # Documentation & threat model
├─ README.md        # This file
├─ LICENSE          # MIT License
├─ SECURITY.md      # Security reporting
└─ CONTRIBUTING.md  # Contribution guidelines
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js v23+ and npm v11+
- Git

### 1️⃣ Clone the repo

```bash
git clone https://github.com/okikijesutech/PwmngerTS.git
cd PwmngerTS
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start the web app

```bash
cd apps/web
npm run dev
```

The app should now be running at: **http://localhost:5173**

### 4️⃣ (Optional) Start the backend

```bash
cd backend
npm run dev
```

Backend runs on: **http://localhost:4000**

### 5️⃣ Build the Extension

```bash
cd apps/extension
npm run build
```

Then load the `apps/extension/dist` directory as an **unpacked extension** in your browser.

---

## 🔐 Security Model

- ✅ All encryption is **client-side** (Web Crypto API)
- ✅ Master password derives encryption keys using **Argon2id**
- ✅ Vault encrypted with **AES-256-GCM**
- ✅ Backend stores only **encrypted blobs**
- ✅ No plaintext passwords transmitted or stored

⚠️ **Disclaimer**: This project is for **educational and experimental use**.
Do not rely on it for high-risk production secrets without a professional security audit.

See [docs/threat-model.md](docs/threat-model.md) for detailed security analysis.

---

## ☁️ Cloud Sync (Optional)

Cloud sync uses the Node.js backend to:

- Authenticate users (JWT)
- Store encrypted vault blobs
- Never decrypt vault data

Users can manually export/import vaults as encrypted JSON backups.

---

## 🧪 Testing

Tests are organized by module:

```bash
# Run all tests
npm test

# Test specific packages
npm run test:crypto      # Crypto functions
npm run test:vault       # Vault operations
npm run test:applogic    # App logic
npm run test:storage     # Storage layer
npm run test:integration # Full integration
```

**Test coverage:**

- ✅ Unit tests for crypto, vault, and storage
- ✅ Integration tests for vault operations
- ✅ Controller tests for API endpoints
- ⏳ E2E tests (planned)

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

**Quick start:**

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Good first contributions:**

- UI improvements & styling
- Additional tests
- Accessibility improvements
- Documentation
- Bug fixes

---

## 🔐 Security Issues

**Do not open public issues for security vulnerabilities!**

Please report responsibly via:

- [GitHub Security Advisories](https://github.com/okikijesutech/PwmngerTS/security/advisories)
- See [SECURITY.md](SECURITY.md) for full details

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for full details.

---

## 🧠 Motivation & Learning Goals

PwmngerTS was built to:

- ✅ Learn zero-knowledge architecture principles
- ✅ Practice client-side encryption
- ✅ Explore monorepo structure with TypeScript
- ✅ Build cross-platform apps (Web, Mobile, Extension)
- ✅ Create reusable crypto and vault packages

This is an open-source learning project. Feel free to fork, study, and improve!

---

## 🗺️ Roadmap

- [x] Browser extension version
- [ ] Mobile app (React Native)
- [ ] Two-factor authentication
- [ ] Password strength meter
- [ ] Auto-fill integration
- [ ] Passkey support
- [ ] End-to-end tests
- [ ] Professional security audit

---

## 📧 Contact & Support

- 🐛 **Issues:** Use [GitHub Issues](https://github.com/okikijesutech/PwmngerTS/issues)
- 💬 **Discussions:** Use [GitHub Discussions](https://github.com/okikijesutech/PwmngerTS/discussions)
- 📚 **Docs:** Check [docs/](docs/) directory

---

**Built with ❤️ by the PwmngerTS community**
