# ⚔️ Security Auditing & Pentesting Guide

This guide provides structured methods to "attack" PwmngerTS in a controlled environment to verify its security claims.

## 🎯 Target Areas

### 1. Cryptographic Resistance (Argon2id)
**Goal:** Verify that the Master Key derivation is memory-hard and CPU-intensive enough to resist brute force.
- **Test:** Use `apps/web/src/lib/crypto.ts` and attempt to run the derivation loop in a web worker with reduced cost parameters. 
- **Success Criteria:** Derivation should take >500ms on a standard machine with default parameters.

### 2. Metadata Leakage (Zero-Knowledge)
**Goal:** Prove that the backend knows nothing about the stored data.
- **Test:** Use a tool like **Postman** or **`curl`** to intercept the `/vault` response.
- **Audit Steps:**
  1. Login to the vault.
  2. Inspect the JSON response from the server.
  3. Ensure no fields contain names, URLs, or notes in plaintext.
- **Success Criteria:** Only base64-encoded `iv`, `ciphertext`, and `tag` should be visible.

### 3. API Fuzzing (OWASP Top 10)
**Goal:** Test for common vulnerabilities like SQL Injection or Broken Access Control.
- **Recommended Tool:** [OWASP ZAP](https://www.zaproxy.org/) or [Burp Suite].
- **Audit Steps:**
  1. Point ZAP toward `http://localhost:4000`.
  2. Run the "Automated Scan" on auth endpoints.
  3. Attempt to fetch `/vault/:userId` using a JWT from a different user.
- **Success Criteria:** Secondary user should receive a `403 Forbidden` or `404 Not Found`.

### 4. Man-in-the-Middle (HTTPS/TLS)
**Goal:** Verify that even with a compromised network, data is safe.
- **Test:** Use **Proxyman** or **Fiddler** to decrypt local HTTPS traffic.
- **Success Criteria:** Even with decrypted HTTPS, the payload (Vault Blob) remains AES-256 encrypted and unreadable to the attacker.

### 5. Extension Manifest V3 Popping
**Goal:** Ensure the browser extension doesn't leak data to other sites.
- **Test:** Create a malicious `index.html` that tries to send messages to the PwmngerTS background script ID.
- **Success Criteria:** The extension should ignore all messages from unauthorized origins via `chrome.runtime.onMessageExternal`.

---

## 🛡️ Reporting
If you find a vulnerability during your audit, please refer to our **SECURITY.md** (or `CODE_OF_CONDUCT.md`) for responsible disclosure.
