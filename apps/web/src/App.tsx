import { useState } from "react";
import {
  createNewVault,
  unlockVault,
  getVault,
  saveCurrentVault,
  lockVault,
  isUnlocked,
  exportEncryptedVault,
  importEncryptedVault,
  syncVaultWithCloud,
} from "@pwmnger/app-logic";
import { Button, Input, Card, Toast } from "@pwmnger/ui";
import { getPasswordStrength } from "./utils/passwordStrength";
import { copyWithAutoClear } from "./utils/clipboard";

export default function App() {
  const [passwordInput, setPasswordInput] = useState("");
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const token = localStorage.getItem("pwmnger_token") || "mock-token";
  const strength = getPasswordStrength(passwordInput);

  async function handleUnlock() {
    try {
      await unlockVault(passwordInput);
      setPasswordInput("");
      setRefresh(refresh + 1);
      setToast({ message: "Vault unlocked!", type: "success" });
    } catch {
      setError("Wrong password");
    }
  }

  async function handleAddEntry() {
    try {
      const vault = getVault();
      vault.entries.push({
        id: crypto.randomUUID(),
        site,
        username,
        password: passwordInput,
        notes: "",
      });
      await saveCurrentVault();
      setSite("");
      setUsername("");
      setPasswordInput("");
      setRefresh(refresh + 1);
      setToast({ message: "Entry added", type: "success" });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSync() {
    setIsSyncing(true);
    try {
      await syncVaultWithCloud(token);
      setRefresh(refresh + 1);
      setToast({ message: "Vault synced with cloud!", type: "success" });
    } catch (err: any) {
      console.error(err);
      setToast({ message: err.message || "Sync failed", type: "error" });
    } finally {
      setIsSyncing(false);
    }
  }

  if (!isUnlocked()) {
    return (
      <div style={{ padding: 40, maxWidth: 450, margin: "auto", fontFamily: "Inter, sans-serif" }}>
        <Card title="PwmngerTS Unlock">
          <Input
            type='password'
            placeholder='Master password'
            label="Master Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
            <Button onClick={handleUnlock} style={{ width: "100%" }}>Unlock Vault</Button>
          </div>
          {error && <p style={{ color: "#ff4d4f", textAlign: "center", marginTop: 16 }}>{error}</p>}
        </Card>
      </div>
    );
  }

  const vault = getVault();

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "auto", fontFamily: "Inter, sans-serif" }}>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 style={{ margin: 0, color: "#1890ff" }}>PwmngerTS Vault</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Button onClick={handleSync} variant="secondary" disabled={isSyncing}>
            {isSyncing ? "Syncing..." : "Sync Cloud"}
          </Button>
          <Button variant="danger" onClick={() => { lockVault(); setRefresh(refresh + 1); }}>
            Lock Vault
          </Button>
        </div>
      </div>

      <Card title="Add New Credential" style={{ marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 16, alignItems: "end" }}>
          <Input
            placeholder='Site'
            label="Website URL"
            value={site}
            onChange={(e) => setSite(e.target.value)}
          />
          <Input
            placeholder='Username'
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder='Password'
            label={`Password (${strength})`}
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <Button onClick={handleAddEntry} style={{ marginBottom: 16 }}>Add</Button>
        </div>
      </Card>

      <Input
        placeholder='Search vault...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 32 }}
      />

      <div style={{ display: "grid", gap: 16 }}>
        {vault.entries
          .filter(e => e.site.toLowerCase().includes(search.toLowerCase()) || e.username.toLowerCase().includes(search.toLowerCase()))
          .map(e => (
            <div key={e.id} style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "16px 24px",
              backgroundColor: "white",
              borderRadius: 8,
              border: "1px solid #f0f0f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "16px" }}>{e.site}</div>
                <div style={{ color: "#8c8c8c", fontSize: "14px" }}>{e.username}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="secondary" onClick={() => { copyWithAutoClear(e.password); setToast({ message: "Copied!", type: "success" }); }}>Copy</Button>
                <Button variant="danger" onClick={() => {
                  const vault = getVault();
                  vault.entries = vault.entries.filter(v => v.id !== e.id);
                  saveCurrentVault();
                  setRefresh(refresh + 1);
                  setToast({ message: "Entry deleted", type: "success" });
                }}>Delete</Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
