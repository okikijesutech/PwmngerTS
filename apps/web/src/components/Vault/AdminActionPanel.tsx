import React from 'react';
import { Button } from '@pwmnger/ui';
import styles from '../../styles/Dashboard.module.css';

interface AdminActionPanelProps {
  onImportVault: (content: string) => void;
}

export const AdminActionPanel: React.FC<AdminActionPanelProps> = ({ onImportVault }) => {
  return (
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
    </div>
  );
};
