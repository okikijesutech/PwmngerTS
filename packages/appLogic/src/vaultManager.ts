import {
  deriveMasterKey,
  decryptData,
  encryptData,
  generateVaultKey,
  wrapKey,
  unwrapKey,
} from "@pwmnger/crypto";
import { createEmptyVault } from "@pwmnger/vault";
import { saveVault, loadVault } from "@pwmnger/storage";

import type { Vault, VaultEntry } from "@pwmnger/vault";

let unlockedVault: Vault | null = null;
let vaultKey: CryptoKey | null = null;
let autoLockTimer: number | null = null;

export function isUnlocked(): boolean {
  return unlockedVault !== null;
}

export function getVault(): Vault {
  if (!unlockedVault) throw new Error("Vault is locked");
  return unlockedVault;
}

export async function lockVault() {
  unlockedVault = null;
  vaultKey = null;
}

export async function checkVaultExists(): Promise<boolean> {
  const stored = await loadVault();
  return !!stored;
}

export async function createNewVault(masterPassword: string) {
  console.log("createNewVault: Starting...");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  console.log("createNewVault: Salt generated, deriving master key...");
  const masterKey = await deriveMasterKey(masterPassword, salt);

  console.log("createNewVault: Master key derived, generating vault key...");
  vaultKey = await generateVaultKey();
  unlockedVault = createEmptyVault();

  console.log("createNewVault: Encrypting initial vault...");
  const encryptedVault = await encryptData(vaultKey, unlockedVault);
  console.log("createNewVault: Wrapping vault key...");
  const encryptedVaultKey = await wrapKey(masterKey, vaultKey);

  await saveVault({
    salt: Array.from(salt),
    encryptedVault,
    encryptedVaultKey,
    updatedAt: Date.now(),
  });
  console.log("createNewVault: Finished.");
}

export function mergeVaults(local: Vault, remote: Vault): Vault {
  const mergedEntriesMap = new Map<string, VaultEntry>();

  // Add all local entries
  local.entries.forEach((entry) => mergedEntriesMap.set(entry.id, entry));

  // Merge remote entries
  remote.entries.forEach((remoteEntry) => {
    const existingEntry = mergedEntriesMap.get(remoteEntry.id);
    if (
      !existingEntry ||
      remoteEntry.lastModified > existingEntry.lastModified
    ) {
      mergedEntriesMap.set(remoteEntry.id, remoteEntry);
    }
  });

  return {
    ...local,
    entries: Array.from(mergedEntriesMap.values()),
    updatedAt: Math.max(local.updatedAt, remote.updatedAt),
  };
}

export async function unlockVault(masterPassword: string) {
  const stored = await loadVault();
  if (!stored) throw new Error("No vault found");

  const salt = new Uint8Array(stored.salt);
  const masterKey = await deriveMasterKey(masterPassword, salt);

  // FIX: Use unwrapKey for CryptoKey instead of decryptData
  try {
    vaultKey = await unwrapKey(masterKey, stored.encryptedVaultKey);
  } catch (err) {
    console.error("Master key decryption error:", err);
    throw new Error("Invalid master password or corrupted vault key");
  }

  if (!vaultKey) throw new Error("Failed to decrypt vault key");

  unlockedVault = await decryptData<Vault>(vaultKey, stored.encryptedVault);
}

export async function saveCurrentVault() {
  if (!vaultKey || !unlockedVault) {
    throw new Error("Vault is not unlocked");
  }

  try {
    unlockedVault.updatedAt = Date.now();
    const encryptedVault = await encryptData(vaultKey, unlockedVault);

    const stored = await loadVault();
    if (!stored) {
      console.error(
        "saveCurrentVault failed: No existing vault found in storage",
      );
      throw new Error("No vault to update");
    }

    await saveVault({
      ...stored,
      encryptedVault,
      updatedAt: unlockedVault.updatedAt,
    });
  } catch (err) {
    console.error("Critical error in saveCurrentVault:", err);
    throw err;
  }
}

export async function addVaultEntry(
  entry: Omit<VaultEntry, "id" | "lastModified">,
) {
  const vault = getVault();
  const newEntry: VaultEntry = {
    ...entry,
    id: crypto.randomUUID(),
    lastModified: Date.now(),
  };
  vault.entries.push(newEntry);
  await saveCurrentVault();
  return newEntry;
}

export async function deleteVaultEntry(id: string) {
  const vault = getVault();
  const originalEntries = [...vault.entries];
  vault.entries = vault.entries.filter((v) => v.id !== id);
  try {
    await saveCurrentVault();
  } catch (err) {
    vault.entries = originalEntries; // Rollback memory
    throw err;
  }
}

// --- Folder Management ---

export async function createFolder(name: string) {
  const vault = getVault();
  if (!vault.folders) vault.folders = []; // Initialize if missing (migration)

  const newFolder = {
    id: crypto.randomUUID(),
    name,
  };
  vault.folders.push(newFolder);
  await saveCurrentVault();
  return newFolder;
}

