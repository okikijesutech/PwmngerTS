import { argon2id } from "hash-wasm";

export async function deriveMasterKey(password: string, salt: Uint8Array | ArrayBuffer) {
  const saltUint8 = salt instanceof Uint8Array ? salt : new Uint8Array(salt);

  const hash = await argon2id({
    password: password,
    salt: saltUint8,
    parallelism: 4,
    iterations: 3,
    memorySize: 65536, // 64MB
    hashLength: 32, // 256 bits
    outputType: "binary",
  });

  return crypto.subtle.importKey(
    "raw",
    hash as any,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}
