import { useState } from "react";
import {
  createNewVault,
  unlockVault,
  getVault,
  saveCurrentVault,
  lockVault,
  isUnlocked,
} from "../../../packages/appLogic/src/vaultManager";

export default function App() {
  const [passwordInput, setPasswordInput] = useState("");
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

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

      <ul>
        {vault.entries.map((e) => (
          <li key={e.id}>
            {e.site} — {e.username} —
            <button
              onClick={() => {
                navigator.clipboard.writeText(e.password);
                alert("Copied!");
              }}
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
    </div>
  );
}
