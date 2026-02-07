export {
  createNewVault,
  unlockVault,
  getVault,
  saveCurrentVault,
  lockVault,
  isUnlocked,
  syncVaultWithCloud,
  checkVaultExists,
  addVaultEntry,
  deleteVaultEntry,
  exportVaultData,
  importVaultData,
  createFolder,
  deleteFolder,
  moveEntryToFolder,
  exportRecoveryData,
  updateVaultEntry,
} from "./vaultManager";
export * from "./auth";
// Re-export specific 2FA functions if needed, spread update handles it if cleaner, but let's be explicit if needed.
// Actually `export * from "./auth"` covers it.
export * from "./health";
