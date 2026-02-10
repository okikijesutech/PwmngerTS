import React, { memo } from 'react';
import { Input } from '@pwmnger/ui';
import { Search } from 'lucide-react';
import styles from '../../styles/Dashboard.module.css';

interface DashboardHeaderProps {
  search: string;
  setSearch: (val: string) => void;
}

export const DashboardHeader = memo(({ search, setSearch }: DashboardHeaderProps) => {
  return (
    <header className={styles.header}>
      <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 700, letterSpacing: "-0.01em" }}>Vault</h1>
      
      <div className={styles.headerSearch} style={{ position: "relative" }}>
         <Search 
            size={14} 
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} 
          />
         <Input
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "0 12px 0 34px", 
              borderRadius: "var(--radius-md)", 
              fontSize: "13px", 
              height: "36px", 
              background: "var(--slate-900)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)"
            }}
          />
      </div>
    </header>
  );
});
