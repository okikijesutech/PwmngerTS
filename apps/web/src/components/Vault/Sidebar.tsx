import React, { memo } from 'react';
import { Button, Input } from '@pwmnger/ui';
import styles from '../../styles/Dashboard.module.css';

interface SidebarProps {
  userEmail: string;
  folders: any[];
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  handleCreateFolder: () => void;
  handleDeleteFolder: (id: string, force?: boolean) => void;
  confirmingDeleteFolderId: string | null;
  setConfirmingDeleteFolderId: (id: string | null) => void;
  onDownloadRecoveryKit: () => void;
  onSync: () => void;
  onLock: () => void;
  isSyncing: boolean;
  totalItems: number;
}

export const Sidebar = memo(({
  userEmail,
  folders,
  selectedFolderId,
  setSelectedFolderId,
  newFolderName,
  setNewFolderName,
  handleCreateFolder,
  handleDeleteFolder,
  confirmingDeleteFolderId,
  setConfirmingDeleteFolderId,
  onDownloadRecoveryKit,
  onSync,
  onLock,
  isSyncing,
  totalItems
}: SidebarProps) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader} style={{ padding: "30px 24px 20px" }}>
        <h1 className={styles.logo} style={{ margin: 0 }}>PwmngerTS</h1>
        {userEmail && (
          <div style={{ fontSize: "11px", opacity: 0.5, marginTop: 4, fontStyle: "italic" }}>
            {userEmail}
          </div>
        )}
      </div>
      
      <ul className={styles.sidebarNav}>
        <li
          className={`${styles.navItem} ${selectedFolderId === null ? styles.navItemActive : ""}`}
          onClick={() => setSelectedFolderId(null)}
        >
          <span className={styles.navIcon}>🏠</span>
          <span style={{ flex: 1 }}>All Vault Items</span>
          <span className={styles.sidebarBadge}>{totalItems}</span>
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
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {confirmingDeleteFolderId === f.id ? (
                <div style={{ display: "flex", gap: 4, background: "rgba(255, 77, 79, 0.2)", padding: "2px 6px", borderRadius: "10px" }}>
                  <span 
                    style={{ fontSize: "10px", color: "#ff4d4f", cursor: "pointer", fontWeight: 700 }}
                    onClick={(e) => {
                       e.stopPropagation();
                       handleDeleteFolder(f.id, true);
                    }}
                  >✓</span>
                  <span 
                    style={{ fontSize: "10px", color: "#fff", cursor: "pointer", opacity: 0.6 }}
                    onClick={(e) => {
                       e.stopPropagation();
                       setConfirmingDeleteFolderId(null);
                    }}
                  >✕</span>
                </div>
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(f.id);
                  }}
                  style={{ opacity: 0.5, fontSize: "10px" }}
                >✕</span>
              )}
            </div>
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
            onClick={handleCreateFolder}
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", height: "32px", minWidth: "32px", padding: 0 }}
          >+</Button>
        </div>
      </div>

      <div className={styles.sidebarFooter}>
         <Button onClick={onDownloadRecoveryKit} variant="secondary" style={{ width: "100%", marginBottom: 8, fontSize: "11px", opacity: 0.8 }}>
           📦 Download Recovery Kit
         </Button>
         <Button onClick={onSync} variant="secondary" disabled={isSyncing} style={{ width: "100%", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontSize: "13px" }}>
           {isSyncing ? "🔄 Syncing..." : "☁️ Sync Cloud"}
         </Button>
         <Button variant="danger" onClick={onLock} style={{ width: "100%", fontSize: "13px" }}>
           🔐 Lock Vault
         </Button>
      </div>
    </aside>
  );
});
