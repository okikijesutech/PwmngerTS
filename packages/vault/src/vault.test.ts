import { createEmptyVault } from "./vault";
import type { VaultEntry, Vault } from "./types";

describe("Vault Package", () => {
  let vault: Vault;

  beforeEach(() => {
    vault = createEmptyVault();
  });

  test("Test 1: Create Empty Vault", () => {
    expect(vault.version).toBe(1);
    expect(vault.entries.length).toBe(0);
    expect(vault.updatedAt).toBeGreaterThan(0);
  });

  test("Test 2: Vault Structure Validation", () => {
    expect(vault).toHaveProperty("version");
    expect(vault).toHaveProperty("entries");
    expect(vault).toHaveProperty("updatedAt");
  });

  test("Test 3: Add Entry to Vault", () => {
    const newEntry: VaultEntry = {
      id: "entry-1",
      site: "github.com",
      username: "johndoe",
      password: "encrypted_password_here",
      notes: "Personal GitHub account",
      lastModified: Date.now(),
    };
    vault.entries.push(newEntry);
    expect(vault.entries.length).toBe(1);
    expect(vault.entries[0].id).toBe("entry-1");
  });

  test("Test 5: Retrieve Entry", () => {
    const entry1: VaultEntry = {
      id: "entry-1",
      site: "s1",
      username: "u1",
      password: "p1",
      lastModified: Date.now(),
    };
    const entry2: VaultEntry = {
      id: "entry-2",
      site: "s2",
      username: "u2",
      password: "p2",
      lastModified: Date.now(),
    };
    vault.entries.push(entry1, entry2);

    const foundEntry = vault.entries.find((e) => e.id === "entry-2");
    expect(foundEntry).toBeDefined();
    expect(foundEntry?.site).toBe("s2");
  });

  test("Test 7: Delete Entry", () => {
    vault.entries.push({
      id: "entry-1",
      site: "s1",
      username: "u1",
      password: "p1",
      lastModified: Date.now(),
    });
    vault.entries = vault.entries.filter((e) => e.id !== "entry-1");
    expect(vault.entries.length).toBe(0);
  });

  test("Test 9: Vault Serialization", () => {
    vault.entries.push({
      id: "entry-1",
      site: "s1",
      username: "u1",
      password: "p1",
      lastModified: Date.now(),
    });
    const serialized = JSON.stringify(vault);
    const deserialized = JSON.parse(serialized) as Vault;
    expect(deserialized.entries.length).toBe(1);
    expect(deserialized.entries[0].site).toBe("s1");
  });
});
