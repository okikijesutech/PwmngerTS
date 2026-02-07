import {
  decryptData,
  encryptData,
  EncryptedPayload,
  deriveMasterKey,
} from "@pwmnger/crypto";
import { EncryptedVault, createEmptyVault } from "@pwmnger/vault";

export async function createEncryptedVault(
  masterPassword: string,
): Promise<EncryptedVault> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveMasterKey(masterPassword, salt);
  const emptyVault = createEmptyVault();
  const encryptedData = await encryptData(
    key,
    JSON.stringify(emptyVault.entries),
  );

  return {
    data: encryptedData,
    salt: Array.from(salt),
    updatedAt: Date.now(),
    version: 1,
  };
}

export async function decryptVault(
  vault: EncryptedVault,
  masterPassword: string,
): Promise<any> {
  try {
    const salt = new Uint8Array(vault.salt);
    const key = await deriveMasterKey(masterPassword, salt);
    const decryptedJson = await decryptData(key, vault.data);
    return JSON.parse(decryptedJson as string);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Invalid master password or corrupted data");
  }
}

export async function encryptVault(
  entries: any[],
  masterPassword: string,
  salt: Uint8Array,
): Promise<EncryptedVault> {
  const key = await deriveMasterKey(masterPassword, salt as any);
  const encryptedData = await encryptData(key, JSON.stringify(entries));

  return {
    data: encryptedData,
    salt: Array.from(salt),
    updatedAt: Date.now(),
    version: 1,
  };
}
