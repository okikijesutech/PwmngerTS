🎯 Threat Model Summary
Assets to protect

User passwords

Vault encryption keys

Master password

👿 Attacker Types & Outcomes
Attacker Result
Database hacker ❌ Cannot decrypt vault
Malicious admin ❌ Cannot see passwords
Network sniffer ❌ Sees only encrypted blobs
Lost device ❌ Vault still encrypted
Weak password ⚠️ Possible brute force

🔐 Attacks You STOP

✅ Server breach
✅ Insider threat
✅ MITM attack
✅ Cloud leak
✅ **Password Guessing (mitigated by 2FA)**

⚠️ **New Risks Introduced**
- **Recovery Key Theft**: If someone steals your printed Recovery Kit, they can decrypt your vault without your password. Treat it like a physical master key.
- **2FA Device Loss**: If you lose your TOTP device and your password, you may be locked out permanently unless you have the Recovery Kit.

⚠️ Attacks You CANNOT STOP (no one can)

Malware on device

Keyloggers

Compromised OS

This is normal. Even Bitwarden says this.
