import { deriveMasterKey } from "../../crypto/src/kdf";
import { decryptData, encryptData } from "../../crypto/src";
import { generateVaultKey } from "../../crypto/src/vaultKey";
import { createEmptyVault } from "../../vault/src/vault";
import { saveVault, loadVault } from "../../storage/src/indexedDb";

import type { Vault } from "../../vault/src/types";

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
