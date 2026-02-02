import { loadVault, saveVault } from "../storage/vaultStorage";
import { decryptVault, createEncryptedVault } from "../crypto/cryptoBridge";
import { EncryptedVault } from "@pwmnger/vault";

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", async () => {
  const unlockBtn = document.getElementById("unlockBtn");
  const masterInput = document.getElementById("masterPassword") as HTMLInputElement | null;
  const vaultDiv = document.getElementById("vault");
  const lockedDiv = document.getElementById("locked");
  const entriesUl = document.getElementById("entries");
  
  // Register elements
  const registerDiv = document.getElementById("register");
  const regPasswordInput = document.getElementById("regPassword") as HTMLInputElement | null;
  const createVaultBtn = document.getElementById("createVaultBtn");

  if (!unlockBtn || !masterInput || !vaultDiv || !lockedDiv || !entriesUl || !registerDiv || !regPasswordInput || !createVaultBtn) {
    console.error("Required DOM elements not found");
    return;
  }

  // Generator elements
  const generateBtn = document.getElementById("generate");
  const lengthInput = document.getElementById("length") as HTMLInputElement | null;
  const generatedOutput = document.getElementById("generatedPassword") as HTMLInputElement | null;

  if (generateBtn && lengthInput && generatedOutput) {
    generateBtn.addEventListener("click", () => {
      const length = parseInt(lengthInput.value, 10) || 16;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
      const randomValues = crypto.getRandomValues(new Uint32Array(length));
      let password = "";
      for (let i = 0; i < length; i++) {
        password += charset[randomValues[i]! % charset.length];
      }
      generatedOutput.value = password;
      navigator.clipboard.writeText(password);
    });
  }

  // Initial Check
  try {
    const existingVault = await loadVault();
    if (existingVault) {
      lockedDiv.hidden = false;
    } else {
      registerDiv.hidden = false;
    }
  } catch (err) {
    console.error("Failed to load vault:", err);
    registerDiv.hidden = false; // Fallback
  }

  // Handle Create Vault
  createVaultBtn.addEventListener("click", async () => {
    const password = regPasswordInput.value;
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      const newVault = await createEncryptedVault(password);
      await saveVault(newVault);
      alert("Vault created! Please unlock it.");
      registerDiv.hidden = true;
      lockedDiv.hidden = false;
    } catch (e) {
      console.error(e);
      alert("Failed to create vault");
    }
  });

  unlockBtn.addEventListener("click", async () => {
    const master = (masterInput as HTMLInputElement).value;
    const encryptedVault = await loadVault();

    if (!encryptedVault) {
      // Should not happen if logic is correct, but safe fallback
      registerDiv.hidden = false;
      lockedDiv.hidden = true;
      return;
    }

  try {
    const entries = await decryptVault(encryptedVault, master);
    renderEntries(entries, entriesUl);
    lockedDiv.hidden = true;
    vaultDiv.hidden = false;
  } catch {
    alert("Wrong master password");
  }
});

function renderEntries(entries: any[], container: HTMLElement) {
  container.innerHTML = "";
  for (const entry of entries) {
    const li = document.createElement("li");
    li.textContent = `${entry.site} — ${entry.username}`;
    li.onclick = () => copyToClipboard(entry.password);
    container.appendChild(li);
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  setTimeout(() => navigator.clipboard.writeText(""), 7000);
}


});
}

export function passwordStrength(password: string): number {
  let score = 0;

  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  return score; // 0–5
}
