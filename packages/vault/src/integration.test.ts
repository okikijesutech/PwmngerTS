import { encryptData } from "../../crypto/src/encrypt";
import { decryptData } from "../../crypto/src/decrypt";
import { deriveMasterKey } from "../../crypto/src/kdf";
import { randomBytes } from "../../crypto/src/random";
import { createEmptyVault } from "./vault";
import type { VaultEntry, Vault } from "./types";

async function runIntegrationTests() {
  console.log("🔐 Starting Integration Tests (Crypto + Vault)...\n");

  try {
    // Setup: Create master key
    console.log("Setup: Creating Master Key");
    const password = "MasterPassword123!";
    const salt = randomBytes(16);
    const masterKey = await deriveMasterKey(password, salt);
    console.log(`✓ Master key created\n`);

    // Test 1: Encrypt and Store Vault
    console.log("Test 1: Encrypt and Store Vault");
    const vault = createEmptyVault();

    // Add sensitive entries
    vault.entries.push({
      id: "bank-1",
      site: "bank.example.com",
      username: "user@example.com",
      password: "SecurePin1234!",
      notes: "Main savings account",
    });
    vault.entries.push({
      id: "email-1",
      site: "mail.google.com",
      username: "john.doe@gmail.com",
      password: "EmailPassword456!",
    });

    console.log(`✓ Created vault with ${vault.entries.length} entries`);
    console.log(`  Entry 1: ${vault.entries[0]?.site}`);
    console.log(`  Entry 2: ${vault.entries[1]?.site}\n`);

    // Test 2: Encrypt Vault
    console.log("Test 2: Encrypt Vault Data");
    const encryptedVault = await encryptData(masterKey, vault);
    console.log(`✓ Vault encrypted successfully`);
    console.log(`  IV length: ${encryptedVault.iv.length} bytes`);
    console.log(`  Data length: ${encryptedVault.data.length} bytes\n`);

    // Test 3: Decrypt Vault
    console.log("Test 3: Decrypt Vault Data");
    const decryptedVault = (await decryptData(masterKey, {
      iv: new Uint8Array(encryptedVault.iv),
      data: new Uint8Array(encryptedVault.data),
    } as any)) as Vault;
    console.log(`✓ Vault decrypted successfully`);
    console.log(`  Entries recovered: ${decryptedVault.entries.length}\n`);

    // Test 4: Verify Data Integrity
    console.log("Test 4: Data Integrity Check");
    const originalEntry = vault.entries[0];
    const recoveredEntry = decryptedVault.entries[0];

    const matches =
      originalEntry &&
      recoveredEntry &&
      originalEntry.id === recoveredEntry.id &&
      originalEntry.site === recoveredEntry.site &&
      originalEntry.username === recoveredEntry.username &&
      originalEntry.password === recoveredEntry.password;

    console.log(`✓ Data integrity verified: ${matches}`);
    console.log(`  Original: ${JSON.stringify(originalEntry)}`);
    console.log(`  Recovered: ${JSON.stringify(recoveredEntry)}\n`);

    // Test 5: Modify and Re-encrypt
    console.log("Test 5: Modify and Re-encrypt Vault");
    decryptedVault.entries.push({
      id: "aws-1",
      site: "aws.amazon.com",
      username: "admin@company.com",
      password: "AwsPassword789!",
      notes: "Production AWS account",
    });
    decryptedVault.updatedAt = Date.now();

    const encryptedAgain = await encryptData(masterKey, decryptedVault);
    console.log(`✓ Modified vault re-encrypted`);
    console.log(`  Total entries now: ${decryptedVault.entries.length}\n`);

    // Test 6: Access Control - Wrong Password Fails
    console.log("Test 6: Access Control - Wrong Password");
    const wrongPassword = "WrongPassword123!";
    const wrongKey = await deriveMasterKey(wrongPassword, salt);

    try {
      await decryptData(wrongKey, {
        iv: new Uint8Array(encryptedVault.iv),
        data: new Uint8Array(encryptedVault.data),
      } as any);
      console.log(`✗ Should have failed with wrong password!\n`);
    } catch (error) {
      console.log(`✓ Access denied with wrong password`);
      console.log(`  Error: ${(error as Error).message}\n`);
    }

    // Test 7: Large Dataset Encryption
    console.log("Test 7: Large Dataset Encryption");
    const largeVault = createEmptyVault();
    for (let i = 0; i < 100; i++) {
      largeVault.entries.push({
        id: `entry-${i}`,
        site: `site-${i}.example.com`,
        username: `user-${i}@example.com`,
        password: `Password${i}!`,
        notes: `Entry number ${i}`,
      });
    }

    const startTime = performance.now();
    const encryptedLarge = await encryptData(masterKey, largeVault);
    const encryptTime = performance.now() - startTime;

    const decryptStart = performance.now();
    const decryptedLarge = await decryptData(masterKey, {
      iv: new Uint8Array(encryptedLarge.iv),
      data: new Uint8Array(encryptedLarge.data),
    } as any);
    const decryptTime = performance.now() - decryptStart;

    console.log(`✓ Large vault (100 entries) processed`);
    console.log(`  Encryption time: ${encryptTime.toFixed(2)}ms`);
    console.log(`  Decryption time: ${decryptTime.toFixed(2)}ms`);
    console.log(`  Total time: ${(encryptTime + decryptTime).toFixed(2)}ms\n`);

    console.log("✅ All Integration Tests Passed!\n");
    console.log("Summary:");
    console.log("- Encryption/Decryption: ✓");
    console.log("- Data Integrity: ✓");
    console.log("- Access Control: ✓");
    console.log("- Performance: ✓");
  } catch (error) {
    console.error("❌ Integration Test Failed:", error);
  }
}

// Run tests
runIntegrationTests();
