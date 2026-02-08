import type { Vault } from "./types";

export function createEmptyVault(): Vault {
  return {
    version: 1,
    entries: [],
    folders: [],
    deletedEntryIds: [],
    deletedFolderIds: [],
    updatedAt: Date.now(),
  };
}
