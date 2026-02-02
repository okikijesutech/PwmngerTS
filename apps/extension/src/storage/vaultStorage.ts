import { EncryptedVault } from "@pwmnger/vault";

const VAULT_KEY = "pwmnger_vault";

export async function saveVault(vault: EncryptedVault): Promise<void> {
  await chrome.storage.local.set({ [VAULT_KEY]: vault });
}

function isEncryptedVault(value: unknown): value is EncryptedVault {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    "updatedAt" in value
  );
}

export async function loadVault(): Promise<EncryptedVault | null> {
  const result = await chrome.storage.local.get(VAULT_KEY);
  const vault = result[VAULT_KEY];

  if (isEncryptedVault(vault)) {
    return vault;
  }

  return null;
}

export async function clearVault(): Promise<void> {
  await chrome.storage.local.remove(VAULT_KEY);
}
