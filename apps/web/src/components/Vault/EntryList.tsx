import React from 'react';
import { Button } from "@pwmnger/ui";

interface Entry {
  id: string;
  site: string;
  username: string;
  password: string;
  folderId?: string;
}

interface Folder {
  id: string;
  name: string;
}

interface EntryListProps {
  entries: Entry[];
  folders: Folder[];
  onCopy: (password: string) => void;
  onDelete: (id: string) => void;
  onMove: (entryId: string, folderId: string | null) => void;
  searchQuery: string;
}

export const EntryList: React.FC<EntryListProps> = ({ entries, folders, onCopy, onDelete, onMove, searchQuery }) => {
  // Search query filtering is handled by parent now, but we keep this check for safety or if parent passed raw
  // Actually parent passes filtered, so this filter is redundant if search query is empty prop.
  // But let's leave it as safeguard if searchQuery prop is passed.
  // Wait, parent passes `searchQuery=""` so this filter does nothing if parent passes filtered list?
  // No, parent passes `filteredEntries` and `searchQuery=""`. So this filter does `includes("")` which is true.
  // So it effectively renders `entries` (which are already filtered). Correct.
  
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {entries.map(e => (
        <div key={e.id} style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "16px 24px",
          backgroundColor: "white",
          borderRadius: 8,
          border: "1px solid #f0f0f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "16px", color: '#262626' }}>{e.site}</div>
            <div style={{ color: "#8c8c8c", fontSize: "14px" }}>{e.username}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select 
              value={e.folderId || ""} 
              onChange={(evt) => onMove(e.id, evt.target.value || null)}
              style={{ 
                padding: "6px", borderRadius: 4, border: "1px solid #d9d9d9", 
                fontSize: "12px", maxWidth: "100px" 
              }}
            >
              <option value="">(No Folder)</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <Button variant="secondary" onClick={() => onCopy(e.password)}>Copy</Button>
            <Button variant="danger" onClick={() => onDelete(e.id)}>Delete</Button>
          </div>
        </div>
      ))}
      {entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#bfbfbf' }}>
          No entries found.
        </div>
      )}
    </div>
  );
};
