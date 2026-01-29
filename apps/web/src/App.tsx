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
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleCreate() {
    try {
      await createNewVault(password);
      setPassword("");
    } catch (e) {
      setError("Failed to create vault");
    }
  }

  async function handleUnlock() {
    try {
      await unlockVault(password);
      setPassword("");
    } catch {
      setError("Wrong password");
    }
  }

  function handleAddEntry() {
    const vault = getVault();
    vault.entries.push({
      id: crypto.randomUUID(),
      site: "example.com",
      username: "user",
      password: "secret",
      notes: "",
    });
    saveCurrentVault();
  }

  if (!isUnlocked()) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Password Manager</h2>
        <input
          type='password'
          placeholder='Master password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
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
      <button onClick={handleAddEntry}>Add Dummy Entry</button>
      <button onClick={lockVault}>Lock</button>

      <ul>
        {vault.entries.map((e) => (
          <li key={e.id}>
            {e.site} — {e.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
