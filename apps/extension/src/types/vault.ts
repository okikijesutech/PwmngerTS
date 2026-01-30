export interface VaultEntry {
  id: string;
  site: string;
  username: string;
  password: string; // decrypted in-memory only
}

export interface EncryptedVault {
  data: string; // encrypted base64
  updatedAt: number;
}
