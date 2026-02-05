export type VaultEntry = {
  id: string;
  site: string;
  username: string;
  password: string;
  notes?: string;
  lastModified: number;
};

export type Vault = {
  version: number;
  entries: VaultEntry[];
  updatedAt: number;
};

import type { EncryptedPayload } from "@pwmnger/crypto";

export type EncryptedVault = {
  data: EncryptedPayload;
  salt: number[];
  updatedAt: number;
  version: number;
};
