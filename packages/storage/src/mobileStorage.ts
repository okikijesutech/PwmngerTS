import type { StoredVault, VaultStorage } from "./types";

// Note: SecureStore is typically used via expo-secure-store
// This is a placeholder that would be injected or chosen at runtime
export class MobileStorage implements VaultStorage {
  async saveVault(data: StoredVault): Promise<void> {
    // In a real mobile app, this would use expo-secure-store or react-native-mmkv
    console.log("MobileStorage: Saving vault (Mock)");
    // Placeholder: globalThis.localStorage for dev/expo-web
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('pwmnger-vault', JSON.stringify(data));
    }
  }

  async loadVault(): Promise<StoredVault | null> {
    console.log("MobileStorage: Loading vault (Mock)");
    if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem('pwmnger-vault');
        return data ? JSON.parse(data) : null;
    }
    return null;
  }
}
