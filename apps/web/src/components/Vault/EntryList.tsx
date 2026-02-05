import React from 'react';
import { Button } from "@pwmnger/ui";

interface Entry {
  id: string;
  site: string;
  username: string;
  password: string;
}

interface EntryListProps {
  entries: Entry[];
  onCopy: (password: string) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
}

export const EntryList: React.FC<EntryListProps> = ({ entries, onCopy, onDelete, searchQuery }) => {
  const filteredEntries = entries.filter(e => 
    e.site.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {filteredEntries.map(e => (
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
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" onClick={() => onCopy(e.password)}>Copy</Button>
            <Button variant="danger" onClick={() => onDelete(e.id)}>Delete</Button>
          </div>
        </div>
      ))}
      {filteredEntries.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#bfbfbf' }}>
          No entries found.
        </div>
      )}
    </div>
  );
};
