import { argon2id } from "hash-wasm";

export async function deriveMasterKey(
  password: string | Uint8Array,
  salt: Uint8Array | ArrayBuffer,
) {
  const saltUint8 = salt instanceof Uint8Array ? salt : new Uint8Array(salt);

  const hash = await argon2id({
    password: password,
    salt: saltUint8,
    parallelism: 4,
    iterations: 10,
    memorySize: 65536, // 64MB
    hashLength: 32, // 256 bits
    outputType: "binary",
  });

  return crypto.subtle.importKey(
    "raw",
    hash as any,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
  );
}

export async function deriveAuthHash(
  password: string | Uint8Array,
  saltString: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const salt = encoder.encode(saltString);

  const hash = await argon2id({
    password: password,
    salt: salt,
    parallelism: 4,
    iterations: 4, // different cost for auth vs master key
    memorySize: 16384, // 16MB
    hashLength: 32,
    outputType: "hex",
  });

  return hash;
}
