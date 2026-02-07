import React from "react";
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
  onCopy: (text: string, label: string) => void;
  onDelete: (id: string) => void;
  onMove: (entryId: string, folderId: string | null) => void;
  onEdit: (entryId: string, site: string, username: string, password: string) => void;
  searchQuery: string;
}

export const EntryList: React.FC<EntryListProps> = ({
  entries,
  folders,
  onCopy,
  onDelete,
  onMove,
  onEdit,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editSite, setEditSite] = React.useState("");
  const [editUser, setEditUser] = React.useState("");
  const [editPass, setEditPass] = React.useState("");

  const startEdit = (e: Entry) => {
    setEditingId(e.id);
    setEditSite(e.site);
    setEditUser(e.username);
    setEditPass(e.password);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {entries.map((e) => {
        const isEditing = editingId === e.id;
        // Simple domain extractor
        const domain = e.site.includes(".") ? e.site.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] : null;

        return (
          <div
            key={e.id}
            className="glass"
            style={{
              padding: "16px 20px",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              position: "relative",
              overflow: "hidden",
              cursor: "default",
              border: isEditing ? "1px solid var(--primary)" : "1px solid transparent",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(evt) => {
               if (!isEditing) {
                 evt.currentTarget.style.transform = "translateY(-2px)";
                 evt.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
               }
            }}
            onMouseLeave={(evt) => {
               if (!isEditing) {
                 evt.currentTarget.style.transform = "translateY(0)";
                 evt.currentTarget.style.boxShadow = "var(--glass-shadow)";
               }
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {isEditing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input 
                      value={editSite} 
                      onChange={(ev) => setEditSite(ev.target.value)}
                      style={{ background: "rgba(0,0,0,0.05)", border: "none", fontSize: "14px", padding: "4px 8px", borderRadius: "4px", width: "100%" }}
                      placeholder="Site"
                    />
                    <input 
                      value={editUser} 
                      onChange={(ev) => setEditUser(ev.target.value)}
                      style={{ background: "rgba(0,0,0,0.05)", border: "none", fontSize: "12px", padding: "4px 8px", borderRadius: "4px", width: "100%" }}
                      placeholder="Username"
                    />
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <div style={{ fontWeight: 800, fontSize: "15px", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {e.site}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", fontFamily: "monospace", opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {e.username}
                      </div>
                      <span 
                        onClick={() => onCopy(e.username, "Username")}
                        style={{ fontSize: "10px", cursor: "pointer", opacity: 0.4, padding: "2px 4px", borderRadius: "4px", background: "rgba(0,0,0,0.05)" }}
                      >
                        📋
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: domain ? "#fff" : "rgba(22, 119, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "var(--primary)",
                  fontWeight: 800,
                  flexShrink: 0,
                  marginLeft: 12,
                  overflow: "hidden",
                  boxShadow: domain ? "0 2px 8px rgba(0,0,0,0.05)" : "none"
                }}
              >
                {domain ? (
                  <img 
                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} 
                    alt="" 
                    style={{ width: "20px", height: "20px" }}
                    onError={(evt) => {
                      evt.currentTarget.style.display = "none";
                      evt.currentTarget.parentElement!.innerText = e.site.charAt(0).toUpperCase();
                    }}
                  />
                ) : e.site.charAt(0).toUpperCase()}
              </div>
            </div>

            {isEditing && (
              <input 
                type="password"
                value={editPass} 
                onChange={(ev) => setEditPass(ev.target.value)}
                style={{ background: "rgba(0,0,0,0.05)", border: "none", fontSize: "12px", padding: "4px 8px", borderRadius: "4px", width: "100%" }}
                placeholder="Password"
              />
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                 {isEditing ? (
                   <div style={{ display: "flex", gap: 6 }}>
                     <Button 
                       variant="primary" 
                       onClick={() => {
                         onEdit(e.id, editSite, editUser, editPass);
                         cancelEdit();
                       }}
                       style={{ padding: "4px 10px", fontSize: "11px" }}
                     >
                       Save
                     </Button>
                     <Button 
                       variant="secondary" 
                       onClick={cancelEdit}
                       style={{ padding: "4px 10px", fontSize: "11px" }}
                     >
                       Cancel
                     </Button>
                   </div>
                 ) : (
                   <>
                     <select
                        value={e.folderId || ""}
                        onChange={(evt) => onMove(e.id, evt.target.value || null)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "20px",
                          border: "1px solid rgba(0,0,0,0.08)",
                          fontSize: "11px",
                          background: "transparent",
                          color: "var(--text-secondary)",
                          outline: "none",
                        }}
                      >
                        <option value="">Move...</option>
                        {folders.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                      <span 
                        onClick={() => startEdit(e)}
                        style={{ fontSize: "11px", color: "var(--primary)", cursor: "pointer", marginLeft: 4 }}
                      >
                        Edit
                      </span>
                      <span 
                        onClick={() => onDelete(e.id)}
                        style={{ fontSize: "11px", color: "#ff4d4f", cursor: "pointer", marginLeft: 4 }}
                      >
                        Delete
                      </span>
                   </>
                 )}
              </div>
              
              {!isEditing && (
                <div style={{ display: "flex", gap: 6 }}>
                  <Button 
                     variant="secondary" 
                     onClick={() => onCopy(e.username, "Username")}
                     style={{ padding: "6px 10px", borderRadius: "20px", fontSize: "11px" }}
                  >
                    User
                  </Button>
                  <Button 
                     variant="primary" 
                     onClick={() => onCopy(e.password, "Password")}
                     style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "11px" }}
                  >
                    Pass
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {entries.length === 0 && (
        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
           <div style={{ fontSize: "40px", marginBottom: 16 }}>📂</div>
           <p>Your vault is empty or no results match your search.</p>
        </div>
      )}
    </div>
  );
};
