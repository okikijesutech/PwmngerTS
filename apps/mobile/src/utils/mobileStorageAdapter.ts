import * as SecureStore from 'expo-secure-store';
import { VaultStorage, StoredVault } from '@pwmnger/storage';

const VAULT_KEY = 'pwmnger_vault';
const TOKEN_KEY = 'pwmnger_token';

export const mobileStorage: VaultStorage = {
  async saveVault(data: StoredVault): Promise<void> {
    await SecureStore.setItemAsync(VAULT_KEY, JSON.stringify(data));
  },

  async loadVault(): Promise<StoredVault | null> {
    const json = await SecureStore.getItemAsync(VAULT_KEY);
    return json ? JSON.parse(json) : null;
  },

  async saveAuthToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async loadAuthToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async clearVault(): Promise<void> {
    await SecureStore.deleteItemAsync(VAULT_KEY);
  },

  async clearAuthToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};
