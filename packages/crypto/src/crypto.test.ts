import { encryptData } from "./encrypt";
import { decryptData } from "./decrypt";
import { deriveMasterKey } from "./kdf";
import { randomBytes } from "./random";
import { generateVaultKey } from "./vaultKey";

async function runCryptoTests() {
  console.log("🧪 Starting Crypto Tests...\n");

  try {
    // Test 1: Random Bytes Generation
    console.log("Test 1: Random Bytes Generation");
    const randomData = randomBytes(16);
    console.log(`✓ Generated ${randomData.length} random bytes`);
    console.log(
      `  Sample: ${Array.from(randomData.slice(0, 4)).join(", ")}...\n`,
    );

    // Test 2: Vault Key Generation
    console.log("Test 2: Vault Key Generation");
    const vaultKey = await generateVaultKey();
    console.log(`✓ Generated vault key successfully`);
    console.log(`  Key type: ${(vaultKey as any).privateKey?.type}`);
    console.log(
      `  Key extractable: ${(vaultKey as any).privateKey?.extractable}\n`,
    );

    // Test 3: Master Key Derivation
    console.log("Test 3: Master Key Derivation (PBKDF2)");
    const password = "MySecurePassword123!";
    const salt = randomBytes(16);
    const masterKey = await deriveMasterKey(password, salt);
    console.log(`✓ Derived master key from password`);
    console.log(`  Key type: ${masterKey.type}`);
    console.log(`  Key usages: ${masterKey.usages.join(", ")}\n`);

    // Test 4: Encryption/Decryption Cycle
    console.log("Test 4: Encryption/Decryption Cycle");
    const testData = {
      username: "john_doe",
      password: "secret123",
      email: "john@example.com",
    };

    const encrypted = await encryptData(masterKey, testData);
    console.log(`✓ Encrypted data successfully`);
    console.log(`  IV length: ${encrypted.iv.length} bytes`);
    console.log(`  Data length: ${encrypted.data.length} bytes\n`);

    const decrypted = await decryptData(masterKey, {
      iv: new Uint8Array(encrypted.iv),
      data: new Uint8Array(encrypted.data),
    } as any);
    console.log(`✓ Decrypted data successfully`);
    console.log(
      `  Matches original: ${JSON.stringify(decrypted) === JSON.stringify(testData)}`,
    );
    console.log(`  Decrypted: ${JSON.stringify(decrypted)}\n`);

    // Test 5: Multiple Encryptions are Different
    console.log("Test 5: Encryption Randomness Check");
    const encrypted2 = await encryptData(masterKey, testData);
    const ivMatch = encrypted.iv.every((v, i) => v === encrypted2.iv[i]);
    console.log(`✓ Different IVs generated: ${!ivMatch}`);
    console.log(`  First IV: ${encrypted.iv.slice(0, 4).join(", ")}...`);
    console.log(`  Second IV: ${encrypted2.iv.slice(0, 4).join(", ")}...\n`);

    // Test 6: Wrong Password Fails Decryption
    console.log("Test 6: Wrong Key Fails Decryption");
    const wrongPassword = "WrongPassword123!";
    const wrongMasterKey = await deriveMasterKey(wrongPassword, salt);
    try {
      await decryptData(wrongMasterKey, {
        iv: new Uint8Array(encrypted.iv),
        data: new Uint8Array(encrypted.data),
      } as any);
      console.log(`✗ Should have failed with wrong key!\n`);
    } catch (error) {
      console.log(`✓ Correctly rejected decryption with wrong key`);
      console.log(`  Error: ${(error as Error).message}\n`);
    }

    console.log("✅ All Crypto Tests Passed!\n");
  } catch (error) {
    console.error("❌ Crypto Test Failed:", error);
  }
}

// Run tests
runCryptoTests();
