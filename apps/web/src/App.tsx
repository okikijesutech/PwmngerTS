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
} from "@pwmnger/app-logic";
import { getPasswordStrength } from "./utils/passwordStrength";
import { copyWithAutoClear } from "./utils/clipboard";


export default function App() {
  const [passwordInput, setPasswordInput] = useState("");
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");
  const strength = getPasswordStrength(passwordInput);
  const strengthColor = {
    weak: "red",
    medium: "orange",
    strong: "green",
  };

  async function handleCreate() {
    try {
      await createNewVault(passwordInput);
      setPasswordInput("");
    } catch (e) {
      setError("Failed to create vault");
    }
  }

  async function handleUnlock() {
    try {
      await unlockVault(passwordInput);
      setPasswordInput("");
      setRefresh(refresh + 1);
    } catch {
      setError("Wrong password");
    }
  }

  function handleAddEntry() {
    try {
      const vault = getVault();
      vault.entries.push({
        id: crypto.randomUUID(),
        site,
        username,
        password: passwordInput,
        notes: "",
      });
      saveCurrentVault();
      setSite("");
      setUsername("");
      setPasswordInput("");
      setRefresh(refresh + 1);
    } catch (err) {
      console.error(err);
    }
  }

  function handleDelete(id: string) {
    const vault = getVault();
    vault.entries = vault.entries.filter((e) => e.id !== id);
    saveCurrentVault();
    setRefresh(refresh + 1);
  }

  if (!isUnlocked()) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Password Manager</h2>
        <input
          type='password'
          placeholder='Master password'
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <br />
        <button onClick={handleCreate}>Create Vault</button>
        <button onClick={handleUnlock}>Unlock Vault</button>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  const vault = getVault();

  return (
    <div style={{ padding: 20 }}>
      <h2>Vault</h2>
      <button
        onClick={() => {
          lockVault();
          setRefresh(refresh + 1);
        }}
      >
        Lock
      </button>

      <div style={{ marginTop: 20 }}>
        <h4>Add Entry</h4>
        <input
          type='text'
          placeholder='Site'
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='text'
          placeholder='Password'
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button onClick={handleAddEntry}>Add</button>
      </div>

      <p style={{ color: strengthColor[strength] }}>
        Strength: {strength.toUpperCase()}
      </p>

      <input
        type='text'
        placeholder='Search by site or user name'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {vault.entries
          .filter(
            (e) =>
              e.site.toLowerCase().includes(search.toLowerCase()) ||
              e.username.toLowerCase().includes(search.toLowerCase()),
          )
          .map((e) => (
            <li key={e.id}>
              {e.site} — {e.username} —
              {/* <button
                onClick={() => {
                  navigator.clipboard.writeText(e.password);
                  alert("Copied!");
                }}
              >
                Copy
              </button> */}
              <button
  onClick={() => copyWithAutoClear(e.password)}
>
  Copy
</button>

              <button
                onClick={() => {
                  const pass = window.confirm("Reveal password?");
                  if (pass) alert(`Password: ${e.password}`);
                }}
              >
                Reveal
              </button>
              <button onClick={() => handleDelete(e.id)}>Delete</button>
            </li>
          ))}
      </ul>
      <button
  onClick={async () => {
    const encrypted = await exportEncryptedVault();
    const blob = new Blob([JSON.stringify(encrypted)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "vault-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }}
>
  Export Vault
</button>
<input
  type="file"
  accept=".json"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    await importEncryptedVault(text);
    alert("Vault imported successfully");
  }}
/>

    </div>
  );
}
