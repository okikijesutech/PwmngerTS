import { decryptData, EncryptedPayload, deriveMasterKey } from "@pwmnger/crypto";
import { EncryptedVault } from "@pwmnger/vault";

export async function decryptVault(
  vault: EncryptedVault,
  masterPassword: string
): Promise<any> {
  try {
    const salt = new Uint8Array(vault.salt);
    const key = await deriveMasterKey(masterPassword, salt);
    const decryptedJson = await decryptData(key, vault.data);
    return JSON.parse(decryptedJson);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Invalid master password or corrupted data");
  }
}
