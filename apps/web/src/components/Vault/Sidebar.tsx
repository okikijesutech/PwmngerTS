import React, { memo } from 'react';
import { Button, Input } from '@pwmnger/ui';
import { 
  LayoutGrid, 
  Folder, 
  Plus, 
  ShieldCheck, 
  Cloud, 
  Lock, 
  X, 
  Check,
  ChevronRight
} from 'lucide-react';
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
      <div className={styles.sidebarHeader}>
        <h1 className={styles.logo}>PwmngerTS</h1>
        {userEmail && (
          <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: 2 }}>
            {userEmail}
          </div>
        )}
      </div>
      
      <ul className={styles.sidebarNav}>
        <li
          className={`${styles.navItem} ${selectedFolderId === null ? styles.navItemActive : ""}`}
          onClick={() => setSelectedFolderId(null)}
        >
          <LayoutGrid className={styles.navIcon} size={16} />
          <span style={{ flex: 1 }}>All Vault Items</span>
          <span className={styles.sidebarBadge}>{totalItems}</span>
        </li>
        
        <div style={{ padding: "24px 12px 8px", fontSize: "10px", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Folders
        </div>
        
        {(folders || []).map((f: any) => (
          <li
            key={f.id}
            className={`${styles.navItem} ${selectedFolderId === f.id ? styles.navItemActive : ""}`}
            onClick={() => setSelectedFolderId(f.id)}
          >
            <Folder className={styles.navIcon} size={16} />
            <span style={{ flex: 1 }}>{f.name}</span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {confirmingDeleteFolderId === f.id ? (
                <div style={{ display: "flex", gap: 4 }}>
                  <Check 
                    size={12}
                    className={styles.accentSuccess}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                       e.stopPropagation();
                       handleDeleteFolder(f.id, true);
                    }}
                  />
                  <X 
                    size={12}
                    style={{ cursor: "pointer", opacity: 0.5 }}
                    onClick={(e) => {
                       e.stopPropagation();
                       setConfirmingDeleteFolderId(null);
                    }}
                  />
                </div>
              ) : (
                <X
                  size={12}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(f.id);
                  }}
                  style={{ opacity: 0.3, cursor: "pointer" }}
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      <div style={{ padding: "12px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <Input
            placeholder="New Folder..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            style={{ 
              background: "var(--slate-900)", 
              border: "1px solid var(--border-subtle)", 
              color: "#fff", 
              fontSize: "12px", 
              height: "36px",
              padding: "0 10px",
              borderRadius: "var(--radius-md) 0 0 var(--radius-md)"
            }}
          />
          <Button
            onClick={handleCreateFolder}
            style={{ 
              background: "var(--slate-800)", 
              color: "#fff", 
              border: "1px solid var(--border-subtle)", 
              borderLeft: "none",
              height: "36px", 
              minWidth: "36px", 
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0 var(--radius-md) var(--radius-md) 0"
            }}
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>

      <div className={styles.sidebarFooter}>
         <Button onClick={onDownloadRecoveryKit} variant="secondary" style={{ width: "100%", justifyContent: "flex-start", gap: 8, fontSize: "11px", height: "36px" }}>
           <ShieldCheck size={14} /> Recovery Kit
         </Button>
         <Button onClick={onSync} variant="secondary" disabled={isSyncing} style={{ width: "100%", justifyContent: "flex-start", gap: 8, fontSize: "11px", height: "36px" }}>
           <Cloud size={14} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Syncing..." : "Sync Cloud"}
         </Button>
         <Button variant="danger" onClick={onLock} style={{ width: "100%", justifyContent: "flex-start", gap: 8, fontSize: "11px", height: "36px" }}>
           <Lock size={14} /> Lock Vault
         </Button>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <a 
              href="https://github.com/okikijesutech/PwmngerTS/blob/main/PRIVACY_POLICY.md" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ fontSize: "10px", color: "var(--text-dim)", textDecoration: "none" }}
            >
              Privacy Policy
            </a>
          </div>
      </div>
    </aside>
  );
});
