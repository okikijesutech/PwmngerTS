import { EncryptedPayload } from "./types";

export async function decryptData<T>(
  key: CryptoKey,
  payload: EncryptedPayload,
): Promise<T> {
  const iv = new Uint8Array(payload.iv);
  const data = new Uint8Array(payload.data);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data,
  );

  return JSON.parse(new TextDecoder().decode(decrypted)) as T;
}
