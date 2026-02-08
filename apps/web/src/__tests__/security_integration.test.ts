import { describe, it, expect } from "vitest";
import { deriveMasterKey, encryptData, decryptData, generateVaultKey } from "@pwmnger/crypto";

describe("Security Core: Cryptographic Lifecycle", () => {
  const masterPassword = "correct-password-123";

  it("should derive a strong key from a password", async () => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveMasterKey(masterPassword, salt);
    expect(key).toBeDefined();
    expect(key.type).toBe("secret");
    expect((key.algorithm as any).name).toBe("AES-GCM");
  });

  it("should encrypt and decrypt data correctly", async () => {
    const vaultKey = await generateVaultKey();
    const sensitiveData = { secret: "my-password" };
    
    // 1. Encrypt
    const encrypted = await encryptData(vaultKey, sensitiveData);
    expect(encrypted.data).toBeDefined();
    expect(JSON.stringify(encrypted)).not.toContain("my-password");

    // 2. Decrypt
    const decrypted = await decryptData<any>(vaultKey, encrypted);
    expect(decrypted.secret).toBe("my-password");
  });

  it("should fail to decrypt with an incorrect key", async () => {
    const vaultKey1 = await generateVaultKey();
    const vaultKey2 = await generateVaultKey();
    const sensitiveData = { secret: "my-password" };
    
    const encrypted = await encryptData(vaultKey1, sensitiveData);
    
    // Attempt with wrong key
    await expect(decryptData(vaultKey2, encrypted))
      .rejects.toThrow();
  });
});
