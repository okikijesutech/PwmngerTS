import { argon2id } from "hash-wasm";

export async function deriveMasterKey(password: string, salt: BufferSource) {
  const saltUint8 = new Uint8Array(
    salt instanceof ArrayBuffer ? salt : (salt as ArrayBufferView).buffer,
  );

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
