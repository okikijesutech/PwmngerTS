export type VaultEntry = {
  id: string;
  site: string;
  username: string;
  password: string;
  notes?: string;
};

export type Vault = {
  version: number;
  entries: VaultEntry[];
  updatedAt: number;
};
