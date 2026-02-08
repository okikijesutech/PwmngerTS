import React, { memo } from 'react';
import { Input } from '@pwmnger/ui';
import styles from '../../styles/Dashboard.module.css';

interface DashboardHeaderProps {
  search: string;
  setSearch: (val: string) => void;
}

export const DashboardHeader = memo(({ search, setSearch }: DashboardHeaderProps) => {
  return (
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
  );
});
