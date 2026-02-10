import React from 'react';
import { Button } from '@pwmnger/ui';
import { Settings, Download, Upload } from 'lucide-react';
import styles from '../../styles/Dashboard.module.css';

interface AdminActionPanelProps {
  onImportVault: (content: string) => void;
}

export const AdminActionPanel: React.FC<AdminActionPanelProps> = ({ onImportVault }) => {
  return (
    <div className="card-premium" style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Settings size={16} style={{ color: "var(--slate-400)" }} />
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Administration</h3>
      </div>
      
      <p style={{ fontSize: "12px", color: "var(--text-dim)", margin: "0 0 16px 0" }}>
        Manage your vault data through encrypted JSON imports and exports.
      </p>
      
      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
        <label style={{ flex: 1 }}>
          <div className={`${styles.fakeButton} card-premium`} style={{ 
            width: "100%", 
            fontSize: "12px", 
            height: "36px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: 8,
            cursor: "pointer",
            background: "var(--slate-900)",
            color: "var(--text-primary)",
            fontWeight: 500
          }}>
            <Download size={14} /> Import
          </div>
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
          style={{ flex: 1, fontSize: "12px", height: "36px", gap: 8 }}
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
          <Upload size={14} /> Export
        </Button>
      </div>
    </div>
  );
};
