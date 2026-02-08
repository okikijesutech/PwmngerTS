import React, { useState, useMemo, useCallback, memo } from "react";
import { Button, Input, Toast } from "@pwmnger/ui";
import { AddEntryForm } from "./AddEntryForm";
import { EntryList } from "./EntryList";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { SecurityActionPanel } from "./SecurityActionPanel";
import { AdminActionPanel } from "./AdminActionPanel";
import { copyWithAutoClear } from "../../utils/clipboard";
import type { Vault } from "@pwmnger/vault";
import styles from "../../styles/Dashboard.module.css";

interface VaultDashboardProps {
  vault: Vault;
  userEmail: string;
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
  onDownloadRecoveryKit: () => void;
  onRefreshAccountStatus: () => void;
  isSyncing: boolean;
  is2FAEnabled: boolean;
}

export const VaultDashboard = memo(({
  vault,
  userEmail,
  onSync,
  onLock,
  onAddEntry,
  onDeleteEntry,
  onCreateFolder,
  onDeleteFolder,
  onMoveEntry,
  onEditEntry,
  onImportVault,
  onDownloadRecoveryKit,
  onRefreshAccountStatus,
  isSyncing,
  is2FAEnabled,
}: VaultDashboardProps) => {
  const [search, setSearch] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [confirmingDeleteFolderId, setConfirmingDeleteFolderId] = useState<string | null>(null);
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

  const handleCopy = useCallback((text: string, label: string) => {
    copyWithAutoClear(text);
    setToast({
      message: `${label} copied to clipboard and will be cleared in 30s`,
      type: "success",
    });
  }, []);

  const handleCreateFolderLocal = useCallback(() => {
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName);
    setNewFolderName("");
  }, [newFolderName, onCreateFolder]);

  const handleDeleteFolderLocal = useCallback((id: string, force = false) => {
    if (!force) {
      setConfirmingDeleteFolderId(id);
      return;
    }
    onDeleteFolder(id);
    if (selectedFolderId === id) setSelectedFolderId(null);
    setConfirmingDeleteFolderId(null);
  }, [onDeleteFolder, selectedFolderId]);

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

      <Sidebar 
        userEmail={userEmail}
        folders={folders}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        handleCreateFolder={handleCreateFolderLocal}
        handleDeleteFolder={handleDeleteFolderLocal}
        confirmingDeleteFolderId={confirmingDeleteFolderId}
        setConfirmingDeleteFolderId={setConfirmingDeleteFolderId}
        onDownloadRecoveryKit={onDownloadRecoveryKit}
        onSync={onSync}
        onLock={onLock}
        isSyncing={isSyncing}
        totalItems={filteredEntries.length}
      />

      <main className={styles.mainContent}>
        <DashboardHeader search={search} setSearch={setSearch} />

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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, padding: "16px 0", borderTop: "1px solid rgba(0,0,0,0.05)", flexShrink: 0 }}>
              <Button
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >Previous</Button>
              <span style={{ fontSize: "14px", color: "#8c8c8c" }}>
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >Next</Button>
            </div>
          )}
        </section>

        <section className={styles.actionArea} style={{ paddingBottom: 16, flexShrink: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SecurityActionPanel 
             is2FAEnabled={is2FAEnabled}
             show2FASetup={show2FASetup}
             setShow2FASetup={setShow2FASetup}
             onRefreshAccountStatus={onRefreshAccountStatus}
             setToast={setToast}
          />
          <AdminActionPanel onImportVault={onImportVault} />
        </section>
      </main>
    </div>
  );
});
