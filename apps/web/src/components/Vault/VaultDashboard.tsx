import React, { useState } from 'react';
import { Button, Input, Toast } from "@pwmnger/ui";
import { AddEntryForm } from './AddEntryForm';
import { EntryList } from './EntryList';
import { copyWithAutoClear } from '../../utils/clipboard';

interface VaultDashboardProps {
  vault: { entries: any[] };
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
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleCopy = (password: string) => {
    copyWithAutoClear(password);
    setToast({ message: "Password copied to clipboard and will be cleared in 30s", type: "success" });
  };

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
        <h2 style={{ margin: 0, color: "#1890ff" }}>PwmngerTS Vault</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Button onClick={onSync} variant="secondary" disabled={isSyncing}>
            {isSyncing ? "Syncing..." : "Sync Cloud"}
          </Button>
          <Button variant="danger" onClick={onLock}>
            Lock Vault
          </Button>
        </div>
      </div>

      <AddEntryForm onAdd={onAddEntry} />

      <Input
        placeholder='Search vault...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 32 }}
      />

      <EntryList 
        entries={vault.entries} 
        onCopy={handleCopy} 
        onDelete={onDeleteEntry} 
        searchQuery={search} 
      />
    </div>
  );
};
