import { loadVault } from "../storage/vaultStorage";
import { decryptVault } from "../crypto/cryptoBridge";
import { EncryptedVault } from "@pwmnger/vault";

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
  const unlockBtn = document.getElementById("unlockBtn")!;
  const masterInput = document.getElementById("masterPassword")!;
  const vaultDiv = document.getElementById("vault")!;
  const lockedDiv = document.getElementById("locked")!;
  const entriesUl = document.getElementById("entries")!;

  unlockBtn.addEventListener("click", async () => {
    const master = (masterInput as HTMLInputElement).value;
    const encryptedVault = await loadVault();

    if (!encryptedVault) {
      alert("No vault found");
      return;
    }

  try {
    const entries = await decryptVault(encryptedVault, master);
    renderEntries(entries);
    lockedDiv.hidden = true;
    vaultDiv.hidden = false;
  } catch {
    alert("Wrong master password");
  }
});

function renderEntries(entries: any[]) {
  entriesUl.innerHTML = "";
  for (const entry of entries) {
    const li = document.createElement("li");
    li.textContent = `${entry.site} — ${entry.username}`;
    li.onclick = () => copyToClipboard(entry.password);
    entriesUl.appendChild(li);
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
