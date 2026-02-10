import React from "react";
import { Button, Input } from "@pwmnger/ui";
import { Lock, FileJson, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

interface UnlockVaultProps {
  onUnlock: (password: string) => void;
  onRecover: (recoveryKeyHex: string, wrappedVaultKey: any) => void;
  error: string;
  loading?: boolean;
}

export const UnlockVault: React.FC<UnlockVaultProps> = ({
  onUnlock,
  onRecover,
  error,
  loading = false,
}) => {
  const [password, setPassword] = React.useState("");
  const [showRecovery, setShowRecovery] = React.useState(false);

  return (
    <div className="card-premium animate-fade-in" style={{ padding: "40px", borderRadius: "var(--radius-xl)" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, letterSpacing: "-0.025em" }}>Unlock Vault</h2>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--text-dim)" }}>Securely decrypting your local data.</p>
      </div>

      {!showRecovery ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: 14, top: 40, color: "var(--text-dim)" }} />
            <Input
              type="password"
              placeholder="Enter Master Password"
              label="Master Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onUnlock(password)}
              style={{ 
                background: "var(--slate-900)", 
                border: "1px solid var(--border-subtle)", 
                color: "#fff", 
                paddingLeft: "40px",
                height: "44px"
              }}
            />
          </div>
          
          <Button 
            onClick={() => onUnlock(password)} 
            disabled={loading || !password}
            style={{ 
              width: "100%", 
              height: "44px", 
              background: "var(--accent-green)", 
              color: "#000", 
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 12,
              border: "none"
            }}
          >
            {loading ? "Unlocking..." : "Unlock Vault"} 
            {!loading && <ShieldCheck size={16} />}
          </Button>

          <p 
            onClick={() => setShowRecovery(true)}
            style={{ textAlign: "center", marginTop: 8, cursor: "pointer", fontSize: "12px", color: "var(--text-muted)", opacity: 0.8 }}
          >
            Forgot Password? <span style={{ color: "var(--accent-green)" }}>Use Recovery Kit</span>
          </p>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div style={{ display: "flex", gap: 12, padding: "12px", background: "rgba(62, 207, 142, 0.05)", border: "1px solid rgba(62, 207, 142, 0.1)", borderRadius: "var(--radius-md)", marginBottom: 24 }}>
             <FileJson size={16} style={{ color: "var(--accent-green)", flexShrink: 0 }} />
             <p style={{ margin: 0, fontSize: "12px", color: "var(--accent-green)", lineHeight: 1.4 }}>
               Upload your <code>recovery_kit.json</code> to regain access.
             </p>
          </div>

          <div style={{ position: "relative" }}>
             <input 
               type="file" 
               accept=".json"
               onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (!file) return;
                 const reader = new FileReader();
                 reader.onload = (event) => {
                   try {
                     const kit = JSON.parse(event.target?.result as string);
                     if (kit.recoveryKey && kit.encryptedVaultKey) {
                       onRecover(kit.recoveryKey, kit.encryptedVaultKey);
                     } else {
                       alert("Invalid recovery kit format");
                     }
                   } catch (err) {
                     alert("Failed to parse recovery kit");
                   }
                 };
                 reader.readAsText(file);
               }}
               style={{ 
                 width: "100%", 
                 padding: "40px 20px", 
                 border: "2px dashed var(--border-subtle)", 
                 borderRadius: "var(--radius-lg)", 
                 cursor: "pointer",
                 background: "var(--slate-950)",
                 color: "var(--text-dim)",
                 fontSize: "12px"
               }}
             />
          </div>
          
          <p 
            onClick={() => setShowRecovery(false)}
            style={{ textAlign: "center", marginTop: 24, cursor: "pointer", fontSize: "12px", color: "var(--text-dim)" }}
          >
            Back to Password Entry
          </p>
        </div>
      )}

      {error && (
        <div style={{ 
          marginTop: 20, 
          padding: "10px", 
          borderRadius: "6px", 
          background: "rgba(239, 68, 68, 0.05)", 
          border: "1px solid rgba(239, 68, 68, 0.1)",
          display: "flex",
          gap: 10,
          alignItems: "center"
        }}>
           <AlertCircle size={14} style={{ color: "#ef4444" }} />
           <p style={{ margin: 0, color: "#ef4444", fontSize: "13px" }}>{error}</p>
        </div>
      )}
    </div>
  );
};
