export type VaultEntry = {
  id: string;
  site: string;
  username: string;
  password: string;
  notes?: string | undefined;
  folderId?: string | undefined; // Link to a folder
  lastModified: number;
};

export type Folder = {
  id: string;
  name: string;
};

export type Vault = {
  version: number;
  entries: VaultEntry[];
  folders: Folder[]; // List of available folders
  deletedEntryIds?: string[]; // Tombstones for entries
  deletedFolderIds?: string[]; // Tombstones for folders
  updatedAt: number;
};

import type { EncryptedPayload } from "@pwmnger/crypto";

export type EncryptedVault = {
  data: EncryptedPayload;
  salt: number[];
  updatedAt: number;
  version: number;
};
