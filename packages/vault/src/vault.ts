import { Vault } from "./types";

export function createEmptyVault(): Vault {
  return {
    version: 1,
    entries: [],
    updatedAt: Date.now(),
  };
}
