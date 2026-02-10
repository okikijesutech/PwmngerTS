import {
  deriveMasterKey,
  decryptData,
  encryptData,
  generateVaultKey,
  wrapKey,
  unwrapKey,
  wipe,
  stringToUint8Array,
} from "@pwmnger/crypto";
import { createEmptyVault } from "@pwmnger/vault";
import { saveVault, loadVault, clearVault } from "@pwmnger/storage";

import type { Vault, VaultEntry, Folder } from "@pwmnger/vault";

let unlockedVault: Vault | null = null;
let vaultKey: CryptoKey | null = null;
let autoLockTimer: number | null = null;

export function isUnlocked(): boolean {
  return unlockedVault !== null;
}

export function getVault(): Vault {
  if (!unlockedVault) throw new Error("Vault is locked");
  // Sanitize on access to ensure UI doesn't crash on legacy or corrupted data
  return sanitizeVault(unlockedVault);
}

function sanitizeVault(vault: Vault): Vault {
  if (!vault.entries) vault.entries = [];
  
  // Filter out corrupted entries (those without site name or id)
  // and ensure folderId is either string or undefined (no null)
  vault.entries = vault.entries.filter(e => {
    return e && typeof e === 'object' && typeof e.site === 'string' && e.id;
  }).map(e => ({
    ...e,
    folderId: e.folderId === null ? undefined : e.folderId
  }));

  if (!vault.folders) vault.folders = [];
  vault.folders = vault.folders.filter(f => f && typeof f === 'object' && f.id && f.name);

  return vault;
}

export async function lockVault() {
  unlockedVault = null;
  vaultKey = null;
}

export async function checkVaultExists(): Promise<boolean> {
  const stored = await loadVault();
  return !!stored;
}

export async function resetLocalVault() {
  await clearVault();
  unlockedVault = null;
  vaultKey = null;
}

export async function createNewVault(masterPassword: string) {
  console.log("createNewVault: Starting...");
  const passwordBuffer = stringToUint8Array(masterPassword);
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    console.log("createNewVault: Salt generated, deriving master key...");
    const masterKey = await deriveMasterKey(passwordBuffer, salt);

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
  } finally {
    wipe(passwordBuffer);
  }
}

export function mergeVaults(local: Vault, remote: Vault): Vault {
  const mergedEntriesMap = new Map<string, VaultEntry>();
  
  // Combine tombstones (Unique union)
  const deletedEntryIds = Array.from(new Set([
    ...(local.deletedEntryIds || []),
    ...(remote.deletedEntryIds || [])
  ]));
  const deletedFolderIds = Array.from(new Set([
    ...(local.deletedFolderIds || []),
    ...(remote.deletedFolderIds || [])
  ]));

  const tombstoneEntries = new Set(deletedEntryIds);
  const tombstoneFolders = new Set(deletedFolderIds);

  // Add all local entries (unless in tombstones)
  local.entries.forEach((entry) => {
    if (!tombstoneEntries.has(entry.id)) {
      mergedEntriesMap.set(entry.id, entry);
    }
  });

  // Merge remote entries (unless in tombstones or older)
  remote.entries.forEach((remoteEntry) => {
    if (tombstoneEntries.has(remoteEntry.id)) return;
    
    const existingEntry = mergedEntriesMap.get(remoteEntry.id);
    if (
      !existingEntry ||
      remoteEntry.lastModified > existingEntry.lastModified
    ) {
      mergedEntriesMap.set(remoteEntry.id, remoteEntry);
    }
  });

  // Merge folders
  const mergedFoldersMap = new Map<string, Folder>();
  (local.folders || []).forEach(f => {
    if (!tombstoneFolders.has(f.id)) mergedFoldersMap.set(f.id, f);
  });
  (remote.folders || []).forEach(f => {
    if (!tombstoneFolders.has(f.id)) mergedFoldersMap.set(f.id, f);
  });

  return {
    ...local,
    entries: Array.from(mergedEntriesMap.values()),
    folders: Array.from(mergedFoldersMap.values()),
    deletedEntryIds,
    deletedFolderIds,
    updatedAt: Math.max(local.updatedAt, remote.updatedAt),
  };
}