export async function deleteFolder(id: string) {
  const vault = getVault();
  if (!vault.folders) return;

  // Remove folder
  vault.folders = vault.folders.filter((f) => f.id !== id);

  // Move entries in this folder back to root (null)
  vault.entries.forEach((e) => {
    if (e.folderId === id) delete e.folderId;
  });

  await saveCurrentVault();
}

export async function moveEntryToFolder(
  entryId: string,
  folderId: string | null,
) {
  const vault = getVault();
  const entry = vault.entries.find((e) => e.id === entryId);
  if (!entry) throw new Error("Entry not found");

  if (folderId) {
    entry.folderId = folderId;
  } else {
    delete entry.folderId;
  }
  await saveCurrentVault();
}

export function startAutoLock(timeoutMs: number = 300000) {
  if (autoLockTimer) clearTimeout(autoLockTimer);
  autoLockTimer = window.setTimeout(() => {
    lockVault();
    alert("Vault auto-locked due to inactivity");
  }, timeoutMs);
}

export function resetAutoLock() {
  if (autoLockTimer) clearTimeout(autoLockTimer);
  startAutoLock();
}

export async function exportEncryptedVault() {
  if (!vaultKey || !unlockedVault) {
    throw new Error("Vault is not unlocked");
  }
  const encryptedVault = await encryptData(vaultKey, unlockedVault);
  return encryptedVault;
}

// Export decrypted vault as JSON (For user backup)
export async function exportVaultData(): Promise<string> {
  if (!unlockedVault) throw new Error("Vault must be unlocked to export data");

  // We export the Raw Vault structure
  // In a real app, we might want to sanitize or format this (e.g. CSV)
  return JSON.stringify(unlockedVault, null, 2);
}

// Import decrypted vault JSON
export async function importVaultData(jsonString: string) {
  if (!unlockedVault) throw new Error("Vault must be unlocked to import data");

  try {
    const importedVault = JSON.parse(jsonString) as Vault;

    // Basic validation
    if (!importedVault.entries || !Array.isArray(importedVault.entries)) {
      throw new Error("Invalid vault format: missing entries array");
    }

    // Merge strategy: Add non-duplicate IDs, or update if newer?
    // For simplicity v1: Merge, keeping local if conflict (or just simple merge)
    // Re-use mergeVaults logic
    const merged = mergeVaults(unlockedVault, importedVault);
    unlockedVault = merged;

    await saveCurrentVault();
  } catch (err) {
    console.error("Import failed:", err);
    throw new Error("Failed to import vault: Invalid JSON or corrupted data");
  }
}

export async function importEncryptedVault(encryptedVault: any) {
  if (!vaultKey) {
    throw new Error("Vault is not unlocked");
  }
  const remoteVault = await decryptData<Vault>(vaultKey, encryptedVault);
  unlockedVault = mergeVaults(getVault(), remoteVault);
  await saveCurrentVault();
}

export async function exportRecoveryData() {
  if (!vaultKey) throw new Error("Vault is locked");

  // Generate a random Recovery Key (32 bytes)
  const recoveryKeyBytes = crypto.getRandomValues(new Uint8Array(32));
  const recoveryKeyBits = await crypto.subtle.importKey(
    "raw",
    recoveryKeyBytes,
    "AES-GCM",
    true,
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
  );

  // Wrap the Vault Key with this Recovery Key
  // This allows us to regain access to the vault data (which is encrypted with Vault Key)
  // without needing the Master Password.
  const wrappedVaultKey = await wrapKey(recoveryKeyBits, vaultKey);

  // Convert recovery key to hex for user to save
  const recoveryKeyHex = Array.from(recoveryKeyBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return {
    recoveryKey: recoveryKeyHex,
    encryptedVaultKey: wrappedVaultKey, // This goes into the kit or the vault metadata
    // In this model, we'll put it in the kit for now to be stateless on server
  };
}

const BASE_URL = (globalThis as any).PW_API_URL || "http://localhost:4000";

export async function syncToCloud(token: string) {
  const encrypted = await exportEncryptedVault();

  await fetch(`${BASE_URL}/vault/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ encryptedVault: encrypted }),
  });
}

export async function syncFromCloud(token: string) {
  const res = await fetch(`${BASE_URL}/vault/sync`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { encryptedVault } = await res.json();
  if (encryptedVault) {
    await importEncryptedVault(encryptedVault);
  }
}
export async function syncVaultWithCloud(token: string) {
  // 1. Pull latest from cloud
  await syncFromCloud(token);

  // 2. Push current (merged) local to cloud
  const encrypted = await exportEncryptedVault();

  const res = await fetch(`${BASE_URL}/vault/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ encryptedVault: encrypted }),
  });

  if (res.status === 409) {
    // Conflict handled by immediate retry pull
    await syncFromCloud(token);
    throw new Error(
      "Conflict detected and resolved from cloud. Please review your entries.",
    );
  }

  if (!res.ok) throw new Error("Sync failed");
}
