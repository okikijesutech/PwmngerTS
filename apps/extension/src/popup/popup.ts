import { loadVault, saveVault } from "../storage/vaultStorage";
import { decryptVault, createEncryptedVault, encryptVault } from "../crypto/cryptoBridge";
import { passwordStrength } from "../password/strength";
import { loginAccount, registerAccount, syncVaultWithCloud } from "@pwmnger/app-logic";

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", async () => {
    const unlockBtn = document.getElementById("unlockBtn");
    const masterInput = document.getElementById("masterPassword") as HTMLInputElement | null;
    const vaultDiv = document.getElementById("vault");
    const lockedDiv = document.getElementById("locked");
    const entriesUl = document.getElementById("entries");
    const searchInput = document.getElementById("searchInput") as HTMLInputElement | null;

    const registerDiv = document.getElementById("register");
    const regEmailInput = document.getElementById("regEmail") as HTMLInputElement | null;
    const regPasswordInput = document.getElementById("regPassword") as HTMLInputElement | null;
    const createVaultBtn = document.getElementById("createVaultBtn") as HTMLButtonElement | null;
    const showLoginLink = document.getElementById("showLoginLink");

    const loginDiv = document.getElementById("login");
    const loginEmailInput = document.getElementById("loginEmail") as HTMLInputElement | null;
    const loginPasswordInput = document.getElementById("loginPassword") as HTMLInputElement | null;
    const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement | null;
    const showRegisterLink = document.getElementById("showRegisterLink");
    
    // Strength meter elements
    const strengthBar = document.getElementById("regStrengthBar");
    const strengthText = document.getElementById("regStrengthText");

    // Add Entry elements
    const addEntryForm = document.getElementById("add-entry-form");
    const showAddEntryBtn = document.getElementById("showAddEntryBtn");
    const saveEntryBtn = document.getElementById("saveEntryBtn");
    const cancelAddBtn = document.getElementById("cancelAddBtn");
    const siteInput = document.getElementById("siteInput") as HTMLInputElement | null;
    const usernameInput = document.getElementById("usernameInput") as HTMLInputElement | null;
    const passwordInput = document.getElementById("passwordInput") as HTMLInputElement | null;

    let currentEntries: any[] = [];
    let currentMaster: string = "";
    let currentSalt: Uint8Array | null = null;

    const login2FASection = document.getElementById("login2FASection");
    const login2FATokenInput = document.getElementById("login2FAToken") as HTMLInputElement | null;
    const syncBtn = document.getElementById("syncBtn");
    const folderSelect = document.getElementById("folderSelect") as HTMLSelectElement | null;

    if (!unlockBtn || !masterInput || !vaultDiv || !lockedDiv || !entriesUl || !registerDiv || !regPasswordInput || !createVaultBtn || !addEntryForm || !showAddEntryBtn || !saveEntryBtn || !cancelAddBtn || !siteInput || !usernameInput || !passwordInput || !regEmailInput || !loginDiv || !loginEmailInput || !loginPasswordInput || !loginBtn || !syncBtn || !folderSelect) {
      console.error("Required DOM elements not found");
      return;
    }

    // Password strength colors
    const getStrengthInfo = (password: string) => {
      if (!password) return { width: '0%', color: '#eee', label: 'None' };
      const score = passwordStrength(password);

      if (score < 2) return { width: '20%', color: '#ff4d4f', label: 'Weak' };
      if (score < 3) return { width: '40%', color: '#faad14', label: 'Fair' };
      if (score < 5) return { width: '60%', color: '#52c41a', label: 'Good' };
      if (score < 6) return { width: '80%', color: '#1890ff', label: 'Strong' };
      return { width: '100%', color: '#1890ff', label: 'Very Strong' };
    };

    regPasswordInput.addEventListener("input", () => {
      const info = getStrengthInfo(regPasswordInput.value);
      if (strengthBar) {
        strengthBar.style.width = info.width;
        strengthBar.style.backgroundColor = info.color;
      }
      if (strengthText) {
        strengthText.innerText = info.label;
        strengthText.style.color = info.color;
      }
      createVaultBtn.disabled = regPasswordInput.value.length < 8;
    });

    // Generator logic
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

    // Initial Vault Check
    const existingVault = await loadVault();
    if (existingVault) {
      lockedDiv.hidden = false;
    } else {
      loginDiv.hidden = false; // Default to Login for new installs
    }

    // Switch Views
    showRegisterLink?.addEventListener("click", () => {
      loginDiv.hidden = true;
      registerDiv.hidden = false;
    });

    showLoginLink?.addEventListener("click", () => {
      registerDiv.hidden = true;
      loginDiv.hidden = false;
    });

    // Create (Register) logic
    createVaultBtn.addEventListener("click", async () => {
      const email = regEmailInput.value;
      const password = regPasswordInput.value;

      if (!email || !password) return alert("Email and Password required");

      try {
        createVaultBtn.disabled = true;
        createVaultBtn.innerText = "Creating...";

        await registerAccount(email, password); // Zero-Knowledge Reg

        const newVault = await createEncryptedVault(password);
        await saveVault(newVault);
        
        // Auto-login to get token
        const token = await loginAccount(email, password);
        await syncVaultWithCloud(token);

        // Auto-unlock
        const entries = await decryptVault(newVault, password);
        currentEntries = entries;
        currentMaster = password;
        currentSalt = new Uint8Array(newVault.salt);
        
        renderEntries(entries, entriesUl);
        registerDiv.hidden = true;
        vaultDiv.hidden = false;
      } catch (e: any) {
        console.error(e);
        alert(e.message || "Failed to create vault");
        createVaultBtn.disabled = false;
        createVaultBtn.innerText = "Create & Unlock";
      }
    });

    // Login logic
    loginBtn?.addEventListener("click", async () => {
      const email = loginEmailInput.value;
      const password = loginPasswordInput.value;
      const token = login2FATokenInput?.value;
      
      if (!email || !password) return alert("Required");

      try {
        loginBtn.innerText = "Syncing...";
        const authToken = await loginAccount(email, password, token);

        // If login successful, hide 2FA just in case
        login2FASection?.setAttribute("hidden", "");

        // Sync (First download)
        await syncVaultWithCloud(authToken);
        
        // Now try to unlock locally
        const encryptedVault = await loadVault();
        if (encryptedVault) {
            const vaultData = await decryptVault(encryptedVault, password);
            currentEntries = vaultData.entries;
            currentFolders = vaultData.folders || [];
            currentMaster = password;
            renderEntries(currentEntries, entriesUl);
            loginDiv.hidden = true;
            vaultDiv.hidden = false;
        } else {
            alert("No vault found on cloud or local");
        }
      } catch(e: any) {
        if (e.requires2FA) {
            login2FASection?.removeAttribute("hidden");
            login2FATokenInput?.focus();
            alert("2FA Required. Please enter your code.");
        } else {
            alert(e.message || "Login failed");
        }
      } finally {
        loginBtn.innerText = "Login & Sync";
      }
    });

    syncBtn?.addEventListener("click", async () => {
      try {
        syncBtn.innerText = "⏳";
        syncBtn.style.pointerEvents = "none";
        // We need the token. For simplicity, we assume user is logged in if they can sync.
        // loginAccount doesn't store token globally in library yet? 
        // In web app it's in localStorage. 
        const token = localStorage.getItem("pwmnger_token");
        if (!token) throw new Error("Please log in again to sync.");
        
        await syncVaultWithCloud(token);
        const updatedVault = await loadVault();
        if (updatedVault) {
           const entries = await decryptVault(updatedVault, currentMaster);
           currentEntries = entries;
           renderEntries(entries, entriesUl);
           alert("Sync Success!");
        }
      } catch(e: any) {
        alert(e.message || "Sync failed");
      } finally {
        syncBtn.innerText = "🔄";
        syncBtn.style.pointerEvents = "auto";
      }
    });

    unlockBtn.addEventListener("click", async () => {
      const master = masterInput.value;
      const encryptedVault = await loadVault();
      if (!encryptedVault) return;

      try {
        const vaultData = await decryptVault(encryptedVault, master);
        currentEntries = vaultData.entries;
        currentFolders = vaultData.folders || [];
        currentMaster = master;
        currentSalt = new Uint8Array(encryptedVault.salt);
        
        renderEntries(currentEntries, entriesUl);
        lockedDiv.hidden = true;
        vaultDiv.hidden = false;
      } catch {
        alert("Wrong master password");
      }
    });

    searchInput?.addEventListener("input", () => {
      const filtered = currentEntries.filter(e => 
        e.site.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        e.username.toLowerCase().includes(searchInput.value.toLowerCase())
      );
      renderEntries(filtered, entriesUl);
    });

    showAddEntryBtn.addEventListener("click", async () => {
      vaultDiv.hidden = true;
      addEntryForm.hidden = false;
      
      // Populate folders
      if (folderSelect) {
        folderSelect.innerHTML = '<option value="">No Folder</option>';
        currentFolders.forEach((f: any) => {
             const opt = document.createElement("option");
             opt.value = f.id;
             opt.innerText = f.name;
             folderSelect.appendChild(opt);
        });
      }

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url) {
        siteInput.value = new URL(tab.url).hostname;
      }
    });

    cancelAddBtn.addEventListener("click", () => {
      addEntryForm.hidden = true;
      vaultDiv.hidden = false;
    });

    saveEntryBtn.addEventListener("click", async () => {
      if (!siteInput.value || !usernameInput.value || !passwordInput.value) {
        alert("All fields are required");
        return;
      }

      currentEntries.push({
        id: crypto.randomUUID(),
        site: siteInput.value,
        username: usernameInput.value,
        password: passwordInput.value,
        folderId: folderSelect?.value || undefined,
        createdAt: Date.now()
      });

      try {
        if (!currentSalt) throw new Error("Salt missing");
        const updatedVault = await encryptVault(currentEntries, currentMaster, currentSalt);
        await saveVault(updatedVault);
        
        renderEntries(currentEntries, entriesUl);
        addEntryForm.hidden = true;
        vaultDiv.hidden = false;
        
        siteInput.value = "";
        usernameInput.value = "";
        passwordInput.value = "";
      } catch (e) {
        console.error(e);
        alert("Failed to save entry");
      }
    });

    let currentFolders: any[] = [];

    async function updateVaultData() {
        const encryptedVault = await loadVault();
        if (encryptedVault && currentMaster) {
            const vaultData = await decryptVault(encryptedVault, currentMaster);
            currentEntries = vaultData.entries;
            currentFolders = vaultData.folders || [];
        }
    }

    function renderEntries(entries: any[], container: HTMLElement) {
      container.innerHTML = "";
      for (const entry of entries) {
        const folder = currentFolders.find(f => f.id === entry.folderId);
        const folderLabel = folder ? `<span style="font-size: 10px; color: var(--primary); background: #e6f7ff; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">${folder.name}</span>` : "";

        const li = document.createElement("li");
        li.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="site">${entry.site} ${folderLabel}</div>
          </div>
          <div class="user">${entry.username}</div>
        `;
        li.onclick = () => {
          navigator.clipboard.writeText(entry.password);
          const originalText = li.innerHTML;
          li.innerHTML = '<div style="color: var(--primary); font-weight: bold; text-align: center;">Copied!</div>';
          setTimeout(() => li.innerHTML = originalText, 2000);
          setTimeout(() => navigator.clipboard.writeText(""), 30000);
        };
        container.appendChild(li);
      }
    }

    // Initial load
    await updateVaultData();
  });
}
