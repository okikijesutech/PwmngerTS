import type { EncryptedPayload } from "@pwmnger/crypto";

export type StoredVault = {
  salt: number[];
  encryptedVault: EncryptedPayload;
  encryptedVaultKey: EncryptedPayload;
  updatedAt: number;
};

export interface VaultStorage {
  saveVault(data: StoredVault): Promise<void>;
  loadVault(): Promise<StoredVault | null>;
  saveAuthToken(token: string): Promise<void>;
  loadAuthToken(): Promise<string | null>;
  clearVault(): Promise<void>;
  clearAuthToken(): Promise<void>;
}
