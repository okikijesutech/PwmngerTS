import { useState, useCallback } from "react";
import { 
  unlockVault, 
  getVault, 
  lockVault as lockVaultLogic, 
  isUnlocked as isUnlockedLogic,
  syncVaultWithCloud,
  createNewVault,
  addVaultEntry,
  deleteVaultEntry,
  updateVaultEntry,
  importVaultData,
  createFolder,
  deleteFolder,
  moveEntryToFolder,
  unlockVaultWithRecoveryKey,
  exportRecoveryData
} from "@pwmnger/app-logic";
import type { Vault } from "@pwmnger/vault";

export function useVault() {
  const [vault, setVault] = useState<Vault | null>(() => {
    if (isUnlockedLogic()) {
      return getVault();
    }
    return null;
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState("");

  const updateVaultState = useCallback(() => {
    if (isUnlockedLogic()) {
      const v = getVault();
      setVault({ ...v, entries: [...v.entries], folders: [...(v.folders || [])] });
    } else {
      setVault(null);
    }
  }, []);

  const unlock = async (password: string) => {
    setIsUnlocking(true);
    setError("");
    try {
      await unlockVault(password);
      updateVaultState();
    } catch (err: any) {
      setError(err.message || "Unlock failed");
      throw err;
    } finally {
      setIsUnlocking(false);
    }
  };

  const unlockWithRecovery = async (recoveryKeyHex: string, wrappedVaultKey: any) => {
    setIsUnlocking(true);
    setError("");
    try {
      await unlockVaultWithRecoveryKey(recoveryKeyHex, wrappedVaultKey);
      updateVaultState();
    } catch (err: any) {
      setError(err.message || "Recovery failed");
      throw err;
    } finally {
      setIsUnlocking(false);
    }
  };

  const lock = () => {
    lockVaultLogic();
    setVault(null);
  };

  const sync = async (token: string) => {
    setIsSyncing(true);
    try {
      await syncVaultWithCloud(token);
      updateVaultState();
    } finally {
      setIsSyncing(false);
    }
  };

  const create = async (password: string) => {
    await createNewVault(password);
    updateVaultState();
  };

  const addEntry = async (data: any) => {
    await addVaultEntry(data);
    updateVaultState();
  };

  const deleteEntry = async (id: string) => {
    await deleteVaultEntry(id);
    updateVaultState();
  };

  const updateEntry = async (id: string, data: any) => {
    await updateVaultEntry(id, data);
    updateVaultState();
  };

  const importData = async (json: string) => {
    await importVaultData(json);
    updateVaultState();
  };

  const createFolderAction = async (name: string) => {
    await createFolder(name);
    updateVaultState();
  };

  const deleteFolderAction = async (id: string) => {
    await deleteFolder(id);
    updateVaultState();
  };

  const moveEntry = async (entryId: string, folderId: string | null) => {
    await moveEntryToFolder(entryId, folderId);
    updateVaultState();
  };

  const downloadRecoveryKit = async () => {
    const kit = await exportRecoveryData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(kit, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "pwmnger_recovery_kit.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return {
    vault,
    isSyncing,
    isUnlocking,
    error,
    unlock,
    unlockWithRecovery,
    lock,
    sync,
    create,
    addEntry,
    deleteEntry,
    updateEntry,
    importData,
    createFolder: createFolderAction,
    deleteFolder: deleteFolderAction,
    moveEntry,
    downloadRecoveryKit,
    setError
  };
}
