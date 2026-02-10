/**
 * Overwrites the contents of a Uint8Array with zeros.
 * This is used to clear sensitive data from memory as soon as it's no longer needed.
 */
export function wipe(buffer: Uint8Array): void {
  buffer.fill(0);
}

/**
 * Converts a string to a Uint8Array (UTF-8) for secure handling.
 */
export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}
