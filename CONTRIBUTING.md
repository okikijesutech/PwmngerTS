# Contributing to PwmngerTS

First of all, thank you for taking the time to contribute 🙌  
Contributions of all kinds are welcome.

---

## 📌 Code of Conduct

- Be respectful
- Assume good intent
- No harassment or abusive language

---

## 🧠 Project Philosophy

This project prioritizes:

- Security over convenience
- Clarity over cleverness
- Simplicity over over-engineering

If a contribution weakens the security model, it will not be merged.

---

## 🛠 How to Contribute

### 1️⃣ Fork the Repository

Create a personal fork and work from there.

### 2️⃣ Create a Branch

```bash
git checkout -b feature/your-feature-name
### 3️⃣ Make Your Changes

- Use TypeScript
- Keep functions small and readable
- Avoid adding dependencies unless necessary
- **Do not log sensitive data**

## ⚒️ Local Development & Building

To contribute effectively, you should know how to build and test the project locally.

### 🧩 Building the Extension
1.  Navigate to the root: `cd PwmngerTS`
2.  Install dependencies: `pnpm install`
3.  Build all packages and apps: `pnpm build`
4.  The extension distributable will be in `apps/extension/dist`.
5.  To work in watch mode: `pnpm --filter extension dev`.

### 🧪 Running Tests
We maintain a high bar for testing. Please ensure your changes pass all relevant suites:
- **Unit Tests:** `pnpm test` (Runs Vitest/Jest across the monorepo).
- **Security Integration:** `pnpm --filter web test src/__tests__/security_integration.test.ts`.
- **E2E Tests:** `pnpm test:e2e` (Requires Playwright).

### 4️⃣ Test Your Changes

Ensure the app:
- Builds successfully
- Does not break encryption logic
- Does not expose plaintext secrets

### 5️⃣ Submit a Pull Request

Explain:
- What problem your PR solves
- Why the approach is secure
- Any tradeoffs made

## 🧪 Areas Needing Help

Good first issues include:
- UI/UX improvements
- Tests
- Accessibility
- Password strength visualization
- Documentation

Security-sensitive changes should be discussed first.

## 🔐 Security Contributions

If your contribution involves:
- Cryptography
- Authentication
- Storage
- Sync logic

Please open a discussion before submitting a PR.

---

## ❗ What Not to Do

- **NEVER** add plaintext logging of sensitive data (passwords, keys, salts).
- **NEVER** introduce server-side decryption logic.
- **NEVER** weaken cryptographic parameters (Argon2 iterations, AES modes).
- **NEVER** bypass 2FA checks in the backend.

Thank you for helping make this project better ❤️
