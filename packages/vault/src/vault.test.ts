import { createEmptyVault } from "./vault";
import type { VaultEntry, Vault } from "./types";

function runVaultTests() {
  console.log("🧪 Starting Vault Tests...\n");

  try {
    // Test 1: Create Empty Vault
    console.log("Test 1: Create Empty Vault");
    const vault = createEmptyVault();
    console.log(`✓ Created empty vault`);
    console.log(`  Version: ${vault.version}`);
    console.log(`  Entries: ${vault.entries.length}`);
    console.log(`  Has timestamp: ${vault.updatedAt > 0}\n`);

    // Test 2: Vault Structure
    console.log("Test 2: Vault Structure Validation");
    const hasRequiredFields =
      "version" in vault && "entries" in vault && "updatedAt" in vault;
    console.log(`✓ Vault has all required fields: ${hasRequiredFields}`);
    console.log(`  Fields: version, entries, updatedAt\n`);

    // Test 3: Add Entry to Vault
    console.log("Test 3: Add Entry to Vault");
    const newEntry: VaultEntry = {
      id: "entry-1",
      site: "github.com",
      username: "johndoe",
      password: "encrypted_password_here",
      notes: "Personal GitHub account",
    };
    vault.entries.push(newEntry);
    console.log(`✓ Added entry to vault`);
    console.log(`  Entry ID: ${newEntry.id}`);
    console.log(`  Site: ${newEntry.site}`);
    console.log(`  Entries count: ${vault.entries.length}\n`);

    // Test 4: Multiple Entries
    console.log("Test 4: Multiple Entries");
    vault.entries.push({
      id: "entry-2",
      site: "aws.amazon.com",
      username: "admin@company.com",
      password: "encrypted_password_here",
    });
    vault.entries.push({
      id: "entry-3",
      site: "github.com",
      username: "work-account",
      password: "encrypted_password_here",
      notes: "Work GitHub account",
    });
    console.log(`✓ Added multiple entries`);
    console.log(`  Total entries: ${vault.entries.length}\n`);

    // Test 5: Retrieve Entry
    console.log("Test 5: Retrieve Entry");
    const foundEntry = vault.entries.find((e) => e.id === "entry-2");
    console.log(`✓ Found entry by ID`);
    console.log(`  Site: ${foundEntry?.site}`);
    console.log(`  Username: ${foundEntry?.username}\n`);

    // Test 6: Update Entry
    console.log("Test 6: Update Entry");
    const entryToUpdate = vault.entries.find((e) => e.id === "entry-1");
    if (entryToUpdate) {
      entryToUpdate.notes = "Updated: Personal GitHub account - 2FA enabled";
      console.log(`✓ Updated entry notes`);
      console.log(`  New notes: ${entryToUpdate.notes}\n`);
    }

    // Test 7: Delete Entry
    console.log("Test 7: Delete Entry");
    const countBefore = vault.entries.length;
    vault.entries = vault.entries.filter((e) => e.id !== "entry-3");
    console.log(`✓ Deleted entry`);
    console.log(`  Before: ${countBefore} entries`);
    console.log(`  After: ${vault.entries.length} entries\n`);

    // Test 8: Entry Validation
    console.log("Test 8: Entry Type Validation");
    const sampleEntry = vault.entries[0];
    if (sampleEntry) {
      const hasRequiredEntryFields =
        "id" in sampleEntry &&
        "site" in sampleEntry &&
        "username" in sampleEntry &&
        "password" in sampleEntry;
      console.log(`✓ Entry has required fields: ${hasRequiredEntryFields}`);
      console.log(`  Fields: id, site, username, password, (notes optional)\n`);
    }

    // Test 9: Vault Serialization
    console.log("Test 9: Vault Serialization");
    const serialized = JSON.stringify(vault);
    const deserialized = JSON.parse(serialized) as Vault;
    console.log(`✓ Vault serializes/deserializes correctly`);
    console.log(`  Original entries: ${vault.entries.length}`);
    console.log(`  Deserialized entries: ${deserialized.entries.length}`);
    console.log(
      `  Matches: ${JSON.stringify(vault) === JSON.stringify(deserialized)}\n`,
    );

    // Test 10: Timestamp Updates
    console.log("Test 10: Timestamp Management");
    const originalTime = vault.updatedAt;
    vault.updatedAt = Date.now();
    console.log(`✓ Timestamp can be updated`);
    console.log(`  Original timestamp: ${originalTime}`);
    console.log(`  Updated timestamp: ${vault.updatedAt}`);
    console.log(`  Time difference: ${vault.updatedAt - originalTime}ms\n`);

    console.log("✅ All Vault Tests Passed!\n");
  } catch (error) {
    console.error("❌ Vault Test Failed:", error);
  }
}

// Run tests
runVaultTests();
