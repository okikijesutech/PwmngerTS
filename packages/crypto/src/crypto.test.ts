import { encryptData } from "./encrypt";
import { decryptData } from "./decrypt";
import { deriveMasterKey } from "./kdf";
import { randomBytes } from "./random";
import { generateVaultKey } from "./vaultKey";

describe("Crypto Package", () => {
  let masterKey: CryptoKey;
  let testData = {
    username: "john_doe",
    password: "secret123",
    email: "john@example.com",
  };
  let salt: Uint8Array;

  beforeAll(async () => {
    salt = randomBytes(16);
    masterKey = await deriveMasterKey("MySecurePassword123!", salt);
  });

  test("Test 1: Random Bytes Generation", () => {
    const randomData = randomBytes(16);
    expect(randomData.length).toBe(16);
    expect(randomData).toBeInstanceOf(Uint8Array);
  });

  test("Test 2: Vault Key Generation", async () => {
    const vaultKey = await generateVaultKey();
    expect(vaultKey).toBeDefined();
    expect((vaultKey as any).type).toBe("secret");
  });

  test("Test 3: Master Key Derivation (Argon2id)", async () => {
    expect(masterKey.type).toBe("secret");
    expect(masterKey.usages).toContain("encrypt");
    expect(masterKey.usages).toContain("decrypt");
  });

  test("Test 4: Encryption/Decryption Cycle", async () => {
    const encrypted = await encryptData(masterKey, testData);
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.data).toBeDefined();

    const decrypted = await decryptData(masterKey, {
      iv: new Uint8Array(encrypted.iv),
      data: new Uint8Array(encrypted.data),
    } as any);

    expect(decrypted).toEqual(testData);
  });

  test("Test 5: Encryption Randomness Check", async () => {
    const encrypted1 = await encryptData(masterKey, testData);
    const encrypted2 = await encryptData(masterKey, testData);
    
    const ivMatch = Array.from(encrypted1.iv).every((v, i) => v === encrypted2.iv[i]);
    expect(ivMatch).toBe(false);
  });

  test("Test 6: Wrong Key Fails Decryption", async () => {
    const encrypted = await encryptData(masterKey, testData);
    const wrongPassword = "WrongPassword123!";
    const wrongMasterKey = await deriveMasterKey(wrongPassword, salt);

    await expect(decryptData(wrongMasterKey, {
      iv: new Uint8Array(encrypted.iv),
      data: new Uint8Array(encrypted.data),
    } as any)).rejects.toThrow();
  });
});
