import React, { useState, useMemo } from "react";
import { Button, Input, Toast } from "@pwmnger/ui";
import { AddEntryForm } from "./AddEntryForm";
import { EntryList } from "./EntryList";
import { TwoFactorSetup } from "./TwoFactorSetup";
import { copyWithAutoClear } from "../../utils/clipboard";
import type { Vault } from "@pwmnger/vault";

interface VaultDashboardProps {
  vault: Vault;
  onSync: () => void;
  onLock: () => void;
  onAddEntry: (site: string, username: string, password: string) => void;
  onDeleteEntry: (id: string) => void;
  isSyncing: boolean;
}

export const VaultDashboard: React.FC<VaultDashboardProps> = ({ 
  vault, onSync, onLock, onAddEntry, onDeleteEntry, isSyncing 
}) => {
  const [search, setSearch] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const folders = vault.folders || [];

  const handleCopy = (password: string) => {
    copyWithAutoClear(password);
    setToast({ message: "Password copied to clipboard and will be cleared in 30s", type: "success" });
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const { createFolder } = await import("@pwmnger/app-logic");
      await createFolder(newFolderName);
      setNewFolderName("");
      setToast({ message: "Folder created", type: "success" });
      window.location.reload(); 
    } catch (e: any) {
      setToast({ message: "Failed to create folder", type: "error" });
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!confirm("Delete folder? Entries will move to 'All Items'.")) return;
    try {
      const { deleteFolder } = await import("@pwmnger/app-logic");
      await deleteFolder(id);
      if (selectedFolderId === id) setSelectedFolderId(null);
      window.location.reload();
    } catch (e) {
      setToast({ message: "Failed to delete folder", type: "error" });
    }
  };

  const filteredEntries = useMemo(() => {
    let items = vault.entries.filter(
      (e) =>
        e.site.toLowerCase().includes(search.toLowerCase()) ||
        e.username.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedFolderId) {
      items = items.filter((e) => e.folderId === selectedFolderId);
    }

    return items;
  }, [vault.entries, search, selectedFolderId]);

  return (
    <div>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 style={{ margin: 0, color: "#1890ff" }}>PwmngerTS <span style={{fontSize: "0.6em", color: "#999"}}>v1.0</span></h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Button onClick={onSync} variant="secondary" disabled={isSyncing}>
            {isSyncing ? "Syncing..." : "Sync Cloud"}
          </Button>
          <Button variant="danger" onClick={onLock}>
            Lock
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, minHeight: 400 }}>
        {/* Sidebar */}
        <div style={{ width: 200, borderRight: "1px solid #eee", paddingRight: 16 }}>
          <h4 style={{ marginTop: 0, color: "#555" }}>Folders</h4>
          <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
            <Input 
              placeholder="New Folder..." 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              style={{ fontSize: "12px", padding: "4px 8px" }}
            />
            <Button onClick={handleCreateFolder} style={{ padding: "4px 8px", fontSize: "16px" }}>+</Button>
          </div>

          <ul style={{ listStyle: "none", padding: 0 }}>
             <li 
                style={{ 
                  padding: "8px 12px", cursor: "pointer", borderRadius: 4,
                  backgroundColor: selectedFolderId === null ? "#e6f7ff" : "transparent",
                  color: selectedFolderId === null ? "#1890ff" : "inherit",
                  fontWeight: selectedFolderId === null ? 600 : 400
                }}
                onClick={() => setSelectedFolderId(null)}
             >
               All Items
             </li>
             {folders.map((f: any) => (
               <li 
                key={f.id}
                style={{ 
                  padding: "8px 12px", cursor: "pointer", borderRadius: 4,
                  backgroundColor: selectedFolderId === f.id ? "#e6f7ff" : "transparent",
                  color: selectedFolderId === f.id ? "#1890ff" : "inherit",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}
                onClick={() => setSelectedFolderId(f.id)}
               >
                 <span>{f.name}</span>
                 {selectedFolderId === f.id && (
                   <span 
                    onClick={(e) => { e.stopPropagation(); handleDeleteFolder(f.id); }}
                    style={{ color: "red", fontSize: "10px" }}
                   >✕</span>
                 )}
               </li>
             ))}
          </ul>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <AddEntryForm onAdd={onAddEntry} />

          <Input
            placeholder='Search vault...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 32 }}
          />

          {/* Pass pre-filtered entries to avoid doubule-filtering in EntryList if not needed, 
              but EntryList does filtering too. We should update EntryList or just pass filtered here.
              Actually EntryList does exact logic we duplicated. 
              Let's pass filteredEntries to EntryList and remove filtering there?
              Or simpler: Pass ALL entries to EntryList and let it filter by search, but WE handle folder filter here?
              EntryList takes 'entries'. If we pass filteredEntries, it will filter again by search. 
              That's redundant but safe. 
          */}
          <EntryList 
            entries={filteredEntries} 
            folders={folders}
            onCopy={handleCopy} 
            onDelete={onDeleteEntry}
            onMove={async (entryId, folderId) => {
               try {
                 const { moveEntryToFolder } = await import("@pwmnger/app-logic");
                 await moveEntryToFolder(entryId, folderId);
                 window.location.reload();
               } catch(e) {
                 setToast({ message: "Failed to move entry", type: "error" });
               }
            }} 
            searchQuery="" 
          />
        </div>
      </div>

      <div style={{ marginTop: 40, borderTop: "1px solid #eee", paddingTop: 20 }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#555" }}>Data Management</h3>
         <div style={{ display: "flex", gap: 12 }}>
           <Button variant="secondary" onClick={() => {
              import("@pwmnger/app-logic").then(async ({ exportVaultData }) => {
                const json = await exportVaultData();
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `pwmnger-backup-${Date.now()}.json`;
                a.click();
                setToast({ message: "Vault exported!", type: "success" });
              });
           }}>
             Export Backup (JSON)
           </Button>

           <label style={{ 
              display: "inline-block", backgroundColor: "#f0f0f0", padding: "8px 16px", 
              borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: 600 
           }}>
             Import Backup
             <input type="file" accept=".json" style={{ display: "none" }} onChange={(e) => {
               const file = e.target.files?.[0];
               if (file) {
                 const reader = new FileReader();
                 reader.onload = async (ev) => {
                   const content = ev.target?.result as string;
                   try {
                     const { importVaultData } = await import("@pwmnger/app-logic");
                     await importVaultData(content);
                     setToast({ message: "Vault imported successfully!", type: "success" });
                     window.location.reload(); // Refresh to show new entries
                   } catch (err: any) {
                     setToast({ message: "Import failed: " + err.message, type: "error" });
                   }
                 };
                 reader.readAsText(file);
               }
             }} />
           </label>
           
           <Button variant="secondary" onClick={() => {
              import("@pwmnger/app-logic").then(({ analyzeVaultHealth }) => {
                const report = analyzeVaultHealth(vault); 
                const msg = `Vault Health Score: ${report.score}/100\n` +
                            `Weak Passwords: ${report.weakCount}\n` +
                            `Reused Passwords: ${report.reusedCount}`;
                alert(msg);
              });
           }}>
             Check Health
           </Button>

           <Button variant="secondary" onClick={() => {
              import("@pwmnger/app-logic").then(async ({ exportRecoveryData }) => {
                try {
                  const data = await exportRecoveryData();
                  const content = `PwmngerTS EMERGENCY RECOVERY KIT\n` +
                                 `-------------------------------\n` +
                                 `Recovery Key: ${data.recoveryKey}\n` +
                                 `Encrypted Vault Key: ${JSON.stringify(data.encryptedVaultKey)}\n\n` +
                                 `INSTRUCTIONS:\n` +
                                 `Store this file securely. If you lose your Master Password, this key\n` +
                                 `can be used to recover your vault data.`;
                  
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `pwmnger-recovery-kit.txt`;
                  a.click();
                  setToast({ message: "Recovery Kit downloaded! Keep it safe.", type: "success" });
                } catch(e: any) {
                  setToast({ message: "Recovery Kit generation failed: " + e.message, type: "error" });
                }
              });
           }}>
             Download Recovery Kit
           </Button>
         </div>

         <div style={{ marginTop: 40 }}>
             <Button variant="secondary" onClick={() => setShow2FASetup(!show2FASetup)}>
               {show2FASetup ? "Hide Security Settings" : "Security Settings (2FA)"}
             </Button>
             
             {show2FASetup && (
               <TwoFactorSetup
                 onSetup={async () => {
                   const { setup2FA } = await import("@pwmnger/app-logic");
                   // pass current token logic from localStorage? 
                   // VaultDashboard doesn't have token prop, but we can grab from localStorage
                   const token = localStorage.getItem("pwmnger_token")!;
                   return setup2FA(token);
                 }}
                 onVerify={async (tokenStr, secret) => {
                   const { verify2FASetup } = await import("@pwmnger/app-logic");
                   const authToken = localStorage.getItem("pwmnger_token")!;
                   return verify2FASetup(authToken, tokenStr, secret);
                 }}
               />
             )}
         </div>
      </div>
    </div>
  );
};
