import { encryptData } from "../../crypto/src/encrypt";
import { decryptData } from "../../crypto/src/decrypt";
import { deriveMasterKey } from "../../crypto/src/kdf";
import { randomBytes } from "../../crypto/src/random";
import { createEmptyVault } from "./vault";
import type { VaultEntry, Vault } from "./types";

describe("Integration Tests (Crypto + Vault)", () => {
  let masterKey: CryptoKey;
  let vault: Vault;
  const password = "MasterPassword123!";
  let salt: Uint8Array;

  beforeAll(async () => {
    salt = randomBytes(16);
    masterKey = await deriveMasterKey(password, salt);
  });

  beforeEach(() => {
    vault = createEmptyVault();
  });

  test("Test 1 & 2: Encrypt Vault Data", async () => {
    vault.entries.push({
      id: "bank-1",
      site: "bank.example.com",
      username: "user@example.com",
      password: "SecurePin1234!",
    });

    const encryptedVault = await encryptData(masterKey, vault);
    expect(encryptedVault.iv).toBeDefined();
    expect(encryptedVault.data).toBeDefined();

    const decryptedVault = (await decryptData(masterKey, {
      iv: new Uint8Array(encryptedVault.iv),
      data: new Uint8Array(encryptedVault.data),
    } as any)) as Vault;

    expect(decryptedVault.entries.length).toBe(1);
    expect(decryptedVault.entries[0].site).toBe("bank.example.com");
  });

  test("Test 6: Access Control - Wrong Password", async () => {
    const encryptedVault = await encryptData(masterKey, vault);
    const wrongPassword = "WrongPassword123!";
    const wrongKey = await deriveMasterKey(wrongPassword, salt);

    await expect(decryptData(wrongKey, {
      iv: new Uint8Array(encryptedVault.iv),
      data: new Uint8Array(encryptedVault.data),
    } as any)).rejects.toThrow();
  });

  test("Test 7: Large Dataset Processing", async () => {
    const largeVault = createEmptyVault();
    for (let i = 0; i < 50; i++) {
      largeVault.entries.push({
        id: `entry-${i}`,
        site: `site-${i}.com`,
        username: `user-${i}`,
        password: `pass-${i}`,
      });
    }

    const encrypted = await encryptData(masterKey, largeVault);
    const decrypted = await decryptData(masterKey, {
      iv: new Uint8Array(encrypted.iv),
      data: new Uint8Array(encrypted.data),
    } as any) as Vault;

    expect(decrypted.entries.length).toBe(50);
  });
});
