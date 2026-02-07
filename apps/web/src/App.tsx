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
} from "@pwmnger/app-logic";
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
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [vaultExists, setVaultExists] = useState(false);
  // Track master email/password in memory only during session
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [view, setView] = useState<ViewState>("LOADING");

  useEffect(() => {
    async function init() {
      const exists = await checkVaultExists();
      setVaultExists(exists);
      if (exists) {
        setView("UNLOCK");
      } else {
        setView("LOGIN"); // Default to login, user can switch to register
      }
    }
    init();
  }, [refresh]);

  const token = localStorage.getItem("pwmnger_token");

  async function handleUnlock(password: string) {
    try {
      await unlockVault(password);
      setError("");
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
      // 1. Authenticate with backend to get token
      const jwt = await loginAccount(email, password, twoFactorToken);
      localStorage.setItem("pwmnger_token", jwt);
      setSession({ email });

      // 2. If local vault exists, we need to unlock it separately
      // In a real scenario, we might download the vault here if it doesn't exist locally
      if (vaultExists) {
        await unlockVault(password);
        setView("DASHBOARD");
        setToast({ message: "Welcome back!", type: "success" });
      } else {
        // IDK flow: Download and decrypt? For now, if no local vault, assume sync needed
        // But for this MVP let's just create a new one or sync
        await syncVaultWithCloud(jwt);
        setView("DASHBOARD");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Login failed");
      // Re-throw if it requires 2FA so LoginForm can catch it
      if (err.requires2FA) throw err;
    } finally {
      setIsAuthAction(false);
    }
  }

  async function handleRegister(email: string, password: string) {
    setIsAuthAction(true);
    setError("");
    try {
      console.log("App: Creating account...");
      await registerAccount(email, password);

      console.log("App: Creating local vault...");
      await createNewVault(password);

      console.log("App: Logging in...");
      const jwt = await loginAccount(email, password);
      localStorage.setItem("pwmnger_token", jwt);

      await unlockVault(password);
      setSession({ email });
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
  ) {
    try {
      await addVaultEntry({ site, username, password });
      setRefresh((prev) => prev + 1);
      setToast({ message: "Entry added successfully", type: "success" });
    } catch (err) {
      console.error("Add Entry Error:", err);
      setToast({ message: "Failed to save entry to storage", type: "error" });
    }
  }

  async function handleDeleteEntry(id: string) {
    try {
      await deleteVaultEntry(id);
      setRefresh((prev) => prev + 1);
      setToast({ message: "Entry deleted", type: "success" });
    } catch (err) {
      console.error("Delete Entry Error:", err);
      setToast({
        message: "Failed to delete entry from storage",
        type: "error",
      });
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
      setRefresh((prev) => prev + 1);
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
    setRefresh((prev) => prev + 1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main style={{ maxWidth: 900, margin: "auto" }}>
        {view === "LOADING" && (
          <p style={{ textAlign: "center" }}>Loading...</p>
        )}

        {view === "LOGIN" && (
          <div style={{ maxWidth: 450, margin: "auto" }}>
            <LoginForm
              onLogin={handleLogin}
              onGoToRegister={() => setView("REGISTER")}
              error={error}
              loading={isAuthAction}
            />
          </div>
        )}

        {view === "REGISTER" && (
          <div style={{ maxWidth: 450, margin: "auto" }}>
            <RegisterVault
              onRegister={handleRegister}
              onGoToLogin={() => setView("LOGIN")}
              error={error}
              loading={isAuthAction}
            />
          </div>
        )}

        {view === "UNLOCK" && (
          <div style={{ maxWidth: 450, margin: "auto" }}>
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

        {view === "DASHBOARD" && (
          <VaultDashboard
            vault={getVault()}
            onSync={handleSync}
            onLock={handleLock}
            onAddEntry={handleAddEntry}
            onDeleteEntry={handleDeleteEntry}
            isSyncing={isSyncing}
          />
        )}
      </main>

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
    </div>
  );
}
