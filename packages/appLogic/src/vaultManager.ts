import { deriveMasterKey } from "@pwmnger/crypto";
import { decryptData, encryptData } from "@pwmnger/crypto";
import { generateVaultKey } from "@pwmnger/crypto";
import { createEmptyVault } from "@pwmnger/vault";
import { saveVault, loadVault } from "@pwmnger/storage";

import type { Vault } from "@pwmnger/vault";

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

export async function createNewVault(masterPassword: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const masterKey = await deriveMasterKey(masterPassword, salt);

  vaultKey = await generateVaultKey();
  unlockedVault = createEmptyVault();

  const encryptedVault = await encryptData(vaultKey, unlockedVault);
  const encryptedVaultKey = await encryptData(masterKey, vaultKey);

  await saveVault({
    salt: Array.from(salt),
    encryptedVault,
    encryptedVaultKey,
  });
}

export async function unlockVault(masterPassword: string) {
  const stored = await loadVault();
  if (!stored) throw new Error("No vault found");

  const salt = new Uint8Array(stored.salt);
  const masterKey = await deriveMasterKey(masterPassword, salt);

  vaultKey = await decryptData<CryptoKey>(masterKey, stored.encryptedVaultKey);
  if (!vaultKey) throw new Error("Failed to decrypt vault key");

  unlockedVault = await decryptData<Vault>(vaultKey, stored.encryptedVault);
}

export async function saveCurrentVault() {
  if (!vaultKey || !unlockedVault) {
    throw new Error("Vault is not unlocked");
  }

  unlockedVault.updatedAt = Date.now();
  const encryptedVault = await encryptData(vaultKey, unlockedVault);

  const stored = await loadVault();
  if (!stored) throw new Error("No vault to update");

  await saveVault({
    ...stored,
    encryptedVault,
  });
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

export async function importEncryptedVault(encryptedVault: any) {
  if (!vaultKey) {
    throw new Error("Vault is not unlocked");
  }
  unlockedVault = await decryptData<Vault>(vaultKey, encryptedVault);
  await saveCurrentVault();
}

export async function syncToCloud(token: string) {
  const encrypted = await exportEncryptedVault();

  await fetch("http://localhost:4000/vault/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ encryptedVault: encrypted }),
  });
}

export async function syncFromCloud(token: string) {
  const res = await fetch("http://localhost:4000/vault/sync", {
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

  const res = await fetch("http://localhost:4000/vault/sync", {
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
    throw new Error("Conflict detected and resolved from cloud. Please review your entries.");
  }
  
  if (!res.ok) throw new Error("Sync failed");
}
