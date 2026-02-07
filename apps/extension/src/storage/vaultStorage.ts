import { StoredVault } from "@pwmnger/storage";

const VAULT_KEY = "pwmnger_vault";

export async function saveVault(vault: StoredVault): Promise<void> {
  await chrome.storage.local.set({ [VAULT_KEY]: vault });
}

function isStoredVault(value: unknown): value is StoredVault {
  return (
    typeof value === "object" &&
    value !== null &&
    "encryptedVault" in value &&
    "encryptedVaultKey" in value &&
    "salt" in value
  );
}

export async function loadVault(): Promise<StoredVault | null> {
  const result = await chrome.storage.local.get(VAULT_KEY);
  const vault = result[VAULT_KEY];

  if (isStoredVault(vault)) {
    return vault;
  }

  return null;
}

export async function clearVault(): Promise<void> {
  await chrome.storage.local.remove(VAULT_KEY);
}
