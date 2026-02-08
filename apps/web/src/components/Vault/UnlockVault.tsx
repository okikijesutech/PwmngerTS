import React from "react";
import { Button, Input, Card } from "@pwmnger/ui";

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
    <Card
      title="Unlock Vault"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >
      {!showRecovery ? (
        <>
          <Input
            type="password"
            placeholder="Enter Master Password"
            label="Master Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onUnlock(password)}
          />
          <div style={{ marginTop: 24 }}>
            <Button 
              onClick={() => onUnlock(password)} 
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Unlocking..." : "Unlock"}
            </Button>
          </div>
          <p 
            onClick={() => setShowRecovery(true)}
            style={{ textAlign: "center", marginTop: 16, cursor: "pointer", fontSize: "12px", color: "var(--primary)", opacity: 0.8 }}
          >
            Forgot Password? Use Recovery Kit
          </p>
        </>
      ) : (
        <>
          <p style={{ fontSize: "13px", opacity: 0.7, marginBottom: 16 }}>
            Upload your <code>recovery_kit.json</code> to regain access.
          </p>
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
            style={{ width: "100%", padding: "20px", border: "2px dashed rgba(0,0,0,0.1)", borderRadius: "8px", cursor: "pointer" }}
          />
          <p 
            onClick={() => setShowRecovery(false)}
            style={{ textAlign: "center", marginTop: 16, cursor: "pointer", fontSize: "12px", color: "var(--text-secondary)" }}
          >
            Back to Password
          </p>
        </>
      )}
      {error && (
        <p
          style={{
            color: "#ff4d4f",
            textAlign: "center",
            marginTop: 16,
            fontSize: 14,
          }}
        >
          {error}
        </p>
      )}
    </Card>
  );
};
