# Security Policy

## 🔐 Supported Versions

This project is currently under active development.

| Version | Supported |
| ------- | --------- |
| main    | ✅ Yes    |

Older commits or forks may not receive security updates.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, **DO NOT open a public GitHub issue**.

Password managers handle sensitive data, and responsible disclosure is critical.

### Please report security issues via one of the following:

- GitHub **Security Advisories**
- Private message to the maintainer (to be added)

Include as much detail as possible:

- Steps to reproduce
- Affected files or components
- Potential impact
- Proof of concept (if safe)

---

## 🔒 Security Model Overview

- All sensitive data is encrypted **client-side**
- The backend never sees plaintext passwords or master keys
- Vaults are stored as encrypted blobs only
- Master passwords are never transmitted or stored
- **Account Recovery**: Recovery Keys are generated offline and allow vault decryption without the master password.
- **Two-Factor Authentication**: TOTP secrets are stored and verified by the backend (standard industry practice).

---

## 🛡️ Threat Model

Understanding what PwmngerTS protects against helps you evaluate its security for your needs.

### PWMnger protects against:
- **Database Compromise:** Even if our database is leaked, your passwords are encrypted with keys we don't have.
- **Accidental Technical Exposure:** Local data leaks from logout state are mitigated by memory clearing.
- **Weak User Passwords:** Brute force is mitigated by high-cost Argon2id derivation (though strong passwords are still required).

### PWMnger does NOT protect against:
- **Compromised OS / Malware:** If your machine has a keylogger or malware, no software can fully protect your secrets.
- **Physical Access:** If an attacker has physical access to your device WHILE it is unlocked, they may access your data.
- **Phishing:** Entering your master password into a fake PwmngerTS site will compromise your vault.

---

## ⚠️ Disclaimer

This project is provided **as-is** for educational and experimental purposes.

While security best practices are followed, this project has **not undergone a formal security audit**.  
Do not rely on it for high-risk production secrets without independent review.

---

Thank you for helping keep this project secure 🙏
