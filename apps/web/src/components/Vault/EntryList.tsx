import React, { memo } from "react";
import { Button } from "@pwmnger/ui";
import { 
  Copy, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  User, 
  Key, 
  MoreVertical,
  Inbox
} from 'lucide-react';
import type { VaultEntry as Entry, Folder } from "@pwmnger/vault";
import styles from "../../styles/Dashboard.module.css";

interface EntryListProps {
  entries: Entry[];
  folders: Folder[];
  onCopy: (text: string, label: string) => void;
  onDelete: (id: string) => void;
  onMove: (entryId: string, folderId: string | null) => void;
  onEdit: (entryId: string, site: string, username: string, password: string) => void;
  searchQuery: string;
}

export const EntryList = memo(({
  entries,
  folders,
  onCopy,
  onDelete,
  onMove,
  onEdit,
}: EntryListProps) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = React.useState<string | null>(null);
  const [editSite, setEditSite] = React.useState("");
  const [editUser, setEditUser] = React.useState("");
  const [editPass, setEditPass] = React.useState("");

  const startEdit = (e: Entry) => {
    setConfirmingDeleteId(null);
    setEditingId(e.id);
    setEditSite(e.site);
    setEditUser(e.username);
    setEditPass(e.password);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  if (!entries || entries.length === 0) {
    return (
      <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 0", color: "var(--text-dim)" }}>
         <Inbox size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.5 }} />
         <p style={{ fontSize: "14px" }}>No vault items found.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
      {entries.map((e) => {
        if (!e) return null;
        const isEditing = editingId === e.id;
        const siteStr = e.site || "";
        const domain = siteStr.includes(".") ? siteStr.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] : null;

        return (
          <div
            key={e.id}
            className={`card-premium ${styles.entryCard} ${isEditing ? styles.entryCardEditing : ""}`}
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  background: domain ? "var(--slate-800)" : "var(--slate-900)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  color: "var(--accent-green)",
                  fontWeight: 700,
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {domain ? (
                  <img 
                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} 
                    alt="" 
                    style={{ width: "24px", height: "24px" }}
                    onError={(evt) => {
                      const target = evt.currentTarget;
                      const parent = target.parentElement;
                      target.style.display = "none";
                      if (parent) {
                        parent.innerText = siteStr.charAt(0).toUpperCase() || "?";
                      }
                    }}
                  />
                ) : siteStr.charAt(0).toUpperCase() || "?"}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {isEditing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input 
                      value={editSite} 
                      onChange={(ev) => setEditSite(ev.target.value)}
                      className={styles.editInput}
                      placeholder="Site Name"
                    />
                    <input 
                      value={editUser} 
                      onChange={(ev) => setEditUser(ev.target.value)}
                      className={styles.editInput}
                      style={{ fontSize: "12px" }}
                      placeholder="Username"
                    />
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {siteStr}
                      </h4>
                      {domain && (
                         <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-dim)", display: "flex" }}>
                            <ExternalLink size={10} />
                         </a>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "12px" }}>
                       <span>{e.username}</span>
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: "flex", gap: 4 }}>
                 {!isEditing && (
                    <>
                       <button onClick={() => startEdit(e)} className={styles.iconButton} title="Edit">
                          <Pencil size={14} />
                       </button>
                       <select
                          value={e.folderId || ""}
                          onChange={(evt) => onMove(e.id, evt.target.value || null)}
                          className={styles.folderSelect}
                        >
                          <option value="">Move...</option>
                          {folders.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                    </>
                 )}
              </div>
            </div>

            {isEditing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input 
                  type="password"
                  value={editPass} 
                  onChange={(ev) => setEditPass(ev.target.value)}
                  className={styles.editInput}
                  style={{ fontSize: "12px" }}
                  placeholder="Password"
                />
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                   <Button 
                      variant="primary" 
                      onClick={() => {
                        onEdit(e.id, editSite, editUser, editPass);
                        cancelEdit();
                      }}
                      style={{ flex: 1, height: "32px", fontSize: "12px", background: "var(--accent-green)", color: "#000" }}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={cancelEdit}
                      style={{ flex: 1, height: "32px", fontSize: "12px" }}
                    >
                      Cancel
                    </Button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <Button 
                   variant="secondary" 
                   onClick={() => onCopy(e.username || "", "Username")}
                   style={{ flex: 1, height: "32px", fontSize: "12px", gap: 6, justifyContent: "center" }}
                >
                  <User size={13} /> User
                </Button>
                <Button 
                   variant="primary" 
                   onClick={() => onCopy(e.password || "", "Password")}
                   style={{ flex: 1, height: "32px", fontSize: "12px", gap: 6, justifyContent: "center", background: "var(--accent-green)", color: "#000" }}
                >
                  <Key size={13} /> Copy
                </Button>
                <button 
                   className={styles.iconButtonDanger} 
                   onClick={() => setConfirmingDeleteId(e.id)}
                   title="Delete"
                >
                   <Trash2 size={14} />
                </button>
              </div>
            )}

            {confirmingDeleteId === e.id && (
              <div style={{ 
                position: "absolute", 
                inset: 0, 
                background: "rgba(2, 6, 23, 0.95)", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                zIndex: 20,
                borderRadius: "inherit",
                padding: 16,
                textAlign: "center"
              }}>
                 <Trash2 size={24} style={{ color: "#ff4d4f", marginBottom: 12 }} />
                 <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--text-primary)" }}>Delete this entry permanently?</p>
                 <div style={{ display: "flex", gap: 12, width: "100%" }}>
                    <Button variant="danger" style={{ flex: 1, height: "32px" }} onClick={() => { onDelete(e.id); setConfirmingDeleteId(null); }}>Delete</Button>
                    <Button variant="secondary" style={{ flex: 1, height: "32px" }} onClick={() => setConfirmingDeleteId(null)}>Cancel</Button>
                 </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});
