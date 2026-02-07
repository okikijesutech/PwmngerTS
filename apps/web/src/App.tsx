// Set the API URL for the appLogic package
(window as any).PW_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

import { useState, useEffect } from "react";
import {
  createNewVault,
  unlockVault,
  getVault,
  lockVault,
  isUnlocked,
  syncVaultWithCloud,
  checkVaultExists,
  registerAccount,
  loginAccount,
  addVaultEntry,
  deleteVaultEntry,
  updateVaultEntry,
} from "@pwmnger/app-logic";
import type { Vault } from "@pwmnger/vault";
import { Toast } from "@pwmnger/ui";
import { UnlockVault } from "./components/Vault/UnlockVault";
import { RegisterVault } from "./components/Vault/RegisterVault";
import { LoginForm } from "./components/Vault/LoginForm";
import { VaultDashboard } from "./components/Vault/VaultDashboard";

type ViewState = "LOADING" | "LOGIN" | "REGISTER" | "UNLOCK" | "DASHBOARD";

export default function App() {
  const [refresh, setRefresh] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuthAction, setIsAuthAction] = useState(false);
  const [vaultExists, setVaultExists] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [vault, setVault] = useState<Vault | null>(null);
  const [view, setView] = useState<ViewState>("LOADING");

  const updateVaultState = () => {
    if (isUnlocked()) {
      const v = getVault();
      setVault({ ...v, entries: [...v.entries], folders: [...(v.folders || [])] });
    } else {
      setVault(null);
    }
  };

  async function update2FAStatus() {
    const token = localStorage.getItem("pwmnger_token");
    if (token) {
      import("@pwmnger/app-logic").then(async ({ getAccountStatus }) => {
        try {
          const status = await getAccountStatus(token);
          setIs2FAEnabled(status.is2FAEnabled);
        } catch (e) {
          console.error("Failed to fetch 2FA status", e);
        }
      });
    }
  }

  useEffect(() => {
    async function init() {
      const exists = await checkVaultExists();
      setVaultExists(exists);
      if (isUnlocked()) {
        updateVaultState();
        update2FAStatus();
        setView("DASHBOARD");
      } else if (exists) {
        setView("UNLOCK");
      } else {
        setView("LOGIN");
      }
    }
    init();
  }, [refresh]);

  const token = localStorage.getItem("pwmnger_token");

  async function handleUnlock(password: string) {
    try {
      await unlockVault(password);
      setError("");
      updateVaultState();
      update2FAStatus();
      setView("DASHBOARD");
      setRefresh((prev) => prev + 1);
      setToast({ message: "Vault unlocked!", type: "success" });
    } catch (err: any) {
      setError(err.message || "Incorrect Master Password");
    }
  }

  async function handleLogin(
    email: string,
    password: string,
    twoFactorToken?: string,
  ) {
    setIsAuthAction(true);
    setError("");
    try {
      const jwt = await loginAccount(email, password, twoFactorToken);
      localStorage.setItem("pwmnger_token", jwt);
      setSession({ email });
      await syncVaultWithCloud(jwt);
      await unlockVault(password);
      updateVaultState();
      update2FAStatus();
      setView("DASHBOARD");
      setRefresh((prev) => prev + 1);
      setToast({ message: "Welcome back!", type: "success" });
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Login failed");
      if (err.requires2FA) throw err;
    } finally {
      setIsAuthAction(false);
    }
  }

  async function handleRegister(email: string, password: string) {
    setIsAuthAction(true);
    setError("");
    try {
      await registerAccount(email, password);
      await createNewVault(password);
      const jwt = await loginAccount(email, password);
      localStorage.setItem("pwmnger_token", jwt);
      await unlockVault(password);
      setSession({ email });
      updateVaultState();
      update2FAStatus();
      setRefresh((prev) => prev + 1);
      setView("DASHBOARD");
      setToast({
        message: "Account created and vault secured!",
        type: "success",
      });
    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setIsAuthAction(false);
    }
  }

  async function handleAddEntry(
    site: string,
    username: string,
    password: string,
    folderId?: string | null,
  ) {
    try {
      await addVaultEntry({
        site,
        username,
        password,
        ...(folderId ? { folderId: folderId } : {}),
      });
      updateVaultState();
      setToast({ message: "Entry added successfully", type: "success" });
    } catch (err) {
      console.error("Add Entry Error:", err);
      setToast({ message: "Failed to save entry to storage", type: "error" });
    }
  }

  async function handleImportVault(jsonString: string) {
    try {
      const { importVaultData } = await import("@pwmnger/app-logic");
      await importVaultData(jsonString);
      updateVaultState();
      setToast({ message: "Vault imported successfully!", type: "success" });
    } catch (err: any) {
      setToast({ message: "Import failed: " + err.message, type: "error" });
    }
  }

  async function handleCreateFolder(name: string) {
    try {
      const { createFolder } = await import("@pwmnger/app-logic");
      await createFolder(name);
      updateVaultState();
      setToast({ message: "Folder created", type: "success" });
    } catch (e: any) {
      setToast({ message: "Failed to create folder", type: "error" });
    }
  }

  async function handleDeleteFolder(id: string) {
    try {
      const { deleteFolder } = await import("@pwmnger/app-logic");
      await deleteFolder(id);
      updateVaultState();
      setToast({ message: "Folder deleted", type: "success" });
    } catch (e) {
      setToast({ message: "Failed to delete folder", type: "error" });
    }
  }

  async function handleMoveEntry(entryId: string, folderId: string | null) {
    try {
      const { moveEntryToFolder } = await import("@pwmnger/app-logic");
      await moveEntryToFolder(entryId, folderId);
      updateVaultState();
    } catch (e) {
      setToast({ message: "Failed to move entry", type: "error" });
    }
  }

  async function handleDeleteEntry(id: string) {
    try {
      await deleteVaultEntry(id);
      updateVaultState();
      setToast({ message: "Entry deleted", type: "success" });
    } catch (err) {
      console.error("Delete Entry Error:", err);
      setToast({
        message: "Failed to delete entry from storage",
        type: "error",
      });
    }
  }

  async function handleEditEntry(id: string, site: string, user: string, pass: string) {
    try {
      await updateVaultEntry(id, { site, username: user, password: pass });
      updateVaultState();
      setToast({ message: "Entry updated", type: "success" });
    } catch (err) {
      console.error("Edit Entry Error:", err);
      setToast({ message: "Failed to update entry", type: "error" });
    }
  }

  async function handleSync() {
    if (!token) {
      setToast({ message: "Please login to sync", type: "error" });
      return;
    }
    setIsSyncing(true);
    try {
      await syncVaultWithCloud(token);
      updateVaultState();
      setToast({ message: "Vault synced with cloud!", type: "success" });
    } catch (err: any) {
      console.error(err);
      setToast({ message: err.message || "Sync failed", type: "error" });
    } finally {
      setIsSyncing(false);
    }
  }

  const handleLock = () => {
    lockVault();
    updateVaultState();
    setRefresh((prev) => prev + 1);
  };

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        {view === "LOADING" && (
          <p style={{ textAlign: "center", padding: 40 }}>Loading...</p>
        )}

        {view === "LOGIN" && (
          <div style={{ maxWidth: 450, margin: "100px auto" }}>
            <LoginForm
              onLogin={handleLogin}
              onGoToRegister={() => setView("REGISTER")}
              error={error}
              loading={isAuthAction}
            />
          </div>
        )}

        {view === "REGISTER" && (
          <div style={{ maxWidth: 450, margin: "100px auto" }}>
            <RegisterVault
              onRegister={handleRegister}
              onGoToLogin={() => setView("LOGIN")}
              error={error}
              loading={isAuthAction}
            />
          </div>
        )}

        {view === "UNLOCK" && (
          <div style={{ maxWidth: 450, margin: "100px auto" }}>
            <UnlockVault onUnlock={handleUnlock} error={error} />
            <p style={{ textAlign: "center", marginTop: 20 }}>
              <span
                onClick={() => {
                  localStorage.clear();
                  setView("LOGIN");
                }}
                style={{ cursor: "pointer", color: "#666", fontSize: 13 }}
              >
                Switch Account / Reset
              </span>
            </p>
          </div>
        )}

        {view === "DASHBOARD" && vault && (
          <VaultDashboard
            vault={vault as Vault}
            onSync={handleSync}
            onLock={handleLock}
            onAddEntry={handleAddEntry}
            onDeleteEntry={handleDeleteEntry}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
            onMoveEntry={handleMoveEntry}
            onEditEntry={handleEditEntry}
            onImportVault={handleImportVault}
            onRefreshAccountStatus={update2FAStatus}
            isSyncing={isSyncing}
            is2FAEnabled={is2FAEnabled}
          />
        )}
      </div>

      {(view !== "DASHBOARD") && (
        <footer
          style={{
            marginTop: 40,
            textAlign: "center",
            color: "#777",
            fontSize: 13,
          }}
        >
          &copy; 2026 PwmngerTS &bull; Secure Zero-Knowledge Storage
        </footer>
      )}
    </div>
  );
}
