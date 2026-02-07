import React, { useState, useMemo } from "react";
import { Button, Input, Toast } from "@pwmnger/ui";
import { AddEntryForm } from "./AddEntryForm";
import { EntryList } from "./EntryList";
import { TwoFactorSetup } from "./TwoFactorSetup";
import { copyWithAutoClear } from "../../utils/clipboard";
import type { Vault } from "@pwmnger/vault";
import styles from "../../styles/Dashboard.module.css";

interface VaultDashboardProps {
  vault: Vault;
  onSync: () => void;
  onLock: () => void;
  onAddEntry: (
    site: string,
    username: string,
    password: string,
    folderId?: string | null,
  ) => void;
  onDeleteEntry: (id: string) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
  onMoveEntry: (entryId: string, folderId: string | null) => void;
  onEditEntry: (entryId: string, site: string, username: string, password: string) => void;
  onImportVault: (jsonString: string) => void;
  onRefreshAccountStatus: () => void;
  isSyncing: boolean;
  is2FAEnabled: boolean;
}

export const VaultDashboard: React.FC<VaultDashboardProps> = ({
  vault,
  onSync,
  onLock,
  onAddEntry,
  onDeleteEntry,
  onCreateFolder,
  onDeleteFolder,
  onMoveEntry,
  onEditEntry,
  onImportVault,
  onRefreshAccountStatus,
  isSyncing,
  is2FAEnabled,
}) => {
  const [search, setSearch] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedFolderId]);
  
  const [newFolderName, setNewFolderName] = useState("");
  const [isAddFormExpanded, setIsAddFormExpanded] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const itemsPerPage = 10;

  const folders = vault.folders || [];

  const handleCopy = (text: string, label: string) => {
    copyWithAutoClear(text);
    setToast({
      message: `${label} copied to clipboard and will be cleared in 30s`,
      type: "success",
    });
  };

  const handleCreateFolderLocal = () => {
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName);
    setNewFolderName("");
  };

  const handleDeleteFolderLocal = (id: string) => {
    if (!confirm("Delete folder? Entries will move to 'All Items'.")) return;
    onDeleteFolder(id);
    if (selectedFolderId === id) setSelectedFolderId(null);
  };

  const filteredEntries = useMemo(() => {
    let items = vault.entries.filter(
      (e) =>
        e.site.toLowerCase().includes(search.toLowerCase()) ||
        e.username.toLowerCase().includes(search.toLowerCase()),
    );

    if (selectedFolderId) {
      items = items.filter((e) => e.folderId === selectedFolderId);
    }

    return items;
  }, [vault.entries, search, selectedFolderId]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(start, start + itemsPerPage);
  }, [filteredEntries, currentPage]);

  return (
    <div className={styles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 24px 24px" }}>
          <span style={{ fontSize: "20px" }}>🛡️</span>
          <h2 className={styles.sidebarTitle} style={{ padding: 0, margin: 0, fontSize: "1.2rem" }}>Pwmnger</h2>
        </div>
        
        <ul className={styles.sidebarNav}>
          <li
            className={`${styles.navItem} ${selectedFolderId === null ? styles.navItemActive : ""}`}
            onClick={() => setSelectedFolderId(null)}
          >
            <span className={styles.navIcon}>🏠</span>
            <span style={{ flex: 1 }}>All Vault Items</span>
            <span className={styles.sidebarBadge}>
               {filteredEntries.length}
            </span>
          </li>
          
          <div style={{ padding: "20px 24px 8px", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
            Folders
          </div>
          
          {folders.map((f: any) => (
            <li
              key={f.id}
              className={`${styles.navItem} ${selectedFolderId === f.id ? styles.navItemActive : ""}`}
              onClick={() => setSelectedFolderId(f.id)}
            >
              <span className={styles.navIcon}>📁</span>
              <span style={{ flex: 1 }}>{f.name}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolderLocal(f.id);
                }}
                style={{ opacity: 0.5, fontSize: "10px" }}
              >
                ✕
              </span>
            </li>
          ))}
        </ul>

        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Input
              placeholder="New Folder..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", fontSize: "12px", height: "32px" }}
            />
            <Button
              onClick={handleCreateFolderLocal}
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", height: "32px", minWidth: "32px", padding: 0 }}
            >
              +
            </Button>
          </div>
        </div>

        <div className={styles.sidebarFooter}>
           <Button 
             onClick={onSync} 
             variant="secondary" 
             disabled={isSyncing}
             style={{ width: "100%", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontSize: "13px" }}
           >
             {isSyncing ? "🔄 Syncing..." : "☁️ Sync Cloud"}
           </Button>
           <Button 
             variant="danger" 
             onClick={onLock}
             style={{ width: "100%", fontSize: "13px" }}
           >
             🔐 Lock Vault
           </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}>My Vault</h1>
          </div>
          
          <div className={styles.headerSearch} style={{ position: "relative" }}>
             <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.4, fontSize: "12px" }}>🔍</span>
             <Input
                placeholder="Search vault..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "8px 16px 8px 36px", borderRadius: "100px", fontSize: "13px", height: "38px", border: "1px solid rgba(0,0,0,0.08)" }}
              />
          </div>
        </header>

        <section className={styles.cardArea}>
          <div className={`glass ${isAddFormExpanded ? styles.expanded : ""}`} style={{ padding: "12px 20px", borderRadius: "var(--radius-md)", flexShrink: 0, transition: "all 0.3s ease" }}>
            <div 
              className={styles.addEntryToggle}
              onClick={() => setIsAddFormExpanded(!isAddFormExpanded)}
            >
              <h3 className={styles.sectionTitle} style={{ margin: 0, fontSize: "13px", opacity: 0.7, display: "flex", alignItems: "center", gap: 8 }}>
                <span>✨</span> Add New Entry
              </h3>
              <span className={styles.expandIcon}>▼</span>
            </div>
            {isAddFormExpanded && (
              <div style={{ marginTop: 12, borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 12 }}>
                <AddEntryForm onAdd={(s, u, p, f) => {
                  onAddEntry(s, u, p, f);
                  setIsAddFormExpanded(false);
                }} folderId={selectedFolderId} />
              </div>
            )}
          </div>

          <div className={styles.scrollArea}>
            <EntryList
              entries={paginatedEntries}
              folders={folders}
              onCopy={handleCopy}
              onDelete={onDeleteEntry}
              onMove={onMoveEntry}
              onEdit={onEditEntry}
              searchQuery=""
            />
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
                padding: "16px 0",
                borderTop: "1px solid rgba(0,0,0,0.05)",
                flexShrink: 0,
              }}
            >
              <Button
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span style={{ fontSize: "14px", color: "#8c8c8c" }}>
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </section>

        {/* Action Area */}
        <section className={styles.actionArea} style={{ paddingBottom: 16, flexShrink: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Security Column */}
          <div className="glass" style={{ padding: 16, borderRadius: "var(--radius-md)" }}>
            <h3 className={styles.sectionTitle} style={{ fontSize: "12px", marginBottom: 8, opacity: 0.6 }}>🛡️ Security</h3>
            {is2FAEnabled ? (
              <div className={`${styles.badge} ${styles.badgeSuccess}`} style={{ display: "inline-block" }}>
                ✓ Two-Factor Authentication Active
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, flex: 1 }}>
                  Enable 2FA (TOTP) for maximum security.
                </p>
                <Button variant="secondary" onClick={() => setShow2FASetup(!show2FASetup)} style={{ fontSize: "11px", padding: "6px 12px" }}>
                  {show2FASetup ? "Cancel" : "Enable"}
                </Button>
              </div>
            )}
            {show2FASetup && (
              <div style={{ marginTop: 20, borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 16 }}>
                <TwoFactorSetup
                  onSetup={async () => {
                    const { setup2FA } = await import("@pwmnger/app-logic");
                    const token = localStorage.getItem("pwmnger_token")!;
                    return setup2FA(token);
                  }}
                  onVerify={async (tokenStr, secret) => {
                    const { verify2FASetup } = await import("@pwmnger/app-logic");
                    const authToken = localStorage.getItem("pwmnger_token")!;
                    const res = await verify2FASetup(authToken, tokenStr, secret);
                    if (res.success) {
                      onRefreshAccountStatus();
                      setToast({ message: "2FA Enabled!", type: "success" });
                      setShow2FASetup(false);
                    }
                    return res;
                  }}
                />
              </div>
            )}

            <div style={{ marginTop: 12, borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 12 }}>
               <h4 style={{ fontSize: "11px", margin: "0 0 8px 0", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Account Security</h4>
               <Button 
                 variant="secondary" 
                 style={{ width: "100%", fontSize: "11px", opacity: 0.6 }}
                 onClick={() => alert("Master Password change feature is coming in v1.1. It requires full vault re-encryption.")}
               >
                 Change Master Password
               </Button>
            </div>
          </div>

          {/* Administration Column */}
          <div className="glass" style={{ padding: 16, borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column" }}>
            <h3 className={styles.sectionTitle} style={{ fontSize: "12px", marginBottom: 8, opacity: 0.6 }}>⚙️ Administration</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
               <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, flex: 1 }}>
                 Manage imports, exports, and recovery.
               </p>
            </div>
            
            <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
              <label style={{ flex: 1 }}>
                <Button variant="secondary" style={{ width: "100%", fontSize: "12px", padding: "8px" }}>📥 Import JSON</Button>
                <input
                  type="file"
                  accept=".json"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const content = ev.target?.result as string;
                        onImportVault(content);
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
              <Button 
                variant="secondary" 
                style={{ flex: 1, fontSize: "12px", padding: "8px" }}
                onClick={() => {
                  if (!confirm("Export unencrypted passwords?")) return;
                  import("@pwmnger/app-logic").then(async ({ exportVaultData }) => {
                    const json = await exportVaultData();
                    const blob = new Blob([json], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `backup-${Date.now()}.json`;
                    a.click();
                  });
                }}
              >
                📤 Export Vault
              </Button>
            </div>

            <Button 
                variant="secondary"
                style={{ 
                  marginTop: 8, 
                  width: "100%", 
                  fontSize: "11px", 
                  padding: "6px", 
                  background: "rgba(22, 119, 255, 0.05)",
                  border: "1px solid rgba(22, 119, 255, 0.15)",
                  color: "var(--primary)",
                  fontWeight: 600,
                  borderRadius: "20px"
                }}
                onClick={() => {
                  import("@pwmnger/app-logic").then(async ({ exportRecoveryData }) => {
                    const data = await exportRecoveryData();
                    const content = `PwmngerTS Recovery Kit\nKey: ${data.recoveryKey}`;
                    const blob = new Blob([content], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "recovery-kit.txt";
                    a.click();
                  });
                }}
              >
                🔑 Download Emergency Recovery Kit
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};
