# Cryptographic Design

## Overview

PwmngerTS implements a zero-knowledge password manager using industry-standard cryptographic primitives. All encryption and decryption operations occur client-side, ensuring that the server never has access to plaintext data or master passwords.

## Key Derivation

### Master Key Derivation

The master password is transformed into a cryptographic key using Argon2id, a memory-hard key derivation function resistant to brute-force attacks.

**Algorithm**: Argon2id  
**Parameters**:

- **Memory**: 64 MB (65536 KB)
- **Iterations**: 3
- **Parallelism**: 4 threads
- **Salt**: 128-bit random value (16 bytes)
- **Output**: 256-bit key (32 bytes)

**Implementation**: Uses `hash-wasm` library for Argon2id hashing.

```typescript
// From packages/crypto/src/kdf.ts
export async function deriveMasterKey(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey>;
```

The salt is generated once during vault creation and stored with the encrypted vault. This ensures the same password always derives the same master key for a given vault.

### Vault Key Generation

The vault key is a randomly generated AES-256 key used to encrypt the actual vault data.

**Algorithm**: AES-256-GCM  
**Key Size**: 256 bits (32 bytes)  
**Generation**: Web Crypto API `crypto.subtle.generateKey()`  
**Extractable**: Yes (required for key wrapping)

```typescript
// From packages/crypto/src/vaultKey.ts
export async function generateVaultKey(): Promise<CryptoKey>;
```

## Encryption

### Vault Encryption

The vault (containing all password entries) is encrypted using AES-256-GCM, which provides both confidentiality and authenticity.

**Algorithm**: AES-256-GCM  
**IV**: 96-bit random (12 bytes) - generated per encryption  
**Tag Length**: 128 bits (default for GCM)  
**Data Format**: JSON-serialized `Vault` object

```typescript
// From packages/crypto/src/encrypt.ts
export async function encryptData<T>(
  key: CryptoKey,
  data: T,
): Promise<EncryptedPayload>;
```

**EncryptedPayload Structure**:

```typescript
{
  iv: number[],    // 12-byte initialization vector
  data: number[]   // Encrypted ciphertext + authentication tag
}
```

### Key Wrapping

The vault key is encrypted (wrapped) with the master key to protect it at rest.

**Algorithm**: AES-GCM Key Wrap  
**Purpose**: Encrypt the vault key using the master key  
**IV**: 96-bit random per wrap operation

```typescript
// From packages/crypto/src/keys.ts
export async function wrapKey(
  masterKey: CryptoKey,
  vaultKey: CryptoKey,
): Promise<EncryptedPayload>;

export async function unwrapKey(
  masterKey: CryptoKey,
  wrappedKey: EncryptedPayload,
): Promise<CryptoKey>;
```

## Account Recovery

If the master password is lost, the vault can be recovered using an Emergency Recovery Kit.

### Recovery Key Generation

The recovery key is a high-entropy 256-bit key that is provided to the user in a human-readable format (mnemonic or hex string).

1. **Vault Key Protection**: The vault key is wrapped with the recovery key, just as it is with the master key.
2. **Persistence**: The wrapped vault key (using the recovery key) is stored alongside the standard vault metadata.
3. **Usage**: During recovery, the user provides their recovery key, which is used to unwrap the vault key and regain access to the plaintext vault.

```typescript
// From packages/appLogic/src/vaultManager.ts
export async function generateRecoveryKit(masterKey: CryptoKey, vault: Vault): Promise<string>;
export async function recoverVault(recoveryKey: string, encryptedVault: EncryptedVault): Promise<Vault>;
```

## Data Flow

### Vault Creation

```
User Password
    ↓
Random Salt (16 bytes)
    ↓
Argon2id(password, salt) → Master Key (256-bit)
    ↓
Generate Random Vault Key (256-bit)
    ↓
Wrap Vault Key with Master Key → Encrypted Vault Key
    ↓
Encrypt Empty Vault with Vault Key → Encrypted Vault
    ↓
Store: {salt, encryptedVaultKey, encryptedVault, updatedAt}
```

### Vault Unlock

```
User Password + Stored Salt
    ↓
Argon2id(password, salt) → Master Key
    ↓
Unwrap Encrypted Vault Key → Vault Key
    ↓
Decrypt Encrypted Vault → Vault (in memory)
```

### Adding/Modifying Entries

```
Modify Vault in Memory
    ↓
Encrypt Vault with Vault Key → Encrypted Vault
    ↓
Store: {salt, encryptedVaultKey, encryptedVault, updatedAt}
```

Note: The vault key remains the same; only the encrypted vault blob changes.

## Security Properties

✅ **Confidentiality**: AES-256-GCM ensures data cannot be read without the key  
✅ **Authenticity**: GCM authentication tag prevents tampering  
✅ **Forward Secrecy**: Changing master password re-wraps vault key  
✅ **Random IVs**: Each encryption uses a unique, random IV  
✅ **Strong KDF**: Argon2id makes brute-force attacks computationally expensive  
✅ **Zero-Knowledge**: Server never sees plaintext or master key

## Threat Model Alignment

| Threat           | Mitigation                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| Server breach    | Server stores only encrypted blobs; cannot decrypt without master password |
| Network sniffing | Only encrypted data transmitted over network                               |
| Weak password    | Argon2id parameters make brute-force expensive (64MB memory, 3 iterations) |
| Key reuse        | Fresh IV generated for each encryption operation                           |
| Tampering        | GCM authentication tag detects modifications                               |
| Lost device      | Vault remains encrypted; master password required to unlock                |

## Attacks We Cannot Stop

⚠️ **Client-side malware**: If the user's device is compromised, malware can capture the master password or vault data in memory.  
⚠️ **Keyloggers**: Can capture master password as it's typed.  
⚠️ **Compromised OS**: Root-level access can bypass all protections.

**Note**: These limitations apply to all password managers, including commercial solutions like Bitwarden and 1Password.

## Implementation Notes

### Web Crypto API

All cryptographic operations use the browser's native Web Crypto API (`crypto.subtle`), which provides:

- Hardware-accelerated encryption
- Secure key storage (non-extractable keys when possible)
- Constant-time operations (resistant to timing attacks)

### No Custom Crypto

We **do not** implement custom cryptographic algorithms. All primitives are provided by:

- Web Crypto API (AES-GCM, key generation)
- hash-wasm library (Argon2id)

### Key Storage

- **Master Key**: Exists only in memory during an unlocked session; never persisted
- **Vault Key**: Stored encrypted (wrapped) with the master key
- **Encrypted Vault**: Stored in IndexedDB and optionally synced to server

### Memory Safety

- Keys are cleared from memory when the vault is locked
- Master password is not stored anywhere
- Vault data is cleared from memory on lock

## Sync Security

When syncing to the cloud:

1. **Upload**: Only the encrypted vault blob is sent
2. **Download**: Encrypted blob is merged with local data using `mergeVaults()`
3. **Conflict Resolution**: Entries are compared by `lastModified` timestamp

The server never receives:

- Master password
- Vault key
- Plaintext vault data
- Plaintext password entries

## Future Improvements

- [ ] Support for hardware security keys (WebAuthn)
- [ ] Biometric unlock (with key wrapping)
- [ ] Key rotation mechanism
- [ ] Encrypted vault sharing (asymmetric encryption)
- [ ] Professional security audit

## References

- [Web Crypto API Specification](https://www.w3.org/TR/WebCryptoAPI/)
- [Argon2 RFC](https://datatracker.ietf.org/doc/html/rfc9106)
- [AES-GCM NIST Specification](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
