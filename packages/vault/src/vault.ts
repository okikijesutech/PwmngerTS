import type { Vault } from "./types";

export function createEmptyVault(): Vault {
  return {
    version: 1,
    entries: [],
    folders: [],
    updatedAt: Date.now(),
  };
}
