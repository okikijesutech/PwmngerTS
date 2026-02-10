import type { StoredVault, VaultStorage } from "./types";
import * as webStorage from "./indexedDb";

// Default to Web Storage (IndexedDB/Chrome Storage)
let currentStorage: VaultStorage = webStorage;

export const setStorageBackend = (backend: VaultStorage) => {
  console.log("Storage Backend Switched");
  currentStorage = backend;
};

export const saveVault = (data: StoredVault) => currentStorage.saveVault(data);
export const loadVault = () => currentStorage.loadVault();
export const saveAuthToken = (token: string) => currentStorage.saveAuthToken(token);
export const loadAuthToken = () => currentStorage.loadAuthToken();
export const clearVault = () => currentStorage.clearVault();
export const clearAuthToken = () => currentStorage.clearAuthToken();

export * from "./types";
// We don't export * from "./indexedDb" to avoid naming conflicts, 
// seeing as we are re-exporting the same function names as delegates.