export async function unlockVault(masterPassword: string) {
  console.log("unlockVault: Attempting to unlock locally...");
  const stored = await loadVault();
  if (!stored) {
    console.warn("unlockVault: No vault found in storage");
    throw new Error("No vault found (Not initialized)");
  }

  const salt = new Uint8Array(stored.salt);
  const passwordBuffer = stringToUint8Array(masterPassword);

  try {
    const masterKey = await deriveMasterKey(passwordBuffer, salt);

    // FIX: Use unwrapKey for CryptoKey instead of decryptData
    try {
      vaultKey = await unwrapKey(masterKey, stored.encryptedVaultKey);
    } catch (err) {
      console.error("Master key decryption error (Key mismatch):", err);
      throw new Error(
        "Invalid master password or incompatible vault data. Try clearing local cache if you are sure your password is correct.",
      );
    }

    if (!vaultKey) throw new Error("Failed to decrypt vault key");

    unlockedVault = await decryptData<Vault>(vaultKey, stored.encryptedVault);
    unlockedVault = sanitizeVault(unlockedVault);
    console.log("unlockVault: Successful.");
  } finally {
    wipe(passwordBuffer);
  }
}

export async function saveCurrentVault() {
  if (!vaultKey || !unlockedVault) {
    throw new Error("Vault is not unlocked (missing keys or vault data)");
  }

  try {
    unlockedVault.updatedAt = Date.now();
    const encryptedVault = await encryptData(vaultKey, unlockedVault);

    const stored = await loadVault();
    if (!stored) {
      throw new Error("Cannot save: No vault to update");
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
  // Integrity check
  if (!entry || typeof entry.site !== 'string' || !entry.site.trim()) {
    throw new Error("Invalid entry: Site name is required");
  }

  const vault = getVault();
  const newEntry: VaultEntry = {
    ...entry,
    id: crypto.randomUUID(),
    lastModified: Date.now(),
  };
  vault.entries.push(newEntry);
  vault.updatedAt = Date.now();
  await saveCurrentVault();
  return newEntry;
}

export async function deleteVaultEntry(id: string) {
  const vault = getVault();
  const originalEntries = [...vault.entries];
  const originalTombstones = [...(vault.deletedEntryIds || [])];

  vault.entries = vault.entries.filter((v) => v.id !== id);
  if (!vault.deletedEntryIds) vault.deletedEntryIds = [];
  if (!vault.deletedEntryIds.includes(id)) {
    vault.deletedEntryIds.push(id);
  }

  vault.updatedAt = Date.now();

  try {
    await saveCurrentVault();
  } catch (err) {
    vault.entries = originalEntries; // Rollback memory
    vault.deletedEntryIds = originalTombstones;
    throw err;
  }
}

export async function updateVaultEntry(
  id: string,
  updates: Partial<Omit<VaultEntry, "id" | "lastModified">>,
) {
  const vault = getVault();
  const entry = vault.entries.find((e) => e.id === id);
  if (!entry) throw new Error("Entry not found");

  Object.assign(entry, updates);
  entry.lastModified = Date.now();
  vault.updatedAt = Date.now();

  await saveCurrentVault();
  return entry;
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

  const originalFolders = [...vault.folders];
  const originalTombstones = [...(vault.deletedFolderIds || [])];

  // Remove folder
  vault.folders = vault.folders.filter((f) => f.id !== id);
  if (!vault.deletedFolderIds) vault.deletedFolderIds = [];
  if (!vault.deletedFolderIds.includes(id)) {
    vault.deletedFolderIds.push(id);
  }

  // Move entries in this folder back to root (null)
  vault.entries.forEach((e) => {
    if (e.folderId === id) e.folderId = undefined;
  });

  vault.updatedAt = Date.now();

  try {
    await saveCurrentVault();
  } catch (err) {
    vault.folders = originalFolders;
    vault.deletedFolderIds = originalTombstones;
    throw err;
  }
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
  if (typeof window === "undefined") return;
  autoLockTimer = window.setTimeout(() => {
    lockVault();
    console.log("Vault auto-locked due to inactivity");
  }, timeoutMs);
}

export function resetAutoLock() {
  if (autoLockTimer) clearTimeout(autoLockTimer);
  startAutoLock();
}

export async function exportEncryptedVault() {
  const stored = await loadVault();
  if (!stored) throw new Error("No vault found in storage");

  // We sync the entire stored object (salt, encryptedVault, encryptedVaultKey)
  // But we use the latest memory-state for the encryptedVault part if unlocked
  if (unlockedVault && vaultKey) {
    const latestEncryptedVault = await encryptData(vaultKey, unlockedVault);
    return {
      ...stored,
      encryptedVault: latestEncryptedVault,
      updatedAt: unlockedVault.updatedAt,
    };
  }

  return stored;
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

export async function importEncryptedVault(payload: any) {
  if (!payload || !payload.salt || !payload.encryptedVaultKey) {
    throw new Error("Invalid vault payload from cloud");
  }

  // If we are unlocked, we merge
  if (vaultKey && unlockedVault) {
    const remoteVault = await decryptData<Vault>(vaultKey, payload.encryptedVault);
    unlockedVault = mergeVaults(unlockedVault, remoteVault);
    await saveCurrentVault();
  } else {
    // If locked (e.g. fresh login), we just save the metadata to storage
    // so we can unlock it later with the password.
    await saveVault({
      salt: payload.salt,
      encryptedVault: payload.encryptedVault,
      encryptedVaultKey: payload.encryptedVaultKey,
      updatedAt: payload.updatedAt || Date.now(),
    });
  }
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

export async function unlockVaultWithRecoveryKey(
  recoveryKeyHex: string,
  wrappedVaultKey: any,
) {
  console.log("unlockVaultWithRecoveryKey: Attempting recovery...");
  const stored = await loadVault();
  if (!stored) throw new Error("No vault found in storage");

  // Decode hex recovery key
  const bytes = new Uint8Array(
    recoveryKeyHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );

  const recoveryKeyBits = await crypto.subtle.importKey(
    "raw",
    bytes,
    "AES-GCM",
    true,
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
  );

  try {
    vaultKey = await unwrapKey(recoveryKeyBits, wrappedVaultKey);
  } catch (err) {
    console.error("Recovery key decryption error:", err);
    throw new Error("This recovery kit does not match your vault. Please make sure you are using the latest kit generated for this account.");
  }

  if (!vaultKey) throw new Error("Failed to decrypt vault key");

  unlockedVault = await decryptData<Vault>(vaultKey, stored.encryptedVault);
  await saveCurrentVault();
  console.log("unlockVaultWithRecoveryKey: Successful.");
}

const BASE_URL = (globalThis as any).PW_API_URL || "http://localhost:4000";

export async function syncToCloud() {
  const encrypted = await exportEncryptedVault();

  const res = await fetch(`${BASE_URL}/vault/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vaultPayload: encrypted }),
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("Session expired. Please log in again to sync your vault.");
  }

  if (!res.ok) {
    throw new Error(`Cloud sync failed: ${res.statusText}`);
  }
}

export async function syncFromCloud() {
  const res = await fetch(`${BASE_URL}/vault/sync`, {
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("Session expired. Please log in again to sync your vault.");
  }

  if (!res.ok) {
     throw new Error(`Failed to fetch cloud data: ${res.statusText}`);
  }

  const data = await res.json();
  if (data.vaultPayload) {
    await importEncryptedVault(data.vaultPayload);
  }
}
export async function syncVaultWithCloud() {
  // 1. Pull latest from cloud
  await syncFromCloud();

  // 2. Push current (merged) local to cloud
  const encrypted = await exportEncryptedVault();

  const res = await fetch(`${BASE_URL}/vault/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vaultPayload: encrypted }),
    credentials: "include",
  });

  if (res.status === 409) {
    // Conflict handled by immediate retry pull
    await syncFromCloud();
    throw new Error(
      "Conflict detected and resolved from cloud. Please review your entries.",
    );
  }

  if (!res.ok) throw new Error("Sync failed");
}
