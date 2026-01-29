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

---

## ⚠️ Disclaimer

This project is provided **as-is** for educational and experimental purposes.

While security best practices are followed, this project has **not undergone a formal security audit**.  
Do not rely on it for high-risk production secrets without independent review.

---

Thank you for helping keep this project secure 🙏
