import type { EncryptedPayload } from "./types";

/**
 * Wraps (encrypts) a CryptoKey using another CryptoKey.
 * Useful for securing a vault key with a master key.
 */
export async function wrapKey(
  wrappingKey: CryptoKey,
  keyToWrap: CryptoKey,
): Promise<EncryptedPayload> {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const wrappedKeyBuffer = await crypto.subtle.wrapKey(
    "raw",
    keyToWrap,
    wrappingKey,
    { name: "AES-GCM", iv },
  );

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(wrappedKeyBuffer)),
  };
}

/**
 * Unwraps (decrypts) a CryptoKey using another CryptoKey.
 */
export async function unwrapKey(
  unwrappingKey: CryptoKey,
  wrappedPayload: EncryptedPayload,
  unwrappedKeyAlgorithm: any = { name: "AES-GCM", length: 256 },
  keyUsages: KeyUsage[] = ["encrypt", "decrypt"],
): Promise<CryptoKey> {
  const iv = new Uint8Array(wrappedPayload.iv);
  const data = new Uint8Array(wrappedPayload.data);

  return crypto.subtle.unwrapKey(
    "raw",
    data,
    unwrappingKey,
    { name: "AES-GCM", iv },
    unwrappedKeyAlgorithm,
    true, // extractable
    keyUsages,
  );
}
